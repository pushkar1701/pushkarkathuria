# Career Flight Easter Egg Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a desktop-only Career Flight easter egg (R3F overlay) that lets visitors steer along a glowing career path through Experience waypoints, then lands on a credits card with Contact / Resume CTAs.

**Architecture:** Thin `FlightProvider` + portal shell mounts on the home page. Opening (footer plane or typing `fly`) dynamically imports the R3F canvas so Three.js never hits the critical path. Pure helpers in `lib/flight/` own waypoints, keyboard state, and magnet math; React owns HUD / credits / gates.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, `three`, `@react-three/fiber`, `@react-three/drei`, Framer Motion (optional HUD only), Node built-in test runner for pure helpers.

**Spec:** `docs/superpowers/specs/2026-07-26-career-flight-easter-egg-design.md`

## Global Constraints

- Dynamic-import Three/R3F only after open; dispose on close.
- Desktop play only; coarse-pointer gets explanatory panel (no WebGL).
- `prefers-reduced-motion: reduce` → static career-route list, no WebGL loop.
- No localStorage; no XP / quest language; no em dashes in user-facing copy.
- Waypoint order: oldest → newest via `[...experience].reverse()`.
- Ignore `fly` chord when focus is in editable fields.
- Body scroll locked while open; unlock on close.

---

### Task 1: Flight copy + waypoint builder (with tests)

**Files:**
- Create: `content/flight.ts`
- Create: `lib/flight/waypoints.ts`
- Create: `lib/flight/waypoints.test.ts`
- Create: `lib/flight/accents.ts`

**Interfaces:**
- Consumes: `experience` from `content/site.ts`
- Produces:
  - `flightCopy` object (labels, mobile message, credits, controls)
  - `FlightWaypoint` type
  - `buildFlightWaypoints(): FlightWaypoint[]`
  - `FLIGHT_ACCENTS: string[]` (same cycle as Experience pins)

- [ ] **Step 1: Write failing waypoint tests**

```ts
// lib/flight/waypoints.test.ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildFlightWaypoints } from "./waypoints";

describe("buildFlightWaypoints", () => {
  it("returns oldest-to-newest order starting at Basware", () => {
    const points = buildFlightWaypoints();
    assert.equal(points[0]?.company.includes("Basware"), true);
    assert.equal(points.at(-1)?.id, "datalogz");
  });

  it("assigns accents and world positions for every stop", () => {
    const points = buildFlightWaypoints();
    assert.equal(points.length, 7);
    for (const p of points) {
      assert.ok(p.accent);
      assert.equal(typeof p.position[0], "number");
      assert.equal(typeof p.position[1], "number");
      assert.equal(typeof p.position[2], "number");
      assert.ok(p.shortCompany.length > 0);
    }
  });
});
```

- [ ] **Step 2: Run tests - expect FAIL**

Run: `node --import tsx --test lib/flight/waypoints.test.ts`  
(If `tsx` is missing, install as a devDependency: `npm i -D tsx`, or compile via `npx tsc` and run the emitted JS.)  
Expected: FAIL module not found / function not defined

- [ ] **Step 3: Implement accents, copy, and waypoints**

```ts
// lib/flight/accents.ts
export const FLIGHT_ACCENTS = [
  "oklch(0.8 0.14 85)",
  "var(--brand-secondary)",
  "var(--brand)",
  "oklch(0.76 0.13 155)",
  "oklch(0.8 0.14 85)",
  "var(--brand-secondary)",
  "var(--brand)",
] as const;
```

```ts
// content/flight.ts
export const flightCopy = {
  title: "Career Flight",
  land: "Land",
  footerAria: "Take a flight along my career path",
  desktopOnly:
    "This easter egg is built for keyboard - try it on desktop.",
  reducedMotionTitle: "Career route",
  creditsTitle: "Career route complete",
  creditsBody: "You flew the path from where I started to where I am now.",
  contact: "Contact",
  resume: "Resume",
  controlsHint: "WASD / arrows · Shift throttle · Esc land",
  progress: (visited: number, total: number) => `${visited}/${total}`,
} as const;
```

