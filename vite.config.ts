import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// The dev port is pinned (and strict) so that automated agents and the Playwright
// config can always rely on http://localhost:5173 without discovery.
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      strategies: 'generateSW',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      workbox: {
        // Locale JSON chunks are emitted as hashed JS modules by Vite, so the
        // default glob already precaches every language for offline use.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,json,ico,webp}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'Magic Fifths',
        short_name: 'Fifths',
        description:
          'A circle-of-fifths tool for exploring the seven modes of the major scale.',
        theme_color: '#8b5e34',
        background_color: '#f5efe3',
        display: 'standalone',
        orientation: 'any',
        // Stable identity for getInstalledRelatedApps / future start_url changes.
        id: '/',
        start_url: '/',
        scope: '/',
        categories: ['music', 'education'],
        // Self-reference so navigator.getInstalledRelatedApps() can detect this PWA.
        // prefer_related_applications must stay false or Chrome skips the web install.
        prefer_related_applications: false,
        related_applications: [
          {
            platform: 'webapp',
            url: '/manifest.webmanifest',
          },
        ],
        launch_handler: {
          client_mode: ['focus-existing', 'auto'],
        },
        icons: [
          {
            src: 'icons/pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
})
