"use client";

/* eslint-disable react-hooks/immutability -- R3F chase cam mutates camera. */

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { flightArcade } from "@/content/flight";
import type { ArcadeRing, ArcadeRock } from "@/lib/flight/arcade";
import type { KeyState } from "@/lib/flight/controls";
import type { CraftDef } from "@/lib/flight/loadout";
import type { FlightWaypoint } from "@/lib/flight/waypoints";
import { isCaptured, magnetSteer, nextWaypoint } from "@/lib/flight/path";

const BASE_SPEED = 11;
const BOOST_SPEED = 10;
const YAW_RATE = 1.85;
const CLIMB_SPEED = 7;
const MIN_Y = 0.5;
const MAX_Y = 16;
const SOFT_MARGIN = 3;
const HARD_MARGIN = 1;
const CAPTURE_RADIUS = 2.5;
const RING_RADIUS = 1.4;
const MAGNET_CONE_COS = Math.cos((55 * Math.PI) / 180);
const MAGNET_STRENGTH_PER_SECOND = 1.35;
const CHASE_DISTANCE = 9;
const CHASE_HEIGHT = 3.5;
const CAMERA_DAMPING = 3.5;

export function getInitialPlanePose(waypoints: FlightWaypoint[]) {
  const first = waypoints[0];
  if (!first) {
    return { position: new THREE.Vector3(0, 4, 12), heading: Math.PI };
  }
  const [x, y, z] = first.position;
  return { position: new THREE.Vector3(x - 10, y + 2, z), heading: -Math.PI / 2 };
}

