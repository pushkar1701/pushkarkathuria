import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { applyKeyEvent, createKeyState, isMovementKey } from "./controls";

describe("flight controls", () => {
  it("tracks pressed movement keys", () => {
    const state = createKeyState();
    applyKeyEvent(state, { code: "KeyW", repeat: false } as KeyboardEvent, true);
    assert.equal(state.pitch, 1);
    applyKeyEvent(state, { code: "KeyW", repeat: false } as KeyboardEvent, false);
    assert.equal(state.pitch, 0);
  });

  it("identifies keys whose browser defaults should be suppressed", () => {
    assert.equal(isMovementKey("ArrowUp"), true);
    assert.equal(isMovementKey("KeyA"), true);
    assert.equal(isMovementKey("ShiftRight"), true);
    assert.equal(isMovementKey("Escape"), false);
  });
});
