import { expect, test } from '@playwright/test'

import { waitSettled } from './helpers/strip'

test.describe('advanced chords', () => {
  test('toggles full chord spellings and hides the tetrad label', async ({ page }) => {
    await page.goto('/?key=C')
    await waitSettled(page)

    const cells = page.getByTestId('tetrad-cell')
    await expect(cells).toHaveCount(7)
    await expect(page.locator('[data-row="tetrads"]').first()).toContainText('Tetrads')
    await expect(cells.nth(1)).toHaveText('Maj7')
    await expect(cells.nth(1)).not.toContainText('4')

    await page.getByTestId('advanced-toggle').click()
    await expect(page.getByTestId('canvas')).toHaveAttribute('data-advanced', 'true')
    await expect(page.getByTestId('advanced-toggle')).toHaveAttribute('aria-pressed', 'true')

    await expect(cells.nth(1)).toContainText('Maj7')
    await expect(cells.nth(1)).toContainText('(4♮)')
    await expect(cells.nth(5)).toContainText('(sus b9)')
    await expect(cells.nth(2)).toHaveText('7')
    await expect(cells.nth(6)).toHaveText('m7(b5)')
    await expect(page.locator('[data-row="tetrads"]').first()).not.toContainText('Tetrads')

    await page.reload()
    await waitSettled(page)
    await expect(page.getByTestId('canvas')).toHaveAttribute('data-advanced', 'true')
    await expect(page.getByTestId('tetrad-cell').nth(0)).toContainText('(11#)')
  })
})
