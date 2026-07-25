import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  distanceXZ,
  isCaptured,
  magnetSteer,
  nextWaypoint,
} from "./path";
import type { FlightWaypoint } from "./waypoints";

const wp = (id: string, x: number, z: number): FlightWaypoint => ({
  id,
  company: id,
  shortCompany: id,
  role: "Role",
  dates: "2020",
  accent: "#fff",
  position: [x, 2, z],
});

describe("flight path helpers", () => {
  it("picks the first unvisited waypoint", () => {
    const list = [wp("a", 0, 0), wp("b", 10, 0)];
    assert.equal(nextWaypoint(list, new Set(["a"]))?.id, "b");
    assert.equal(nextWaypoint(list, new Set(["a", "b"])), null);
  });

  it("captures when inside radius on XZ", () => {
    const target = wp("a", 0, 0);
    assert.equal(isCaptured([0.5, 2, 0.5], target, 2), true);
    assert.equal(isCaptured([20, 2, 0], target, 2), false);
    assert.ok(distanceXZ([0, 0, 0], [3, 9, 4]) > 4);
  });

  it("magnetSteer blends forward toward target proportional to strength", () => {
    const forward: [number, number] = [1, 0];
    const toTarget: [number, number] = [0, 1];

    const [x0, z0] = magnetSteer(forward, toTarget, 0);
    assert.ok(Math.abs(x0 - 1) < 1e-9 && Math.abs(z0) < 1e-9);

    const [x1, z1] = magnetSteer(forward, toTarget, 1);
    assert.ok(Math.abs(x1) < 1e-9 && Math.abs(z1 - 1) < 1e-9);

    const [xh] = magnetSteer(forward, toTarget, 0.5);
    // Partial blend should sit strictly between the two extremes.
    assert.ok(xh > 0 && xh < 1);
  });

  it("magnetSteer always returns a unit vector", () => {
    const [x, z] = magnetSteer([1, 0], [0.6, 0.8], 0.035);
    assert.ok(Math.abs(Math.hypot(x, z) - 1) < 1e-9);
  });
});
