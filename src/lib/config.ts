/**
 * Every tunable in the app lives here. The gesture constants in particular are
 * meant to be adjusted without touching the engine in `useFifthsStrip`.
 */

/** App version from package.json, injected at build time by Vite. */
export const APP_VERSION = __APP_VERSION__

/**
 * Legacy min-width from the old rotate-to-landscape overlay. The board now
 * flips on `(orientation: portrait)` instead; this stays so existing env
 * overrides and docs do not break.
 */
export const MIN_LANDSCAPE_WIDTH = Number(
  import.meta.env.VITE_MIN_LANDSCAPE_WIDTH ?? 468,
)

/** Hard cap on the cardboard canvas so columns stay slim like the physical tool. */
export const CANVAS_MAX_WIDTH = 600

/**
 * Width of the collapsed toolbar icon column (`Button size="icon"` = 36px plus
 * the 1px right border). Stage left padding is this plus the same 0.5rem used
 * on the right, so the gap from buttons → board matches board → screen edge.
 */
export const TOOLBAR_RAIL_WIDTH = 37

/**
 * The persistent sidebar rail needs both width and height: a phone in landscape
 * (844x390) is wide enough but far too short, and there the canvas should own
 * the horizontal space instead.
 */
export const SIDEBAR_PERSISTENT_QUERY = '(min-width: 1024px) and (min-height: 600px)'

/** How far ahead of the finger to project momentum when picking a snap target. */
export const RELEASE_PROJECTION_MS = 180

/** px/ms. Above this a flick always advances at least one column. */
export const MIN_FLICK_VELOCITY = 0.35

/** Resistance applied past either end of the chain, for a physical feel. */
export const RUBBER_BAND_FACTOR = 0.4

/** Snap animation duration scales with distance, clamped to this range. */
export const SNAP_DURATION_MS = { min: 180, max: 420 } as const

/** Window over which pointer velocity is averaged. Raw deltas are too jittery. */
export const VELOCITY_SAMPLE_MS = 80

/**
 * Left-screen-edge zone that opens the sidebar on a rightward swipe.
 * Shared with the strip engine: a drag that begins here must not scroll the
 * paper, and a drag that begins further in must not open the sidebar.
 */
export const SIDEBAR_EDGE_SWIPE_PX = 36

/** Query-string parameter carrying the shared position, as a musical key. */
export const SHARE_PARAM = 'key'

/**
 * Optional query-string parameter for which mode column is grade 1 (the tonic).
 * Omitted from URLs when the home mode is Ionian, so classic `?key=C` links stay
 * short and mean C major.
 */
export const SHARE_MODE_PARAM = 'mode'

/** Octave the lowest note of a played chord or scale is voiced in. */
export const VOICE_ROOT_OCTAVE = 4

/** How long a blocked chord rings, and the silence before the next one. */
export const CHORD_HOLD_SEC = 1.5
export const CHORD_GAP_SEC = 0.25

/** Each arpeggio note rings at least this long, so the piano overlaps. */
export const ARPEGGIO_HOLD_SEC = 1.1

/** Gap between arpeggio notes, in milliseconds. Right on the slider is faster. */
export const ARPEGGIO_MS = { min: 40, max: 420, default: 120, step: 10 } as const
