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
    const r = radius * (0.25 + rand() * 0.75);
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] =
      r * Math.cos(phi) * 0.45 + yBias + (rand() - 0.5) * 40;
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    const warm = rand();
    colors[i * 3] = 0.5 + warm * 0.5;
    colors[i * 3 + 1] = 0.6 + rand() * 0.4;
    colors[i * 3 + 2] = 0.8 + rand() * 0.2;
  }
  return { positions, colors };
}

function NebulaCloud({
  position,
  color,
  scale,
  opacity = 0.12,
  spin = 0.015,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
  opacity?: number;
  spin?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = clock.elapsedTime * spin;
    ref.current.rotation.y = clock.elapsedTime * spin * 0.5;
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

function AsteroidField({
  sky,
  count,
  inner,
  outer,
  yMin,
  yMax,
  seed,
}: {
  sky: SkyTheme;
  count: number;
  inner: number;
  outer: number;
  yMin: number;
  yMax: number;
  seed: number;
}) {
  const rocks = useMemo(() => {
    const rand = seededRand(seed);
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + rand() * 0.35;
      const r = inner + rand() * (outer - inner);
      const wobble = (rand() - 0.5) * 18;
      return {
        id: `ast-${seed}-${i}`,
        position: [
          Math.cos(angle) * r + wobble,
          yMin + rand() * (yMax - yMin),
          Math.sin(angle) * r + wobble * 0.6,
        ] as [number, number, number],
        scale: 0.35 + rand() * 2.2,
        spin: 0.08 + rand() * 0.45,
      };
    });
  }, [count, inner, outer, yMin, yMax, seed]);

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

function GalaxyDisk({
  color,
  position,
  inner,
  outer,
  tilt = -Math.PI / 2.15,
  speed = 0.012,
  opacity = 0.16,
}: {
  color: string;
  position: [number, number, number];
  inner: number;
  outer: number;
  tilt?: number;
  speed?: number;
  opacity?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * speed;
  });
  return (
    <mesh ref={ref} rotation={[tilt, 0.15, 0]} position={position}>
      <ringGeometry args={[inner, outer, 96]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function ColoredStars({
  seed,
  count,
  radius,
  size,
}: {
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

/** Deep-space backdrop: stars, nebulae, belts — no colliders. */
export function GalaxySky({
  sky,
  rich = true,
}: {
  sky: SkyTheme;
  rich?: boolean;
}) {
  const starCount = rich ? 7800 : 2800;
  const sparkleCount = rich ? 180 : 70;

  return (
    <group>
      <Stars
        radius={720}
        depth={220}
        count={starCount}
        factor={4.2}
        saturation={0.75}
        fade
        speed={0.28}
      />
      <ColoredStars
        seed={0xa11ce}
        count={rich ? 1600 : 600}
        radius={420}
        size={1.15}
      />
      <ColoredStars
        seed={0xb00b5}
        count={rich ? 900 : 350}
        radius={680}
        size={2.1}
      />
      {rich ? (
        <ColoredStars seed={0xc0ffee} count={500} radius={900} size={3.2} />
      ) : null}

      <Sparkles
        count={sparkleCount}
        scale={[220, 90, 220]}
        size={5}
        speed={0.3}
        opacity={0.5}
        color={sky.brandSecondary}
      />
      <Sparkles
        count={Math.round(sparkleCount * 0.7)}
        scale={[160, 60, 160]}
        position={[0, 20, -40]}
        size={7}
        speed={0.18}
        opacity={0.38}
        color={sky.brand}
      />
      <Sparkles
        count={Math.round(sparkleCount * 0.45)}
        scale={[400, 120, 400]}
        position={[120, 40, -200]}
        size={8}
        speed={0.12}
        opacity={0.28}
        color={sky.star}
      />

      {/* Near nebulae */}
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

      {/* Mid / far nebulae */}
      <NebulaCloud
        position={[-220, 60, -180]}
        color="#5cefff"
        scale={110}
        opacity={0.07}
        spin={0.008}
      />
      <NebulaCloud
        position={[260, 45, 140]}
        color="#ff5ed8"
        scale={130}
        opacity={0.065}
        spin={0.006}
      />
      <NebulaCloud
        position={[80, 90, -340]}
        color="#ffe08a"
        scale={150}
        opacity={0.055}
        spin={0.005}
      />
      <NebulaCloud
        position={[-380, 70, 220]}
        color="#4dff9a"
        scale={140}
        opacity={0.06}
        spin={0.007}
      />
      <NebulaCloud
        position={[420, 30, -400]}
        color="#6a4cff"
        scale={180}
        opacity={0.05}
        spin={0.004}
      />
      <NebulaCloud
        position={[-100, 120, 480]}
        color="#ff6a3d"
        scale={160}
        opacity={0.05}
        spin={0.005}
      />

      <GalaxyDisk
        color={sky.brandSecondary}
        position={[0, -18, -40]}
        inner={30}
        outer={120}
      />
      <GalaxyDisk
        color={sky.brand}
        position={[-180, -40, -220]}
        inner={80}
        outer={260}
        tilt={-Math.PI / 2.4}
        speed={0.006}
        opacity={0.12}
      />
      <GalaxyDisk
        color={sky.star}
        position={[300, -60, 180]}
        inner={100}
        outer={320}
        tilt={-Math.PI / 1.9}
        speed={0.004}
        opacity={0.1}
      />

      {rich ? (
        <>
          <AsteroidField
            sky={sky}
            count={56}
            inner={52}
            outer={78}
            yMin={2}
            yMax={18}
            seed={0xbeef01}
          />
          <AsteroidField
            sky={sky}
            count={72}
            inner={140}
            outer={190}
            yMin={-10}
            yMax={40}
            seed={0xbeef02}
          />
          <AsteroidField
            sky={sky}
            count={64}
            inner={300}
            outer={380}
            yMin={-20}
            yMax={55}
            seed={0xbeef03}
          />
          <AsteroidField
            sky={sky}
            count={48}
            inner={520}
            outer={620}
            yMin={-30}
            yMax={70}
            seed={0xbeef04}
          />
        </>
      ) : (
        <AsteroidField
          sky={sky}
          count={36}
          inner={55}
          outer={90}
          yMin={2}
          yMax={20}
          seed={0xbeef01}
        />
      )}
    </group>
  );
}
