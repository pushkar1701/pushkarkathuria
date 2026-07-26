"use client";

import type { SkyTheme } from "@/lib/flight/loadout";

export function WorldLights({ sky }: { sky: SkyTheme }) {
  return (
    <>
      <color attach="background" args={[sky.skyHi]} />
      <fog attach="fog" args={[sky.skyHi, 70, 160]} />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#c8d0ff", sky.ground, 0.85]} />
      <directionalLight position={[20, 40, 10]} intensity={1.35} color="#fff5e8" />
      <pointLight position={[-15, 12, 10]} intensity={50} distance={80} color={sky.brand} />
      <pointLight
        position={[25, 10, -10]}
        intensity={40}
        distance={70}
        color={sky.brandSecondary}
      />
    </>
  );
}
