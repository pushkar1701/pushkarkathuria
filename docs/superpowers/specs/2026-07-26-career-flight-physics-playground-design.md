# Career Flight Physics Playground — Design Spec

**Date:** 2026-07-26  
**Site:** pushkarkathuria.com  
**Status:** Implemented (v1 playground — iterate density/GLTF/music in-place)  
**Vision reference:** [bruno-simon.com](https://bruno-simon.com/)  
**Supersedes:** free-roam kinematic district overlay (`2026-07-26-career-flight-district-design.md`) and arcade corridor loop for the primary flight experience

## Goal

Build a Bruno Simon–scale **physics playground** at `/flight`: a Rapier-powered rocket world with an authored island, smashable toys, embedded portfolio landmarks, mini-map, achievements, secrets, and audio. Marketing homepage stays at `/`; desktop CTAs deep-link into the playground.

## Locked decisions

| Topic | Choice |
| --- | --- |
| Genre | Physics playground (not guided path, not soft AABB-only district) |
| Ambition | Full Bruno-scale systems in one comprehensive build |
| Assets | Hybrid: code-built terrain/structures + hero GLTFs (rocket, key landmarks) over time |
| Placement | Dedicated route `/flight` (not overlay, not homepage replace) |
| Stack | R3F + `@react-three/rapier` + Howler |
| Entry | Desktop Hero/Experience/footer/`fly` → `/flight`; hangar as first screen on that route |
| Mobile | Hide CTAs; `/flight` shows desktop-only / reduced-motion gate |

## Product shape & entry

- **`/flight`:** Full-viewport playground. No marketing scroll chrome.
- **`/`:** Unchanged marketing site. CTAs navigate to `/flight` (no portal overlay for play).
- **Hangar:** First screen on `/flight` (sky + craft) → Launch into island.
- **Cutover:** Retire `FlightShell` overlay play path after `/flight` ships (delete or leave unused; prefer delete once stable).
- **Mobile / coarse pointer / reduced motion:** Gate UI with resume/contact links; no broken touch physics session.

## World, physics & content

### Feel

A small park/planet you **crash around** in a rocket. Weight, bounce, boost, jump pads, smashable crates. Joy = physics first; portfolio content is embedded in the place (in-world panels), HUD secondary.

### Island districts

| District | Content |
| --- | --- |
| Hangar plateau | Spawn, soft tutorial props |
| Company cliffs | 7 company towers/beacons + in-world panels |
| Projects pier | Featured project billboards / pavilions |
| Contact bay | Pad → navigate to `/#contact` (or in-world then navigate) |
| Resume hangar | Pad → `/resume` |
| Play zone | Ramp, circuit-ish loop, bounce pads, crate stacks, pins |
| Secrets | Cave / under-island / `fly` shrine / Bonafide Losers nod |

### Physics (Rapier)

- Dynamic rocket: thrust, torque, linear/angular damping; boost; jump impulse on pads / Space where designed.
- Static island colliders (terrain, ramps, buildings).
- Dynamic smashables (crates, pins).
- Sensor volumes for discover / collect / secret unlock.
- Respawn on fall below world or “I’m stuck” control.

### Systems (full C)

- **Mini-map** with district markers and player blip.
- **Achievements** (e.g. discover all companies, smash N crates, find all secrets, complete a lap).
- **Collectible coins** (light, not a forced win).
- **Audio** (Howler): ambient bed + SFX (boost, crash, collect, UI); mute toggle.
- **Options:** audio, quality (dpr / effects), respawn, reset smashables / progress (where safe).

## Architecture

```
app/flight/page.tsx          → route + metadata
components/flight-world/     → playground UI + R3F scene (new tree)
lib/flight-world/            → layout data, achievement defs, pure helpers
public/flight/               → GLTF / audio assets (as added)
```

| Piece | Role |
| --- | --- |
| `FlightApp` | Hangar → playing; gates; providers |
| `Rocket` | Rapier rigid body + controls |
| `Island` | Static mesh + colliders |
| `Toys` | Dynamic props |
| `Sensors` | Landmark / coin / secret triggers |
| `Hud` | Map, achievements, options, near-panel, respawn |
| Audio bus | Howler wrapper; respects mute + reduced motion (optional silent) |

**Homepage:** `FlightCta` / footer / `fly` chord → `router.push('/flight')` or `<Link href="/flight">`.

**State:** React context or Zustand for session discovery + UI; `localStorage` for mute and unlocked achievements.

**Old modules:** Overlay district (`components/flight/*` play shell) removed after cutover; shared copy/brand tokens may move under `flight-world`.

## Controls (desktop)

| Input | Action |
| --- | --- |
| WASD / arrows | Thrust / steer (torque + directional thrust) |
| Shift | Boost |
| Space | Jump / pad boost (where applicable) |
| R | Respawn |
| M | Toggle map |
| L | Mute |
| Esc | Options / leave to `/` |

Exact thrust model tuned in implementation for “toy rocket” feel (not sim-racing realism).

## Out of scope

Multiplayer, mobile physics controls, photo-real cinema assets, live leaderboard server (stub offline if UI needs it), replacing `/` with the 3D world.

## Success criteria

1. Visiting `/flight` on desktop: hangar → Rapier rocket on a coherent island with smashables that feel physical.
2. Can discover companies and projects via in-world presence; Contact/Resume reachable from pads.
3. Mini-map, at least 5 achievements, secrets, collectibles, and muteable audio are present.
4. Marketing CTAs on `/` go to `/flight` and are hidden on mobile.
5. Coarse pointer / reduced-motion users get a safe gate, not a broken canvas.

## Risks (accepted)

Full Bruno parity is multi-week. This spec commits to **systems + place + physics feel** with code-first art and hero GLTFs; visual density will grow iteratively inside the same architecture rather than a second rewrite.
