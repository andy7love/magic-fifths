import * as Tone from 'tone'
import { describe, expect, it } from 'vitest'

import { SALAMANDER_URLS } from '@/lib/audio/salamander'
import { DEFAULT_SNAP, MAX_SNAP } from '@/lib/music/snap'

import { spellVoice, type VoiceKind } from './voicing'

describe('salamander samples', () => {
  it('names every recording with a pitch Tone can repitch', () => {
    for (const note of Object.keys(SALAMANDER_URLS)) {
      expect(Tone.Frequency(note).toMidi()).toBeGreaterThan(0)
    }
  })
})

describe('spellVoice', () => {
  it('spells the C major window from each column', () => {
    expect(spellVoice(DEFAULT_SNAP, 1, 'triad', false)).toEqual(['C4', 'E4', 'G4'])
    expect(spellVoice(DEFAULT_SNAP, 1, 'tetrad', false)).toEqual(['C4', 'E4', 'G4', 'B4'])
    expect(spellVoice(DEFAULT_SNAP, 1, 'mode', false)).toEqual([
      'C4',
      'D4',
      'E4',
      'F4',
      'G4',
      'A4',
      'B4',
    ])
    expect(spellVoice(DEFAULT_SNAP, 0, 'triad', false)).toEqual(['F4', 'A4', 'C5'])
    expect(spellVoice(DEFAULT_SNAP, 4, 'triad', false)).toEqual(['A4', 'C5', 'E5'])
    expect(spellVoice(DEFAULT_SNAP, 6, 'triad', false)).toEqual(['B4', 'D5', 'F5'])
  })

  it('adds the printed color tone when advanced chords are on', () => {
    expect(spellVoice(DEFAULT_SNAP, 0, 'tetrad', true)).toEqual(['F4', 'A4', 'B4', 'C5', 'E5'])
    expect(spellVoice(DEFAULT_SNAP, 5, 'tetrad', false)).toEqual(['E4', 'G4', 'B4', 'D5'])
    expect(spellVoice(DEFAULT_SNAP, 5, 'tetrad', true)).toEqual(['E4', 'F4', 'A4', 'B4', 'D5'])
    expect(spellVoice(DEFAULT_SNAP, 1, 'triad', true)).toEqual(['C4', 'E4', 'G4'])
  })

  it('spells double sharps and double flats the way Tone expects', () => {
    expect(spellVoice(MAX_SNAP, 1, 'triad', false)).toEqual(['Cx4', 'Ex4', 'Gx4'])
    expect(spellVoice(0, 0, 'triad', false)).toEqual(['Fbb4', 'Abb4', 'Cbb5'])
  })

  it('only produces ascending pitches Tone can schedule', () => {
    const kinds: VoiceKind[] = ['triad', 'tetrad', 'mode']
    for (const snapIndex of [0, DEFAULT_SNAP, MAX_SNAP]) {
      for (let column = 0; column < 7; column += 1) {
        for (const kind of kinds) {
          const notes = spellVoice(snapIndex, column, kind, true)
          const midis = notes.map((note) => Tone.Frequency(note).toMidi())
          expect(midis.length).toBeGreaterThan(2)
          for (let index = 1; index < midis.length; index += 1) {
            expect(midis[index]).toBeGreaterThan(midis[index - 1]!)
          }
        }
      }
    }
  })
})
