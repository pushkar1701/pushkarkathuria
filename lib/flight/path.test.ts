import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  distanceXZ,
  isCaptured,
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
});
