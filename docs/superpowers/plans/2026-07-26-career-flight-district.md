# Career Flight District Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace guided path/arcade Career Flight with a free-roam rocket district (Bruno-inspired overlay) with landmarks, soft collision, collectibles, and mobile CTAs hidden.

**Architecture:** Keep FlightProvider/Shell/hangar/canvas. Add `lib/flight/world.ts` placements and `lib/flight/collision.ts` pure helpers. Replace path/arcade scene with district + landmarks. Plane becomes free kinematic flight with AABB bounce and trigger discovery. HUD shows discover/collectible/respawn.

**Tech Stack:** Next.js 16, React 19, R3F, Three.js, existing flight controls/loadout.

## Global Constraints

- Overlay only; do not replace homepage.
- No Rapier; hybrid kinematic + soft collision.
- No score/combo/endless win loop.
- Hide CTAs unless `md+` and fine pointer.
- Session-only discovery/collectible state.
- Desktop keyboard flight; coarse/reduced-motion gates stay.

---

### Task 1: World data + collision helpers (TDD)

**Files:**
- Create: `lib/flight/world.ts`, `lib/flight/collision.ts`
- Create: `lib/flight/world.test.ts`, `lib/flight/collision.test.ts`
- Modify: `content/flight.ts` (copy for district HUD)

- [ ] Write collision tests (AABB push-out, bounds, triggers)
- [ ] Implement collision helpers
- [ ] Write world builder tests (7 companies, featured projects, contact, resume, solids, collectibles, secrets)
- [ ] Implement `buildFlightWorld()`
- [ ] Update flight copy for explore (drop arcade score strings from HUD use)

### Task 2: Scene + plane rewrite

**Files:**
- Create: `components/flight/scene/district.tsx`, `components/flight/scene/landmarks.tsx`
- Modify: `components/flight/scene/plane.tsx`, `components/flight/flight-canvas.tsx`
- Stop using: path-line / arcade-field as primary gameplay (can leave files unused or delete imports)

- [ ] Render platforms/props/collectibles from world
- [ ] Render landmarks with accent materials
- [ ] Rewrite Plane: no magnet/path; collide solids; discover landmarks; pick collectibles; respawn via token

### Task 3: Shell + HUD + mobile CTAs

**Files:**
- Modify: `flight-shell.tsx`, `flight-hud.tsx`, `flight-cta.tsx`, `footer-trigger.tsx`
- Modify: hangar copy if needed

- [ ] Shell state: discovered Set, collectibles Set, nearLandmark, respawnToken
- [ ] HUD: discover count, coins, card, Respawn, Cancel; drop score/endless
- [ ] Hide CTAs/footer on mobile/coarse pointer
- [ ] Handle KeyR respawn when open

### Task 4: Verify

- [ ] `npm test`, `npm run lint`, `npm run build`
- [ ] Spec status → Implemented

---

**Done when:** Desktop CTA → hangar → free flight, no path; discover company + project; bounce on pad; collect coin; Respawn/Cancel work; mobile CTAs hidden.
