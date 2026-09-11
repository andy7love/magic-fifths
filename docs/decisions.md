# Decisions (ADRs)

## ADR-001 — Pin TypeScript to 6.0.3

`typescript-eslint@8.70` declares `typescript: ">=4.8.4 <6.1.0"`. TS 7 installs
fine and then breaks `pnpm lint`. Revisit when typescript-eslint v9 ships.

## ADR-002 — Custom Pointer Events engine

CSS scroll-snap and Embla both fight the "align to a grid in a different
element" requirement. A custom engine keeps `index = round(-x / colW)` exact
and behaves identically for mouse, touch, pen, wheel and keyboard.

## ADR-003 — `resources-to-backend` for offline locales

Dynamic `import()` of locale JSON becomes hashed chunks that Workbox
precaches. Every language works offline with no HTTP backend.

## ADR-004 — `generateSW` + `registerType: 'prompt'`

Prompt avoids mid-gesture reloads. First-load SW takes control on the next
navigation (no `skipWaiting`/`clientsClaim`), which the PWA E2E accounts for.

## ADR-005 — Sidebar breakpoint includes height

`(min-width: 1024px) and (min-height: 600px)`. A phone in landscape clears any
width-only threshold while being too short for a rail.

## ADR-006 — Plain React Context, no state library

Three low-frequency settings plus one canvas-local snap index. The only
high-frequency state (drag offset) bypasses React entirely.

## ADR-007 — Share links address a musical key

`?key=Eb` rather than `?pos=17`. URL-safe `s`/`ss` for sharps. `replaceState`,
never `pushState`.
