import { expect, test, type Page } from '@playwright/test'

import { waitSettled } from './helpers/strip'

async function lastPlayback(page: Page) {
  return page.evaluate(() => window.__mf__?.getLastPlayback() ?? null)
}

test.describe('playback', () => {
  test('clicking a triad, tetrad, or mode plays that column', async ({ page }) => {
    await page.goto('/?key=C')
    await waitSettled(page)

    await page.getByTestId('triad-cell').nth(1).click()
    await expect.poll(() => lastPlayback(page)).toMatchObject({
      style: 'chord',
      chords: [['C4', 'E4', 'G4']],
    })

    await page.getByTestId('tetrad-cell').nth(1).click()
    await expect.poll(() => lastPlayback(page)).toMatchObject({
      chords: [['C4', 'E4', 'G4', 'B4']],
    })

    await page.getByTestId('mode-column').nth(0).click()
    const mode = await lastPlayback(page)
    expect(mode?.style).toBe('arpeggio')
    expect(mode?.chords).toEqual([['F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5']])
    expect(mode?.events.map((event) => event.notes)).toEqual([
      ['F4'],
      ['G4'],
      ['A4'],
      ['B4'],
      ['C5'],
      ['D5'],
      ['E5'],
    ])
    expect(mode?.events[1]?.time).toBeGreaterThan(0)
  })

  test('arpeggiate chords changes triads only, and the speed slider stays on', async ({
    page,
  }) => {
    await page.goto('/?key=C')
    await waitSettled(page)

    await page.getByTestId('sidebar-trigger').click()
    const toggle = page.getByTestId('playback-arpeggio')
    const slider = page.getByTestId('arpeggio-speed')
    await toggle.scrollIntoViewIfNeeded()
    await expect(toggle).not.toBeChecked()
    await expect(page.getByText('Arpeggiate chords')).toBeVisible()
    await expect(slider).not.toHaveAttribute('data-disabled')

    const close = page.getByTestId('sidebar-close')
    if (await close.isVisible()) await close.click()

    await page.getByTestId('triad-cell').nth(1).click()
    const blocked = await lastPlayback(page)
    expect(blocked?.style).toBe('chord')
    expect(blocked?.events).toHaveLength(1)

    await page.getByTestId('mode-column').nth(0).click()
    const scale = await lastPlayback(page)
    expect(scale?.style).toBe('arpeggio')
    expect(scale?.events.length).toBeGreaterThan(1)

    await page.getByTestId('sidebar-trigger').click()
    await toggle.scrollIntoViewIfNeeded()
    await toggle.click()
    await expect(toggle).toBeChecked()
    await expect(slider).not.toHaveAttribute('data-disabled')
    if (await close.isVisible()) await close.click()

    await page.getByTestId('triad-cell').nth(1).click()
    const playback = await lastPlayback(page)
    expect(playback?.style).toBe('arpeggio')
    expect(playback?.events.map((event) => event.notes)).toEqual([['C4'], ['E4'], ['G4']])
    expect(playback?.events[1]?.time).toBeGreaterThan(0)
    expect(playback?.events[2]?.time).toBeGreaterThan(playback?.events[1]?.time ?? 0)
  })
})
