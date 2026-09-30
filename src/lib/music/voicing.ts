import { VOICE_CENTER_MIDI, VOICE_ROOT_OCTAVE } from '@/lib/config'
import { COLUMNS, MODES, type ChordExtraId, type Mode } from '@/lib/music/modes'
import { noteAt, spelledMidi, type AccidentalOffset, type ChainNote } from '@/lib/music/notes'

/** What a click on the board asks to hear. */
export type VoiceKind = 'triad' | 'tetrad' | 'mode'

const TRIAD_DEGREES = [0, 2, 4] as const
const TETRAD_DEGREES = [0, 2, 4, 6] as const
const SCALE_DEGREES = [0, 1, 2, 3, 4, 5, 6] as const

/**
 * Color tones printed in advanced mode, as degrees of the mode scale
 * (0 = the note in that column). They are tensions (9, 11, 13), not chord
 * tones folded into the octave. Phrygian's "sus b9" drops the third.
 */
const EXTRA_DEGREES: Record<ChordExtraId, { add: readonly number[]; omit?: readonly number[] }> = {
  sharp11: { add: [3] },
  nat4: { add: [3] },
  nat6: { add: [5] },
  flat6: { add: [5] },
  susb9: { add: [1, 3], omit: [2] },
}

interface VoicedDegree {
  degree: number
  /** 9ths, 11ths and 13ths: one octave above the scale degree, never a 2nd/4th/6th. */
  tension: boolean
}

/**
 * Scientific-pitch spellings for one column of the current window, low to high.
 * The root's octave is the one that centers the voicing; every later note sits
 * strictly above it, in root position. A #11 is an eleventh, not a fourth.
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

  const root = noteAt(snapIndex + column)
  const windowNotes = Array.from({ length: COLUMNS }, (_, index) => noteAt(snapIndex + index))
  const scale = scaleFrom(windowNotes, root)
  return voiceAscending(root, scale, degreesFor(kind, MODES[column], advanced))
}

function degreesFor(kind: VoiceKind, mode: Mode | undefined, advanced: boolean): VoicedDegree[] {
  if (kind === 'mode') return SCALE_DEGREES.map((degree) => ({ degree, tension: false }))
  if (kind === 'triad') return TRIAD_DEGREES.map((degree) => ({ degree, tension: false }))

  const chord = new Set<number>(TETRAD_DEGREES)
  const tensions: number[] = []
  if (advanced && mode?.extra) {
    const extra = EXTRA_DEGREES[mode.extra]
    for (const degree of extra.omit ?? []) chord.delete(degree)
    tensions.push(...extra.add)
  }

  return [
    ...[...chord].sort((a, b) => a - b).map((degree) => ({ degree, tension: false })),
    ...tensions.sort((a, b) => a - b).map((degree) => ({ degree, tension: true })),
  ]
}

/** The seven window notes ordered as a scale starting on `root`. */
function scaleFrom(notes: readonly ChainNote[], root: ChainNote): ChainNote[] {
  const rootPitch = root.semitone
  return [...notes].sort(
    (a, b) =>
      ((a.semitone - rootPitch + 12) % 12) - ((b.semitone - rootPitch + 12) % 12),
  )
}

/** Semitones above the root. Tensions sit an octave higher than the scale degree. */
function intervalAbove(root: ChainNote, note: ChainNote, tension: boolean): number {
  const within = (note.semitone - root.semitone + 12) % 12
  return tension ? within + 12 : within
}

function voiceAscending(
  root: ChainNote,
  scale: readonly ChainNote[],
  degrees: readonly VoicedDegree[],
): string[] {
  const placed = degrees.map((entry) => {
    const note = scale[entry.degree]
    if (!note) throw new RangeError(`Scale degree out of range: ${entry.degree}`)
    return { note, interval: intervalAbove(root, note, entry.tension) }
  })
  placed.sort((a, b) => a.interval - b.interval)

  const span = placed[placed.length - 1]?.interval ?? 0
  const rootMidi = spelledMidi(root, rootOctaveFor(root, span))
  return placed.map((item) => spellAt(item.note, rootMidi + item.interval))
}

/** Octave whose voicing midpoint sits nearest the middle of the piano. */
function rootOctaveFor(root: ChainNote, span: number): number {
  let bestOctave = VOICE_ROOT_OCTAVE
  let bestDistance = Number.POSITIVE_INFINITY
  for (let octave = 2; octave <= 5; octave += 1) {
    const midpoint = spelledMidi(root, octave) + span / 2
    const distance = Math.abs(midpoint - VOICE_CENTER_MIDI)
    const closerToHome =
      Math.abs(octave - VOICE_ROOT_OCTAVE) < Math.abs(bestOctave - VOICE_ROOT_OCTAVE)
    if (distance < bestDistance || (distance === bestDistance && closerToHome)) {
      bestDistance = distance
      bestOctave = octave
    }
  }
  return bestOctave
}

function spellAt(note: ChainNote, targetMidi: number): string {
  let octave = 1
  let midi = spelledMidi(note, octave)
  while (midi < targetMidi && octave < 8) {
    octave += 1
    midi = spelledMidi(note, octave)
  }
  return `${note.letter}${toneAccidental(note.accidental)}${octave}`
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
