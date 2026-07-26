# Career Flight Physics Playground Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Bruno-style Rapier rocket playground at `/flight` with island, smashables, landmarks, map, achievements, secrets, audio; homepage CTAs deep-link there.

**Architecture:** New `app/flight` client app using R3F + `@react-three/rapier` + Howler. Separate `components/flight-world/` tree. Homepage drops overlay play; CTAs `Link` to `/flight`.

**Tech Stack:** Next.js 16, React 19, R3F, `@react-three/rapier`, howler, three.

## Global Constraints

- Play lives at `/flight` only (not overlay, not homepage replace).
- Desktop keyboard physics; mobile/coarse/reduced-motion get a gate.
- Hybrid assets: code island first; GLTF hooks optional.
- localStorage for mute + achievements.
- No multiplayer / leaderboard server.

---

### Task 1: Deps + `/flight` scaffold + homepage cutover

**Files:**
- Create: `app/flight/page.tsx`, `components/flight-world/flight-app.tsx`, `components/flight-world/gate.tsx`
- Modify: `components/flight/flight-cta.tsx`, `footer-trigger.tsx`, `flight-provider.tsx`, `app/page.tsx`
- Create: `lib/flight-world/achievements.ts`, `lib/flight-world/layout.ts`

- [ ] Install `@react-three/rapier` and `howler` (+ `@types/howler`)
- [ ] Scaffold `/flight` with hangar → play phases and mobile gate
- [ ] Point CTAs / footer / `fly` to `/flight`; remove `FlightShell` from homepage

### Task 2: Physics island + rocket + toys

**Files:**
- Create: `components/flight-world/scene/canvas.tsx`, `rocket.tsx`, `island.tsx`, `toys.tsx`, `world-lights.tsx`

- [ ] Static island colliders (ground, ramps, districts)
- [ ] Dynamic rocket with thrust/boost/jump + respawn
- [ ] Dynamic crates / pins / bounce pads

### Task 3: Content sensors + HUD systems

**Files:**
- Create: `sensors.tsx`, `hud.tsx`, `map.tsx`, `audio.ts`, `store.tsx`

- [ ] Landmark/coin/secret sensors + discover state
- [ ] HUD: map, achievements, options, near panel, respawn, leave
- [ ] Howler muteable SFX stubs (procedural or short beeps via WebAudio if no assets)

### Task 4: Verify

- [ ] `npm test`, `npm run lint`, `npm run build`
- [ ] Spec status → Implemented

**Done when:** Desktop `/flight` has Rapier rocket on island with smashables, discoverable content, map + achievements + mute, homepage links work, mobile gated.
