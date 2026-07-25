import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { applyKeyEvent, createKeyState } from "./controls";

describe("flight controls", () => {
  it("tracks pressed movement keys", () => {
    const state = createKeyState();
    applyKeyEvent(state, { code: "KeyW", repeat: false } as KeyboardEvent, true);
    assert.equal(state.pitch, 1);
    applyKeyEvent(state, { code: "KeyW", repeat: false } as KeyboardEvent, false);
    assert.equal(state.pitch, 0);
  });
});
