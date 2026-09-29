import { VOICE_ROOT_OCTAVE } from '@/lib/config'
import { COLUMNS, MODES, type ChordExtraId, type Mode } from '@/lib/music/modes'
import { noteAt, spelledMidi, type AccidentalOffset, type ChainNote } from '@/lib/music/notes'

/** What a click on the board asks to hear. */
export type VoiceKind = 'triad' | 'tetrad' | 'mode'

const TRIAD_DEGREES = [0, 2, 4] as const
const TETRAD_DEGREES = [0, 2, 4, 6] as const
const SCALE_DEGREES = [0, 1, 2, 3, 4, 5, 6] as const

/**
 * Color tones printed in advanced mode, as degrees of the mode scale
 * (0 = the note in that column). Phrygian's "sus b9" drops the third.
 */
const EXTRA_DEGREES: Record<ChordExtraId, { add: readonly number[]; omit?: readonly number[] }> = {
  sharp11: { add: [3] },
  nat4: { add: [3] },
  nat6: { add: [5] },
  flat6: { add: [5] },
  susb9: { add: [1, 3], omit: [2] },
}

/**
 * Scientific-pitch spellings for one column of the current window, low to high.
 * The root sits in `VOICE_ROOT_OCTAVE`; each next degree steps up so a chord
 * and an arpeggio share one ascending voicing.
 */
export function spellVoice(
  snapIndex: number,
  column: number,
  kind: VoiceKind,
  advanced: boolean,
): string[] {
  if (column < 0 || column >= COLUMNS) {
    throw new RangeError(`Mode column out of range: ${column}`)
  }

  const windowNotes = Array.from({ length: COLUMNS }, (_, index) => noteAt(snapIndex + index))
  const scale = scaleFrom(windowNotes, noteAt(snapIndex + column))
  return voiceAscending(pick(scale, degreesFor(kind, MODES[column], advanced)))
}

function degreesFor(kind: VoiceKind, mode: Mode | undefined, advanced: boolean): number[] {
  if (kind === 'mode') return [...SCALE_DEGREES]
  if (kind === 'triad') return [...TRIAD_DEGREES]

  const degrees = new Set<number>(TETRAD_DEGREES)
  if (advanced && mode?.extra) {
    const extra = EXTRA_DEGREES[mode.extra]
    for (const degree of extra.omit ?? []) degrees.delete(degree)
    for (const degree of extra.add) degrees.add(degree)
  }
  return [...degrees].sort((a, b) => a - b)
}

/** The seven window notes ordered as a scale starting on `root`. */
function scaleFrom(notes: readonly ChainNote[], root: ChainNote): ChainNote[] {
  const rootPitch = root.semitone
  return [...notes].sort(
    (a, b) =>
      ((a.semitone - rootPitch + 12) % 12) - ((b.semitone - rootPitch + 12) % 12),
  )
}

function pick(scale: readonly ChainNote[], degrees: readonly number[]): ChainNote[] {
  return degrees.map((degree) => {
    const note = scale[degree]
    if (!note) throw new RangeError(`Scale degree out of range: ${degree}`)
    return note
  })
}

function voiceAscending(notes: readonly ChainNote[]): string[] {
  let octave = VOICE_ROOT_OCTAVE
  let previous = -1
  return notes.map((note) => {
    let midi = spelledMidi(note, octave)
    while (previous >= 0 && midi <= previous) {
      octave += 1
      midi = spelledMidi(note, octave)
    }
    previous = midi
    return `${note.letter}${toneAccidental(note.accidental)}${octave}`
  })
}

/** Tone's note type uses `x` for double-sharp, not the strip's `##`. */
function toneAccidental(offset: AccidentalOffset): string {
  switch (offset) {
    case -2:
      return 'bb'
    case -1:
      return 'b'
    case 1:
      return '#'
    case 2:
      return 'x'
    default:
      return ''
  }
}
