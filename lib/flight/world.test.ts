import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildFlightWorld } from "./world";

describe("buildFlightWorld", () => {
  it("includes companies, featured projects, contact, resume, secrets", () => {
    const world = buildFlightWorld();
    const kinds = Object.fromEntries(
      ["company", "project", "contact", "resume", "secret"].map((k) => [
        k,
        world.landmarks.filter((l) => l.kind === k).length,
      ]),
    );
    assert.equal(kinds.company, 7);
    assert.ok(kinds.project >= 3);
    assert.equal(kinds.contact, 1);
    assert.equal(kinds.resume, 1);
    assert.equal(kinds.secret, 2);
  });

  it("places solids and collectibles with a spawn pose", () => {
    const world = buildFlightWorld();
    assert.ok(world.solids.length >= 10);
    assert.ok(world.collectibles.length >= 6);
    assert.equal(world.spawn.position.length, 3);
  });
});
