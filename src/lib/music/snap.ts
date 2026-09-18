import { CHAIN_LENGTH, noteAt, type ChainNote } from './notes'
import { COLUMNS, MODES, TONIC_COLUMN } from './modes'

/**
 * Snap geometry, kept as pure functions so the gesture engine has nothing to
 * get wrong and the whole thing is unit-testable without a DOM.
 *
 * `snapIndex` is the chain index of the note aligned to the *first* mode column
 * (Lydian). The window is always full, so it ranges 0..MAX_SNAP inclusive.
 *
 * The *tonic* is the note under grade 1 — whichever mode column the user has
 * chosen as home — so `tonic = snapIndex + tonicColumn`.
 */

/** 35 - 7 = 28, giving 29 valid positions. */
export const MAX_SNAP = CHAIN_LENGTH - COLUMNS

/** The natural block, i.e. `F C G D A E B`, i.e. C major with Ionian as home. */
export const DEFAULT_SNAP = 14

/**
 * Twelve perfect fifths land on the enharmonic spelling of the same pitch class.
 * The strip's "center" is `DEFAULT_SNAP` (the natural / flat-side resting
 * position); from either side we always jump toward the other side of center.
 */
export const ENHARMONIC_SHIFT = 12

export function clampSnap(index: number): number {
  if (!Number.isFinite(index)) return DEFAULT_SNAP
  return Math.min(MAX_SNAP, Math.max(0, Math.round(index)))
}

/**
 * Snap index of the enharmonic field, or `null` when already at the strip
 * center (where the control should be disabled).
 */
export function enharmonicSnap(snapIndex: number): number | null {
  const index = clampSnap(snapIndex)
  if (index === DEFAULT_SNAP) return null
  const delta = index < DEFAULT_SNAP ? ENHARMONIC_SHIFT : -ENHARMONIC_SHIFT
  return clampSnap(index + delta)
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

/** Chain index of the tonic (the note under grade 1) for a snap position. */
export function tonicIndex(
  snapIndex: number,
  tonicColumn: number = TONIC_COLUMN,
): number {
  return snapIndex + tonicColumn
}

/** Inverse of `tonicIndex`. A bijection only when `tonicColumn` is held fixed. */
export function snapForTonic(
  chainIndex: number,
  tonicColumn: number = TONIC_COLUMN,
): number {
  return clampSnap(chainIndex - tonicColumn)
}

export function tonicNote(
  snapIndex: number,
  tonicColumn: number = TONIC_COLUMN,
): ChainNote {
  return noteAt(tonicIndex(snapIndex, tonicColumn))
}

export interface ModeAssignment {
  mode: (typeof MODES)[number]
  note: ChainNote
}

/** The seven mode-to-note pairings currently showing in the window. */
export function assignmentsFor(snapIndex: number): ModeAssignment[] {
  return MODES.map((mode) => ({ mode, note: noteAt(snapIndex + mode.column) }))
}
