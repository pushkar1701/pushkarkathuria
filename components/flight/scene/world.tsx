"use client";

/* eslint-disable react-hooks/immutability -- R3F scene background/fog are
 * assigned imperatively on the live three.js Scene. */

import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { SkyTheme } from "@/lib/flight/loadout";

/** Deterministic star field so render stays pure. */
function buildStarPositions(count: number) {
  const positions = new Float32Array(count * 3);
  let seed = 0xc0ffee;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < count; i += 1) {
    const r = 80 + rand() * 220;
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 8;
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  return positions;
}

const STAR_POSITIONS = buildStarPositions(900);

export function World({ sky }: { sky: SkyTheme }) {
  const { scene, gl } = useThree();

  useEffect(() => {
    gl.setClearColor(sky.sky, 1);
    scene.background = new THREE.Color(sky.sky);
    scene.fog = new THREE.FogExp2(sky.fog, 0.012);
    return () => {
      scene.background = null;
      scene.fog = null;
    };
  }, [scene, gl, sky]);

  const stars = useMemo(() => STAR_POSITIONS, []);

  return (
    <>
      <hemisphereLight args={[sky.skyHi, sky.ground, 0.55]} />
      <directionalLight position={[18, 28, 10]} intensity={0.55} color="#c8b8ff" />
      <pointLight
        position={[-20, 12, -10]}
        intensity={18}
        distance={80}
        color={sky.brand}
      />
      <pointLight
        position={[24, 10, 16]}
        intensity={14}
        distance={70}
        color={sky.brandSecondary}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -9.02, 0]}>
        <circleGeometry args={[280, 64]} />
        <meshStandardMaterial color={sky.ground} roughness={1} metalness={0} />
      </mesh>

      <gridHelper
        args={[240, 48, sky.grid, sky.grid]}
        position={[0, -8.95, 0]}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -8.9, 0]}>
        <ringGeometry args={[40, 120, 64]} />
        <meshBasicMaterial
          color={sky.brand}
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -8.88, 0]}>
        <ringGeometry args={[80, 180, 64]} />
        <meshBasicMaterial
          color={sky.brandSecondary}
          transparent
          opacity={0.03}
          side={THREE.DoubleSide}
        />
      </mesh>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={sky.star}
          size={0.55}
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </points>
    </>
  );
}
