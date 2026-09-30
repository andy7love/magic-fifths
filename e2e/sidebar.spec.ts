import { expect, test } from '@playwright/test'
import { createRequire } from 'node:module'

import { waitSettled } from './helpers/strip'

const { version: appVersion } = createRequire(import.meta.url)(
  '../package.json',
) as { version: string }

test.describe('sidebar', () => {
  test('opens the drawer and reaches every menu item', async ({ page }) => {
    await page.goto('/?key=C')
    await waitSettled(page)

    await expect(page.getByTestId('toolbar')).toBeVisible()
    await page.getByTestId('sidebar-trigger').click()
    await expect(page.getByTestId('toolbar')).toHaveCount(0)

    // Display toggles first, then enharmonic seek, then the rest of the rail.
    await expect(page.getByTestId('triads-toggle-menu')).toBeVisible()
    await expect(page.getByTestId('tetrads-toggle-menu')).toBeVisible()
    await expect(page.getByTestId('grades-toggle-menu')).toBeVisible()
    await expect(page.getByTestId('grade-names-toggle')).toBeVisible()
    await expect(page.getByText('Degrees names')).toBeVisible()
    await expect(page.getByTestId('notation-toggle')).toBeVisible()
    await expect(page.getByText('on one sliding strip')).toHaveCount(0)
    await expect(page.getByTestId('advanced-toggle-menu')).toBeVisible()
    await expect(page.getByTestId('enharmonic-seek-menu')).toBeVisible()
    await expect(page.getByTestId('share-button-menu')).toBeVisible()
    await expect(page.getByTestId('howto-open')).toBeVisible()
    await expect(page.getByTestId('theory-open')).toBeVisible()
    await page.getByTestId('theme-toggle').scrollIntoViewIfNeeded()
    await expect(page.getByTestId('theme-toggle')).toBeVisible()

    await expect(page.getByTestId('scale-select')).toBeVisible()
    await expect(page.getByTestId('language-select')).toBeVisible()
    await expect(page.getByTestId('app-version')).toHaveText(
      `Magic Fifths v.${appVersion}`,
    )

    await page.getByTestId('advanced-toggle-menu').click()
    await expect(page.getByTestId('canvas')).toHaveAttribute('data-advanced', 'true')

    await page.getByTestId('howto-open').scrollIntoViewIfNeeded()
    await page.getByTestId('howto-open').click()
    await expect(page.getByTestId('howto-dialog')).toBeVisible()
    await expect(page.getByTestId('howto-dialog')).toContainText('Enharmonic field')
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
    await expect(page.getByTestId('theory-dialog')).toContainText('One field at a time')
    await page.keyboard.press('Escape')
    await expect(page.getByTestId('theory-dialog')).toHaveCount(0)

    const close = page.getByTestId('sidebar-close')
    if (await close.isVisible()) {
      await close.click()
    }
    await expect(page.getByTestId('toolbar')).toBeVisible()
  })

  test('a rightward swipe from the left edge opens the drawer and leaves the strip put', async ({
    page,
  }) => {
    await page.goto('/?key=C')
    await waitSettled(page)

    const strip = page.getByTestId('fifths-strip')
    await expect(strip).toHaveAttribute('data-snap-index', '14')
    await expect(page.getByTestId('toolbar')).toBeVisible()

    const viewport = page.viewportSize()
    const y = Math.round((viewport?.height ?? 800) * 0.55)
    await page.mouse.move(8, y)
    await page.mouse.down()
    await page.mouse.move(110, y, { steps: 12 })
    await page.mouse.up()

    await expect(page.getByTestId('toolbar')).toHaveCount(0)
    await expect(page.getByTestId('sidebar-close')).toBeVisible()
    await expect(strip).toHaveAttribute('data-snap-index', '14')
    await expect(strip).toHaveAttribute('data-settled', 'true')
  })

  test('a rightward swipe from the toolbox or the margin left of the board opens the drawer', async ({
    page,
  }) => {
    await page.goto('/?key=C')
    await waitSettled(page)

    const strip = page.getByTestId('fifths-strip')
    const canvas = page.getByTestId('canvas')
    const toolbar = page.getByTestId('toolbar')
    const canvasBox = await canvas.boundingBox()
    const toolbarBox = await toolbar.boundingBox()
    if (!canvasBox || !toolbarBox) throw new Error('canvas or toolbar has no box')

    await expect(strip).toHaveAttribute('data-snap-index', '14')

    const marginX = Math.min(toolbarBox.x + toolbarBox.width / 2, canvasBox.x - 16)
    const y = toolbarBox.y + Math.min(toolbarBox.height * 0.35, 80)
    await page.mouse.move(marginX, y)
    await page.mouse.down()
    await page.mouse.move(marginX + 140, y, { steps: 12 })
    await page.mouse.up()

    await expect(page.getByTestId('toolbar')).toHaveCount(0)
    await expect(page.getByTestId('sidebar-close')).toBeVisible()
    await expect(strip).toHaveAttribute('data-snap-index', '14')

    await page.getByTestId('sidebar-close').click()
    await expect(page.getByTestId('toolbar')).toBeVisible()

    const blackX = canvasBox.x - 28
    if (blackX > toolbarBox.x + toolbarBox.width) {
      const boardY = canvasBox.y + canvasBox.height * 0.45
      await page.mouse.move(blackX, boardY)
      await page.mouse.down()
      await page.mouse.move(blackX + 140, boardY, { steps: 12 })
      await page.mouse.up()

      await expect(page.getByTestId('toolbar')).toHaveCount(0)
      await expect(strip).toHaveAttribute('data-snap-index', '14')
    }
  })

  test('dragging the strip away from the left edge does not open the drawer', async ({
    page,
  }) => {
    await page.goto('/?key=C')
    await waitSettled(page)

    const strip = page.getByTestId('fifths-strip')
    const box = await strip.boundingBox()
    if (!box) throw new Error('fifths strip has no box')

    const startX = box.x + box.width * 0.45
    const y = box.y + box.height * 0.5
    await page.mouse.move(startX, y)
    await page.mouse.down()
    await page.mouse.move(startX + 180, y, { steps: 12 })
    await page.mouse.up()
    await waitSettled(page)

    await expect(page.getByTestId('toolbar')).toBeVisible()
    await expect(strip).not.toHaveAttribute('data-snap-index', '14')
  })
})
