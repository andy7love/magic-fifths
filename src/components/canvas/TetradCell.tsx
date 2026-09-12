import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import type { Mode } from '@/lib/music/modes'

const NATURAL = '\u266e'

/** Drawn, not a font glyph: Inter's ♮ stays upright and reads as "h"/"b" on edge. */
function NaturalSign() {
  return (
    <span className="mf-natural">
      <span className="sr-only">{NATURAL}</span>
      <svg viewBox="0 0 14 24" aria-hidden="true">
        <path
          d="M3.2.6 V23.4 M10.8.6 V23.4 M3.2 8.6 L10.8 5.4 M3.2 18.8 L10.8 15.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="square"
        />
      </svg>
    </span>
  )
}

function withNaturals(text: string) {
  return text.split(NATURAL).map((part, index, parts) => (
    <Fragment key={index}>
      {part}
      {index < parts.length - 1 ? <NaturalSign /> : null}
    </Fragment>
  ))
}

interface TetradCellProps {
  mode: Mode
  advanced: boolean
  className: string
}

/**
 * One tetrad / full-chord cell. Default mode is the 3rd–5th–7th quality;
 * advanced mode appends the color tones in a lighter face, with a space
 * between the two pieces as on the teacher's chart.
 */
export function TetradCell({ mode, advanced, className }: TetradCellProps) {
  const { t } = useTranslation('music')
  const base = t(`tetrads.${mode.tetrad}` as 'tetrads.maj7')
  const extra =
    advanced && mode.extra
      ? t(`chordExtras.${mode.extra}` as 'chordExtras.nat4')
      : null

  return (
    <div
      className={className}
      data-row="tetrads"
      data-testid="tetrad-cell"
      data-mode={mode.id}
      data-advanced={advanced ? 'true' : 'false'}
    >
      <span className="mf-chord">
        <span className="mf-chord-base">{base}</span>
        {extra ? (
          <>
            {' '}
            <span className="mf-chord-extra">{withNaturals(extra)}</span>
          </>
        ) : null}
      </span>
    </div>
  )
}
