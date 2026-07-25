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
import type { ArcadeRing, ArcadeRock } from "@/lib/flight/arcade";
import type { CraftDef, SkyTheme } from "@/lib/flight/loadout";
import { nextWaypoint } from "@/lib/flight/path";
import { buildFlightWaypoints } from "@/lib/flight/waypoints";
import { ArcadeField } from "./scene/arcade-field";
import { getInitialCameraPosition, Plane } from "./scene/plane";
import { PathLine } from "./scene/path-line";
import { Waypoints } from "./scene/waypoints";
import { World } from "./scene/world";

export type FlightCanvasProps = {
  visited: Set<string>;
  onVisit: (id: string) => void;
  sky: SkyTheme;
  craft: CraftDef;
  rings: ArcadeRing[];
  rocks: ArcadeRock[];
  collectedRingIds: Set<string>;
  onRing: (id: string) => void;
  onHit: () => void;
};

export default function FlightCanvas({
  visited,
  onVisit,
  sky,
  craft,
  rings,
  rocks,
  collectedRingIds,
  onRing,
  onHit,
}: FlightCanvasProps) {
  const keyState = useMemo(() => createKeyState(), []);
  const waypoints = useMemo(() => buildFlightWaypoints(), []);
  const cameraPosition = useMemo(
    () => getInitialCameraPosition(waypoints),
    [waypoints],
  );
  const nextId = useMemo(
    () => nextWaypoint(waypoints, visited)?.id ?? null,
    [waypoints, visited],
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
      <PathLine waypoints={waypoints} color={sky.brandSecondary} />
      <ArcadeField
        rings={rings}
        rocks={rocks}
        collectedRingIds={collectedRingIds}
        sky={sky}
      />
      <Waypoints waypoints={waypoints} visited={visited} nextId={nextId} />
      <Plane
        keyState={keyState}
        waypoints={waypoints}
        visited={visited}
        onVisit={onVisit}
        craft={craft}
        rings={rings}
        rocks={rocks}
        collectedRingIds={collectedRingIds}
        onRing={onRing}
        onHit={onHit}
      />
    </Canvas>
  );
}
