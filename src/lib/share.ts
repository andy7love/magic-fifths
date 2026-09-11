import { SHARE_MODE_PARAM, SHARE_PARAM } from './config'
import { FIFTHS_CHAIN, LETTERS, type AccidentalOffset, type Letter } from './music/notes'
import {
  DEFAULT_TONIC_MODE,
  isModeId,
  tonicColumnFor,
  type ModeId,
} from './music/modes'
import { snapForTonic, tonicIndex } from './music/snap'

/**
 * Share links address a position by its musical key — the note under grade 1 —
 * rather than by a raw snap index. `?key=Eb` is readable, hand-typeable, and
 * stays valid if the chain is ever extended; `?pos=17` is none of those.
 *
 * When a mode other than Ionian is the tonic, the URL also carries
 * `?mode=<id>` so the recipient lands on the same grade-1 column.
 *
 * Tokens are URL-safe by construction. A share link's whole job is surviving
 * copy/paste through chat apps and QR codes, and `#` would be percent-encoded
 * to `%23` or, worse, truncated as a fragment. So sharps are written `s`/`ss`:
 *
 *   ?key=C    ?key=Bb   ?key=Fs   ?key=Css   ?key=Ebb
 *   ?key=D&mode=dorian
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

export interface SharePosition {
  snapIndex: number
  tonicModeId: ModeId
}

function isLetter(value: string): value is Letter {
  return (LETTERS as readonly string[]).includes(value)
}

/** Canonical, URL-safe token for the tonic of a snap position. */
export function encodeKeyToken(
  snapIndex: number,
  tonicModeId: ModeId = DEFAULT_TONIC_MODE,
): string {
  const tonicColumn = tonicColumnFor(tonicModeId)
  const note = FIFTHS_CHAIN[tonicIndex(snapIndex, tonicColumn)]
  if (!note) throw new RangeError(`No tonic for snap index ${snapIndex}`)
  return `${note.letter}${TOKEN_SUFFIX[note.accidental]}`
}

/**
 * Resolves a token to a snap position for a given tonic column, or `null` if
 * it names no note that can sit under that column.
 */
export function parseKeyToken(
  token: string | null | undefined,
  tonicModeId: ModeId = DEFAULT_TONIC_MODE,
): number | null {
  if (!token) return null

  const letter = token.slice(0, 1).toUpperCase()
  if (!isLetter(letter)) return null

  const offset = SUFFIX_TO_OFFSET[token.slice(1).toLowerCase()]
  if (offset === undefined) return null

  const note = FIFTHS_CHAIN.find(
    (candidate) => candidate.letter === letter && candidate.accidental === offset,
  )
  if (!note) return null

  const tonicColumn = tonicColumnFor(tonicModeId)
  const snapIndex = snapForTonic(note.index, tonicColumn)
  return tonicIndex(snapIndex, tonicColumn) === note.index ? snapIndex : null
}

/** Absolute URL for the current position, preserving any other query params. */
export function buildShareUrl(
  snapIndex: number,
  base: string | URL,
  tonicModeId: ModeId = DEFAULT_TONIC_MODE,
): string {
  const url = new URL(base)
  url.searchParams.set(SHARE_PARAM, encodeKeyToken(snapIndex, tonicModeId))
  if (tonicModeId === DEFAULT_TONIC_MODE) {
    url.searchParams.delete(SHARE_MODE_PARAM)
  } else {
    url.searchParams.set(SHARE_MODE_PARAM, tonicModeId)
  }
  url.hash = ''
  return url.toString()
}

function readModeParam(base: string | URL): ModeId {
  try {
    const raw = new URL(base).searchParams.get(SHARE_MODE_PARAM)
    return isModeId(raw) ? raw : DEFAULT_TONIC_MODE
  } catch {
    return DEFAULT_TONIC_MODE
  }
}

/** Reads snap + tonic mode out of a URL, or `null` when the key is absent/bad. */
export function readSharePosition(base: string | URL): SharePosition | null {
  try {
    const url = new URL(base)
    const tonicModeId = readModeParam(url)
    const snapIndex = parseKeyToken(url.searchParams.get(SHARE_PARAM), tonicModeId)
    if (snapIndex === null) return null
    return { snapIndex, tonicModeId }
  } catch {
    return null
  }
}

/** @deprecated Prefer `readSharePosition`. Kept for call sites that only need snap. */
export function readShareParam(base: string | URL): number | null {
  return readSharePosition(base)?.snapIndex ?? null
}
