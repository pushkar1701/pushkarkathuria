import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { advanceFlightChord } from "./flight-provider";

describe("Career Flight chord", () => {
  it("opens after fly regardless of letter case", () => {
    let state = advanceFlightChord("", "F", 0);
    state = advanceFlightChord(state.buffer, "l", 100);
    state = advanceFlightChord(state.buffer, "Y", 100);

    assert.deepEqual(state, { buffer: "", matched: true });
  });

  it("resets after a wrong letter", () => {
    const state = advanceFlightChord("f", "x", 100);

    assert.deepEqual(state, { buffer: "", matched: false });
  });

  it("starts over after two seconds idle", () => {
    const state = advanceFlightChord("fl", "y", 2001);

    assert.deepEqual(state, { buffer: "", matched: false });
  });
});
