"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";
import type { SkyTheme } from "@/lib/flight/loadout";

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function buildPointCloud(count: number, seed: number, radius: number, yBias = 0) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const rand = seededRand(seed);
  for (let i = 0; i < count; i += 1) {
    const r = radius * (0.35 + rand() * 0.65);
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = Math.abs(r * Math.cos(phi)) * 0.55 + yBias + rand() * 20;
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    const warm = rand();
    colors[i * 3] = 0.55 + warm * 0.45;
    colors[i * 3 + 1] = 0.65 + rand() * 0.35;
    colors[i * 3 + 2] = 0.85 + rand() * 0.15;
  }
  return { positions, colors };
}

function NebulaCloud({
  position,
  color,
  scale,
  opacity = 0.12,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
  opacity?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = clock.elapsedTime * 0.02;
    ref.current.rotation.y = clock.elapsedTime * 0.01;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[1, 24, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function AsteroidBelt({ sky }: { sky: SkyTheme }) {
  const rocks = useMemo(() => {
    const rand = seededRand(0xbeef01);
    return Array.from({ length: 48 }, (_, i) => {
      const angle = (i / 48) * Math.PI * 2 + rand() * 0.2;
      const r = 52 + rand() * 18;
      return {
        id: `ast-${i}`,
        position: [
          Math.cos(angle) * r,
          4 + rand() * 14,
          Math.sin(angle) * r,
        ] as [number, number, number],
        scale: 0.4 + rand() * 1.4,
        spin: 0.1 + rand() * 0.4,
      };
    });
  }, []);

  return (
    <group>
      {rocks.map((rock) => (
        <Asteroid key={rock.id} {...rock} color={sky.grid} accent={sky.brand} />
      ))}
    </group>
  );
}

function Asteroid({
  position,
  scale,
  spin,
  color,
  accent,
}: {
  position: [number, number, number];
  scale: number;
  spin: number;
  color: string;
  accent: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += dt * spin;
    ref.current.rotation.y += dt * spin * 0.7;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={accent}
        emissiveIntensity={0.12}
        flatShading
        roughness={0.85}
      />
    </mesh>
  );
}

function GalaxyDisk({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 0.015;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2.15, 0, 0]} position={[0, -18, -40]}>
      <ringGeometry args={[30, 95, 96]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.18}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function ColoredStars({ seed, count, radius, size }: {
  seed: number;
  count: number;
  radius: number;
  size: number;
}) {
  const cloud = useMemo(
    () => buildPointCloud(count, seed, radius, 8),
    [count, seed, radius],
  );
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[cloud.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[cloud.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Deep-space backdrop: stars, nebulae, planets, belt — no colliders. */
export function GalaxySky({
  sky,
  rich = true,
}: {
  sky: SkyTheme;
  rich?: boolean;
}) {
  const starCount = rich ? 4200 : 1800;
  const sparkleCount = rich ? 120 : 50;
  const asteroids = rich;

  return (
    <group>
      <Stars
        radius={220}
        depth={80}
        count={starCount}
        factor={3.5}
        saturation={0.7}
        fade
        speed={0.35}
      />
      <ColoredStars seed={0xa11ce} count={rich ? 900 : 400} radius={160} size={1.1} />
      {rich ? (
        <ColoredStars seed={0xb00b5} count={500} radius={210} size={1.8} />
      ) : null}

      <Sparkles
        count={sparkleCount}
        scale={[90, 40, 90]}
        size={4}
        speed={0.35}
        opacity={0.55}
        color={sky.brandSecondary}
      />
      <Sparkles
        count={Math.round(sparkleCount * 0.65)}
        scale={[70, 28, 70]}
        position={[0, 12, -10]}
        size={6}
        speed={0.2}
        opacity={0.4}
        color={sky.brand}
      />

      <NebulaCloud position={[-60, 30, -50]} color={sky.brand} scale={48} opacity={0.1} />
      <NebulaCloud
        position={[70, 25, -30]}
        color={sky.brandSecondary}
        scale={55}
        opacity={0.11}
      />
      <NebulaCloud position={[10, 40, -90]} color={sky.star} scale={70} opacity={0.08} />
      <NebulaCloud position={[-40, 18, 40]} color="#7a5cff" scale={36} opacity={0.07} />
      <NebulaCloud position={[45, 22, 55]} color="#ff6b9d" scale={40} opacity={0.07} />

      <GalaxyDisk color={sky.brandSecondary} />

      {/* Planets live as physics obstacles inside <Physics> */}

      {asteroids ? <AsteroidBelt sky={sky} /> : null}
    </group>
  );
}
