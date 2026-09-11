# AGENTS.md

Canonical entry point for any AI or human picking this project up.

Read this file first, then [docs/plans/2026-09-11-pwa-refactor.md](docs/plans/2026-09-11-pwa-refactor.md)
for the full design and ADRs.

---

## What this is

An offline-capable, UI-only PWA that reproduces a physical cardboard music tool.

A static brown **board** ("the canvas") holds a table of the seven Greek modes and the
triad / tetrad quality of each. A white paper **strip** slides horizontally through a
channel in the board. The strip is one continuous chain of perfect fifths; whichever seven
consecutive notes land in the channel are the seven modes of one major scale.

There is no backend, no API, and no runtime network request of any kind.

## Load-bearing invariants

Break any of these and the app is wrong, not just ugly.

1. **The chain is 35 notes and continuous.** Five blocks of `F C G D A E B` at double-flat,
   flat, natural, sharp, double-sharp. Every adjacent pair is a perfect fifth apart,
   *including across block seams* (`Bb -> F`, `B -> F#`). It is one strip, not five.
2. **`tonic = snapIndex + tonicColumn`**, where `tonicColumn` is the column of
   whichever mode is currently grade 1 (default: Ionian at column `1`). The note
   under grade **1** is the tonic — not necessarily Ionian. Tap a mode name to
   move grade 1. `snapIndex` is still the chain index of the note under the
   *first* column (Lydian).
3. **`snapIndex` ranges 0..28 inclusive** (`MAX_SNAP = 35 - 7`), so the window is always
   full. 29 positions. With Ionian as home there are 29 distinct tonics (`Cbb` through
   `C##`); other home modes shift which chain notes are reachable as tonic.
4. **`--col-w` is the only geometry source of truth.** Published in **px** onto `.mf-canvas`
   by `useColumnWidth`, consumed by the grid, the track and every cell.
5. **All derived state is computed in `onSettle`, never mid-drag.** During motion the engine
   writes `--strip-x` straight to the DOM node. React sees two renders per gesture.
6. **No hardcoded UI strings.** Everything goes through `t()`. The i18n E2E spec doubles as
   the guard.

## Stack, and why these versions

| Package | Version | Note |
|---|---|---|
| `vite` | 8.3.0 | Needs Node `^20.19 \|\| >=22.12`. |
| `@vitejs/plugin-react` | 6.1.1 | Its `oxc-transform-react` / `@rolldown/plugin-babel` peers are `optional: true`, so the install does not need them. |
| `react` / `react-dom` | 19.3.0 | |
| `typescript` | **6.0.3** | **Do not bump to 7.** See gotcha 1. |
| `tailwindcss` + `@tailwindcss/vite` | 4.3.3 | CSS-first. There is no `tailwind.config.js` and there should not be. |
| `shadcn` CLI | 4.21.0 | `components.json` has `tailwind.config: ""`, correct for v4. |
| `i18next` / `react-i18next` | 26.4.2 / 17.0.13 | |
| `eslint` / `typescript-eslint` | 10.10.0 / 8.70.0 | |
| `eslint-plugin-react-hooks` | 7.1.1 | Much stricter than v5. See gotcha 3. |
| `@playwright/test` | 1.63.0 | |
| `vitest` | 5.0.0 | |

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server, **pinned to `http://localhost:5173`** (`strictPort`). |
| `pnpm build` | `tsc -b && vite build` |
| `pnpm preview` | Serves the production build on `:4173`. Needed for service-worker testing. |
| `pnpm typecheck` | `tsc -b --noEmit` |
| `pnpm lint` | `eslint .` |
| `pnpm test` | `vitest run` - pure music / snap / share-token / locale-parity specs |
| `pnpm e2e` | `playwright test` |
| `pnpm e2e:report` | Opens the last HTML report |
| `pnpm verify` | typecheck + lint + test + e2e. **Run this before declaring anything done.** |

Setup from scratch: `pnpm install`, then
`pnpm dlx shadcn@latest add <components> --yes --overwrite`, then
`pnpm exec playwright install chromium` (deliberately without `--with-deps`, which needs
root; the system Chrome already provides the shared libraries).

