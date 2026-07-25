# Career Flight Easter Egg — Design Spec

**Date:** 2026-07-26  
**Site:** pushkarkathuria.com  
**Status:** Approved  

## Goal

Add a desktop-only, optionally discovered **Career Flight** easter egg: a guided free-flight WebGL experience where the player steers a plane along a glowing path through career waypoints (Basware → … → Datalogz), then lands on an on-brand credits card with Contact / Resume CTAs.

## Decisions locked in

| Topic | Choice |
| --- | --- |
| Metaphor | Career-path flight (Experience stops as waypoints) |
| Control style | Guided free-flight (steer + soft magnet to next waypoint) |
| Discovery | Both: type `fly` + subtle footer plane icon |
| Platforms | Desktop-only play; touch devices get an explanatory panel |
| Stack | React Three Fiber overlay (Approach A) |
| Completion | Credits-style card with Contact / Resume / Land |
| Persistence | In-session only (no localStorage) |
| Quest language | None (no XP / Career Quest) |

## Architecture

```
Footer plane button ──┐
Type "fly" chord ─────┼──► FlightProvider (open state)
                      │         │
                      │         ▼ dynamic import on open
                      │    FlightCanvas (R3F + three)
                      │         │
                      │         ▼ all waypoints visited
                      └──► CreditsCard → Contact / Resume / Land
```

- Mount a thin client shell near the page root (provider + portal).
- Load `three` / `@react-three/fiber` / `@react-three/drei` **only after** open.
- Lock body scroll while open; dispose WebGL and unlock on close (`Esc` / Land).
- Ignore the `fly` chord when focus is inside `input`, `textarea`, `select`, or `contenteditable`.

## Waypoints

Source of truth: `experience` from `content/site.ts`, ordered **oldest → newest** (same as Experience roadmap: `[...experience].reverse()`).

Each waypoint exposes: `id`, `company`, `role`, `dates`, short company label, accent color (reuse Experience pin accent cycle).

World positions: place the 7 stops along a gentle 3D spline (not a literal copy of the SVG path). Order is chronological; visual layout should read left-to-right / forward along the route.

## Flight model

- Procedural low-poly plane mesh (no GLTF required for v1).
- Keyboard: pitch `W/S` or arrows, yaw `A/D` or arrows, throttle `Shift`/`Ctrl`, close `Esc`.
- Soft magnet: when roughly facing the next unvisited waypoint and within a capture radius corridor, gently steer toward it.
- Capture: entering a waypoint radius marks it visited, pulses the beacon, updates HUD.
- Soft ground clamp: keep altitude in a playable band (no full aerodynamics).

## HUD & visuals

- React HUD over the canvas: title, Land, next/current stop card (company, role, dates, `visited/7`), fading control hints.
- Brand palette: `--brand`, `--brand-secondary`, Experience pin accents.
- Sky + fog + simple terrain; glowing spline; filled beacons for visited, pulse for next.
- `dpr` capped at `1.5`; no shadows in v1; pause loop when `document.hidden`.

## Desktop gate

If `matchMedia('(pointer: coarse)')` or no hover capability when opening: show a short panel  
“This easter egg is built for keyboard — try it on desktop.” + Close. Do not start WebGL.

## Reduced motion

If `prefers-reduced-motion: reduce`: do not start the WebGL loop. Show a static career-route list (companies + roles) with Land / Contact / Resume instead.

## Credits card

Shown when all waypoints are visited:

- Title: “Career route complete”
- Compact list of companies visited
- CTAs: Contact (`#contact`), Resume (`/resume`), Land (close overlay)

## File layout

| Path | Responsibility |
| --- | --- |
| `content/flight.ts` | Copy strings (labels, mobile message, credits, controls) |
| `lib/flight/waypoints.ts` | Build ordered waypoints from `experience` |
| `lib/flight/controls.ts` | Keyboard state helpers |
| `lib/flight/path.ts` | Spline sample / magnet helpers |
| `components/flight/flight-provider.tsx` | Open/close context, chord listener |
| `components/flight/flight-shell.tsx` | Portal overlay, scroll lock, dynamic canvas |
| `components/flight/flight-canvas.tsx` | R3F Canvas + scene graph |
| `components/flight/flight-hud.tsx` | HUD + credits + desktop gate / reduced-motion fallback |
| `components/flight/footer-trigger.tsx` | Footer plane button (or wire into `footer.tsx`) |
| `app/page.tsx` | Wrap or mount `FlightProvider` |

## Out of scope (v1)

Mobile touch controls, audio, photo-real terrain, GLTF cockpit, multiplayer, leaderboards, localStorage progress, Career Quest / XP.

## Success criteria

1. Homepage critical path does not load Three.js until the easter egg opens.
2. `fly` and footer plane open the overlay on desktop.
3. Player can steer, visit all 7 stops with soft magnet help, and see the credits card.
4. Esc / Land restores normal browsing (no scroll lock or orphaned canvas).
5. Coarse-pointer and reduced-motion paths never trap the user in a broken WebGL state.
