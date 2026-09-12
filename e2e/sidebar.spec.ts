import { expect, test } from '@playwright/test'

import { waitSettled } from './helpers/strip'

test.describe('sidebar', () => {
  test('opens the drawer and reaches every menu item', async ({ page }) => {
    await page.goto('/?key=C')
    await waitSettled(page)

    await expect(page.getByTestId('toolbar')).toBeVisible()
    await page.getByTestId('sidebar-trigger').click()
    await expect(page.getByTestId('toolbar')).toHaveCount(0)
    await expect(page.getByTestId('scale-select')).toBeVisible()
    await expect(page.getByTestId('language-select')).toBeVisible()
    await expect(page.getByTestId('theme-toggle')).toBeVisible()

    await page.getByTestId('howto-open').scrollIntoViewIfNeeded()
    await page.getByTestId('howto-open').click()
    await expect(page.getByTestId('howto-dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByTestId('howto-dialog')).toHaveCount(0)

    // Re-open if the sheet closed with the dialog on mobile.
    const theory = page.getByTestId('theory-open')
    if (!(await theory.isVisible())) {
      await page.getByTestId('sidebar-trigger').click()
    }
    await theory.scrollIntoViewIfNeeded()
    await theory.click()
    await expect(page.getByTestId('theory-dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByTestId('theory-dialog')).toHaveCount(0)

    const close = page.getByTestId('sidebar-close')
    if (await close.isVisible()) {
      await close.click()
    }
    await expect(page.getByTestId('toolbar')).toBeVisible()
  })
})