## Layout

```
src/
├── lib/
│   ├── config.ts          # EVERY tunable: viewport gate, canvas cap, gesture feel
│   ├── storage.ts         # try/catch localStorage under "mf:v1:"
│   ├── share.ts           # ?key= token encode/parse/build  (pure, tested)
│   └── music/
│       ├── notes.ts       # the 35-note chain               (pure, tested)
│       ├── modes.ts       # 7 modes + triads + tetrads
│       ├── scales.ts      # scale registry, major only
│       └── snap.ts        # snap math, tonic bijection       (pure, tested)
├── i18n/
│   ├── index.ts           # init, language detection
│   ├── i18next.d.ts       # types t() off the English catalog
│   └── locales/{en,es}/{common,music,howto,theory}.json
├── context/
│   ├── settings.ts        # context + useSettings()  (no JSX, so fast refresh is safe)
│   └── SettingsProvider.tsx
├── hooks/
│   ├── use-media-query.ts     # useSyncExternalStore based
│   ├── use-mobile.ts          # OVERWRITTEN shadcn file, see gotcha 4
│   ├── use-persisted-state.ts
│   ├── use-column-width.ts    # ResizeObserver -> px column width
│   └── use-fifths-strip.ts    # THE gesture engine
├── styles/cardboard.css   # hand-rolled board / channel / paper
└── components/
    ├── ui/                # shadcn-generated, eslint-ignored, do not hand-edit
    └── canvas/            # the cardboard
```

## Geometry contract

This is the part most likely to be broken by a well-meaning refactor.

- `.mf-canvas` is a grid: `grid-template-columns: var(--label-w) repeat(7, 1fr)`. Using
  `1fr` means there is no percentage arithmetic to get wrong.
- `useColumnWidth` measures the real first mode column with a `ResizeObserver` and publishes
  the result as `--col-w` in **px**.
- `.mf-strip-window` is a grid item at `grid-column: 2 / span 7`, so **its left edge is the
  first mode column's left edge by construction**, not by offset math.
- The track is `calc(35 * var(--col-w))` wide and positioned with
  `translate3d(var(--strip-x), 0, 0)`, where at rest `--strip-x = -snapIndex * colW`.
- Therefore cell `snapIndex + n` lands exactly on mode column `n`. Alignment is structural;
  the E2E `alignment` spec asserts it to within 1.5 px anyway.

## Gesture engine rules

`use-fifths-strip.ts`, and the reason the app feels native rather than web:

- **Transform only.** No `left`, no `width`, no layout, no paint. Stays on the compositor.
- **Velocity is an exponentially weighted average** over the last ~80 ms
  (`VELOCITY_SAMPLE_MS`). Raw last-delta velocity is jittery enough that identical flicks
  land on different columns.
- **`MIN_FLICK_VELOCITY`** guarantees a deliberate flick advances at least one column even
  if the finger barely moved.
- **`overscroll-behavior-x: none` on `html, body`** (in `index.css`). Without it a left flick
  near the screen edge triggers Chrome Android / iOS Safari back-navigation and the user
  leaves the app. Do not remove it.
- Sign convention: dragging **right** increases the offset and moves **back** along the
  chain, so `snapIndex` decreases. The flick-direction code inverts accordingly.
- Tuning constants all live in `src/lib/config.ts`. Tune there, not in the engine.

## Gotchas (each of these cost real time)

1. **Do not upgrade TypeScript to 7.** `typescript-eslint@8.70` declares
   `typescript: ">=4.8.4 <6.1.0"`. TS 7 installs fine and then `pnpm lint` breaks. 6.0.3 is
   the newest supported version. Revisit when `typescript-eslint` v9 ships.
2. **TypeScript 6 deprecates `baseUrl`** (error TS5101). The tsconfigs use `paths` alone,
   which resolves relative to the file containing it. Do not re-add `baseUrl`.
