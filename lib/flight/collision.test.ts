import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isInSphere,
  resolveBounds,
  resolveSolids,
  type SolidBox,
} from "./collision";

describe("resolveSolids", () => {
  const box: SolidBox = {
    id: "pad",
    position: [0, 0, 0],
    size: [4, 2, 4],
  };

  it("leaves a free sphere unchanged", () => {
    const out = resolveSolids([0, 5, 0], 0.7, [box]);
    assert.deepEqual(out, [0, 5, 0]);
  });

  it("pushes a sphere out of an overlapping box", () => {
    const out = resolveSolids([0, 1.2, 0], 0.7, [box]);
    assert.ok(out[1] >= 1 + 0.7 - 0.05, `expected above box top, got ${out[1]}`);
  });
});

describe("resolveBounds", () => {
  it("clamps into world bounds", () => {
    const out = resolveBounds([100, -5, -100], {
      minX: -10,
      maxX: 10,
      minY: 0.5,
      maxY: 8,
      minZ: -10,
      maxZ: 10,
    });
    assert.deepEqual(out, [10, 0.5, -10]);
  });
});

describe("isInSphere", () => {
  it("detects inside and outside", () => {
    assert.equal(isInSphere([0, 0, 0], [0, 0, 0], 2), true);
    assert.equal(isInSphere([3, 0, 0], [0, 0, 0], 2), false);
  });
});
