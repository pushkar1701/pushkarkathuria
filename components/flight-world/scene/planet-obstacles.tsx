"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, BallCollider } from "@react-three/rapier";
import * as THREE from "three";
import type { SkyTheme } from "@/lib/flight/loadout";
import { GALAXY_PLANETS } from "@/lib/flight-world/layout";

function resolveColor(
  sky: SkyTheme,
  from: "brand" | "brandSecondary" | "custom",
  custom?: string,
) {
  if (from === "brand") return sky.brand;
  if (from === "brandSecondary") return sky.brandSecondary;
  return custom ?? sky.star;
}

function PlanetBody({
  position,
  radius,
  color,
  ring,
  ringColor,
}: {
  position: [number, number, number];
  radius: number;
  color: string;
  ring?: boolean;
  ringColor?: string;
}) {
  const spin = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.y += dt * 0.05;
  });

  return (
    <RigidBody type="fixed" position={position} colliders={false} restitution={0.35}>
      <BallCollider args={[radius]} />
      <group ref={spin}>
        <mesh castShadow>
          <sphereGeometry args={[radius, 32, 24]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.4}
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>
        {ring ? (
          <mesh rotation={[Math.PI / 2.4, 0.2, 0]}>
            <ringGeometry args={[radius * 1.35, radius * 2.1, 64]} />
            <meshBasicMaterial
              color={ringColor ?? "#c8e8ff"}
              transparent
              opacity={0.45}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        ) : null}
      </group>
    </RigidBody>
  );
}

/** Solid planet obstacles for deep-space roaming. */
export function PlanetObstacles({ sky }: { sky: SkyTheme }) {
  return (
    <group>
      {GALAXY_PLANETS.map((planet) => (
        <PlanetBody
          key={planet.id}
          position={planet.position}
          radius={planet.radius}
          color={resolveColor(sky, planet.colorFrom, planet.customColor)}
          ring={planet.ring}
          ringColor={
            planet.ring
              ? resolveColor(
                  sky,
                  planet.ringColorFrom ?? "brandSecondary",
                  planet.customRingColor,
                )
              : undefined
          }
        />
      ))}
    </group>
  );
}
