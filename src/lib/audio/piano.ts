import * as Tone from 'tone'

import { scheduleChords, type PlaybackStyle, type ScheduledAttack } from '@/lib/audio/schedule'
import { SALAMANDER_URLS, SAMPLE_BASE_URL } from '@/lib/audio/salamander'

export interface PlaybackSnapshot {
  chords: string[][]
  style: PlaybackStyle
  arpeggioSeconds: number
  events: ScheduledAttack[]
}

export interface PlayChordsOptions {
  style: PlaybackStyle
  /** Gap between arpeggio notes, in seconds. Ignored when `style` is `chord`. */
  arpeggioSeconds: number
}

let sampler: Tone.Sampler | null = null
let loaded: Promise<void> | null = null
let generation = 0
let lastPlayback: PlaybackSnapshot | null = null

function piano(): Promise<Tone.Sampler> {
  if (!sampler) {
    sampler = new Tone.Sampler({
      urls: { ...SALAMANDER_URLS },
      release: 1,
      baseUrl: SAMPLE_BASE_URL,
    }).toDestination()
    loaded = Tone.loaded()
  }
  return loaded!.then(() => sampler!)
}

/** What the most recent `playChords` call asked for, including an empty one. */
export function getLastPlayback(): PlaybackSnapshot | null {
  return lastPlayback
}

/**
 * Play one or more chords on the salamander piano.
 * A later call cuts off whatever is still sounding or still scheduled.
 * `Tone.start()` runs synchronously so the click that got here can unlock
 * the audio context before any await.
 */
export function playChords(
  chords: readonly (readonly string[])[],
  options: PlayChordsOptions,
): void {
  const events = scheduleChords(chords, options.style, options.arpeggioSeconds)
  lastPlayback = {
    chords: chords.map((chord) => [...chord]),
    style: options.style,
    arpeggioSeconds: options.arpeggioSeconds,
    events,
  }
  if (events.length === 0) return

  generation += 1
  const token = generation
  sampler?.releaseAll()
  void Tone.start().catch(() => {
    // resume() rejects when the browser still has no user gesture.
  })

  void piano()
    .then((instrument) => {
      if (token !== generation) return
      const origin = Tone.now()
      for (const event of events) {
        instrument.triggerAttackRelease(event.notes, event.duration, origin + event.time)
      }
    })
    .catch(() => {
      // A blocked audio context or a failed sample must not break the board.
    })
}
