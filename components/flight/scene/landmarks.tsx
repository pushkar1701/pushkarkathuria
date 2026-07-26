"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Landmark } from "@/lib/flight/world";

const IDLE = 0.85;
const VISITED = 0.35;

function LandmarkMesh({
  landmark,
  discovered,
  isNear,
}: {
  landmark: Landmark;
  discovered: boolean;
  isNear: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = landmark.accent;

  useFrame(({ clock }) => {
    if (document.hidden) return;
    const mesh = meshRef.current;
    if (!mesh) return;
    const material = mesh.material as THREE.MeshStandardMaterial;
    if (isNear) {
      const pulse = 0.5 + Math.sin(clock.elapsedTime * 3) * 0.5;
      material.emissiveIntensity = 0.9 + pulse * 0.6;
      mesh.scale.setScalar(1 + Math.sin(clock.elapsedTime * 3) * 0.06);
    } else {
      material.emissiveIntensity = discovered ? VISITED : IDLE;
      mesh.scale.setScalar(1);
    }
  });

  const geo =
    landmark.kind === "secret" ? (
      <octahedronGeometry args={[0.85, 0]} />
    ) : landmark.kind === "project" ? (
      <boxGeometry args={[1.4, 1.4, 1.4]} />
    ) : landmark.kind === "contact" || landmark.kind === "resume" ? (
      <cylinderGeometry args={[0.9, 0.9, 1.4, 8]} />
    ) : (
      <icosahedronGeometry args={[0.95, 0]} />
    );

  return (
    <mesh ref={meshRef} position={landmark.position}>
      {geo}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={discovered ? VISITED : IDLE}
        roughness={0.35}
        metalness={0.12}
        transparent
        opacity={discovered ? 0.4 : 0.95}
      />
    </mesh>
  );
}

export function Landmarks({
  landmarks,
  discovered,
  nearId,
}: {
  landmarks: Landmark[];
  discovered: Set<string>;
  nearId: string | null;
}) {
  return (
    <group>
      {landmarks.map((landmark) => (
        <LandmarkMesh
          key={landmark.id}
          landmark={landmark}
          discovered={discovered.has(landmark.id)}
          isNear={landmark.id === nearId}
        />
      ))}
    </group>
  );
}
