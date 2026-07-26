# Career Flight District — Design Spec

**Date:** 2026-07-26  
**Site:** pushkarkathuria.com  
**Status:** Approved (pending user review of written spec)  
**Supersedes (for flight loop):** guided path + arcade corridor win loop in `2026-07-26-career-flight-arcade-design.md`  
**Keeps:** hangar loadout, overlay shell, Hero/Experience entry (desktop)

## Goal

Turn Career Flight into a Bruno Simon–inspired **free-roam rocket district**: no guided path, hybrid soft collisions, portfolio landmarks plus atmospheric props and light collectibles. The marketing homepage stays primary; the district is a full-screen overlay (hybrid C = explore overlay + content map).

## Locked decisions

| Topic | Choice |
| --- | --- |
| Product shape | Overlay on existing site (not homepage replace) |
| Core loop | Free explore + light collectibles; no forced win / score chase |
| World density | Companies + projects + contact/resume + props, rings/coins, secrets |
| Motion | Hybrid: kinematic flight + lightweight collide/bounce/floors (no Rapier) |
| Approach | Rebuild overlay world; reuse provider/shell/hangar/canvas |
| Mobile CTAs | Hide “Take Career Flight” / “Fly this route” (and footer plane) on mobile / coarse pointer |

## Entry & gates

- **Desktop entry:** Hero CTA, Experience CTA, optional footer plane, optional `fly` chord → hangar → Launch.
- **Mobile:** CTAs and footer trigger are not shown unless the viewport is `md+` **and** the pointer is fine (match existing coarse-pointer gate). Coarse-pointer / reduced-motion fallbacks remain if the overlay is opened somehow.
- **Hangar:** Existing sky + craft pick → Launch into open district (not a corridor).
- **Exit:** Cancel / Esc; body scroll unlock unchanged. Contact/Resume landmarks close overlay then navigate (same pattern as today’s credits CTAs).

## World layout

Open career district — **no Catmull path line, no magnet “next stop”, no arcade corridor.**

| Zone | Content |
| --- | --- |
| Company cluster | 7 job beacons from `experience` — near → role/dates card |
| Projects plaza | Pads for projects with `featured: true` — card + optional external link |
| Contact pad | Close overlay → `#contact` |
| Resume hangar | Close overlay → `/resume` |
| Atmosphere | Low platforms, billboards, deco rocks, soft rings/coins |
| Secrets | 2–3 playful props (e.g. `fly` nod, Bonafide Losers wink) |
| Bounds | Soft invisible walls + gentle floor; **Respawn** resets pose |

**Removed from play loop:** path spline, company-clear credits as win, Endless-as-goal, score/combo HUD. Staying in the world is enough to “roam forever.”

## Flight, collision & interaction

- **Controls:** WASD / arrows yaw + climb/descend; Shift boost; Esc Cancel; **R** + HUD **Respawn**. Chase camera kept.
- **Motion:** Kinematic rocket; hangar craft meshes kept.
- **Collision:** Sphere / AABB vs solid props and platforms → slide or soft bounce; floors support landing. Collectibles and landmark zones are triggers (no bounce).
- **Discover:** Enter landmark zone → mark discovered + show card. Re-enter refreshes card. No score pressure.
- **Collectibles:** Session tally only; secrets can toast or badge in HUD; not required for completion.

## HUD

- Title, discovered landmarks count, optional collectible tally, Respawn, Cancel.
- Near-landmark card panel (company / project / secret copy).
- Drop: score, combo, endless toggle, “n/7 clear” win chrome.

## Architecture

Keep `FlightProvider`, `FlightShell`, hangar, canvas. Refocus internals:

| Piece | Role |
| --- | --- |
| `lib/flight/world.ts` | Landmark + prop + collectible placements |
| `lib/flight/collision.ts` | Soft bounds, bounce/slide, floor, triggers (pure, unit-tested) |
| `scene/district.tsx` | Platforms, props, billboards (replaces path-line + arcade-field) |
| `scene/landmarks.tsx` | Company / project / contact / resume meshes + discovery |
| `scene/plane.tsx` | Drop magnet/path capture; collide + trigger hooks |
| `flight-hud.tsx` | Discover / collectible / Respawn; landmark card |
| `flight-cta.tsx` | Hide on mobile / coarse pointer |
| Gut / remove from loop | `arcade.ts` corridor as primary gameplay; path magnet; endless win |

**State (session only):** `Set` of discovered landmark ids; collectible count. No persistence.

## Out of scope

Rapier / full rigid-body physics, audio, multiplayer, mobile flight controls, photo-real assets, replacing the homepage with the 3D world, leaderboards.

## Success criteria

1. Desktop user opens from CTA → hangar → free flight with no visible guided path.
2. Can discover companies and at least one non-company landmark; collectibles optional.
3. Soft collision with platforms/props; Respawn works; Cancel returns to page.
4. Mobile does not show Career Flight CTAs.
5. Reduced-motion / coarse-pointer gates still avoid a broken 3D experience.
