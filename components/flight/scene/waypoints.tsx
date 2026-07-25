"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { FlightWaypoint } from "@/lib/flight/waypoints";
import { resolveCssColor } from "./colors";

const VISITED_INTENSITY = 0.35;
const IDLE_INTENSITY = 0.8;

function Beacon({
  waypoint,
  isVisited,
  isNext,
}: {
  waypoint: FlightWaypoint;
  isVisited: boolean;
  isNext: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = useMemo(
    () => resolveCssColor(waypoint.accent, "#ffffff"),
    [waypoint.accent],
  );

  useFrame(({ clock }) => {
    if (document.hidden) return;
    const mesh = meshRef.current;
    if (!mesh) return;
    const material = mesh.material as THREE.MeshStandardMaterial;

    if (isNext) {
      const pulse = 0.5 + Math.sin(clock.elapsedTime * 3) * 0.5;
      material.emissiveIntensity = 1 + pulse;
      const scale = 1 + Math.sin(clock.elapsedTime * 3) * 0.08;
      mesh.scale.setScalar(scale);
    } else {
      material.emissiveIntensity = isVisited ? VISITED_INTENSITY : IDLE_INTENSITY;
      mesh.scale.setScalar(1);
    }
  });

  return (
    <mesh ref={meshRef} position={waypoint.position}>
      <icosahedronGeometry args={[1.1, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isVisited ? VISITED_INTENSITY : IDLE_INTENSITY}
        roughness={0.35}
        metalness={0.1}
        transparent
        opacity={isVisited ? 0.5 : 1}
      />
    </mesh>
  );
}

export function Waypoints({
  waypoints,
  visited,
  nextId,
}: {
  waypoints: FlightWaypoint[];
  visited: Set<string>;
  nextId: string | null;
}) {
  return (
    <group>
      {waypoints.map((waypoint) => (
        <Beacon
          key={waypoint.id}
          waypoint={waypoint}
          isVisited={visited.has(waypoint.id)}
          isNext={waypoint.id === nextId}
        />
      ))}
    </group>
  );
}
