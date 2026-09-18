import { describe, expect, it } from 'vitest'

import { COLUMNS, TONIC_COLUMN } from './modes'
import { CHAIN_LENGTH } from './notes'
import {
  DEFAULT_SNAP,
  ENHARMONIC_SHIFT,
  MAX_SNAP,
  assignmentsFor,
  clampSnap,
  enharmonicSnap,
  isSnapIndex,
  offsetFor,
  snapFor,
  snapForTonic,
  tonicIndex,
  tonicNote,
} from './snap'

const COL_W = 64

describe('snap positions', () => {
  it('keeps the window full at both extremes', () => {
    expect(MAX_SNAP).toBe(CHAIN_LENGTH - COLUMNS)
    expect(MAX_SNAP).toBe(28)
  })

  it('defaults to C as tonic under Ionian', () => {
    expect(tonicNote(DEFAULT_SNAP).ascii).toBe('C')
  })

  it('seeks the enharmonic field twelve fifths off center', () => {
    expect(ENHARMONIC_SHIFT).toBe(12)
    expect(enharmonicSnap(DEFAULT_SNAP)).toBeNull()
    expect(enharmonicSnap(DEFAULT_SNAP - 1)).toBe(DEFAULT_SNAP - 1 + 12)
    expect(enharmonicSnap(DEFAULT_SNAP + 1)).toBe(DEFAULT_SNAP + 1 - 12)
    expect(enharmonicSnap(0)).toBe(12)
    expect(enharmonicSnap(MAX_SNAP)).toBe(MAX_SNAP - 12)
  })

  it('reads the tonic from a non-Ionian grade-1 column', () => {
    // Natural block with Dorian as home → D is tonic.
    expect(tonicNote(DEFAULT_SNAP, 3).ascii).toBe('D')
  })

  it('clamps out-of-range and non-finite input', () => {
    expect(clampSnap(-5)).toBe(0)
    expect(clampSnap(999)).toBe(MAX_SNAP)
    expect(clampSnap(Number.NaN)).toBe(DEFAULT_SNAP)
    expect(clampSnap(Number.POSITIVE_INFINITY)).toBe(DEFAULT_SNAP)
  })

  it('rounds to the nearest column', () => {
    expect(clampSnap(14.4)).toBe(14)
    expect(clampSnap(14.6)).toBe(15)
  })

  it('validates snap indices', () => {
    expect(isSnapIndex(0)).toBe(true)
    expect(isSnapIndex(MAX_SNAP)).toBe(true)
    expect(isSnapIndex(MAX_SNAP + 1)).toBe(false)
    expect(isSnapIndex(1.5)).toBe(false)
    expect(isSnapIndex('14')).toBe(false)
  })
})

describe('offset conversion', () => {
  it('round-trips through offsetFor and snapFor', () => {
    for (let index = 0; index <= MAX_SNAP; index += 1) {
      expect(snapFor(offsetFor(index, COL_W), COL_W)).toBe(index)
    }
  })

  it('snaps to the nearer column when released mid-travel', () => {
    expect(snapFor(offsetFor(14, COL_W) - COL_W * 0.4, COL_W)).toBe(14)
    expect(snapFor(offsetFor(14, COL_W) - COL_W * 0.6, COL_W)).toBe(15)
  })

  it('survives a zero column width rather than dividing by zero', () => {
    expect(snapFor(-100, 0)).toBe(DEFAULT_SNAP)
  })
})

describe('tonic mapping', () => {
  it('is a bijection over every valid position', () => {
    for (let index = 0; index <= MAX_SNAP; index += 1) {
      expect(snapForTonic(tonicIndex(index))).toBe(index)
    }
  })

  it('yields 29 distinct tonics', () => {
    const tonics = new Set<string>()
    for (let index = 0; index <= MAX_SNAP; index += 1) tonics.add(tonicNote(index).ascii)
    expect(tonics.size).toBe(MAX_SNAP + 1)
    expect(tonics.size).toBe(29)
  })

  it('spans Cbb to C## at the extremes', () => {
    expect(tonicNote(0).ascii).toBe('Cbb')
    expect(tonicNote(MAX_SNAP).ascii).toBe('C##')
  })
})

describe('mode assignments', () => {
  it('lines the natural block up as the modes of C major', () => {
    const assignments = assignmentsFor(DEFAULT_SNAP)
    expect(assignments.map((a) => `${a.mode.id}:${a.note.ascii}`)).toEqual([
      'lydian:F',
      'ionian:C',
      'mixolydian:G',
      'dorian:D',
      'aeolian:A',
      'phrygian:E',
      'locrian:B',
    ])
  })

  it('puts the default tonic under the Ionian column', () => {
    for (let index = 0; index <= MAX_SNAP; index += 1) {
      const ionian = assignmentsFor(index)[TONIC_COLUMN]
      expect(ionian.mode.id).toBe('ionian')
      expect(ionian.note.ascii).toBe(tonicNote(index).ascii)
    }
  })

  it('puts a chosen tonic under its own column', () => {
    const dorianColumn = 3
    for (let index = 0; index <= MAX_SNAP; index += 1) {
      const dorian = assignmentsFor(index)[dorianColumn]
      expect(dorian.mode.id).toBe('dorian')
      expect(dorian.note.ascii).toBe(tonicNote(index, dorianColumn).ascii)
    }
  })

  it('always fills all seven columns', () => {
    for (let index = 0; index <= MAX_SNAP; index += 1) {
      expect(assignmentsFor(index)).toHaveLength(COLUMNS)
    }
  })
})
