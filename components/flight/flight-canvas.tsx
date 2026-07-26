"use client";

import { useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  applyKeyEvent,
  createKeyState,
  isEditableTarget,
  isMovementKey,
  resetKeyState,
} from "@/lib/flight/controls";
import type { CraftDef, SkyTheme } from "@/lib/flight/loadout";
import type { FlightWorld } from "@/lib/flight/world";
import { District } from "./scene/district";
import { Landmarks } from "./scene/landmarks";
import { getInitialCameraPosition, Plane } from "./scene/plane";
import { World } from "./scene/world";

export type FlightCanvasProps = {
  world: FlightWorld;
  sky: SkyTheme;
  craft: CraftDef;
  discovered: Set<string>;
  collectedIds: Set<string>;
  onDiscover: (id: string) => void;
  onCollect: (id: string) => void;
  onNear: (id: string | null) => void;
  nearId: string | null;
  respawnToken: number;
};

export default function FlightCanvas({
  world,
  sky,
  craft,
  discovered,
  collectedIds,
  onDiscover,
  onCollect,
  onNear,
  nearId,
  respawnToken,
}: FlightCanvasProps) {
  const keyState = useMemo(() => createKeyState(), []);
  const cameraPosition = useMemo(
    () => getInitialCameraPosition(world),
    [world],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) return;
      if (isMovementKey(event.code)) event.preventDefault();
      applyKeyEvent(keyState, event, true);
    }
    function handleKeyUp(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) return;
      if (isMovementKey(event.code)) event.preventDefault();
      applyKeyEvent(keyState, event, false);
    }
    function handleBlur() {
      resetKeyState(keyState);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [keyState]);

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: cameraPosition, fov: 50 }}
      shadows={false}
    >
      <World sky={sky} />
      <District world={world} sky={sky} collectedIds={collectedIds} />
      <Landmarks
        landmarks={world.landmarks}
        discovered={discovered}
        nearId={nearId}
      />
      <Plane
        keyState={keyState}
        world={world}
        craft={craft}
        discovered={discovered}
        collectedIds={collectedIds}
        onDiscover={onDiscover}
        onCollect={onCollect}
        onNear={onNear}
        respawnToken={respawnToken}
      />
    </Canvas>
  );
}
