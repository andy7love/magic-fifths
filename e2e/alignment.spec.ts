import { test } from '@playwright/test'

import { expectAligned, setSnap, waitSettled } from './helpers/strip'

const SNAP_SAMPLES = [0, 7, 14, 21, 28]

test.describe('alignment', () => {
  test('note cells sit under mode columns at every sample snap', async ({ page }) => {
    await page.goto('/?key=C')
    await waitSettled(page)

    for (const index of SNAP_SAMPLES) {
      await setSnap(page, index)
      await expectAligned(page)
    }
  })
})
