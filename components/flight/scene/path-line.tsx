"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import type { FlightWaypoint } from "@/lib/flight/waypoints";
import { resolveCssColor } from "./colors";

/** Glowing CatmullRom spline strung through the waypoints. */
export function PathLine({ waypoints }: { waypoints: FlightWaypoint[] }) {
  const color = useMemo(
    () => resolveCssColor("var(--brand-secondary)", "#5ad1d6"),
    [],
  );

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
    <Line
      points={points}
      color={color}
      lineWidth={2}
      transparent
      opacity={0.65}
    />
  );
}
