import { COLUMNS } from '@/lib/music/modes'

/**
 * Pixel-level check that each in-window note cell sits on its mode slot.
 * Used by the debug overlay and by `window.__mf__.getAlignmentDeltas`.
 *
 * Landscape compares left edges (`--col-w`); portrait compares top edges
 * (`--row-h`). Alignment is structural in both cases, so these deltas should
 * be ~0.
 */
export function getAlignmentDeltas(root: ParentNode = document): number[] {
  const canvas =
    root instanceof Element && root.matches('[data-testid="canvas"]')
      ? root
      : root.querySelector('[data-testid="canvas"]')
  const portrait = canvas?.getAttribute('data-orientation') === 'portrait'

  const modes = root.querySelectorAll<HTMLElement>('[data-testid="mode-column"]')
  const notes = root.querySelectorAll<HTMLElement>(
    '[data-testid="note-cell"][data-in-window="true"]',
  )

  const deltas: number[] = []
  for (let i = 0; i < COLUMNS; i += 1) {
    const mode = modes[i]
    const note = notes[i]
    if (!mode || !note) {
      deltas.push(Number.NaN)
      continue
    }
    const modeBox = mode.getBoundingClientRect()
    const noteBox = note.getBoundingClientRect()
    deltas.push(
      portrait ? noteBox.top - modeBox.top : noteBox.left - modeBox.left,
    )
  }
  return deltas
}
