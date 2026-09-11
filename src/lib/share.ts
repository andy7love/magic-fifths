import { SHARE_PARAM } from './config'
import { FIFTHS_CHAIN, LETTERS, type AccidentalOffset, type Letter } from './music/notes'
import { snapForTonic, tonicIndex } from './music/snap'

/**
 * Share links address a position by its musical key - the note under Ionian -
 * rather than by a raw snap index. `?key=Eb` is readable, hand-typeable, and
 * stays valid if the chain is ever extended; `?pos=17` is none of those.
 *
 * Tokens are URL-safe by construction. A share link's whole job is surviving
 * copy/paste through chat apps and QR codes, and `#` would be percent-encoded
 * to `%23` or, worse, truncated as a fragment. So sharps are written `s`/`ss`:
 *
 *   ?key=C    ?key=Bb   ?key=Fs   ?key=Css   ?key=Ebb
 *
 * The parser also accepts the displayed spellings (`#`, `##`, `x`) so that
 * hand-typed and hand-edited links work.
 */

const TOKEN_SUFFIX: Record<AccidentalOffset, string> = {
  '-2': 'bb',
  '-1': 'b',
  0: '',
  1: 's',
  2: 'ss',
}

const SUFFIX_TO_OFFSET: Record<string, AccidentalOffset> = {
  '': 0,
  b: -1,
  bb: -2,
  s: 1,
  ss: 2,
  '#': 1,
  '##': 2,
  x: 2,
}

function isLetter(value: string): value is Letter {
  return (LETTERS as readonly string[]).includes(value)
}

/** Canonical, URL-safe token for the tonic of a snap position. */
export function encodeKeyToken(snapIndex: number): string {
  const note = FIFTHS_CHAIN[tonicIndex(snapIndex)]
  if (!note) throw new RangeError(`No tonic for snap index ${snapIndex}`)
  return `${note.letter}${TOKEN_SUFFIX[note.accidental]}`
}

/**
 * Resolves a token to a snap position, or `null` if it names no note in the
 * chain. Returning null rather than a default keeps the caller in charge of the
 * fallback order.
 */
export function parseKeyToken(token: string | null | undefined): number | null {
  if (!token) return null

  const letter = token.slice(0, 1).toUpperCase()
  if (!isLetter(letter)) return null

  const offset = SUFFIX_TO_OFFSET[token.slice(1).toLowerCase()]
  if (offset === undefined) return null

  const note = FIFTHS_CHAIN.find(
    (candidate) => candidate.letter === letter && candidate.accidental === offset,
  )
  if (!note) return null

  // Only the 29 notes reachable as a tonic are addressable; the first and last
  // few chain entries can never sit under Ionian.
  const snapIndex = snapForTonic(note.index)
  return tonicIndex(snapIndex) === note.index ? snapIndex : null
}

/** Absolute URL for the current position, preserving any other query params. */
export function buildShareUrl(snapIndex: number, base: string | URL): string {
  const url = new URL(base)
  url.searchParams.set(SHARE_PARAM, encodeKeyToken(snapIndex))
  url.hash = ''
  return url.toString()
}

/** Reads a snap position out of a URL, or `null` when absent or unparseable. */
export function readShareParam(base: string | URL): number | null {
  try {
    return parseKeyToken(new URL(base).searchParams.get(SHARE_PARAM))
  } catch {
    return null
  }
}
