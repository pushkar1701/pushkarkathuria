"use client";

import { useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { applyKeyEvent, createKeyState, isEditableTarget } from "@/lib/flight/controls";
import { nextWaypoint } from "@/lib/flight/path";
import { buildFlightWaypoints } from "@/lib/flight/waypoints";
import { Plane } from "./scene/plane";
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
  const nextId = useMemo(
    () => nextWaypoint(waypoints, visited)?.id ?? null,
    [waypoints, visited],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) return;
      applyKeyEvent(keyState, event, true);
    }
    function handleKeyUp(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) return;
      applyKeyEvent(keyState, event, false);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keyState]);

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [-10, 6, 12], fov: 50 }}
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
