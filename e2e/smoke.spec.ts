import { expect, test } from '@playwright/test'

import { expectAligned, waitSettled } from './helpers/strip'

test.describe('smoke', () => {
  test('renders the cardboard with C major at rest', async ({ page }) => {
    await page.goto('/?key=C')
    await waitSettled(page)

    const modes = page.getByTestId('mode-column')
    await expect(modes).toHaveCount(7)
    await expect(modes.nth(0)).toHaveAttribute('data-mode', 'lydian')
    await expect(modes.nth(1)).toHaveAttribute('data-mode', 'ionian')
    await expect(modes.nth(1)).toHaveAttribute('data-triad', 'major')
    await expect(modes.nth(1)).toHaveAttribute('data-tetrad', 'maj7')
    await expect(modes.nth(6)).toHaveAttribute('data-mode', 'locrian')
    await expect(modes.nth(6)).toHaveAttribute('data-triad', 'diminished')

    const strip = page.getByTestId('fifths-strip')
    await expect(strip).toHaveAttribute('data-snap-index', '14')
    await expect(strip).toHaveAttribute('data-tonic', 'C')

    await expect(page.getByTestId('key-readout')).toContainText('C')
    await expectAligned(page)
  })
})
