# Experience Roadmap Redesign

**Date:** 2026-07-18  
**Site:** pushkarkathuria.com  
**Status:** Approved for planning

## Goal

Replace the current Experience section with a horizontal, interactive winding-road roadmap inspired by journey/infographic maps — more beautiful and interactive than a vertical timeline, while remaining recruiter-readable and responsive.

## Decisions locked in

| Topic | Choice |
| --- | --- |
| Navigation | Scroll-linked progress **and** click-to-travel on pins |
| Visual language | Dark on-brand scene; numbered pins cycle a short accent set (coral → cyan → amber → soft green…) |
| Detail placement | Synced detail panel **under** the path (path stays hero) |
| Approach | Scroll-theater path (Approach 1) |

## Layout

### Desktop (`lg+`)

1. Existing section heading and intro copy remain.
2. Full-width **roadmap stage** (~55–65vh) containing:
   - Dark asphalt S-curve SVG path with dashed center line and soft edge glow
   - Seven numbered map pins along the path (newest → oldest, progressing along the snake)
   - Glowing **traveler** node on the active stop
3. **Detail panel** below the stage showing the active role:
   - Role, company, dates, location, context
   - Expand/collapse highlights (featured roles open by default)
   - Prev / Next controls and optional pin index for quick jumps

### Mobile / tablet (`< lg`)

- Same data and interaction model
- Compressed **vertical** S-path (left rail) — no horizontal drag/pan
- Detail panel stacks below (or sticky under the path)
- Scroll still drives active stop; taps jump to a stop

## Interaction

- Section has a tall scroll range; progress `0 → 1` maps traveler position and path highlight across seven stops.
- Active stop = nearest progress threshold; detail panel syncs immediately.
- Clicking a pin (or Prev/Next) smooth-scrolls to that stop’s progress and focuses the panel.
- Panel announces updates with `aria-live="polite"`.
- Keyboard: when stage/panel is focused, arrow keys cycle stops; Enter toggles highlights.
- `prefers-reduced-motion`: no path draw / traveler tween; focus jumps instantly.

## Content & data

- Source of truth remains `experience` in `content/site.ts`.
- No content model changes required.
- Pin labels use `01`–`07` (or index) plus start year where space allows.
- Order: existing array order (newest first).

## Implementation plan (high level)

1. Replace `components/sections/experience.tsx` with the roadmap UI (may split small helpers in the same folder if the file grows).
2. SVG path + pins (no canvas, no new dependencies).
3. Framer Motion for traveler motion and reduced-motion checks; scroll progress via `useScroll` / `useTransform` on a section ref (or a thin local hook).
4. Shared `activeIndex` state drives pins, traveler, and detail panel.
5. Two layout branches in one component: horizontal stage (desktop) / vertical rail (mobile).
6. Preserve expand/collapse highlights behavior from the current section.
7. Keep responsive hardening already in place (`min-w-0`, overflow guards, padding scale).

## Out of scope

- City/map background illustration art
- Drag-to-pan or sideways-only scroll map
- New npm dependencies
- Content rewrites of roles/highlights
- Changing other page sections

## Accessibility & performance

- Pins and Prev/Next are real buttons with accessible names (`{role} at {company}, {dates}`).
- Path decoration is `aria-hidden`; screen readers use the detail panel as the primary content.
- Avoid layout thrash: transform/opacity for traveler; path stroke dashoffset for highlight.
- Respect `prefers-reduced-motion`.

## Success criteria

- Desktop feels like a winding horizontal journey with clear numbered stops.
- Scroll and click both reliably select the same stop and update the panel.
- Mobile remains usable without horizontal overflow or hidden content.
- Reduced-motion users can still browse all seven roles.
- No regression to SEO/section id `#experience` or nav anchor.
