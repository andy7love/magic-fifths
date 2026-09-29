import { ARPEGGIO_HOLD_SEC, ARPEGGIO_MS, CHORD_GAP_SEC, CHORD_HOLD_SEC } from '@/lib/config'

/** Blocked chords attack together. An arpeggio staggers the same notes. */
export type PlaybackStyle = 'chord' | 'arpeggio'

export function isPlaybackStyle(value: unknown): value is PlaybackStyle {
  return value === 'chord' || value === 'arpeggio'
}

export interface ScheduledAttack {
  notes: string[]
  /** Seconds after the start of this gesture. */
  time: number
  /** How long the note is held before the sampler releases it. */
  duration: number
}

export function clampArpeggioSeconds(seconds: number): number {
  if (!Number.isFinite(seconds)) return ARPEGGIO_MS.default / 1000
  const ms = Math.min(ARPEGGIO_MS.max, Math.max(ARPEGGIO_MS.min, seconds * 1000))
  return ms / 1000
}

/**
 * Turn one or more chords into sampler attacks.
 * Chord style stacks every note of a chord on the same instant, then leaves a
 * gap before the next chord. Arpeggio style walks every note in order; the
 * speed argument is the gap between those notes and is ignored for chords.
 */
export function scheduleChords(
  chords: readonly (readonly string[])[],
  style: PlaybackStyle,
  arpeggioSeconds: number,
): ScheduledAttack[] {
  const voices = chords
    .map((chord) => chord.filter((note) => note.length > 0))
    .filter((chord) => chord.length > 0)

  if (style === 'chord') {
    const stride = CHORD_HOLD_SEC + CHORD_GAP_SEC
    return voices.map((notes, index) => ({
      notes: [...notes],
      time: index * stride,
      duration: CHORD_HOLD_SEC,
    }))
  }

  const step = clampArpeggioSeconds(arpeggioSeconds)
  const duration = Math.max(ARPEGGIO_HOLD_SEC, step * 2)
  const events: ScheduledAttack[] = []
  let index = 0
  for (const notes of voices) {
    for (const note of notes) {
      events.push({ notes: [note], time: index * step, duration })
      index += 1
    }
  }
  return events
}
