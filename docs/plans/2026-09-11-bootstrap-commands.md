# Bootstrap: the front-loaded approval batch

Companion to [2026-09-11-pwa-refactor.md](2026-09-11-pwa-refactor.md).

Everything that needs a human approval is collected here, in order, so it can be approved in
one sitting. After command 5 succeeds, implementation and testing run without further
intervention.

## Approach

No `pnpm create vite` scaffold. The working tree already holds `.git/`, `docs/` and
`original-prompt-bk.md`, and `create-vite` goes interactive in a non-empty directory. Instead
the config files are written directly (file writes, not terminal commands), then a single
install resolves everything at once. Same for shadcn: `components.json` is written by hand so
`shadcn init` never prompts, and every component is added in one non-interactive call.

## The batch

### 1. `pnpm install`

Run once, after `package.json`, `tsconfig*.json`, `vite.config.ts`, `index.html` and the
`src/` tree are written. Resolves the whole dependency graph in a single pass.

Runtime dependencies:

```
react@19.3.0  react-dom@19.3.0
i18next@26.4.2  react-i18next@17.0.13  i18next-resources-to-backend@1.2.3
lucide-react@1.45.0  sonner@2.0.8
class-variance-authority@0.7.1  clsx@2.1.1  tailwind-merge@3.6.0
@fontsource-variable/caveat@5.3.0  @fontsource-variable/inter
```

Dev dependencies:

```
vite@8.3.0  @vitejs/plugin-react@6.1.1  typescript@6.0.3
tailwindcss@4.3.3  @tailwindcss/vite@4.3.3  tw-animate-css@1.4.0
vite-plugin-pwa@1.3.0  workbox-window@7.4.1  workbox-build@7.4.1
@playwright/test@1.63.0  vitest@5.0.0
eslint@10.10.0  typescript-eslint@8.70.0  @eslint/js
eslint-plugin-react-hooks  eslint-plugin-react-refresh  globals
@types/react  @types/react-dom  @types/node
```

Notes:

- `typescript` is pinned to **6.0.3**, not 7.0.2 - `typescript-eslint@8.70` declares
  `typescript: ">=4.8.4 <6.1.0"` (ADR-001).
- The Vite 8 risk flagged in the plan is now resolved: `@vitejs/plugin-react@6.1.1` lists
  `oxc-transform-react`, `@rolldown/plugin-babel` and `babel-plugin-react-compiler` as peers,
  but all three are `peerDependenciesMeta.optional: true`, so the install will not fail on
  them and no fallback to Vite 7 is expected.
- Radix packages are deliberately absent; `shadcn add` pulls in exactly the ones each
  component needs in step 2.
- Fonts are self-hosted via `@fontsource-variable`, so the app makes zero external requests
  and precache alone gives full offline capability.

### 2. `pnpm dlx shadcn@latest add sidebar dialog select switch scroll-area sonner label toggle-group --yes --overwrite`

Needs network. Non-interactive because `components.json` is written beforehand with
`tailwind.config: ""` (correct for Tailwind v4) and `tailwind.css: "src/index.css"`.

`sidebar` transitively brings `button`, `separator`, `sheet`, `tooltip`, `input` and
`skeleton`, which is why they are not listed explicitly.

### 3. `pnpm exec playwright install chromium`

Downloads the Playwright-managed Chromium build. Deliberately **without** `--with-deps`,
since that shells out to `apt-get` and would need root. The system already has
`/usr/bin/google-chrome`, so the shared libraries Chromium needs are present. If a missing
`.so` does turn up, the fallback is `channel: 'chrome'` in `playwright.config.ts`, which uses
the existing Chrome and needs no download at all.

### 4. `pnpm dev` (long-running, backgrounded)

Serves on a fixed `http://localhost:5173` (`strictPort: true`, `host: true`). Stays up for the
rest of the session so I can drive it with the Cursor browser: navigate, snapshot, drag the
strip, screenshot `?debug=1`, and read alignment deltas without asking you anything.

### 5. `pnpm verify` (= `typecheck && lint && test && e2e`)

The unattended feedback loop. Playwright is configured with
`reporter: [['list'], ['html', { open: 'never' }]]`, `trace: 'on-first-retry'`,
`screenshot: 'only-on-failure'` and `video: 'retain-on-failure'`, so every failure leaves a
machine-readable artifact I can read and act on directly. `--ui` and `--headed` are never
needed.

Its `webServer` array starts both `:5173` (dev) and `:4173` (`build && preview`, for the real
service-worker offline spec), with `reuseExistingServer: !process.env.CI` so it reuses the
dev server from step 4 instead of racing it.

## Why the order matters

Steps 1-3 are the only ones that install anything or touch the network. Once they are done,
steps 4 and 5 are repeatable and idempotent, and the phase 2-6 work is file writes plus reruns
of commands already approved.

## Script table (written into `package.json` in step 1)

- `dev` - Vite dev server on :5173
- `build` - `tsc -b && vite build`
- `preview` - serve the production build on :4173
- `typecheck` - `tsc -b --noEmit`
- `lint` - `eslint .`
- `test` - `vitest run` (pure music / snap / share-token math)
- `e2e` - `playwright test`
- `e2e:report` - `playwright show-report`
- `verify` - `typecheck && lint && test && e2e`
