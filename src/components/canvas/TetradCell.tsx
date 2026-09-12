import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { NaturalSign } from '@/components/canvas/NaturalSign'
import type { Mode } from '@/lib/music/modes'

const NATURAL = '\u266e'

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
