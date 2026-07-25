"use client";

/* eslint-disable react-hooks/immutability -- R3F's useThree().camera is a
 * live three.js Object3D that game loops are meant to mutate imperatively
 * every frame (chase cam); it is not React-managed state. */

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { KeyState } from "@/lib/flight/controls";
import type { FlightWaypoint } from "@/lib/flight/waypoints";
import { isCaptured, magnetSteer, nextWaypoint } from "@/lib/flight/path";

const BASE_SPEED = 9;
const BOOST_SPEED = 9;
const YAW_RATE = 1.6; // rad/s
const CLIMB_SPEED = 6; // units/s
const MIN_Y = 0.5;
const MAX_Y = 16;
const SOFT_MARGIN = 3;
const HARD_MARGIN = 1;
const CAPTURE_RADIUS = 2.5;
const MAGNET_CONE_COS = Math.cos((60 * Math.PI) / 180);
const MAGNET_STRENGTH = 0.035;
const CHASE_DISTANCE = 9;
const CHASE_HEIGHT = 3.5;
const CAMERA_DAMPING = 3.5;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

/** Soft-clamps a proposed altitude delta as it nears the playable band edges. */
function softClampDelta(y: number, dy: number) {
  if (dy > 0) {
    const room = MAX_Y - y;
    return dy * clamp01(room / SOFT_MARGIN);
  }
  if (dy < 0) {
    const room = y - MIN_Y;
    return dy * clamp01(room / SOFT_MARGIN);
  }
  return dy;
}

type PlaneProps = {
  keyState: KeyState;
  waypoints: FlightWaypoint[];
  visited: Set<string>;
  onVisit: (id: string) => void;
};

export function Plane({ keyState, waypoints, visited, onVisit }: PlaneProps) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  const initial = useMemo(() => {
    const first = waypoints[0];
    if (!first) {
      return { position: new THREE.Vector3(0, 4, 12), heading: Math.PI };
    }
    const [x, y, z] = first.position;
    return { position: new THREE.Vector3(x - 10, y + 2, z), heading: -Math.PI / 2 };
  }, [waypoints]);

  const positionRef = useRef(initial.position.clone());
  const headingRef = useRef(initial.heading);
  const notifiedRef = useRef<string | null>(null);
  const desiredCam = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, rawDelta) => {
    if (document.hidden) return;
    const dt = Math.min(rawDelta, 0.05);

    // Yaw from input.
    headingRef.current += keyState.yaw * YAW_RATE * dt;
    let heading = headingRef.current;
    let fx = -Math.sin(heading);
    let fz = -Math.cos(heading);

    // Soft magnet toward the next unvisited waypoint when roughly facing it.
    const target = nextWaypoint(waypoints, visited);
    if (target) {
      const toX = target.position[0] - positionRef.current.x;
      const toZ = target.position[2] - positionRef.current.z;
      const toLen = Math.hypot(toX, toZ) || 1;
      const toNormX = toX / toLen;
      const toNormZ = toZ / toLen;
      const facing = fx * toNormX + fz * toNormZ;

      if (facing > MAGNET_CONE_COS) {
        const [sx, sz] = magnetSteer([fx, fz], [toNormX, toNormZ], MAGNET_STRENGTH);
        heading = Math.atan2(-sx, -sz);
        headingRef.current = heading;
        fx = sx;
        fz = sz;
      }
    }

    // Forward motion.
    const speed = BASE_SPEED + keyState.throttle * BOOST_SPEED;
    positionRef.current.x += fx * speed * dt;
    positionRef.current.z += fz * speed * dt;

    // Altitude with a soft clamp near the band edges, hard clamp beyond it.
    const dy = softClampDelta(positionRef.current.y, keyState.pitch * CLIMB_SPEED * dt);
    positionRef.current.y = THREE.MathUtils.clamp(
      positionRef.current.y + dy,
      MIN_Y - HARD_MARGIN,
      MAX_Y + HARD_MARGIN,
    );

    // Apply transform + a little visual bank/pitch feedback.
    const group = groupRef.current;
    if (group) {
      group.position.copy(positionRef.current);
      group.rotation.y = heading;
      group.rotation.z = THREE.MathUtils.damp(
        group.rotation.z,
        -keyState.yaw * 0.5,
        6,
        dt,
      );
      group.rotation.x = THREE.MathUtils.damp(
        group.rotation.x,
        keyState.pitch * 0.22,
        6,
        dt,
      );
    }

    // Capture check (only notify once per target until it actually visits).
    if (
      target &&
      notifiedRef.current !== target.id &&
      isCaptured(
        [positionRef.current.x, positionRef.current.y, positionRef.current.z],
        target,
        CAPTURE_RADIUS,
      )
    ) {
      notifiedRef.current = target.id;
      onVisit(target.id);
    }

    // Chase camera, slightly behind/above, looking ahead of the plane.
    desiredCam.set(
      positionRef.current.x - fx * CHASE_DISTANCE,
      positionRef.current.y + CHASE_HEIGHT,
      positionRef.current.z - fz * CHASE_DISTANCE,
    );
    camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredCam.x, CAMERA_DAMPING, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredCam.y, CAMERA_DAMPING, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredCam.z, CAMERA_DAMPING, dt);
    camera.lookAt(
      positionRef.current.x + fx * 6,
      positionRef.current.y,
      positionRef.current.z + fz * 6,
    );
  });

  return (
    <group ref={groupRef} position={initial.position.toArray()}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.55, 2.4, 8]} />
        <meshStandardMaterial color="#e7e8f0" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.05, 0.15]}>
        <boxGeometry args={[3.2, 0.12, 0.7]} />
        <meshStandardMaterial color="#c7cbd8" metalness={0.2} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.35, 1]}>
        <boxGeometry args={[0.1, 0.7, 0.5]} />
        <meshStandardMaterial color="#c7cbd8" metalness={0.2} roughness={0.5} />
      </mesh>
    </group>
  );
}
