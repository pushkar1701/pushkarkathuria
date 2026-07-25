import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  applyKeyEvent,
  createKeyState,
  isMovementKey,
  resetKeyState,
} from "./controls";

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

  it("cancels out opposing keys held simultaneously", () => {
    const state = createKeyState();
    applyKeyEvent(state, { code: "KeyA", repeat: false } as KeyboardEvent, true);
    applyKeyEvent(state, { code: "KeyD", repeat: false } as KeyboardEvent, true);
    assert.equal(state.yaw, 0);

    applyKeyEvent(state, { code: "KeyW", repeat: false } as KeyboardEvent, true);
    applyKeyEvent(state, { code: "KeyS", repeat: false } as KeyboardEvent, true);
    assert.equal(state.pitch, 0);

    // Releasing one of the two opposing keys should restore the other.
    applyKeyEvent(state, { code: "KeyD", repeat: false } as KeyboardEvent, false);
    assert.equal(state.yaw, 1);
  });

  it("resets all tracked keys and axes, e.g. on window blur", () => {
    const state = createKeyState();
    applyKeyEvent(state, { code: "KeyW", repeat: false } as KeyboardEvent, true);
    applyKeyEvent(state, { code: "KeyD", repeat: false } as KeyboardEvent, true);
    applyKeyEvent(state, { code: "ShiftLeft", repeat: false } as KeyboardEvent, true);

    resetKeyState(state);
    assert.equal(state.pitch, 0);
    assert.equal(state.yaw, 0);
    assert.equal(state.throttle, 0);

    // A stale keyup for a key that was cleared by reset should be a no-op.
    applyKeyEvent(state, { code: "KeyW", repeat: false } as KeyboardEvent, false);
    assert.equal(state.pitch, 0);
  });
});
