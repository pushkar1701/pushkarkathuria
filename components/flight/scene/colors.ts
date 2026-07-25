"use client";

// Resolves any CSS color (including var(--token) and oklch(...)) into a
// rgb()/hex string that THREE.Color can parse, by round-tripping the value
// through a live DOM element (to resolve custom properties via the cascade)
// and then a canvas 2D context (which always serializes fillStyle as
// #rrggbb / rgba(...), per spec — sidestepping newer wide-gamut
// color(srgb ...) serializations that THREE.Color.setStyle can't parse).
let probe: HTMLDivElement | null = null;
const cache = new Map<string, string>();

function getProbe(): HTMLDivElement {
  if (!probe) {
    probe = document.createElement("div");
    probe.style.position = "fixed";
    probe.style.left = "-9999px";
    probe.style.top = "-9999px";
    probe.style.pointerEvents = "none";
    probe.style.opacity = "0";
    document.body.appendChild(probe);
  }
  return probe;
}

export function resolveCssColor(value: string, fallback = "#ffffff"): string {
  if (typeof document === "undefined") return fallback;

  const cached = cache.get(value);
  if (cached) return cached;

  const el = getProbe();
  el.style.color = fallback;
  el.style.color = value;
  const computed = getComputedStyle(el).color;

  let resolved = fallback;
  if (computed) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = fallback;
      ctx.fillStyle = computed;
      resolved = ctx.fillStyle;
    } else {
      resolved = computed;
    }
  }

  cache.set(value, resolved);
  return resolved;
}
