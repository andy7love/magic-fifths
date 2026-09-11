/**
 * The seven columns printed on the cardboard face.
 *
 * The order is not the usual scale-degree order: it follows the circle of
 * fifths, because that is what lets one straight strip line up all seven modes
 * of a single major scale at once. With `F C G D A E B` in the window, every
 * column is a mode of C major, and C sits under Ionian.
 */

export type TriadQuality = 'major' | 'minor' | 'diminished'
export type TetradQuality = 'maj7' | 'dom7' | 'min7' | 'min7b5'

export interface Mode {
  id: string
  /** 0-6, left to right on the face. */
  column: number
  /** Degree of the major scale this mode starts on. */
  degree: number
  triad: TriadQuality
  tetrad: TetradQuality
}

export const MODES: readonly Mode[] = [
  { id: 'lydian', column: 0, degree: 4, triad: 'major', tetrad: 'maj7' },
  { id: 'ionian', column: 1, degree: 1, triad: 'major', tetrad: 'maj7' },
  { id: 'mixolydian', column: 2, degree: 5, triad: 'major', tetrad: 'dom7' },
  { id: 'dorian', column: 3, degree: 2, triad: 'minor', tetrad: 'min7' },
  { id: 'aeolian', column: 4, degree: 6, triad: 'minor', tetrad: 'min7' },
  { id: 'phrygian', column: 5, degree: 3, triad: 'minor', tetrad: 'min7' },
  { id: 'locrian', column: 6, degree: 7, triad: 'diminished', tetrad: 'min7b5' },
]

/** Number of mode columns, and therefore of notes visible in the window. */
export const COLUMNS = MODES.length

/**
 * The Ionian column holds the tonic of the current major scale. This is the
 * app's load-bearing invariant: `tonic = snapIndex + TONIC_COLUMN`.
 */
export const TONIC_COLUMN = 1
