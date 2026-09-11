/**
 * The movable paper strip is a single straight line through the circle of
 * fifths, not five separate strips glued together.
 *
 * Five blocks of the base cycle `F C G D A E B`, 35 notes total:
 *
 *   0..6   Fbb Cbb Gbb Dbb Abb Ebb Bbb
 *   7..13  Fb  Cb  Gb  Db  Ab  Eb  Bb
 *  14..20  F   C   G   D   A   E   B     <- natural block, default rest
 *  21..27  F#  C#  G#  D#  A#  E#  B#
 *  28..34  F## C## G## D## A## E## B##
 *
 * Continuity holds across the block seams (`Bb -> F`, `B -> F#`), which is what
 * makes it one chain: every adjacent pair is a perfect fifth apart.
 */

export const LETTERS = ['F', 'C', 'G', 'D', 'A', 'E', 'B'] as const
export type Letter = (typeof LETTERS)[number]

/** How many semitones the accidental shifts the natural letter. */
export type AccidentalOffset = -2 | -1 | 0 | 1 | 2

export const BLOCK_OFFSETS: readonly AccidentalOffset[] = [-2, -1, 0, 1, 2]

export const CHAIN_LENGTH = BLOCK_OFFSETS.length * LETTERS.length

/** Semitone of each natural letter, used only to verify fifth continuity. */
const NATURAL_SEMITONE: Record<Letter, number> = {
  F: 5,
  C: 0,
  G: 7,
  D: 2,
  A: 9,
  E: 4,
  B: 11,
}

const SOLFEGE: Record<Letter, string> = {
  F: 'fa',
  C: 'do',
  G: 'sol',
  D: 're',
  A: 'la',
  E: 'mi',
  B: 'si',
}

/** ASCII spelling, used for `data-*` attributes and test assertions. */
const ASCII_ACCIDENTAL: Record<AccidentalOffset, string> = {
  '-2': 'bb',
  '-1': 'b',
  0: '',
  1: '#',
  2: '##',
}

/**
 * What the cardboard actually shows. Double-sharp is drawn as `x`, matching both
 * the physical tool in the reference photo and common jazz lead-sheet practice.
 */
const GLYPH_ACCIDENTAL: Record<AccidentalOffset, string> = {
  '-2': '\u266d\u266d',
  '-1': '\u266d',
  0: '',
  1: '\u266f',
  2: 'x',
}

export interface ChainNote {
  /** Position in the 35-note chain. */
  index: number
  letter: Letter
  accidental: AccidentalOffset
  /** `F`, `Bb`, `C##` */
  ascii: string
  /** Accidental glyph on its own, for the middle row of the strip cell. */
  glyph: string
  /** i18n key into the `music` namespace, e.g. `solfege.fa`. */
  solfegeKey: string
  /** Pitch class 0-11. Exposed so tests can verify the fifths continuity. */
  semitone: number
}

export function buildFifthsChain(): ChainNote[] {
  return BLOCK_OFFSETS.flatMap((accidental, block) =>
    LETTERS.map((letter, position) => ({
      index: block * LETTERS.length + position,
      letter,
      accidental,
      ascii: `${letter}${ASCII_ACCIDENTAL[accidental]}`,
      glyph: GLYPH_ACCIDENTAL[accidental],
      solfegeKey: `solfege.${SOLFEGE[letter]}`,
      semitone: (((NATURAL_SEMITONE[letter] + accidental) % 12) + 12) % 12,
    })),
  )
}

/** The chain is immutable, so build it once at module load. */
export const FIFTHS_CHAIN: readonly ChainNote[] = buildFifthsChain()

export function noteAt(index: number): ChainNote {
  const note = FIFTHS_CHAIN[index]
  if (!note) throw new RangeError(`Chain index out of range: ${index}`)
  return note
}
