import { describe, expect, it } from 'vitest'

import { DEFAULT_SNAP, MAX_SNAP, tonicNote } from './music/snap'
import {
  buildShareUrl,
  encodeKeyToken,
  parseKeyToken,
  readShareParam,
  readSharePosition,
} from './share'

const ORIGIN = 'https://magic-fifths.example/'

describe('key tokens', () => {
  it('round-trips every valid position', () => {
    for (let index = 0; index <= MAX_SNAP; index += 1) {
      expect(parseKeyToken(encodeKeyToken(index))).toBe(index)
    }
  })

  it('produces 29 distinct tokens', () => {
    const tokens = new Set<string>()
    for (let index = 0; index <= MAX_SNAP; index += 1) tokens.add(encodeKeyToken(index))
    expect(tokens.size).toBe(29)
  })

  it('never emits a character that needs percent-encoding', () => {
    for (let index = 0; index <= MAX_SNAP; index += 1) {
      const token = encodeKeyToken(index)
      expect(token).toMatch(/^[A-G](b{1,2}|s{1,2})?$/)
      expect(encodeURIComponent(token)).toBe(token)
    }
  })

  it('spells the readable cases the obvious way', () => {
    expect(encodeKeyToken(DEFAULT_SNAP)).toBe('C')
    expect(parseKeyToken('C')).toBe(DEFAULT_SNAP)
    expect(tonicNote(parseKeyToken('Eb')!).ascii).toBe('Eb')
    expect(tonicNote(parseKeyToken('Fs')!).ascii).toBe('F#')
  })

  it('accepts the displayed spellings so hand-typed links work', () => {
    expect(parseKeyToken('F#')).toBe(parseKeyToken('Fs'))
    expect(parseKeyToken('F##')).toBe(parseKeyToken('Fss'))
    expect(parseKeyToken('Fx')).toBe(parseKeyToken('Fss'))
  })

  it('is case-insensitive without confusing B for a flat', () => {
    expect(parseKeyToken('bb')).toBe(parseKeyToken('Bb'))
    expect(parseKeyToken('bbb')).toBe(parseKeyToken('Bbb'))
    expect(tonicNote(parseKeyToken('bb')!).ascii).toBe('Bb')
    expect(tonicNote(parseKeyToken('bbb')!).ascii).toBe('Bbb')
  })

  it('rejects garbage rather than guessing', () => {
    expect(parseKeyToken('')).toBeNull()
    expect(parseKeyToken(null)).toBeNull()
    expect(parseKeyToken(undefined)).toBeNull()
    expect(parseKeyToken('H')).toBeNull()
    expect(parseKeyToken('Cbbb')).toBeNull()
    expect(parseKeyToken('C$')).toBeNull()
    expect(parseKeyToken('14')).toBeNull()
  })

  it('rejects notes that exist in the chain but can never be a tonic under Ionian', () => {
    // Fbb is chain index 0; Ionian is column 1, so no snap position can put it there.
    expect(parseKeyToken('Fbb')).toBeNull()
    expect(parseKeyToken('Bss')).toBeNull()
  })

  it('round-trips a non-Ionian tonic mode', () => {
    // Natural block, Dorian as home → tonic D at snap 14.
    expect(encodeKeyToken(DEFAULT_SNAP, 'dorian')).toBe('D')
    expect(parseKeyToken('D', 'dorian')).toBe(DEFAULT_SNAP)
    expect(tonicNote(parseKeyToken('D', 'dorian')!, 3).ascii).toBe('D')
  })
})

describe('share urls', () => {
  it('encodes the current position', () => {
    expect(buildShareUrl(DEFAULT_SNAP, ORIGIN)).toBe(`${ORIGIN}?key=C`)
  })

  it('omits mode when Ionian is home and includes it otherwise', () => {
    expect(buildShareUrl(DEFAULT_SNAP, ORIGIN, 'ionian')).toBe(`${ORIGIN}?key=C`)
    expect(buildShareUrl(DEFAULT_SNAP, ORIGIN, 'dorian')).toBe(
      `${ORIGIN}?key=D&mode=dorian`,
    )
  })

  it('round-trips through readShareParam', () => {
    for (let index = 0; index <= MAX_SNAP; index += 1) {
      expect(readShareParam(buildShareUrl(index, ORIGIN))).toBe(index)
    }
  })

  it('round-trips mode through readSharePosition', () => {
    const url = buildShareUrl(DEFAULT_SNAP, ORIGIN, 'aeolian')
    expect(readSharePosition(url)).toEqual({
      snapIndex: DEFAULT_SNAP,
      tonicModeId: 'aeolian',
    })
  })

  it('preserves unrelated query params and drops the fragment', () => {
    const url = buildShareUrl(DEFAULT_SNAP, `${ORIGIN}?debug=1#anchor`)
    expect(url).toContain('debug=1')
    expect(url).toContain('key=C')
    expect(url).not.toContain('#')
  })

  it('replaces an existing key rather than appending a second one', () => {
    const url = buildShareUrl(DEFAULT_SNAP, `${ORIGIN}?key=Eb`)
    expect(url).toBe(`${ORIGIN}?key=C`)
  })

  it('returns null for urls without the param', () => {
    expect(readShareParam(ORIGIN)).toBeNull()
    expect(readShareParam(`${ORIGIN}?key=nope`)).toBeNull()
    expect(readShareParam('not a url')).toBeNull()
  })
})
