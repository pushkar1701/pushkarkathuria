"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import {
  getCraft,
  getSkyTheme,
  type CraftId,
  type SkyId,
} from "@/lib/flight/loadout";
import { SPAWN } from "@/lib/flight-world/layout";
import { useFlightWorld } from "../store";
import { Island } from "./island";
import { Rocket } from "./rocket";
import { Sensors } from "./sensors";
import { Toys } from "./toys";
import { WorldLights } from "./world-lights";

function SceneBody({ skyId, craftId }: { skyId: SkyId; craftId: CraftId }) {
  const sky = getSkyTheme(skyId);
  const craft = getCraft(craftId);
  return (
    <>
      <WorldLights sky={sky} />
      <Physics gravity={[0, -9.8, 0]} timeStep="vary">
        <Island sky={sky} />
        <Toys sky={sky} />
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
  const dpr =
    quality === "high" ? ([1, 1.5] as [number, number]) : ([1, 1] as [number, number]);

  return (
    <Canvas
      dpr={dpr}
      camera={{
        position: [
          SPAWN.position[0],
          SPAWN.position[1] + 6,
          SPAWN.position[2] + 16,
        ],
        fov: 50,
        near: 0.1,
        far: 200,
      }}
      gl={{ antialias: quality === "high" }}
      style={{ background: sky.skyHi }}
    >
      <Suspense fallback={null}>
        <SceneBody skyId={skyId} craftId={craftId} />
      </Suspense>
    </Canvas>
  );
}
