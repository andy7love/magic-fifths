import { CHAIN_LENGTH, noteAt, type ChainNote } from './notes'
import { COLUMNS, MODES, TONIC_COLUMN } from './modes'

/**
 * Snap geometry, kept as pure functions so the gesture engine has nothing to
 * get wrong and the whole thing is unit-testable without a DOM.
 *
 * `snapIndex` is the chain index of the note aligned to the *first* mode column
 * (Lydian). The window is always full, so it ranges 0..MAX_SNAP inclusive.
 */

/** 35 - 7 = 28, giving 29 valid positions. */
export const MAX_SNAP = CHAIN_LENGTH - COLUMNS

/** The natural block, i.e. `F C G D A E B`, i.e. C major. */
export const DEFAULT_SNAP = 14

export function clampSnap(index: number): number {
  if (!Number.isFinite(index)) return DEFAULT_SNAP
  return Math.min(MAX_SNAP, Math.max(0, Math.round(index)))
}

export function isSnapIndex(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= MAX_SNAP
  )
}

/** Track translation, in px, that puts `index` under the Lydian column. */
export function offsetFor(index: number, columnWidth: number): number {
  return -index * columnWidth
}

/** Inverse of `offsetFor`, clamped to a valid snap position. */
export function snapFor(offset: number, columnWidth: number): number {
  if (columnWidth <= 0) return DEFAULT_SNAP
  return clampSnap(-offset / columnWidth)
}

/** Chain index of the tonic (the note under Ionian) for a snap position. */
export function tonicIndex(snapIndex: number): number {
  return snapIndex + TONIC_COLUMN
}

/** Inverse of `tonicIndex`. Together they form a bijection over the 29 positions. */
export function snapForTonic(chainIndex: number): number {
  return clampSnap(chainIndex - TONIC_COLUMN)
}

export function tonicNote(snapIndex: number): ChainNote {
  return noteAt(tonicIndex(snapIndex))
}

export interface ModeAssignment {
  mode: (typeof MODES)[number]
  note: ChainNote
}

/** The seven mode-to-note pairings currently showing in the window. */
export function assignmentsFor(snapIndex: number): ModeAssignment[] {
  return MODES.map((mode) => ({ mode, note: noteAt(snapIndex + mode.column) }))
}
