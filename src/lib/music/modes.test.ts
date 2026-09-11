import { describe, expect, it } from 'vitest'

import {
  DEFAULT_TONIC_MODE,
  MODES,
  gradeRelativeTo,
  gradesForTonic,
  isModeId,
  tonicColumnFor,
} from './modes'

describe('gradesForTonic', () => {
  it('defaults to major-scale degrees under Ionian', () => {
    expect(gradesForTonic('ionian')).toEqual([4, 1, 5, 2, 6, 3, 7])
  })

  it('puts 1 under the chosen tonic mode', () => {
    for (const mode of MODES) {
      const grades = gradesForTonic(mode.id)
      expect(grades[mode.column]).toBe(1)
    }
  })

  it('rotates correctly when Dorian is home', () => {
    // Dorian = major degree 2 → F=3, C=7, G=4, D=1, A=5, E=2, B=6
    expect(gradesForTonic('dorian')).toEqual([3, 7, 4, 1, 5, 2, 6])
  })

  it('rotates correctly when Aeolian is home', () => {
    expect(gradesForTonic('aeolian')).toEqual([6, 3, 7, 4, 1, 5, 2])
  })
})

describe('gradeRelativeTo', () => {
  it('wraps through the octave', () => {
    expect(gradeRelativeTo(1, 1)).toBe(1)
    expect(gradeRelativeTo(1, 2)).toBe(7)
    expect(gradeRelativeTo(7, 1)).toBe(7)
  })
})

describe('mode helpers', () => {
  it('recognises mode ids', () => {
    expect(isModeId('ionian')).toBe(true)
    expect(isModeId('bogus')).toBe(false)
    expect(isModeId(1)).toBe(false)
  })

  it('maps the default tonic to the Ionian column', () => {
    expect(tonicColumnFor(DEFAULT_TONIC_MODE)).toBe(1)
  })
})
