export type KeyState = {
  pitch: number; // -1..1
  yaw: number;
  throttle: number; // 0..1 boost
};

const PITCH_UP = new Set(["KeyW", "ArrowUp"]);
const PITCH_DOWN = new Set(["KeyS", "ArrowDown"]);
const YAW_LEFT = new Set(["KeyA", "ArrowLeft"]);
const YAW_RIGHT = new Set(["KeyD", "ArrowRight"]);
const THROTTLE = new Set(["ShiftLeft", "ShiftRight"]);

const pressedByState = new WeakMap<KeyState, Set<string>>();

export function isMovementKey(code: string) {
  return (
    PITCH_UP.has(code) ||
    PITCH_DOWN.has(code) ||
    YAW_LEFT.has(code) ||
    YAW_RIGHT.has(code) ||
    THROTTLE.has(code)
  );
}

function pressedCodes(state: KeyState): Set<string> {
  let set = pressedByState.get(state);
  if (!set) {
    set = new Set();
    pressedByState.set(state, set);
  }
  return set;
}

function syncMovement(state: KeyState, pressed: Set<string>) {
  const pitchUp = [...PITCH_UP].some((c) => pressed.has(c));
  const pitchDown = [...PITCH_DOWN].some((c) => pressed.has(c));
  if (pitchUp && !pitchDown) state.pitch = 1;
  else if (pitchDown && !pitchUp) state.pitch = -1;
  else state.pitch = 0;

  const yawLeft = [...YAW_LEFT].some((c) => pressed.has(c));
  const yawRight = [...YAW_RIGHT].some((c) => pressed.has(c));
  if (yawLeft && !yawRight) state.yaw = 1;
  else if (yawRight && !yawLeft) state.yaw = -1;
  else state.yaw = 0;

  state.throttle = [...THROTTLE].some((c) => pressed.has(c)) ? 1 : 0;
}

export function createKeyState(): KeyState {
  const state: KeyState = { pitch: 0, yaw: 0, throttle: 0 };
  pressedByState.set(state, new Set());
  return state;
}

export function applyKeyEvent(
  state: KeyState,
  e: Pick<KeyboardEvent, "code" | "repeat">,
  down: boolean,
) {
  if (e.repeat) return;

  if (!isMovementKey(e.code)) return;

  const pressed = pressedCodes(state);
  if (down) pressed.add(e.code);
  else pressed.delete(e.code);

  syncMovement(state, pressed);
}

export function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}
