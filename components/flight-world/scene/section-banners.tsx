"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { SECTION_BANNERS } from "@/lib/flight-world/layout";

function SectionFlag({
  title,
  subtitle,
  position,
  yaw,
  accent,
}: {
  title: string;
  subtitle: string;
  position: [number, number, number];
  yaw: number;
  accent: string;
}) {
  const flagRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!flagRef.current) return;
    // Soft flutter
    flagRef.current.rotation.y =
      Math.sin(clock.elapsedTime * 2.2 + position[0]) * 0.06;
  });

  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {/* Pole */}
      <mesh position={[0, 2.4, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 4.8, 8]} />
        <meshStandardMaterial
          color="#d8dce8"
          metalness={0.75}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 4.85, 0]}>
        <sphereGeometry args={[0.14, 10, 10]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Flag board */}
      <group position={[1.75, 3.7, 0]}>
        <mesh ref={flagRef} castShadow>
          <boxGeometry args={[3.4, 1.55, 0.08]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={0.35}
            roughness={0.45}
            metalness={0.15}
          />
        </mesh>
        {/* Backing plate for contrast */}
        <mesh position={[0, 0, -0.02]}>
          <boxGeometry args={[3.5, 1.65, 0.04]} />
          <meshStandardMaterial color="#0c1018" roughness={0.9} />
        </mesh>
        <Text
          position={[0, 0.22, 0.06]}
          fontSize={0.42}
          color="#0a0c12"
          anchorX="center"
          anchorY="middle"
          maxWidth={3}
          fontWeight={700}
        >
          {title}
        </Text>
        <Text
          position={[0, -0.32, 0.06]}
          fontSize={0.2}
          color="#1a1e28"
          anchorX="center"
          anchorY="middle"
          maxWidth={3.1}
        >
          {subtitle}
        </Text>
      </group>
    </group>
  );
}

/** District flags on the staging island. */
export function SectionBanners() {
  return (
    <group>
      {SECTION_BANNERS.map((banner) => (
        <SectionFlag
          key={banner.id}
          title={banner.title}
          subtitle={banner.subtitle}
          position={banner.position}
          yaw={banner.yaw}
          accent={banner.accent}
        />
      ))}
    </group>
  );
}
