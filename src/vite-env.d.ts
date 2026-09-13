/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />
/// <reference types="vite-plugin-pwa/client" />

/** Injected from package.json by vite.config.ts. */
declare const __APP_VERSION__: string

interface ImportMetaEnv {
  readonly VITE_MIN_LANDSCAPE_WIDTH?: string
  readonly VITE_E2E?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
