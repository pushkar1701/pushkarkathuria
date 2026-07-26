"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import * as THREE from "three";
import {
  getCraft,
  getSkyTheme,
  type CraftId,
  type SkyId,
} from "@/lib/flight/loadout";
import { SPAWN } from "@/lib/flight-world/layout";
import { useFlightWorld } from "../store";
import { GalaxySky } from "./galaxy";
import { Island } from "./island";
import { PlanetObstacles } from "./planet-obstacles";
import { Rocket } from "./rocket";
import { SectionBanners } from "./section-banners";
import { Sensors } from "./sensors";
import { Toys } from "./toys";
import { WorldLights } from "./world-lights";

function SceneBody({
  skyId,
  craftId,
  rich,
}: {
  skyId: SkyId;
  craftId: CraftId;
  rich: boolean;
}) {
  const sky = getSkyTheme(skyId);
  const craft = getCraft(craftId);
  return (
    <>
      <WorldLights sky={sky} />
      <GalaxySky sky={sky} rich={rich} />
      <Physics gravity={[0, -9.8, 0]} timeStep="vary">
        <Island sky={sky} />
        <SectionBanners />
        <Toys sky={sky} />
        <PlanetObstacles sky={sky} />
        <Sensors sky={sky} />
        <Rocket craft={craft} />
      </Physics>
    </>
  );
}

export function FlightWorldCanvas({
  skyId,
  craftId,
}: {
  skyId: SkyId;
  craftId: CraftId;
}) {
  const { quality } = useFlightWorld();
  const sky = getSkyTheme(skyId);
  const rich = quality === "high";
  const dpr = rich
    ? ([1, 1.5] as [number, number])
    : ([1, 1] as [number, number]);

  return (
    <Canvas
      dpr={dpr}
      camera={{
        position: [
          SPAWN.position[0],
          SPAWN.position[1] + 6,
          SPAWN.position[2] + 16,
        ],
        fov: 55,
        near: 0.1,
        far: 450,
      }}
      gl={{
        antialias: rich,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      style={{ background: sky.sky }}
    >
      <Suspense fallback={null}>
        <SceneBody skyId={skyId} craftId={craftId} rich={rich} />
      </Suspense>
    </Canvas>
  );
}
