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

/** Color-tone suffix shown only in advanced chord mode. */
export type ChordExtraId = 'nat4' | 'nat6' | 'susb9' | 'sharp11' | 'flat6'

export type ModeId =
  | 'lydian'
  | 'ionian'
  | 'mixolydian'
  | 'dorian'
  | 'aeolian'
  | 'phrygian'
  | 'locrian'

export interface Mode {
  id: ModeId
  /** 0-6, left to right on the face. */
  column: number
  /**
   * Degree of the parent major scale this mode starts on (Ionian = 1).
   * Used to rotate the grades row when a different mode is chosen as tonic.
   */
  degree: number
  triad: TriadQuality
  tetrad: TetradQuality
  /**
   * Extra color tones (11#, 4♮, …) drawn after the tetrad in advanced mode.
   * Mixolydian and Locrian have none: Locrian's b5 is already the tetrad.
   */
  extra?: ChordExtraId
}

export const MODES: readonly Mode[] = [
  { id: 'lydian', column: 0, degree: 4, triad: 'major', tetrad: 'maj7', extra: 'sharp11' },
  { id: 'ionian', column: 1, degree: 1, triad: 'major', tetrad: 'maj7', extra: 'nat4' },
  { id: 'mixolydian', column: 2, degree: 5, triad: 'major', tetrad: 'dom7' },
  { id: 'dorian', column: 3, degree: 2, triad: 'minor', tetrad: 'min7', extra: 'nat6' },
  { id: 'aeolian', column: 4, degree: 6, triad: 'minor', tetrad: 'min7', extra: 'flat6' },
  { id: 'phrygian', column: 5, degree: 3, triad: 'minor', tetrad: 'min7', extra: 'susb9' },
  { id: 'locrian', column: 6, degree: 7, triad: 'diminished', tetrad: 'min7b5' },
]

/** Number of mode columns, and therefore of notes visible in the window. */
export const COLUMNS = MODES.length

/** Default home mode: Ionian, i.e. the major scale. */
export const DEFAULT_TONIC_MODE: ModeId = 'ionian'

/**
 * Ionian's column index. Historically this was *the* tonic column; now the
 * tonic is whichever mode the user picks as grade 1. Keep the name for the
 * many call sites that mean "the major-scale home column".
 */
export const TONIC_COLUMN = 1

const MODE_BY_ID: Record<ModeId, Mode> = Object.fromEntries(
  MODES.map((mode) => [mode.id, mode]),
) as Record<ModeId, Mode>

export function isModeId(value: unknown): value is ModeId {
  return typeof value === 'string' && value in MODE_BY_ID
}

export function modeById(id: ModeId): Mode {
  return MODE_BY_ID[id]
}

/** Column that currently holds grade 1 (the tonic). */
export function tonicColumnFor(tonicModeId: ModeId): number {
  return MODE_BY_ID[tonicModeId].column
}

/**
 * Scale degree of `modeDegree` when `tonicDegree` is treated as 1.
 * Both inputs are 1..7 (major-scale degrees of the mode roots).
 */
export function gradeRelativeTo(modeDegree: number, tonicDegree: number): number {
  return ((modeDegree - tonicDegree + 7) % 7) + 1
}

/** Grade number (1..7) shown under each mode column for the chosen tonic. */
export function gradesForTonic(tonicModeId: ModeId): readonly number[] {
  const tonicDegree = MODE_BY_ID[tonicModeId].degree
  return MODES.map((mode) => gradeRelativeTo(mode.degree, tonicDegree))
}
