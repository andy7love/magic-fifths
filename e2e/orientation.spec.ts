import { expect, test } from '@playwright/test'

test.describe('orientation', () => {
  test('uses the vertical board only in portrait, and the original board in landscape', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 400, height: 700 })
    await page.goto('/')

    await expect(page.getByTestId('orientation-gate')).toHaveCount(0)
    const canvas = page.getByTestId('canvas')
    await expect(canvas).toHaveAttribute('data-orientation', 'portrait')
    await expect(page.getByTestId('fifths-strip')).toBeVisible()

    // Landscape — including a phone turned sideways — keeps the original board.
    await page.setViewportSize({ width: 900, height: 420 })
    await expect(canvas).toHaveAttribute('data-orientation', 'landscape')
  })

  test('the vertical strip scrolls and settles on a new tonic', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 800 })
    await page.goto('/')

    const strip = page.getByTestId('fifths-strip')
    await expect(strip).toHaveAttribute('data-settled', 'true')
    const before = await strip.getAttribute('data-tonic')

    const box = await strip.boundingBox()
    if (!box) throw new Error('strip has no bounding box')
    const cx = box.x + box.width / 2
    const cy = box.y + box.height / 2

    await page.mouse.move(cx, cy)
    await page.mouse.down()
    await page.mouse.move(cx, cy + box.height / 4, { steps: 12 })
    await page.mouse.up()

    await expect(strip).toHaveAttribute('data-settled', 'true')
    await expect
      .poll(async () => strip.getAttribute('data-tonic'))
      .not.toBe(before)
  })
})