3. **`eslint-plugin-react-hooks` 7 forbids two things that used to be idiomatic:**
   `setState` synchronously inside an effect body (`react-hooks/set-state-in-effect`) and
   writing to a ref during render (`react-hooks/refs`). This is why `use-media-query`
   uses `useSyncExternalStore`, why `use-column-width` measures in a **ref callback** with a
   React 19 cleanup return, and why `use-fifths-strip` syncs its refs inside effects.
4. **`src/hooks/use-mobile.ts` is a shadcn-generated file that has been rewritten.** It now
   delegates to `SIDEBAR_PERSISTENT_QUERY` instead of shadcn's width-only 768 px check,
   because a phone in landscape (844x390) clears any width threshold while being far too
   short for a sidebar rail. **Re-running `shadcn add sidebar` will clobber it.**
5. **Never express `--col-w` as a percentage.** A percentage inside the track resolves
   against the 35-column track width, not the 7-column window, and everything silently
   misaligns by a factor of 5.
6. **`shadcn add` rewrites `src/index.css`.** The cardboard palette tokens (`--board`,
   `--paper`, and friends) live there. After any `shadcn add`, check they survived.
7. The dev port is pinned with `strictPort: true` so agents and Playwright can hardcode
   `http://localhost:5173`. If it is taken, kill the old server rather than changing the port.

## How to verify without a human

Everything below runs unattended.

**Browser.** `pnpm dev`, then drive `http://localhost:5173` with the Cursor browser tools.
The DOM is instrumented for exactly this:

- `[data-testid="fifths-strip"]` carries `data-snap-index`, `data-tonic`,
  `data-tonic-mode`, `data-settled`. Wait on `data-settled="true"` rather than sleeping.
- `[data-testid="note-cell"]` carries `data-chain-index`, `data-note`, `data-in-window`, and
  `data-mode` when inside the channel.
- `[data-testid="mode-column"]` carries `data-mode`, `data-triad`, `data-tetrad`,
  `data-tonic-mode`.
- `[data-testid="grade-cell"]` carries `data-grade` and `data-tonic-grade`.
- `window.__mf__` (dev / `VITE_E2E` only) exposes `getSnapIndex`, `setSnapIndex`,
  `getTonicModeId`, `setTonicModeId`, `getGeometry`, `getAlignmentDeltas` - reachable via
  `browser_cdp` `Runtime.evaluate`.
- `?debug=1` renders an overlay with `snapIndex`, tonic, tonic mode, `colW`, the offset and
  the per-column alignment delta in px, so a single screenshot proves or disproves alignment.

**Playwright.** `pnpm e2e`. Configured with `reporter: [['list'], ['html', { open: 'never' }]]`,
`trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'`, so
failures leave readable artifacts. `--ui` and `--headed` are never required.

## Current status

| Phase | State |
|---|---|
| 1. Scaffold (Vite / React / TS / Tailwind / shadcn / ESLint) | **Done** |
| 2. Music domain, share tokens, i18n EN+ES, settings context, storage | **Done**, 52 unit tests |
| 3. Canvas + gesture engine | **Done**, alignment within ~0.1 px |
| 4. Shell: sidebar/drawer, toolbar, theme, dialogs, orientation gate, ShareButton + `?key=` deep links | **Done** |
| 5. PWA: plugin, manifest, icons, update prompt | **Done**, offline reload verified |
| 6. Playwright config + specs, docs, README | **Done**, 46 E2E passed (4 keyboard skips on touch projects) |

### Known follow-ups

- Restore a `LICENSE` file if desired (removed with the old Ionic app).
- Keyboard strip controls are covered on the `desktop` Playwright project only;
  touch projects skip them because focus is unreliable under `isMobile`.
- Re-running `shadcn add sidebar` will clobber `src/hooks/use-mobile.ts` (gotcha 4).

## Conventions

- Single quotes, no semicolons, 2-space indent, trailing commas. Match the surrounding file.
- `@/` maps to `src/`.
- Comments explain constraints the code cannot show. No narration of what the next line does.
- Prefer a pure function in `lib/` plus a Vitest spec over logic embedded in a component.
- `src/components/ui/**` is generated and eslint-ignored. Do not hand-edit it; if a change is
  unavoidable, note it here (see gotcha 4).
