"use client";

// Resolves any CSS color (including var(--token) and oklch(...)) into a
// rgb()/hex string that THREE.Color can parse, by round-tripping the value
// through a live DOM element (to resolve custom properties via the cascade)
// and then a canvas 2D context (which always serializes fillStyle as
// #rrggbb / rgba(...), per spec — sidestepping newer wide-gamut
// color(srgb ...) serializations that THREE.Color.setStyle can't parse).
//
// The probe element is created, appended, sampled, and removed within a
// single call rather than kept around, so it never lingers as an orphaned
// node in the document. Resolved values are cached by input string so this
// only runs once per distinct color.
const cache = new Map<string, string>();

export function resolveCssColor(value: string, fallback = "#ffffff"): string {
  if (typeof document === "undefined") return fallback;

  const cached = cache.get(value);
  if (cached) return cached;

  const el = document.createElement("div");
  el.style.position = "fixed";
  el.style.left = "-9999px";
  el.style.top = "-9999px";
  el.style.pointerEvents = "none";
  el.style.opacity = "0";
  document.body.appendChild(el);

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

  document.body.removeChild(el);
  cache.set(value, resolved);
  return resolved;
}