```ts
// lib/flight/waypoints.ts
import { experience } from "@/content/site";
import { FLIGHT_ACCENTS } from "@/lib/flight/accents";

export type FlightWaypoint = {
  id: string;
  company: string;
  shortCompany: string;
  role: string;
  dates: string;
  accent: string;
  position: [number, number, number];
};

function shortCompany(name: string) {
  if (name.includes("Basware")) return "Basware";
  if (name.includes("Sapient")) return "Sapient";
  if (name.includes("DMI")) return "DMI";
  if (name.includes("Cognizant")) return "Cognizant";
  if (name.includes("RSystems")) return "RSystems";
  if (name.includes("Deloitte")) return "Deloitte";
  if (name.includes("Datalogz")) return "Datalogz";
  return name;
}

/** Lay stops along a gentle arc in world space (oldest → newest). */
export function buildFlightWaypoints(): FlightWaypoint[] {
  const ordered = [...experience].reverse();
  const n = ordered.length;
  return ordered.map((job, i) => {
    const t = n === 1 ? 0 : i / (n - 1);
    const x = (t - 0.5) * 48;
    const z = Math.sin(t * Math.PI) * -10;
    const y = 2 + Math.sin(t * Math.PI * 2) * 0.6;
    return {
      id: job.id,
      company: job.company,
      shortCompany: shortCompany(job.company),
      role: job.role,
      dates: job.dates,
      accent: FLIGHT_ACCENTS[i % FLIGHT_ACCENTS.length],
      position: [x, y, z],
    };
  });
}
```

Mirror Experience `shortCompany` / pin accents exactly if they differ - prefer extracting shared helpers later; for v1 duplicate is OK to avoid refactors.

- [ ] **Step 4: Run tests - expect PASS**

Run: `node --import tsx --test lib/flight/waypoints.test.ts`  
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add content/flight.ts lib/flight/accents.ts lib/flight/waypoints.ts lib/flight/waypoints.test.ts package.json package-lock.json
git commit -m "Add Career Flight waypoint data and copy."
```

---

### Task 2: Path magnet + keyboard helpers (with tests)

**Files:**
- Create: `lib/flight/path.ts`
- Create: `lib/flight/path.test.ts`
- Create: `lib/flight/controls.ts`
- Create: `lib/flight/controls.test.ts`

**Interfaces:**
- Consumes: `FlightWaypoint`
- Produces:
  - `nextWaypoint(waypoints, visitedIds): FlightWaypoint | null`
  - `distanceXZ(a, b): number`
  - `magnetSteer(forward, toTarget, strength): [number, number, number]` (normalized yaw nudge)
  - `isCaptured(planePos, waypoint, radius): boolean`
  - `createKeyState()` / `applyKeyEvent(state, e, down)` / `KeyState`

- [ ] **Step 1: Write failing path + controls tests**

```ts
// lib/flight/path.test.ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  distanceXZ,
  isCaptured,
  nextWaypoint,
} from "./path";
import type { FlightWaypoint } from "./waypoints";

const wp = (id: string, x: number, z: number): FlightWaypoint => ({
  id,
  company: id,
  shortCompany: id,
  role: "Role",
  dates: "2020",
  accent: "#fff",
  position: [x, 2, z],
});

describe("flight path helpers", () => {
  it("picks the first unvisited waypoint", () => {
    const list = [wp("a", 0, 0), wp("b", 10, 0)];
    assert.equal(nextWaypoint(list, new Set(["a"]))?.id, "b");
    assert.equal(nextWaypoint(list, new Set(["a", "b"])), null);
  });

  it("captures when inside radius on XZ", () => {
    const target = wp("a", 0, 0);
    assert.equal(isCaptured([0.5, 2, 0.5], target, 2), true);
    assert.equal(isCaptured([20, 2, 0], target, 2), false);
    assert.ok(distanceXZ([0, 0, 0], [3, 9, 4]) > 4);
  });
});
```

```ts
// lib/flight/controls.test.ts
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
```

- [ ] **Step 2: Run tests - expect FAIL**

Run: `node --import tsx --test lib/flight/path.test.ts lib/flight/controls.test.ts`  
Expected: FAIL module not found

- [ ] **Step 3: Implement helpers**

```ts
// lib/flight/path.ts
import type { FlightWaypoint } from "./waypoints";

export function nextWaypoint(
  waypoints: FlightWaypoint[],
  visited: Set<string>,
): FlightWaypoint | null {
  return waypoints.find((w) => !visited.has(w.id)) ?? null;
}

export function distanceXZ(
  a: [number, number, number] | number[],
  b: [number, number, number] | number[],
) {
  const dx = a[0] - b[0];
  const dz = a[2] - b[2];
  return Math.hypot(dx, dz);
}

export function isCaptured(
  planePos: [number, number, number] | number[],
  waypoint: FlightWaypoint,
  radius: number,
) {
  return distanceXZ(planePos, waypoint.position) <= radius;
}

