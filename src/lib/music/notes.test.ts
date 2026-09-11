import { describe, expect, it } from 'vitest'

import {
  BLOCK_OFFSETS,
  CHAIN_LENGTH,
  FIFTHS_CHAIN,
  LETTERS,
  noteAt,
} from './notes'

describe('fifths chain', () => {
  it('holds five blocks of the seven-letter cycle', () => {
    expect(CHAIN_LENGTH).toBe(35)
    expect(FIFTHS_CHAIN).toHaveLength(35)
  })

  it('is one continuous line of perfect fifths, including across block seams', () => {
    // This is the property that makes it a single strip rather than five
    // separate ones. Bb -> F and B -> F# are the seams that would break first.
    for (let i = 0; i < FIFTHS_CHAIN.length - 1; i += 1) {
      const from = noteAt(i)
      const to = noteAt(i + 1)
      expect(to.semitone, `${from.ascii} -> ${to.ascii}`).toBe((from.semitone + 7) % 12)
    }
  })

  it('advances the letter by one step of the cycle at every position', () => {
    for (let i = 0; i < FIFTHS_CHAIN.length - 1; i += 1) {
      const fromLetter = LETTERS.indexOf(noteAt(i).letter)
      const toLetter = LETTERS.indexOf(noteAt(i + 1).letter)
      expect(toLetter).toBe((fromLetter + 1) % LETTERS.length)
    }
  })

  it('applies one accidental per block of seven', () => {
    BLOCK_OFFSETS.forEach((offset, block) => {
      const notes = FIFTHS_CHAIN.slice(block * 7, block * 7 + 7)
      expect(notes).toHaveLength(7)
      expect(notes.every((note) => note.accidental === offset)).toBe(true)
    })
  })

  it('spells the natural block as the modes of C major', () => {
    expect(FIFTHS_CHAIN.slice(14, 21).map((note) => note.ascii)).toEqual([
      'F',
      'C',
      'G',
      'D',
      'A',
      'E',
      'B',
    ])
  })

  it('spells the extremes as double accidentals', () => {
    expect(noteAt(0).ascii).toBe('Fbb')
    expect(noteAt(34).ascii).toBe('B##')
  })

  it('renders double sharps as x, the way the cardboard does', () => {
    expect(noteAt(34).glyph).toBe('x')
    expect(noteAt(0).glyph).toBe('\u266d\u266d')
    expect(noteAt(14).glyph).toBe('')
  })

  it('maps letters to Latin solfège syllables', () => {
    expect(FIFTHS_CHAIN.slice(14, 21).map((note) => note.solfegeKey)).toEqual([
      'solfege.fa',
      'solfege.do',
      'solfege.sol',
      'solfege.re',
      'solfege.la',
      'solfege.mi',
      'solfege.si',
    ])
  })

  it('rejects out-of-range indices instead of returning undefined', () => {
    expect(() => noteAt(-1)).toThrow(RangeError)
    expect(() => noteAt(35)).toThrow(RangeError)
  })
})
