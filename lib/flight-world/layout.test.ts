import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ACHIEVEMENTS } from "./achievements";
import { buildPlaygroundLayout } from "./layout";

describe("buildPlaygroundLayout", () => {
  it("includes companies, projects, pads, secrets, toys", () => {
    const layout = buildPlaygroundLayout();
    assert.equal(
      layout.landmarks.filter((l) => l.kind === "company").length,
      7,
    );
    assert.ok(layout.landmarks.some((l) => l.kind === "project"));
    assert.ok(layout.landmarks.some((l) => l.kind === "contact"));
    assert.ok(layout.landmarks.some((l) => l.kind === "resume"));
    assert.equal(
      layout.landmarks.filter((l) => l.kind === "secret").length,
      3,
    );
    assert.ok(layout.crates.length >= 8);
    assert.ok(layout.coins.length >= 5);
    assert.ok(layout.bouncePads.length >= 2);
  });
});

describe("ACHIEVEMENTS", () => {
  it("defines at least five achievements", () => {
    assert.ok(ACHIEVEMENTS.length >= 5);
  });
});