/** Returns a horizontal steer vector blended toward the target. */
export function magnetSteer(
  forwardXZ: [number, number],
  toTargetXZ: [number, number],
  strength: number,
): [number, number] {
  const fl = Math.hypot(forwardXZ[0], forwardXZ[1]) || 1;
  const tl = Math.hypot(toTargetXZ[0], toTargetXZ[1]) || 1;
  const fx = forwardXZ[0] / fl;
  const fz = forwardXZ[1] / fl;
  const tx = toTargetXZ[0] / tl;
  const tz = toTargetXZ[1] / tl;
  const x = fx * (1 - strength) + tx * strength;
  const z = fz * (1 - strength) + tz * strength;
  const len = Math.hypot(x, z) || 1;
  return [x / len, z / len];
}
```

```ts
// lib/flight/controls.ts
export type KeyState = {
  pitch: number; // -1..1
  yaw: number;
  throttle: number; // 0..1 boost
};

export function createKeyState(): KeyState {
  return { pitch: 0, yaw: 0, throttle: 0 };
}

export function applyKeyEvent(
  state: KeyState,
  e: Pick<KeyboardEvent, "code" | "repeat">,
  down: boolean,
) {
  if (e.repeat) return;
  const v = down ? 1 : 0;
  switch (e.code) {
    case "KeyW":
    case "ArrowUp":
      state.pitch = down ? 1 : state.pitch === 1 ? 0 : state.pitch;
      break;
    case "KeyS":
    case "ArrowDown":
      state.pitch = down ? -1 : state.pitch === -1 ? 0 : state.pitch;
      break;
    case "KeyA":
    case "ArrowLeft":
      state.yaw = down ? 1 : state.yaw === 1 ? 0 : state.yaw;
      break;
    case "KeyD":
    case "ArrowRight":
      state.yaw = down ? -1 : state.yaw === -1 ? 0 : state.yaw;
      break;
    case "ShiftLeft":
    case "ShiftRight":
      state.throttle = v;
      break;
    default:
      break;
  }
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
```

Fix pitch/yaw release logic carefully so opposing keys don't stick - prefer tracking a `Set` of codes if the simple version flakes in manual QA.

- [ ] **Step 4: Run tests - expect PASS**

Run: `node --import tsx --test lib/flight/*.test.ts`  
Expected: all PASS

- [ ] **Step 5: Commit**

```bash
git add lib/flight/path.ts lib/flight/path.test.ts lib/flight/controls.ts lib/flight/controls.test.ts
git commit -m "Add Career Flight path magnet and keyboard helpers."
```

---

### Task 3: Flight provider, chord, shell, footer trigger

**Files:**
- Create: `components/flight/flight-provider.tsx`
- Create: `components/flight/flight-shell.tsx`
- Create: `components/flight/footer-trigger.tsx`
- Modify: `components/footer.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `flightCopy`, `isEditableTarget`
- Produces: `FlightProvider`, `useFlight()`, `open` / `close` / `isOpen`

- [ ] **Step 1: Implement provider**

```tsx
"use client";
// components/flight/flight-provider.tsx
// Context with isOpen, open(), close()
// useEffect: window keydown buffer for letters spelling "fly" (case-insensitive)
// Reset buffer after 2s idle or wrong letter
// Skip when isEditableTarget(e.target)
// Esc calls close() when open
```

- [ ] **Step 2: Implement shell with dynamic canvas**

```tsx
"use client";
// components/flight/flight-shell.tsx
// If !isOpen return null
// Portal to document.body
// fixed inset-0 z-[80] bg-background/95
// On mount: document.body.style.overflow = "hidden"; cleanup restore
// Detect coarse pointer OR prefers-reduced-motion → render FlightHud gate/fallback only
// Else: next/dynamic(() => import("./flight-canvas"), { ssr: false, loading: ... })
```

Until Task 4, `flight-canvas.tsx` can be a stub:

```tsx
export default function FlightCanvas() {
  return <div className="grid h-full place-items-center text-sm">Canvas loading…</div>;
}
```

- [ ] **Step 3: Footer trigger + page mount**

```tsx
// footer-trigger.tsx - button with Plane icon from lucide-react
// opacity-40 hover:opacity-100 hover:text-brand
// onClick → open()
```

Wire into `Footer` next to social links. Wrap homepage in `FlightProvider` and render `<FlightShell />` inside it in `app/page.tsx`.

- [ ] **Step 4: Manual smoke**

Run: `npm run dev`  
Verify: footer plane opens overlay; typing `fly` opens; Esc closes; body scroll restores; typing in email field does not open.

- [ ] **Step 5: Commit**

```bash
git add components/flight app/page.tsx components/footer.tsx
git commit -m "Wire Career Flight provider, shell, and footer trigger."
```

---

### Task 4: Install R3F and build the flight canvas

**Files:**
- Create: `components/flight/flight-canvas.tsx`
- Create: `components/flight/scene/*` as needed (`plane.tsx`, `world.tsx`, `waypoints.tsx`, `path-line.tsx`)
- Modify: `package.json` (deps)

**Interfaces:**
- Consumes: `buildFlightWaypoints`, `createKeyState`, `applyKeyEvent`, `nextWaypoint`, `isCaptured`, `magnetSteer`, `useFlight`
- Produces: default export `FlightCanvas` used by dynamic import

- [ ] **Step 1: Install deps**

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

- [ ] **Step 2: Implement scene**

`FlightCanvas` responsibilities:
- `<Canvas dpr={[1, 1.5]} camera={{ position: [0, 8, 16], fov: 50 }}>`
- Fog + ambient + directional light (no shadows)
- Simple ground plane + sky color matching site background
- CatmullRom / Line from waypoint positions (glowing path)
- Beacon meshes per waypoint (emissive accent; pulse if next; dimmer if visited)
- Player plane: group of boxes/cones; `useFrame` integrates keys → position/rotation
- Soft magnet when next waypoint exists and facing within ~60°
- Capture radius ~2.5 world units → call into shell via props/callbacks: `onVisit(id)`, `visited: Set<string>`
- Chase camera slightly behind/above plane
- `visibilitychange` → stop updates when hidden (skip `useFrame` work)

Lift visited state to `FlightShell` so HUD can read it.

- [ ] **Step 3: Verify in browser**

Run: `npm run dev`  
Open easter egg on desktop: plane moves with WASD; path visible; beacons light on visit.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json components/flight
git commit -m "Add Career Flight R3F scene with guided free-flight."
```

---

### Task 5: HUD, credits card, gates

**Files:**
- Create: `components/flight/flight-hud.tsx`
- Modify: `components/flight/flight-shell.tsx`
- Modify: `components/flight/flight-canvas.tsx` (callbacks only if needed)

**Interfaces:**
- Consumes: `flightCopy`, waypoints, `visited`, `close`, `siteConfig` / routes
- Produces: HUD overlay; credits when `visited.size === waypoints.length`

- [ ] **Step 1: Implement HUD**

```tsx
// Top bar: flightCopy.title + Land button
// Bottom hint: flightCopy.controlsHint (opacity fades after first key)
// Side card: next or last visited - shortCompany, role, dates, progress
// Credits modal when complete:
//   title, body, list of shortCompany names
//   LinkButton to #contact and /resume, Land button
```

- [ ] **Step 2: Wire gates in shell**

```tsx
if (coarsePointer) return <DesktopOnlyPanel onClose={close} />;
if (reduceMotion) return <ReducedMotionRouteList onClose={close} />;
return <DynamicCanvas ... />;
```

- [ ] **Step 3: Manual QA checklist**

- Complete all 7 stops → credits appear  
- Contact jumps to `#contact` after Land or from credits (decide: close then navigate, or navigate under overlay then close)  
- Resume opens `/resume`  
- Reduced motion: no canvas, list visible  
- Coarse pointer: desktop-only message  

- [ ] **Step 4: Commit**

```bash
git add components/flight
git commit -m "Add Career Flight HUD, credits card, and device gates."
```

---

### Task 6: Polish, build verification, docs touch-up

**Files:**
- Modify: any flight files as needed from QA
- Optionally modify: `README.md` (one line mentioning the easter egg - only if you already document fun extras)

- [ ] **Step 1: Lint + typecheck + build**

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Expected: clean typecheck; lint clean or only pre-existing warnings; build succeeds; flight chunk appears as a separate async bundle in build output.

- [ ] **Step 2: Bundle sanity**

Confirm the main `/` RSC/client bundle does not eagerly include `three` (search `.next` client manifests / network tab on cold load before opening the egg).

- [ ] **Step 3: Final commit + push (when user asks)**

```bash
git add -A
git commit -m "Polish Career Flight easter egg and verify production build."
git push origin HEAD
```

Only push when the user requests it.

---

## Self-review

1. **Spec coverage:** Triggers, guided flight, desktop-only, reduced motion, credits CTAs, dynamic import, in-session visited, waypoint order - all mapped to Tasks 1-6.  
2. **Placeholders:** None intentional; canvas internals are specified enough to implement without inventing product behavior.  
3. **Types:** `FlightWaypoint`, `KeyState`, `buildFlightWaypoints`, `nextWaypoint`, `isCaptured`, `magnetSteer`, provider `open/close` - consistent across tasks.

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-26-career-flight-easter-egg.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** - fresh subagent per task, review between tasks  
2. **Inline Execution** - execute tasks in this session with checkpoints  

Which approach?
