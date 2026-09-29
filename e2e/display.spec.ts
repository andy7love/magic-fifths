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
    await expect(
      page.getByText('Gb major is the enharmonic field of F# major'),
    ).toBeVisible()
    await waitSettled(page)
    await expect(strip).toHaveAttribute('data-snap-index', '20')

    await page.getByTestId('enharmonic-seek').click()
    await waitSettled(page)
    await expect(strip).toHaveAttribute('data-snap-index', '8')
  })

  test('highlights the control when the field has a double accidental', async ({ page }) => {
    await page.goto('/?key=C')
    await waitSettled(page)

    const seek = page.getByTestId('enharmonic-seek')
    await expect(seek).toHaveAttribute('data-suggest', 'false')

    await setSnap(page, 4)
    await expect(seek).toBeEnabled()
    await expect(seek).toHaveAttribute('data-suggest', 'true')

    await setSnap(page, 26)
    await expect(seek).toHaveAttribute('data-suggest', 'true')

    await setSnap(page, 14)
    await expect(seek).toHaveAttribute('data-suggest', 'false')
    await expect(seek).toBeDisabled()
  })
})

test.describe('note names', () => {
  test('the notation toggle lives in the sidebar and swaps the strip labels', async ({
    page,
  }) => {
    await page.goto('/?key=C')
    await waitSettled(page)

    await expect(page.getByTestId('toolbar').getByTestId('notation-toggle')).toHaveCount(0)
    await expect(page.getByTestId('canvas')).toHaveAttribute('data-notation', 'solfege')
    await expect(page.locator('.mf-note-solfege')).toHaveCount(35)
    await expect(page.locator('.mf-note-letter')).toHaveCount(0)
    await expect(
      page.locator('[data-testid="note-cell"][data-in-window="true"]').first(),
    ).toContainText('Fa')

    await page.getByTestId('sidebar-trigger').click()
    const notation = page.getByTestId('notation-toggle')
    await notation.scrollIntoViewIfNeeded()
    await expect(notation).toBeVisible()
    await expect(page.getByTestId('toolbar').getByTestId('notation-toggle')).toHaveCount(0)
    await notation.click()

    await expect(page.getByTestId('canvas')).toHaveAttribute('data-notation', 'letter')
    await expect(page.locator('.mf-note-letter')).toHaveCount(35)
    await expect(page.locator('.mf-note-solfege')).toHaveCount(0)
    await expect(
      page.locator('[data-testid="note-cell"][data-in-window="true"]').nth(1),
    ).toContainText('C')
  })
})

test.describe('grade names', () => {
  test('the sidebar toggle prints functional names and uses subtonic in natural minor', async ({
    page,
  }) => {
    await page.goto('/?key=C')
    await waitSettled(page)

    await expect(page.getByTestId('toolbar').getByTestId('grade-names-toggle')).toHaveCount(0)
    await expect(page.getByTestId('grade-name')).toHaveCount(0)

    await page.getByTestId('sidebar-trigger').click()
    const toggle = page.getByTestId('grade-names-toggle')
    await toggle.scrollIntoViewIfNeeded()
    await toggle.click()

    const close = page.getByTestId('sidebar-close')
    if (await close.isVisible()) await close.click()

    await expect(page.getByTestId('canvas')).toHaveAttribute('data-show-grade-names', 'true')
    await expect(page.getByTestId('grade-name')).toHaveCount(7)
    await expect(page.getByTestId('grade-cell').nth(1)).toContainText('Tonic')
    await expect(page.getByTestId('grade-cell').nth(6)).toContainText('Leading tone')

    await page.getByTestId('mode-column').filter({ hasText: 'Aeolian' }).click()
    await expect(page.getByTestId('grade-cell').filter({ hasText: '7' })).toContainText('Subtonic')
    await expect(page.getByTestId('grade-cell').filter({ hasText: '1' })).toContainText('Tonic')
  })

  test('degrees names stays put and cannot be toggled while degrees are hidden', async ({
    page,
  }) => {
    await page.goto('/?key=C')
    await waitSettled(page)

    await page.getByTestId('sidebar-trigger').click()
    const names = page.getByTestId('grade-names-toggle')
    await names.scrollIntoViewIfNeeded()
    await expect(names).toBeEnabled()
    await names.click()

    await page.getByTestId('grades-toggle-menu').click()
    await expect(page.getByTestId('canvas')).toHaveAttribute('data-show-grades', 'false')
    await expect(names).toBeDisabled()
    await expect(names).toBeChecked()
    await expect(page.getByTestId('grade-name')).toHaveCount(0)

    await page.getByTestId('grades-toggle-menu').click()
    await expect(names).toBeEnabled()
    await expect(page.getByTestId('grade-name')).toHaveCount(7)
  })
})