export function getInitialCameraPosition(waypoints: FlightWaypoint[]) {
  const { position, heading } = getInitialPlanePose(waypoints);
  const fx = -Math.sin(heading);
  const fz = -Math.cos(heading);
  return [
    position.x - fx * CHASE_DISTANCE,
    position.y + CHASE_HEIGHT,
    position.z - fz * CHASE_DISTANCE,
  ] as [number, number, number];
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function softClampDelta(y: number, dy: number) {
  if (dy > 0) return dy * clamp01((MAX_Y - y) / SOFT_MARGIN);
  if (dy < 0) return dy * clamp01((y - MIN_Y) / SOFT_MARGIN);
  return dy;
}

function dist3(
  a: THREE.Vector3,
  b: [number, number, number],
) {
  return Math.hypot(a.x - b[0], a.y - b[1], a.z - b[2]);
}

type PlaneProps = {
  keyState: KeyState;
  waypoints: FlightWaypoint[];
  visited: Set<string>;
  onVisit: (id: string) => void;
  craft: CraftDef;
  rings: ArcadeRing[];
  rocks: ArcadeRock[];
  collectedRingIds: Set<string>;
  onRing: (id: string) => void;
  onHit: () => void;
};

export function Plane({
  keyState,
  waypoints,
  visited,
  onVisit,
  craft,
  rings,
  rocks,
  collectedRingIds,
  onRing,
  onHit,
}: PlaneProps) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const initial = useMemo(() => getInitialPlanePose(waypoints), [waypoints]);
  const positionRef = useRef(initial.position.clone());
  const headingRef = useRef(initial.heading);
  const notifiedRef = useRef<string | null>(null);
  const hitCooldownRef = useRef(0);
  const stunUntilRef = useRef(0);
  const desiredCam = useMemo(() => new THREE.Vector3(), []);
  const collectedRef = useRef(collectedRingIds);
  useEffect(() => {
    collectedRef.current = collectedRingIds;
  }, [collectedRingIds]);

  useFrame(({ clock }, rawDelta) => {
    if (document.hidden) return;
    const dt = Math.min(rawDelta, 0.05);
    const now = clock.elapsedTime * 1000;
    const stunned = now < stunUntilRef.current;
    const controlScale = stunned ? 0.35 : 1;

    headingRef.current += keyState.yaw * YAW_RATE * dt * controlScale;
    let heading = headingRef.current;
    let fx = -Math.sin(heading);
    let fz = -Math.cos(heading);

    const target = nextWaypoint(waypoints, visited);
    if (target && !stunned) {
      const toX = target.position[0] - positionRef.current.x;
      const toZ = target.position[2] - positionRef.current.z;
      const toLen = Math.hypot(toX, toZ) || 1;
      const toNormX = toX / toLen;
      const toNormZ = toZ / toLen;
      const facing = fx * toNormX + fz * toNormZ;

      if (facing > MAGNET_CONE_COS) {
        const magnetStrength = clamp01(MAGNET_STRENGTH_PER_SECOND * dt);
        const [sx, sz] = magnetSteer([fx, fz], [toNormX, toNormZ], magnetStrength);
        heading = Math.atan2(-sx, -sz);
        headingRef.current = heading;
        fx = sx;
        fz = sz;
      }
    }

    const speed = (BASE_SPEED + keyState.throttle * BOOST_SPEED) * (stunned ? 0.55 : 1);
    positionRef.current.x += fx * speed * dt;
    positionRef.current.z += fz * speed * dt;
    const dy = softClampDelta(
      positionRef.current.y,
      keyState.pitch * CLIMB_SPEED * dt * controlScale,
    );
    positionRef.current.y = THREE.MathUtils.clamp(
      positionRef.current.y + dy,
      MIN_Y - HARD_MARGIN,
      MAX_Y + HARD_MARGIN,
    );

    const group = groupRef.current;
    if (group) {
      group.position.copy(positionRef.current);
      group.rotation.y = heading;
      group.rotation.z = THREE.MathUtils.damp(group.rotation.z, -keyState.yaw * 0.5, 6, dt);
      group.rotation.x = THREE.MathUtils.damp(group.rotation.x, keyState.pitch * 0.22, 6, dt);
    }

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

    for (const ring of rings) {
      if (collectedRef.current.has(ring.id)) continue;
      if (dist3(positionRef.current, ring.position) <= RING_RADIUS) {
        onRing(ring.id);
      }
    }

    if (now > hitCooldownRef.current) {
      for (const rock of rocks) {
        if (dist3(positionRef.current, rock.position) <= rock.radius + 0.7) {
          hitCooldownRef.current = now + flightArcade.stunMs;
          stunUntilRef.current = now + flightArcade.stunMs;
          onHit();
          break;
        }
      }
    }

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
      <CraftMesh craft={craft} />
      <mesh position={[0, 0, 1.4]}>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshBasicMaterial color={craft.trail} transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function CraftMesh({ craft }: { craft: CraftDef }) {
  if (craft.kind === "rocket") {
    return (
      <group>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.45, 0.55, 2.6, 10]} />
          <meshStandardMaterial
            color={craft.body}
            emissive={craft.accent}
            emissiveIntensity={0.2}
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, 0, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.55, 0.9, 10]} />
          <meshStandardMaterial color={craft.accent} emissive={craft.accent} emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 0, 1.4]}>
          <coneGeometry args={[0.35, 0.7, 8]} />
          <meshStandardMaterial color={craft.trail} emissive={craft.trail} emissiveIntensity={1.2} />
        </mesh>
      </group>
    );
  }

  if (craft.kind === "scout") {
    return (
      <group>
        <mesh>
          <sphereGeometry args={[0.85, 16, 12]} />
          <meshStandardMaterial
            color={craft.body}
            emissive={craft.accent}
            emissiveIntensity={0.25}
            metalness={0.5}
            roughness={0.25}
          />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[1.35, 0.12, 8, 32]} />
          <meshStandardMaterial color={craft.accent} emissive={craft.accent} emissiveIntensity={0.8} />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.55, 2.4, 8]} />
        <meshStandardMaterial
          color={craft.body}
          emissive={craft.accent}
          emissiveIntensity={0.25}
          metalness={0.35}
          roughness={0.35}
        />
      </mesh>
      <mesh position={[0, -0.05, 0.15]}>
        <boxGeometry args={[3.2, 0.12, 0.7]} />
        <meshStandardMaterial
          color={craft.accent}
          emissive={craft.accent}
          emissiveIntensity={0.35}
          metalness={0.2}
          roughness={0.45}
        />
      </mesh>
      <mesh position={[0, 0.35, 1]}>
        <boxGeometry args={[0.1, 0.7, 0.5]} />
        <meshStandardMaterial color={craft.body} metalness={0.2} roughness={0.5} />
      </mesh>
    </group>
  );
}
