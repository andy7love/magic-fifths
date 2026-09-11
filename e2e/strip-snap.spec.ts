import { expect, test } from '@playwright/test'

import { setSnap, waitSettled } from './helpers/strip'

test.describe('strip-snap', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?key=C')
    await waitSettled(page)
  })

  test('slow drag of half a column advances by one', async ({ page }) => {
    const strip = page.getByTestId('fifths-strip')
    const box = await strip.boundingBox()
    expect(box).toBeTruthy()
    if (!box) return

    const colW = await page.evaluate(() => window.__mf__!.getGeometry().columnWidth)
    const startX = box.x + box.width / 2
    const startY = box.y + box.height / 2

    // Drag left past the halfway mark, then pause so velocity decays to ~0
    // and the nearest-column snap wins (no flick projection).
    await page.mouse.move(startX, startY)
    await page.mouse.down()
    await page.mouse.move(startX - colW * 0.65, startY, { steps: 20 })
    await page.waitForTimeout(120)
    await page.mouse.up()
    await waitSettled(page)

    await expect(strip).toHaveAttribute('data-snap-index', '15')
  })

  test('clamps at the ends', async ({ page }) => {
    await setSnap(page, 0)
    await expect(page.getByTestId('fifths-strip')).toHaveAttribute('data-snap-index', '0')

    await setSnap(page, 28)
    await expect(page.getByTestId('fifths-strip')).toHaveAttribute('data-snap-index', '28')
  })

  test('arrow keys move one column', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Keyboard focus is unreliable on touch projects')
    const strip = page.getByTestId('fifths-strip')
    await strip.focus()
    await page.keyboard.press('ArrowRight')
    await waitSettled(page)
    await expect(strip).toHaveAttribute('data-snap-index', '15')

    await page.keyboard.press('ArrowLeft')
    await waitSettled(page)
    await expect(strip).toHaveAttribute('data-snap-index', '14')
  })

  test('Home and End jump to the extremes', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Keyboard focus is unreliable on touch projects')
    const strip = page.getByTestId('fifths-strip')
    await strip.focus()
    await page.keyboard.press('Home')
    await waitSettled(page)
    await expect(strip).toHaveAttribute('data-snap-index', '0')

    await page.keyboard.press('End')
    await waitSettled(page)
    await expect(strip).toHaveAttribute('data-snap-index', '28')
  })

  test('tapping a note makes it the tonic', async ({ page }) => {
    const g = page.locator('[data-testid="note-cell"][data-note="G"][data-in-window="true"]')
    const box = await g.boundingBox()
    expect(box).toBeTruthy()
    if (!box) return

    // Exact-position mouse click avoids Playwright's default click jitter that
    // can exceed the engine's tap slop and get treated as a tiny drag.
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
    await waitSettled(page)
    await expect(page.getByTestId('fifths-strip')).toHaveAttribute('data-tonic', 'G')
  })

  test('position survives a reload', async ({ page }) => {
    await setSnap(page, 21)
    await page.reload()
    await waitSettled(page)
    await expect(page.getByTestId('fifths-strip')).toHaveAttribute('data-snap-index', '21')
  })
})
