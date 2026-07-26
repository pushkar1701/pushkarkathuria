"use client";

type Sfx = "boost" | "crash" | "collect" | "discover" | "ui";

let muted = false;
let ctx: AudioContext | null = null;

function context() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ctx = new AC();
  }
  return ctx;
}

export function setFlightMuted(value: boolean) {
  muted = value;
  try {
    localStorage.setItem("flight-mute", value ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export function getFlightMuted() {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem("flight-mute") === "1";
  } catch {
    return false;
  }
}

export function initFlightAudioFromStorage() {
  muted = getFlightMuted();
}

/** Procedural SFX bus (Howler-ready later for music beds). */
export function playSfx(kind: Sfx) {
  if (muted) return;
  const ac = context();
  if (!ac) return;
  if (ac.state === "suspended") void ac.resume();

  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain);
  gain.connect(ac.destination);

  const now = ac.currentTime;
  const table: Record<Sfx, { f: number; d: number; type: OscillatorType }> = {
    boost: { f: 180, d: 0.12, type: "sawtooth" },
    crash: { f: 90, d: 0.18, type: "square" },
    collect: { f: 660, d: 0.1, type: "sine" },
    discover: { f: 440, d: 0.16, type: "triangle" },
    ui: { f: 520, d: 0.06, type: "sine" },
  };
  const tone = table[kind];
  osc.type = tone.type;
  osc.frequency.setValueAtTime(tone.f, now);
  osc.frequency.exponentialRampToValueAtTime(tone.f * 1.4, now + tone.d);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.d);
  osc.start(now);
  osc.stop(now + tone.d + 0.02);
}
