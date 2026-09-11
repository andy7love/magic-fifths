import { defineConfig, devices } from '@playwright/test'

const DEV_URL = 'http://localhost:5173'
const PREVIEW_URL = 'http://localhost:4173'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 30_000,
  expect: { timeout: 8_000 },
  use: {
    baseURL: DEV_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      testIgnore: /pwa-offline\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'tablet-landscape',
      testIgnore: /pwa-offline\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1194, height: 834 },
        hasTouch: true,
      },
    },
    {
      name: 'phone-landscape',
      testIgnore: /pwa-offline\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 900, height: 414 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'phone-portrait',
      testMatch: /orientation\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 400, height: 700 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'pwa',
      testMatch: /pwa-offline\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: PREVIEW_URL,
        serviceWorkers: 'allow',
      },
    },
  ],
  webServer: [
    {
      command: 'pnpm dev',
      url: DEV_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'pnpm build && pnpm preview',
      url: PREVIEW_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
  ],
})
