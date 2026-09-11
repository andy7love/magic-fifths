import { expect, test } from '@playwright/test'

import { waitSettled } from './helpers/strip'

test.describe('theme', () => {
  test('dark toggle adds .dark and persists', async ({ page }) => {
    await page.goto('/?key=C')
    await waitSettled(page)

    await page.getByTestId('sidebar-trigger').click()
    const toggle = page.getByTestId('theme-toggle')

    // Force light first so the assertion is deterministic regardless of OS preference.
    if (await toggle.isChecked()) {
      await toggle.click()
    }
    await expect(page.locator('html')).not.toHaveClass(/dark/)

    await toggle.click()
    await expect(page.locator('html')).toHaveClass(/dark/)

    await page.reload()
    await waitSettled(page)
    await expect(page.locator('html')).toHaveClass(/dark/)
  })
})
