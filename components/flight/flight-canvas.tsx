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
import { nextWaypoint } from "@/lib/flight/path";
import { buildFlightWaypoints } from "@/lib/flight/waypoints";
import { getInitialCameraPosition, Plane } from "./scene/plane";
import { PathLine } from "./scene/path-line";
import { Waypoints } from "./scene/waypoints";
import { World } from "./scene/world";

export type FlightCanvasProps = {
  visited: Set<string>;
  onVisit: (id: string) => void;
};

export default function FlightCanvas({ visited, onVisit }: FlightCanvasProps) {
  const keyState = useMemo(() => createKeyState(), []);
  const waypoints = useMemo(() => buildFlightWaypoints(), []);
  const cameraPosition = useMemo(() => getInitialCameraPosition(waypoints), [waypoints]);
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
      // Missed keyups (alt-tab, devtools focus, etc.) would otherwise leave
      // movement "stuck" on; clear everything when the window loses focus.
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
      <World />
      <PathLine waypoints={waypoints} />
      <Waypoints waypoints={waypoints} visited={visited} nextId={nextId} />
      <Plane
        keyState={keyState}
        waypoints={waypoints}
        visited={visited}
        onVisit={onVisit}
      />
    </Canvas>
  );
}
