import { expect, test } from '@playwright/test'

test.describe('orientation', () => {
  test('shows the gate below the minimum width and hides it when wider', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 400, height: 700 })
    await page.goto('/')
    await expect(page.getByTestId('orientation-gate')).toBeVisible()

    await page.setViewportSize({ width: 900, height: 420 })
    await expect(page.getByTestId('orientation-gate')).toHaveCount(0)
  })
})
