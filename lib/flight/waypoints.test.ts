// lib/flight/waypoints.test.ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildFlightWaypoints } from "./waypoints";

describe("buildFlightWaypoints", () => {
  it("returns oldest-to-newest order starting at Basware", () => {
    const points = buildFlightWaypoints();
    assert.equal(points[0]?.company.includes("Basware"), true);
    assert.equal(points.at(-1)?.id, "datalogz");
  });

  it("assigns accents and world positions for every stop", () => {
    const points = buildFlightWaypoints();
    assert.equal(points.length, 7);
    for (const p of points) {
      assert.ok(p.accent);
      assert.equal(typeof p.position[0], "number");
      assert.equal(typeof p.position[1], "number");
      assert.equal(typeof p.position[2], "number");
      assert.ok(p.shortCompany.length > 0);
    }
  });
});
