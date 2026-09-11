# Magic Fifths

An offline-capable PWA that reproduces a physical cardboard music tool.

A brown **board** holds the seven Greek modes and their triad / tetrad qualities.
A white paper **strip** slides through a channel in the board — one continuous chain
of perfect fifths. Whichever seven consecutive notes land in the channel are the
seven modes of one major scale. The note under **Ionian** is the tonic.

There is no backend and no runtime network request of any kind.

## Prerequisites

- Node.js `^20.19` or `>=22.12`
- [pnpm](https://pnpm.io/) 10+
- Chromium for Playwright (installed below)

## Setup

```bash
pnpm install
pnpm dlx shadcn@latest add sidebar dialog select switch scroll-area sonner label toggle-group --yes --overwrite
pnpm exec playwright install chromium
```

The second command is only needed if the shadcn UI components are missing.
`playwright install chromium` deliberately skips `--with-deps` (needs root); system
Chrome already provides the shared libraries on this machine.

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server at **http://localhost:5173** (`strictPort`) |
| `pnpm build` | Typecheck + production build |
| `pnpm preview` | Serve the production build on `:4173` (needed for SW testing) |
| `pnpm typecheck` | `tsc -b --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest unit suite (music / snap / share / locales) |
| `pnpm e2e` | Playwright E2E |
| `pnpm e2e:report` | Open the last HTML report |
| `pnpm verify` | typecheck + lint + test + e2e |

## Share links

Positions are addressable by musical key, not by raw index:

| URL | Meaning |
|---|---|
| `/?key=C` | C major (default rest position) |
| `/?key=Eb` | E♭ major |
| `/?key=Fs` | F♯ major (`s` = sharp, URL-safe) |
| `/?key=Css` | C𝄪 major |

Sharps are spelled `s` / `ss` so the link survives chat apps and QR codes. The
parser also accepts `#` and `x`. The URL is updated with `history.replaceState`
on every settle, so the back button stays usable.

## Orientation gate

If the viewport is narrower than **468px** (override with
`VITE_MIN_LANDSCAPE_WIDTH`), a full-screen overlay asks the user to rotate to
landscape.

## Tuning the gesture

All feel constants live in [`src/lib/config.ts`](src/lib/config.ts):

- `RELEASE_PROJECTION_MS`
- `MIN_FLICK_VELOCITY`
- `RUBBER_BAND_FACTOR`
- `SNAP_DURATION_MS`
- `VELOCITY_SAMPLE_MS`

## Adding a language

1. Copy `src/i18n/locales/en/` to `src/i18n/locales/<code>/`.
2. Translate the JSON files (keep the same keys and `{{placeholders}}`).
3. Add the code to `SUPPORTED_LANGUAGES` in `src/i18n/index.ts`.
4. Run `pnpm test` — the locale parity suite fails if keys diverge.

## Installing as a PWA

1. `pnpm build && pnpm preview`
2. Open http://localhost:4173 in Chrome / Edge / Safari
3. Use the browser's "Install" affordance
4. Toggle DevTools → Network → Offline and reload — the app should still work

## Project layout

```
src/
  lib/music/     # 35-note chain, modes, snap math (pure, tested)
  lib/share.ts   # ?key= encode/parse
  hooks/         # gesture engine, column width, PWA, share
  components/
    canvas/      # the cardboard
    layout/      # sidebar shell + toolbar
    ui/          # shadcn-generated (do not hand-edit)
  i18n/locales/  # en + es
  styles/cardboard.css
e2e/             # Playwright specs
docs/plans/      # design + ADRs
AGENTS.md        # canonical entry point for AI agents
```

## For AI agents

Start at [`AGENTS.md`](AGENTS.md). It documents the load-bearing invariants, the
geometry contract, the gotchas that cost real time to rediscover, and how to
verify the app unattended (Cursor browser + Playwright).
