import { expect, test } from '@playwright/test'

import { setSnap, waitSettled } from './helpers/strip'

test.describe('display toggles', () => {
  test('hides and restores triads, tetrads, and degrees', async ({ page }) => {
    await page.goto('/?key=C')
    await waitSettled(page)

    await expect(page.locator('[data-row="triads"]').first()).toBeVisible()
    await expect(page.getByTestId('tetrad-cell')).toHaveCount(7)
    await expect(page.getByTestId('grade-cell')).toHaveCount(7)

    await page.getByTestId('triads-toggle').click()
    await expect(page.getByTestId('canvas')).toHaveAttribute('data-show-triads', 'false')
    await expect(page.locator('[data-row="triads"]')).toHaveCount(0)

    await page.getByTestId('tetrads-toggle').click()
    await expect(page.getByTestId('canvas')).toHaveAttribute('data-show-tetrads', 'false')
    await expect(page.getByTestId('tetrad-cell')).toHaveCount(0)

    await page.getByTestId('grades-toggle').click()
    await expect(page.getByTestId('canvas')).toHaveAttribute('data-show-grades', 'false')
    await expect(page.getByTestId('grade-cell')).toHaveCount(0)

    await page.getByTestId('triads-toggle').click()
    await page.getByTestId('tetrads-toggle').click()
    await page.getByTestId('grades-toggle').click()
    await expect(page.locator('[data-row="triads"]').first()).toBeVisible()
    await expect(page.getByTestId('tetrad-cell')).toHaveCount(7)
    await expect(page.getByTestId('grade-cell')).toHaveCount(7)
  })
})

test.describe('enharmonic field', () => {
  test('is disabled at the natural center and jumps twelve fifths off-center', async ({
    page,
  }) => {
    await page.goto('/?key=C')
    await waitSettled(page)

    const strip = page.getByTestId('fifths-strip')
    await expect(strip).toHaveAttribute('data-snap-index', '14')
    await expect(page.getByTestId('enharmonic-seek')).toBeDisabled()

    await setSnap(page, 8)
    await expect(page.getByTestId('enharmonic-seek')).toBeEnabled()

    await page.getByTestId('enharmonic-seek').click()
    await waitSettled(page)
    await expect(strip).toHaveAttribute('data-snap-index', '20')

    await page.getByTestId('enharmonic-seek').click()
    await waitSettled(page)
    await expect(strip).toHaveAttribute('data-snap-index', '8')
  })
})
