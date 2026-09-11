import { COLUMNS } from '@/lib/music/modes'

/**
 * Pixel-level check that each in-window note cell sits under its mode column.
 * Used by the debug overlay and by `window.__mf__.getAlignmentDeltas`.
 *
 * Alignment is structural (same `--col-w`, shared grid track edge), so these
 * deltas should be ~0. A regression that reintroduces percentage column widths
 * or a mis-placed strip window shows up here immediately.
 */
export function getAlignmentDeltas(root: ParentNode = document): number[] {
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
    deltas.push(note.getBoundingClientRect().left - mode.getBoundingClientRect().left)
  }
  return deltas
}
