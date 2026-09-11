import { expect, test } from '@playwright/test'

test.describe('pwa-offline', () => {
  test('service worker activates and the app survives offline reload', async ({
    page,
    context,
  }) => {
    await page.goto('/')
    await expect(page.getByTestId('app-root')).toBeVisible({ timeout: 15_000 })
    await expect(page.locator('link[rel="manifest"]')).toHaveCount(1)

    await expect
      .poll(async () => {
        return page.evaluate(async () => {
          if (!('serviceWorker' in navigator)) return 'unsupported'
          const reg = await navigator.serviceWorker.getRegistration()
          return reg?.active?.state ?? reg?.installing?.state ?? 'none'
        })
      }, { timeout: 45_000 })
      .toBe('activated')

    // A second load is what lets the activated worker take control under
    // registerType: 'prompt' (no skipWaiting / clientsClaim).
    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect
      .poll(async () => {
        return page.evaluate(() => (navigator.serviceWorker.controller ? 'controlling' : 'none'))
      }, { timeout: 15_000 })
      .toBe('controlling')

    await context.setOffline(true)
    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(page.getByTestId('app-root')).toBeVisible({ timeout: 15_000 })
    await expect(page.getByTestId('fifths-strip')).toBeVisible()
  })
})
