# Agent log

Append-only journal. Newest entry at the top.

---

## 2026-09-11 — Phases 3–6 complete

Finished the canvas, shell, PWA and Playwright suite. `pnpm verify` green:
typecheck, lint, 52 unit tests, 46 E2E passed (4 keyboard skips on touch).

### Notable fixes during implementation

- **Alignment drift (~1px/column):** `useColumnWidth` must publish border-box
  width via `getBoundingClientRect()`, never ResizeObserver `contentRect`
  (excludes the mode column's 1px border).
- **Tap-to-tonic broken:** `setPointerCapture` retargets `pointerup` to the
  strip window; hit-test with `document.elementFromPoint` instead.
- **Tablet project:** `devices['iPad Pro 11']` pulls WebKit (not installed);
  use Desktop Chrome + iPad viewport instead.
- **Share button off-canvas:** toolbar uses `share-button-toolbar`; menu uses
  `share-button-menu`.

---

## 2026-09-11 — Phases 1 and 2, plus the phase 3 engine

Scaffold, music domain, i18n EN+ES, settings context. 52 unit tests.
Gesture engine + cardboard.css written but not yet consumed. See git history
and `AGENTS.md` for gotchas (TS 6.0.3 pin, eslint-plugin-react-hooks 7,
rewritten `use-mobile.ts`).
