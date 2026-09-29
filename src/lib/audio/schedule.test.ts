import { describe, expect, it } from 'vitest'

import { ARPEGGIO_MS, CHORD_GAP_SEC, CHORD_HOLD_SEC } from '@/lib/config'

import { scheduleChords } from './schedule'

const C_MAJOR = ['C4', 'E4', 'G4']
const A_MINOR = ['A4', 'C5', 'E5']

describe('scheduleChords', () => {
  it('stacks every note of a chord on the same instant', () => {
    const events = scheduleChords([C_MAJOR], 'chord', 0.5)
    expect(events).toEqual([
      { notes: ['C4', 'E4', 'G4'], time: 0, duration: CHORD_HOLD_SEC },
    ])
  })

  it('ignores arpeggio speed when playing chords', () => {
    const slow = scheduleChords([C_MAJOR, A_MINOR], 'chord', ARPEGGIO_MS.max / 1000)
    const fast = scheduleChords([C_MAJOR, A_MINOR], 'chord', ARPEGGIO_MS.min / 1000)
    expect(slow.map((event) => event.time)).toEqual(fast.map((event) => event.time))
    expect(slow[1]?.time).toBeCloseTo(CHORD_HOLD_SEC + CHORD_GAP_SEC)
    expect(slow[1]?.notes).toEqual(A_MINOR)
  })

  it('staggers an arpeggio by the requested gap, across chords', () => {
    const events = scheduleChords([C_MAJOR, A_MINOR], 'arpeggio', 0.12)
    expect(events.map((event) => event.notes)).toEqual([
      ['C4'],
      ['E4'],
      ['G4'],
      ['A4'],
      ['C5'],
      ['E5'],
    ])
    events.forEach((event, index) => {
      expect(event.time).toBeCloseTo(index * 0.12)
    })
  })

  it('clamps an out-of-range arpeggio speed', () => {
    const events = scheduleChords([C_MAJOR], 'arpeggio', 5)
    expect(events[1]?.time).toBeCloseTo(ARPEGGIO_MS.max / 1000)
    expect(events[2]?.time).toBeCloseTo((2 * ARPEGGIO_MS.max) / 1000)
  })

  it('drops empty chords', () => {
    expect(scheduleChords([[], ['C4']], 'chord', 0.12)).toEqual([
      { notes: ['C4'], time: 0, duration: CHORD_HOLD_SEC },
    ])
  })
})
