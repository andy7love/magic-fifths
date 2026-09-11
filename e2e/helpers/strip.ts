import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

export async function waitSettled(page: Page) {
  await expect(page.getByTestId('fifths-strip')).toHaveAttribute('data-settled', 'true')
}

export async function setSnap(page: Page, index: number) {
  await page.evaluate((i) => {
    window.__mf__?.setSnapIndex(i)
  }, index)
  await waitSettled(page)
  await expect(page.getByTestId('fifths-strip')).toHaveAttribute(
    'data-snap-index',
    String(index),
  )
}

export async function getAlignmentDeltas(page: Page): Promise<number[]> {
  return page.evaluate(() => window.__mf__?.getAlignmentDeltas() ?? [])
}

export async function expectAligned(page: Page, tolerance = 1.5) {
  await waitSettled(page)
  const deltas = await getAlignmentDeltas(page)
  for (const delta of deltas) {
    expect(Math.abs(delta)).toBeLessThanOrEqual(tolerance)
  }
}

declare global {
  interface Window {
    __mf__?: {
      getSnapIndex: () => number
      setSnapIndex: (index: number) => void
      getTonicModeId: () => string
      setTonicModeId: (modeId: string) => void
      getGeometry: () => { columnWidth: number; offset: number; snapIndex: number }
      getAlignmentDeltas: () => number[]
    }
  }
}
