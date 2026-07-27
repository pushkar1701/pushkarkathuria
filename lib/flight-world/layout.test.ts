import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ACHIEVEMENTS } from "./achievements";
import {
  buildPlaygroundLayout,
  CIRCUIT_BAYS,
  GALAXY_HARD_VOID,
  GALAXY_PLANETS,
  SECTION_BANNERS,
} from "./layout";

describe("buildPlaygroundLayout", () => {
  it("builds a circuit with bay-hosted landmarks", () => {
    const layout = buildPlaygroundLayout();
    assert.equal(
      layout.landmarks.filter((l) => l.kind === "company" && l.bayId === "companies")
        .length,
      7,
    );
    assert.equal(
      layout.landmarks.filter((l) => l.kind === "project").length,
      7,
    );
    assert.ok(layout.landmarks.some((l) => l.kind === "skill"));
    assert.ok(layout.landmarks.some((l) => l.kind === "hobby"));
    assert.equal(
      layout.landmarks.filter((l) => l.kind === "achievement").length,
      4,
    );
    assert.ok(layout.landmarks.some((l) => l.kind === "contact"));
    assert.ok(layout.landmarks.some((l) => l.kind === "resume"));
    assert.equal(
      layout.landmarks.filter((l) => l.kind === "secret").length,
      2,
    );
    assert.ok(layout.crates.length >= 8);
    assert.ok(layout.coins.length >= 5);
    assert.ok(layout.bouncePads.length >= 2);
    assert.equal(layout.bays.length, CIRCUIT_BAYS.length);
  });
});

describe("CIRCUIT_BAYS", () => {
  it("exposes the pit-stop exits", () => {
    const ids = CIRCUIT_BAYS.map((b) => b.id);
    assert.ok(ids.includes("companies"));
    assert.ok(ids.includes("technologies"));
    assert.ok(ids.includes("projects"));
    assert.ok(ids.includes("achievements"));
    assert.ok(ids.includes("hobbies"));
    assert.ok(ids.includes("contact"));
    assert.ok(ids.includes("playground"));
  });
});

describe("SECTION_BANNERS", () => {
  it("labels exit mouths from circuit bays", () => {
    const titles = SECTION_BANNERS.map((b) => b.title);
    assert.ok(titles.includes("Companies"));
    assert.ok(titles.includes("Projects"));
    assert.ok(titles.includes("Technologies"));
    assert.ok(titles.includes("Hobbies"));
    assert.equal(SECTION_BANNERS.length, CIRCUIT_BAYS.length);
  });
});

describe("galaxy scale", () => {
  it("spreads many planets across a large roam radius", () => {
    assert.ok(GALAXY_PLANETS.length >= 18);
    assert.ok(GALAXY_HARD_VOID >= 800);
    const farthest = Math.max(
      ...GALAXY_PLANETS.map((p) => Math.hypot(p.position[0], p.position[2])),
    );
    assert.ok(farthest > 400);
  });
});

describe("ACHIEVEMENTS", () => {
  it("defines at least five achievements", () => {
    assert.ok(ACHIEVEMENTS.length >= 5);
  });
});
