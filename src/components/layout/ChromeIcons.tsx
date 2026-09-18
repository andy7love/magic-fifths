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
