import path from 'node:path'
import { defineConfig } from 'vitest/config'

// The unit suite only covers pure functions (music chain, snap math, share tokens),
// so it needs no DOM environment and no React/Tailwind plugins.
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
