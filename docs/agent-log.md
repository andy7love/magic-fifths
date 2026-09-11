# Agent log

Append-only journal. Newest entry at the top. Record what changed, what was actually
verified, and what is still open, so the next session does not have to re-derive it.

---

## 2026-09-11 - Phases 1 and 2, plus the phase 3 engine

**Model:** Claude Opus 5. Handing off mid-phase-3 due to a model change.

### Done

- **Phase 1 - scaffold.** Vite 8.3.0, React 19.3.0, TypeScript 6.0.3, Tailwind 4.3.3,
  shadcn (11 components), ESLint 10 + typescript-eslint 8.70. Dev server pinned to
  `:5173`. Verified in the browser: Tailwind, the `@/` alias and the self-hosted Caveat
  font all render.
- **Phase 2 - domain and i18n.** The 35-note fifths chain, mode table, scale registry, snap
  math, `?key=` share tokens, `mf:v1:` storage, `usePersistedState`, i18next with EN+ES
  catalogs across 4 namespaces, and `SettingsContext`. 52 unit tests green. Verified in the
  browser that switching to Spanish yields `Modos / Lidio / Jónico / Mixolidio / Dórico /
  Eólico / Frigio / Locrio`, matching the reference photo.
- **Phase 3 - partial.** `use-column-width.ts`, `use-fifths-strip.ts` and
  `styles/cardboard.css` are written, typechecked and linted. **No component consumes them
  yet**, which is why the repo is still green; `src/App.tsx` is still the phase-2 harness.

### Decisions taken during implementation

- **Dropped zustand** in favour of a plain React context, at the user's prompting. The
  decisive argument: the only high-frequency state is the drag offset, which must bypass
  React regardless, so a store's selector machinery would never touch the hot path. Full
  reasoning in ADR-006 of the plan document.
- **Share links address a position by musical key** (`?key=Eb`) rather than raw index, with
  URL-safe `s`/`ss` for sharps so the link survives copy/paste. `replaceState`, never
  `pushState`. ADR-007.
- **TypeScript pinned to 6.0.3, not 7.0.2.** `typescript-eslint@8.70` caps at `<6.1.0`.
- **Rewrote shadcn's generated `use-mobile.ts`** to use a height-aware media query rather
  than a width-only 768 px check. See gotcha 4 in `AGENTS.md`.

### Risks closed

- The Vite 8 peer-dependency risk flagged in the plan is **resolved**:
  `@vitejs/plugin-react@6.1.1` marks all three of its exotic peers
  (`oxc-transform-react`, `@rolldown/plugin-babel`, `babel-plugin-react-compiler`) as
  `optional: true`. No fallback to Vite 7 was needed.
- Playwright Chromium installed without `--with-deps`, so no root access was required.

### Surprises worth remembering

- `eslint-plugin-react-hooks` 7 is far stricter than v5. It rejects `setState` in an effect
  body and ref writes during render, which forced three hooks into better shapes
  (`useSyncExternalStore`, ref-callback measurement, effect-synced refs). All four gotchas
  are written up in `AGENTS.md`.
- `shadcn add` rewrites `src/index.css`. The cardboard palette tokens survived, but this
  needs re-checking after any future `add`.

### Open

Phase 3 components, then phases 4-6. The concrete next-step list, including the exact CSS
class names the components must consume, is at the end of `AGENTS.md`.

Nothing is half-broken: `pnpm typecheck`, `pnpm lint` and `pnpm test` are all green at this
commit. `pnpm e2e` does not exist yet (phase 6).
