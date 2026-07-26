export type Vec3 = [number, number, number];

export type SolidBox = {
  id: string;
  /** Center */
  position: Vec3;
  /** Full width, height, depth */
  size: Vec3;
};

/** Soft world bounds (inclusive soft limits before hard clamp). */
export type WorldBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
};

export const DEFAULT_BOUNDS: WorldBounds = {
  minX: -36,
  maxX: 36,
  minY: 0.6,
  maxY: 18,
  minZ: -28,
  maxZ: 28,
};

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

/** Sphere vs AABB: push sphere center out of overlapping boxes. */
export function resolveSolids(
  position: Vec3,
  radius: number,
  solids: SolidBox[],
): Vec3 {
  let [x, y, z] = position;
  for (const solid of solids) {
    const hx = solid.size[0] / 2;
    const hy = solid.size[1] / 2;
    const hz = solid.size[2] / 2;
    const minX = solid.position[0] - hx;
    const maxX = solid.position[0] + hx;
    const minY = solid.position[1] - hy;
    const maxY = solid.position[1] + hy;
    const minZ = solid.position[2] - hz;
    const maxZ = solid.position[2] + hz;

    const cx = clamp(x, minX, maxX);
    const cy = clamp(y, minY, maxY);
    const cz = clamp(z, minZ, maxZ);
    const dx = x - cx;
    const dy = y - cy;
    const dz = z - cz;
    const d2 = dx * dx + dy * dy + dz * dz;
    if (d2 >= radius * radius) continue;

    if (d2 < 1e-8) {
      // Center inside box: push out along smallest penetration axis.
      const penX = Math.min(x - minX, maxX - x);
      const penY = Math.min(y - minY, maxY - y);
      const penZ = Math.min(z - minZ, maxZ - z);
      if (penX <= penY && penX <= penZ) {
        x = x < solid.position[0] ? minX - radius : maxX + radius;
      } else if (penY <= penZ) {
        y = y < solid.position[1] ? minY - radius : maxY + radius;
      } else {
        z = z < solid.position[2] ? minZ - radius : maxZ + radius;
      }
      continue;
    }

    const d = Math.sqrt(d2);
    const push = (radius - d) / d;
    x += dx * push;
    y += dy * push;
    z += dz * push;
  }
  return [x, y, z];
}

export function resolveBounds(
  position: Vec3,
  bounds: WorldBounds = DEFAULT_BOUNDS,
): Vec3 {
  return [
    clamp(position[0], bounds.minX, bounds.maxX),
    clamp(position[1], bounds.minY, bounds.maxY),
    clamp(position[2], bounds.minZ, bounds.maxZ),
  ];
}

export function isInSphere(
  position: Vec3,
  center: Vec3,
  radius: number,
): boolean {
  const dx = position[0] - center[0];
  const dy = position[1] - center[1];
  const dz = position[2] - center[2];
  return dx * dx + dy * dy + dz * dz <= radius * radius;
}
