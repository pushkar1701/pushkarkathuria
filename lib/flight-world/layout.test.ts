import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ACHIEVEMENTS } from "./achievements";
import { buildPlaygroundLayout, SECTION_BANNERS } from "./layout";

describe("buildPlaygroundLayout", () => {
  it("includes companies, projects, skills, pads, secrets, toys", () => {
    const layout = buildPlaygroundLayout();
    assert.equal(
      layout.landmarks.filter((l) => l.kind === "company").length,
      7,
    );
    assert.ok(layout.landmarks.some((l) => l.kind === "project"));
    assert.ok(layout.landmarks.some((l) => l.kind === "skill"));
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

describe("SECTION_BANNERS", () => {
  it("labels the main island districts", () => {
    const titles = SECTION_BANNERS.map((b) => b.title);
    assert.ok(titles.includes("Companies"));
    assert.ok(titles.includes("Projects"));
    assert.ok(titles.includes("Technologies"));
    assert.ok(SECTION_BANNERS.length >= 5);
  });
});

describe("ACHIEVEMENTS", () => {
  it("defines at least five achievements", () => {
    assert.ok(ACHIEVEMENTS.length >= 5);
  });
});
