import { expect, test } from '@playwright/test'

import { expectAligned, waitSettled } from './helpers/strip'

test.describe('share', () => {
  test('deep link opens the matching position', async ({ page }) => {
    await page.goto('/?key=Eb')
    await waitSettled(page)
    await expect(page.getByTestId('fifths-strip')).toHaveAttribute('data-tonic', 'Eb')
    await expectAligned(page)
  })

  test('share copies a URL with the current key', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'share', { value: undefined, configurable: true })
    })
    await page.goto('/?key=Fs')
    await waitSettled(page)

    await page.getByTestId('share-button-toolbar').click()
    const text = await page.evaluate(() => navigator.clipboard.readText())
    expect(text).toContain('key=Fs')
  })

  test('native share receives the payload when available', async ({ page }) => {
    await page.addInitScript(() => {
      ;(window as unknown as { __shareCalls: unknown[] }).__shareCalls = []
      Object.defineProperty(navigator, 'share', {
        configurable: true,
        value: async (data: unknown) => {
          ;(window as unknown as { __shareCalls: unknown[] }).__shareCalls.push(data)
        },
      })
    })

    await page.goto('/?key=Bb')
    await waitSettled(page)
    await page.getByTestId('share-button-toolbar').click()

    const calls = await page.evaluate(
      () => (window as unknown as { __shareCalls: Array<{ url?: string }> }).__shareCalls,
    )
    expect(calls.length).toBeGreaterThan(0)
    expect(calls[0]?.url).toContain('key=Bb')
  })

  test('snaps use replaceState, not pushState', async ({ page }) => {
    await page.goto('/?key=C')
    await waitSettled(page)

    const delta = await page.evaluate(() => {
      const start = history.length
      window.__mf__!.setSnapIndex(10)
      window.__mf__!.setSnapIndex(11)
      window.__mf__!.setSnapIndex(12)
      return history.length - start
    })
    expect(delta).toBe(0)
  })
})
