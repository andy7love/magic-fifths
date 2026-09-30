import { Music2 } from 'lucide-react'

interface NoteCountIconProps {
  count: 3 | 4
  className?: string
}

/** Compact "N + note" glyph for the triad / tetrad visibility toggles. */
export function NoteCountIcon({ count, className }: NoteCountIconProps) {
  return (
    <span
      className={
        className ??
        'inline-flex size-4 shrink-0 items-center justify-center gap-px text-[0.65rem] font-bold leading-none'
      }
      aria-hidden="true"
    >
      <span>{count}</span>
      <Music2 className="size-3" />
    </span>
  )
}

/** Degree-row toggle glyph: a 1 with the degree symbol. */
export function DegreeIcon({ className }: { className?: string }) {
  return (
    <span
      className={
        className ??
        'inline-flex size-4 shrink-0 items-center justify-center text-[0.7rem] font-bold leading-none'
      }
      aria-hidden="true"
    >
      1º
    </span>
  )
}

/** Letter-notation toggle glyph. */
export function LetterNotationIcon({ className }: { className?: string }) {
  return (
    <span
      className={
        className ??
        'inline-flex size-4 shrink-0 items-center justify-center text-[0.75rem] font-bold leading-none'
      }
      aria-hidden="true"
    >
      A
    </span>
  )
}

/** Grade-name toggle glyph. */
export function GradeNameIcon({ className }: { className?: string }) {
  return (
    <span
      className={
        className ??
        'inline-flex size-4 shrink-0 items-center justify-center text-[0.7rem] font-bold leading-none'
      }
      aria-hidden="true"
    >
      T
    </span>
  )
}

/** Enharmonic-field glyph: mathematical equivalence. */
export function EnharmonicIcon({ className }: { className?: string }) {
  return (
    <span
      className={
        className ??
        'inline-flex size-4 shrink-0 items-center justify-center text-sm font-semibold leading-none'
      }
      aria-hidden="true"
    >
      ≍
    </span>
  )
}

/** Warm tint used while a double accidental is sitting in the field. */
export const enharmonicSuggestClass =
  'bg-amber-500/20 text-amber-950 hover:bg-amber-500/30 dark:bg-amber-400/20 dark:text-amber-50 dark:hover:bg-amber-400/30'

/** Icon plus a floating notification dot when the enharmonic jump is worth taking. */
export function EnharmonicMark({ suggest }: { suggest: boolean }) {
  return (
    <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
      <EnharmonicIcon />
      {suggest ? (
        <span
          className="pointer-events-none absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-red-500"
          aria-hidden="true"
        />
      ) : null}
    </span>
  )
}
