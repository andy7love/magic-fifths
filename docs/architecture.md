# Architecture

## Data flow

```
URL ?key=&mode= ──┐
localStorage ─────┼─► resolveInitialSnap() + resolveInitialTonicMode()
                  │         │
                  │         ├─ useFifthsStrip(initialIndex, tonicColumn)
                  │         │     ├─ drag/spring ─► --strip-x (DOM only)
                  │         │     └─ onSettle(index)
                  │         │           ├─ setSnapIndex (React)
                  │         │           ├─ localStorage
                  │         │           └─ history.replaceState(?key=&mode=)
                  │         └─ tonicModeId (grade 1 column; tap a mode name)
SettingsContext ── theme / language / scaleId
i18next ────────── catalogs as dynamic import() chunks (precached offline)
```

## Geometry

`.mf-canvas` is a CSS grid: `var(--label-w) + repeat(7, 1fr)`.
`useColumnWidth` measures the first mode column (border-box) and publishes
`--col-w` in **px**. The strip window sits at `grid-column: 2 / span 7`, so its
left edge *is* Lydian's left edge. At rest `--strip-x = -snapIndex * colW`, so
cell `snapIndex + n` lands on mode column `n`.

Never express `--col-w` as a percentage — inside the 35-column track that would
resolve against the track width and misalign everything by a factor of five.

## Gesture state machine

`idle → dragging → animating → settled`

- During `dragging` and `animating`, the engine writes `--strip-x` on the track
  node inside one `requestAnimationFrame` loop. React is not involved.
- `onSettle` is the single place derived state is computed.
- Tap detection hit-tests with `elementFromPoint` because `setPointerCapture`
  retargets `pointerup` to the strip window.

## i18n × PWA

`i18next-resources-to-backend` loads `./locales/${lng}/${ns}.json` via dynamic
`import()`. Vite emits each catalog as its own chunk; Workbox precaches all
chunks, so every language works offline with no extra runtimeCaching rules.
