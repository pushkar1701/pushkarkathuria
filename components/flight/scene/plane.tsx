"use client";

/* eslint-disable react-hooks/immutability -- R3F chase cam mutates camera. */

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  isInSphere,
  resolveBounds,
  resolveSolids,
} from "@/lib/flight/collision";
import type { KeyState } from "@/lib/flight/controls";
import type { CraftDef } from "@/lib/flight/loadout";
import type { FlightWorld } from "@/lib/flight/world";

const BASE_SPEED = 12;
const BOOST_SPEED = 10;
const YAW_RATE = 1.9;
const CLIMB_SPEED = 7.5;
const CRAFT_RADIUS = 0.75;
const CHASE_DISTANCE = 10;
const CHASE_HEIGHT = 3.8;
const CAMERA_DAMPING = 3.5;

export function getInitialCameraPosition(world: FlightWorld) {
  const { position, heading } = world.spawn;
  const fx = -Math.sin(heading);
  const fz = -Math.cos(heading);
  return [
    position[0] - fx * CHASE_DISTANCE,
    position[1] + CHASE_HEIGHT,
    position[2] - fz * CHASE_DISTANCE,
  ] as [number, number, number];
}

type PlaneProps = {
  keyState: KeyState;
  world: FlightWorld;
  craft: CraftDef;
  discovered: Set<string>;
  collectedIds: Set<string>;
  onDiscover: (id: string) => void;
  onCollect: (id: string) => void;
  onNear: (id: string | null) => void;
  respawnToken: number;
};

export function Plane({
  keyState,
  world,
  craft,
  discovered,
  collectedIds,
  onDiscover,
  onCollect,
  onNear,
  respawnToken,
}: PlaneProps) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const positionRef = useRef(
    new THREE.Vector3(...world.spawn.position),
  );
  const headingRef = useRef(world.spawn.heading);
  const desiredCam = useMemo(() => new THREE.Vector3(), []);
  const nearRef = useRef<string | null>(null);
  const discoveredRef = useRef(discovered);
  const collectedRef = useRef(collectedIds);
  const lastRespawn = useRef(respawnToken);

  useEffect(() => {
    discoveredRef.current = discovered;
  }, [discovered]);
  useEffect(() => {
    collectedRef.current = collectedIds;
  }, [collectedIds]);

  useEffect(() => {
    if (respawnToken === lastRespawn.current) return;
    lastRespawn.current = respawnToken;
    positionRef.current.set(...world.spawn.position);
    headingRef.current = world.spawn.heading;
    if (groupRef.current) {
      groupRef.current.position.copy(positionRef.current);
      groupRef.current.rotation.y = headingRef.current;
    }
  }, [respawnToken, world.spawn]);

  useFrame((_, rawDelta) => {
    if (document.hidden) return;
    const dt = Math.min(rawDelta, 0.05);

    headingRef.current += keyState.yaw * YAW_RATE * dt;
    const heading = headingRef.current;
    const fx = -Math.sin(heading);
    const fz = -Math.cos(heading);

    const speed = BASE_SPEED + keyState.throttle * BOOST_SPEED;
    let next: [number, number, number] = [
      positionRef.current.x + fx * speed * dt,
      positionRef.current.y + keyState.pitch * CLIMB_SPEED * dt,
      positionRef.current.z + fz * speed * dt,
    ];

    next = resolveSolids(next, CRAFT_RADIUS, world.solids);
    next = resolveBounds(next, world.bounds);
    positionRef.current.set(...next);

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

    const pos: [number, number, number] = [
      positionRef.current.x,
      positionRef.current.y,
      positionRef.current.z,
    ];

    let nearest: string | null = null;
    let nearestDist = Infinity;
    for (const landmark of world.landmarks) {
      if (
        isInSphere(pos, landmark.position, landmark.radius) &&
        Math.hypot(
          pos[0] - landmark.position[0],
          pos[1] - landmark.position[1],
          pos[2] - landmark.position[2],
        ) < nearestDist
      ) {
        nearestDist = Math.hypot(
          pos[0] - landmark.position[0],
          pos[1] - landmark.position[1],
          pos[2] - landmark.position[2],
        );
        nearest = landmark.id;
      }
    }

    if (nearest && !discoveredRef.current.has(nearest)) {
      onDiscover(nearest);
    }
    if (nearest !== nearRef.current) {
      nearRef.current = nearest;
      onNear(nearest);
    }

    for (const coin of world.collectibles) {
      if (collectedRef.current.has(coin.id)) continue;
      if (isInSphere(pos, coin.position, coin.radius + CRAFT_RADIUS * 0.4)) {
        onCollect(coin.id);
      }
    }

    desiredCam.set(
      positionRef.current.x - fx * CHASE_DISTANCE,
      positionRef.current.y + CHASE_HEIGHT,
      positionRef.current.z - fz * CHASE_DISTANCE,
    );
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      desiredCam.x,
      CAMERA_DAMPING,
      dt,
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      desiredCam.y,
      CAMERA_DAMPING,
      dt,
    );
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      desiredCam.z,
      CAMERA_DAMPING,
      dt,
    );
    camera.lookAt(
      positionRef.current.x + fx * 6,
      positionRef.current.y,
      positionRef.current.z + fz * 6,
    );
  });

  return (
    <group ref={groupRef} position={world.spawn.position}>
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
          <meshStandardMaterial
            color={craft.accent}
            emissive={craft.accent}
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[0, 0, 1.4]}>
          <coneGeometry args={[0.35, 0.7, 8]} />
          <meshStandardMaterial
            color={craft.trail}
            emissive={craft.trail}
            emissiveIntensity={1.2}
          />
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
          <meshStandardMaterial
            color={craft.accent}
            emissive={craft.accent}
            emissiveIntensity={0.8}
          />
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
