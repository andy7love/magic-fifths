import { expect, test } from '@playwright/test'

import { waitSettled } from './helpers/strip'

test.describe('i18n', () => {
  test('switching to Spanish updates mode names and html lang', async ({ page }) => {
    await page.goto('/?key=C')
    await waitSettled(page)

    await page.getByTestId('sidebar-trigger').click()
    await page.getByTestId('language-select').click()
    await page.getByRole('option', { name: 'Español' }).click()

    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
    await expect(page.getByTestId('mode-column').first()).toContainText('Lidio')
    await expect(page.getByTestId('mode-column').nth(1)).toContainText('Jónico')

    await page.reload()
    await waitSettled(page)
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
    await expect(page.getByTestId('mode-column').first()).toContainText('Lidio')

    await page.getByTestId('sidebar-trigger').click()
    await page.getByTestId('language-select').click()
    await page.getByRole('option', { name: 'English' }).click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByTestId('mode-column').first()).toContainText('Lydian')
  })
})
