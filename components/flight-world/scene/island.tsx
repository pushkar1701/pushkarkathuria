"use client";

import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import type { SkyTheme } from "@/lib/flight/loadout";

function GlowPad({
  position,
  size,
  color,
  emissiveIntensity = 0.35,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  emissiveIntensity?: number;
}) {
  return (
    <RigidBody type="fixed" position={position}>
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          roughness={0.45}
          metalness={0.25}
        />
      </mesh>
    </RigidBody>
  );
}

function RunwayLights({
  color,
  start,
  count,
  spacing,
  axis = "z",
}: {
  color: string;
  start: [number, number, number];
  count: number;
  spacing: number;
  axis?: "x" | "z";
}) {
  return (
    <group>
      {Array.from({ length: count }, (_, i) => {
        const pos: [number, number, number] = [
          start[0] + (axis === "x" ? i * spacing : 0),
          start[1],
          start[2] + (axis === "z" ? i * spacing : 0),
        ];
        return (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.18, 8, 8]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.4}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Crystal({
  position,
  color,
  height = 4,
}: {
  position: [number, number, number];
  color: string;
  height?: number;
}) {
  return (
    <mesh position={position}>
      <octahedronGeometry args={[height * 0.35, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.7}
        transparent
        opacity={0.75}
        roughness={0.2}
        metalness={0.4}
      />
    </mesh>
  );
}

/** Static island: glowing pads, runways, crystals. */
export function Island({ sky }: { sky: SkyTheme }) {
  return (
    <group>
      {/* Main ground plate */}
      <RigidBody type="fixed" colliders={false} position={[0, -0.5, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[90, 1, 90]} />
          <meshStandardMaterial
            color="#1a2238"
            emissive={sky.brandSecondary}
            emissiveIntensity={0.06}
            roughness={0.88}
            metalness={0.12}
          />
        </mesh>
        <CuboidCollider args={[45, 0.5, 45]} />
      </RigidBody>

      {/* Energy grid ring on floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <ringGeometry args={[18, 22, 64]} />
        <meshBasicMaterial
          color={sky.brandSecondary}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
        <ringGeometry args={[32, 34, 64]} />
        <meshBasicMaterial
          color={sky.brand}
          transparent
          opacity={0.28}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <GlowPad
        position={[0, 0.25, 4]}
        size={[16, 0.5, 16]}
        color={sky.brandSecondary}
        emissiveIntensity={0.45}
      />

      <GlowPad
        position={[-10, 0.4, -12]}
        size={[28, 0.8, 18]}
        color="#243056"
        emissiveIntensity={0.2}
      />

      <GlowPad
        position={[26, 0.35, -2]}
        size={[18, 0.7, 22]}
        color="#1e3850"
        emissiveIntensity={0.25}
      />

      {/* Technologies plaza */}
      <GlowPad
        position={[-24, 0.3, 0]}
        size={[16, 0.6, 14]}
        color="#1a4030"
        emissiveIntensity={0.28}
      />

      {/* Ramp */}
      <RigidBody type="fixed" position={[2, 1.2, 14]} rotation={[0, 0, -0.35]}>
        <mesh>
          <boxGeometry args={[4, 0.4, 10]} />
          <meshStandardMaterial
            color={sky.brand}
            emissive={sky.brand}
            emissiveIntensity={0.55}
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>
      </RigidBody>

      <GlowPad position={[10, 0.8, 6]} size={[8, 1.6, 3]} color="#2a3060" />
      <GlowPad position={[-18, 1, 2]} size={[6, 2, 4]} color="#402828" />

      <RigidBody type="fixed" position={[-6, -2.2, 2]}>
        <mesh>
          <boxGeometry args={[8, 0.5, 6]} />
          <meshStandardMaterial
            color="#0e2a22"
            emissive="#3dffa0"
            emissiveIntensity={0.3}
          />
        </mesh>
      </RigidBody>

      {/* Neon billboard wall */}
      <RigidBody type="fixed" position={[0, 3, -22]}>
        <mesh>
          <boxGeometry args={[20, 5, 0.6]} />
          <meshStandardMaterial
            color={sky.brandSecondary}
            emissive={sky.brandSecondary}
            emissiveIntensity={0.55}
            transparent
            opacity={0.65}
          />
        </mesh>
      </RigidBody>

      <GlowPad position={[-4, 1.5, 24]} size={[3, 3, 3]} color="#3a2a58" />
      <GlowPad position={[4, 1.2, 24]} size={[2.4, 2.4, 2.4]} color="#2a3858" />

      <RunwayLights
        color={sky.brand}
        start={[-3, 0.35, 20]}
        count={8}
        spacing={-2.2}
        axis="z"
      />
      <RunwayLights
        color={sky.brandSecondary}
        start={[3, 0.35, 20]}
        count={8}
        spacing={-2.2}
        axis="z"
      />

      <Crystal position={[-22, 3.5, -8]} color={sky.brand} height={5} />
      <Crystal position={[-24, 2.8, -4]} color={sky.brandSecondary} height={3.5} />
      <Crystal position={[18, 3.2, 12]} color={sky.brand} height={4} />
      <Crystal position={[22, 4, -14]} color="#ffe08a" height={6} />
      <Crystal position={[-8, 2.5, 16]} color={sky.brandSecondary} height={3} />
      <Crystal position={[8, 3, -18]} color="#ff7ab8" height={4.5} />
    </group>
  );
}
