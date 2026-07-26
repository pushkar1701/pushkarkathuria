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
  const clothRef = useRef<THREE.Group>(null);
  const phase = position[0] * 0.37 + position[2] * 0.19;

  useFrame(({ clock }) => {
    if (!clothRef.current) return;
    const t = clock.elapsedTime;
    // Soft hinge wave from the pole — whole cloth moves together
    clothRef.current.rotation.y = Math.sin(t * 1.6 + phase) * 0.12;
    clothRef.current.rotation.z = Math.sin(t * 2.1 + phase * 1.3) * 0.04;
  });

  return (
    <group position={position} rotation={[0, yaw, 0]}>
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

      {/* Hinge at the pole; flag extends +X */}
      <group position={[0.12, 3.7, 0]}>
        <group ref={clothRef}>
          <mesh position={[1.7, 0, 0]} castShadow>
            <boxGeometry args={[3.4, 1.55, 0.06]} />
            <meshStandardMaterial
              color={accent}
              emissive={accent}
              emissiveIntensity={0.3}
              roughness={0.5}
              metalness={0.12}
            />
          </mesh>
          <Text
            position={[1.7, 0.22, 0.05]}
            fontSize={0.42}
            color="#0a0c12"
            anchorX="center"
            anchorY="middle"
            maxWidth={3}
            fontWeight={700}
            depthOffset={-1}
          >
            {title}
          </Text>
          <Text
            position={[1.7, -0.32, 0.05]}
            fontSize={0.2}
            color="#1a1e28"
            anchorX="center"
            anchorY="middle"
            maxWidth={3.1}
            depthOffset={-1}
          >
            {subtitle}
          </Text>
        </group>
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
