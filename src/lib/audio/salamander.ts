/**
 * Salamander Grand Piano, the sample set Tone.js uses in its Sampler
 * walkthrough (https://tonejs.github.io/audio/salamander/).
 *
 * Alexander Holm, CC BY 3.0. A minor-third grid is enough: Sampler repitches
 * the nearest recording to fill the gaps. The files live under `public/` so
 * the offline app never fetches them from the network.
 *
 * Keys are scientific pitch; values are the filenames Tone's demo uses
 * (`Ds` / `Fs` for D# / F#).
 */
export const SALAMANDER_URLS = {
  C3: 'C3.mp3',
  'D#3': 'Ds3.mp3',
  'F#3': 'Fs3.mp3',
  A3: 'A3.mp3',
  C4: 'C4.mp3',
  'D#4': 'Ds4.mp3',
  'F#4': 'Fs4.mp3',
  A4: 'A4.mp3',
  C5: 'C5.mp3',
  'D#5': 'Ds5.mp3',
  'F#5': 'Fs5.mp3',
  A5: 'A5.mp3',
  C6: 'C6.mp3',
} as const

const base = import.meta.env.BASE_URL || '/'

/** Trailing slash required: Sampler prepends this to every filename. */
export const SAMPLE_BASE_URL = `${base.endsWith('/') ? base : `${base}/`}audio/salamander/`
