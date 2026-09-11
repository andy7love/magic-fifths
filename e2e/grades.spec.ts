import { expect, test } from '@playwright/test'

import { waitSettled } from './helpers/strip'

test.describe('grades', () => {
  test('default degrees put 1 under Ionian', async ({ page }) => {
    await page.goto('/?key=C')
    await waitSettled(page)

    const grades = page.getByTestId('grade-cell')
    await expect(grades).toHaveCount(7)
    await expect(grades.nth(1)).toHaveAttribute('data-grade', '1')
    await expect(grades.nth(1)).toHaveAttribute('data-tonic-grade', 'true')
    await expect(page.getByTestId('fifths-strip')).toHaveAttribute('data-tonic', 'C')
    await expect(page.getByTestId('key-readout')).toContainText('C major')
  })

  test('clicking a mode name moves grade 1 and the tonic', async ({ page }) => {
    await page.goto('/?key=C')
    await waitSettled(page)

    await page.getByTestId('mode-column').filter({ hasText: 'Dorian' }).click()

    await expect(page.getByTestId('fifths-strip')).toHaveAttribute('data-tonic-mode', 'dorian')
    await expect(page.getByTestId('fifths-strip')).toHaveAttribute('data-tonic', 'D')
    await expect(page.getByTestId('grade-cell').nth(3)).toHaveAttribute('data-grade', '1')
    await expect(page.getByTestId('key-readout')).toContainText('D Dorian')
    await expect(page).toHaveURL(/mode=dorian/)
    await expect(page).toHaveURL(/key=D/)
  })

  test('Aeolian as tonic reads as minor', async ({ page }) => {
    await page.goto('/?key=A&mode=aeolian')
    await waitSettled(page)

    await expect(page.getByTestId('fifths-strip')).toHaveAttribute('data-tonic', 'A')
    await expect(page.getByTestId('fifths-strip')).toHaveAttribute('data-tonic-mode', 'aeolian')
    await expect(page.getByTestId('key-readout')).toContainText('A minor')
    await expect(page.getByTestId('mode-column').filter({ hasText: 'Aeolian' })).toHaveAttribute(
      'data-tonic-mode',
      'true',
    )
  })

  test('Ionian and Aeolian columns show Major / Minor aliases', async ({ page }) => {
    await page.goto('/?key=C')
    await waitSettled(page)

    await expect(page.getByTestId('mode-column').filter({ hasText: 'Ionian' })).toContainText(
      'Major',
    )
    await expect(page.getByTestId('mode-column').filter({ hasText: 'Aeolian' })).toContainText(
      'Minor',
    )
  })
})
