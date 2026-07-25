# Career Flight Arcade — Design Spec

**Date:** 2026-07-26  
**Site:** pushkarkathuria.com  
**Status:** Approved  

## Goal

Upgrade Career Flight from a short waypoint tour into a desktop arcade flyer: hangar customization (sky + craft), ring pickups and obstacles between company beacons, score/combo, Hero + Experience CTAs, with career-clear credits and optional endless loop.

## Decisions locked in

| Topic | Choice |
| --- | --- |
| Core loop | Arcade flyer |
| Entry | Hero CTA + Experience CTA (primary); footer plane optional; `fly` chord optional hidden |
| Pre-flight | Quick hangar: sky (4) + craft (3) → Launch |
| Win | Career clear: all 7 company beacons |
| Hits | Score penalty + brief stun; no lives |
| Endless | After clear, loop with denser obstacles; Cancel anytime |
| Persistence | Session only |

## Hangar

- Skies: Midnight, Neon dusk, Aurora, Ember (palette: sky, fog, ground, accent lights)
- Crafts: Dart (plane), Rocket, Scout (distinct meshes + trail tint)
- Live preview; Launch / Cancel

## Arcade

- Rings along corridor between beacons → points + combo
- Asteroid debris → hit = penalty + short stun
- Soft magnet toward next company (weaker than v1)
- Company capture → big score burst + HUD flash
- HUD: score, combo, next stop, `n/7`, Endless, Cancel

## CTAs

- Hero: “Take Career Flight”
- Experience: “Fly this route”
- Opens hangar (not immediate launch)

## Out of scope

Sound, leaderboards, mobile touch, multiplayer, photo-real assets.
