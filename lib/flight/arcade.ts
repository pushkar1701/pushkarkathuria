import type { FlightWaypoint } from "@/lib/flight/waypoints";

export type ArcadeRing = {
  id: string;
  position: [number, number, number];
  /** Unit forward along the path so the gate faces the flyer. */
  forward: [number, number, number];
};

export type ArcadeRock = {
  id: string;
  position: [number, number, number];
  radius: number;
};

const BASE_RING_SPACING = 8.5;
const BASE_ROCK_SPACING = 14;

/** Place sparse ring gates and off-path rocks along career segments. */
export function buildArcadeProps(
  waypoints: FlightWaypoint[],
  density = 1,
): { rings: ArcadeRing[]; rocks: ArcadeRock[] } {
  const rings: ArcadeRing[] = [];
  const rocks: ArcadeRock[] = [];
  if (waypoints.length < 2) return { rings, rocks };

  const ringSpacing = BASE_RING_SPACING / Math.max(0.75, density);
  const rockSpacing = BASE_ROCK_SPACING / Math.max(0.75, Math.min(density, 1.6));

  let seed = 0xa12ade;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  let ringIndex = 0;
  let rockIndex = 0;
  let ringBudget = 0;
  let rockBudget = 0;

  for (let i = 0; i < waypoints.length - 1; i += 1) {
    const a = waypoints[i].position;
    const b = waypoints[i + 1].position;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const dz = b[2] - a[2];
    const len = Math.hypot(dx, dy, dz) || 1;
    const fx = dx / len;
    const fy = dy / len;
    const fz = dz / len;
    const horiz = Math.hypot(dx, dz) || 1;
    const px = -dz / horiz;
    const pz = dx / horiz;

    ringBudget += len;
    while (ringBudget >= ringSpacing) {
      ringBudget -= ringSpacing;
      const traveled = len - ringBudget;
      const t = Math.min(0.92, Math.max(0.08, traveled / len));
      // Keep gates near the flight line; alternate a slight lateral nudge.
      const lateral = ((ringIndex % 2) * 2 - 1) * 0.55;
      rings.push({
        id: `ring-${ringIndex}`,
        position: [
          a[0] + dx * t + px * lateral,
          a[1] + dy * t,
          a[2] + dz * t + pz * lateral,
        ],
        forward: [fx, fy, fz],
      });
      ringIndex += 1;
    }

    rockBudget += len;
    while (rockBudget >= rockSpacing) {
      rockBudget -= rockSpacing;
      const traveled = len - rockBudget;
      const t = Math.min(0.85, Math.max(0.15, traveled / len));
      const side = rand() > 0.5 ? 1 : -1;
      const lateral = side * (3.2 + rand() * 1.4);
      rocks.push({
        id: `rock-${rockIndex}`,
        position: [
          a[0] + dx * t + px * lateral,
          a[1] + dy * t + (rand() - 0.5) * 0.8,
          a[2] + dz * t + pz * lateral,
        ],
        radius: 0.55 + rand() * 0.35,
      });
      rockIndex += 1;
    }
  }

  return { rings, rocks };
}
