import type { FlightWaypoint } from "./waypoints";

export function nextWaypoint(
  waypoints: FlightWaypoint[],
  visited: Set<string>,
): FlightWaypoint | null {
  return waypoints.find((w) => !visited.has(w.id)) ?? null;
}

export function distanceXZ(
  a: [number, number, number] | number[],
  b: [number, number, number] | number[],
) {
  const dx = a[0] - b[0];
  const dz = a[2] - b[2];
  return Math.hypot(dx, dz);
}

export function isCaptured(
  planePos: [number, number, number] | number[],
  waypoint: FlightWaypoint,
  radius: number,
) {
  return distanceXZ(planePos, waypoint.position) <= radius;
}

/** Returns a horizontal steer vector blended toward the target. */
export function magnetSteer(
  forwardXZ: [number, number],
  toTargetXZ: [number, number],
  strength: number,
): [number, number] {
  const fl = Math.hypot(forwardXZ[0], forwardXZ[1]) || 1;
  const tl = Math.hypot(toTargetXZ[0], toTargetXZ[1]) || 1;
  const fx = forwardXZ[0] / fl;
  const fz = forwardXZ[1] / fl;
  const tx = toTargetXZ[0] / tl;
  const tz = toTargetXZ[1] / tl;
  const x = fx * (1 - strength) + tx * strength;
  const z = fz * (1 - strength) + tz * strength;
  const len = Math.hypot(x, z) || 1;
  return [x / len, z / len];
}
