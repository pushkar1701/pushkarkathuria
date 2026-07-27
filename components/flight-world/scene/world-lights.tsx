"use client";

/* eslint-disable react-hooks/immutability -- R3F scene background/fog are
 * assigned imperatively on the live three.js Scene. */

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { SkyTheme } from "@/lib/flight/loadout";

export function WorldLights({ sky }: { sky: SkyTheme }) {
  const { scene, gl } = useThree();

  useEffect(() => {
    gl.setClearColor(sky.sky, 1);
    scene.background = new THREE.Color(sky.sky);
    scene.fog = new THREE.FogExp2(sky.fog, 0.00155);
    return () => {
      scene.background = null;
      scene.fog = null;
    };
  }, [scene, gl, sky]);

  return (
    <>
      <ambientLight intensity={0.35} />
      <hemisphereLight args={[sky.skyHi, sky.ground, 0.7]} />
      <directionalLight position={[30, 50, 20]} intensity={0.9} color="#fff0d8" />
      <pointLight
        position={[-20, 18, 8]}
        intensity={70}
        distance={100}
        color={sky.brand}
      />
      <pointLight
        position={[28, 14, -12]}
        intensity={55}
        distance={90}
        color={sky.brandSecondary}
      />
      <pointLight
        position={[0, 25, -35]}
        intensity={40}
        distance={120}
        color={sky.star}
      />
      <spotLight
        position={[0, 40, 20]}
        angle={0.55}
        penumbra={0.6}
        intensity={30}
        distance={80}
        color={sky.brandSecondary}
      />
    </>
  );
}
