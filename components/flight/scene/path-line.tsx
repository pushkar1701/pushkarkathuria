"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import type { FlightWaypoint } from "@/lib/flight/waypoints";

/** Glowing CatmullRom spline strung through the waypoints. */
export function PathLine({
  waypoints,
  color,
}: {
  waypoints: FlightWaypoint[];
  color: string;
}) {
  const points = useMemo(() => {
    if (waypoints.length < 2) return [];
    const curve = new THREE.CatmullRomCurve3(
      waypoints.map((w) => new THREE.Vector3(...w.position)),
      false,
      "catmullrom",
      0.35,
    );
    return curve.getPoints(waypoints.length * 24);
  }, [waypoints]);

  if (points.length === 0) return null;

  return (
    <>
      <Line points={points} color={color} lineWidth={3} transparent opacity={0.14} />
      <Line points={points} color={color} lineWidth={1.5} transparent opacity={0.55} />
    </>
  );
}
