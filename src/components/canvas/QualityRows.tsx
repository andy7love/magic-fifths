import { useTranslation } from 'react-i18next'

import { TetradCell } from '@/components/canvas/TetradCell'
import { useSettings } from '@/context/settings'
import { MODES } from '@/lib/music/modes'
import type { VoiceKind } from '@/lib/music/voicing'

interface QualityRowsProps {
  onPlayVoice: (column: number, kind: VoiceKind) => void
}

export function QualityRows({ onPlayVoice }: QualityRowsProps) {
  const { t } = useTranslation('music')
  const { advancedChords, showTriads, showTetrads } = useSettings()

  return (
    <>
      {showTriads ? (
        <>
          <div className="mf-label mf-quality-row-label" aria-hidden="true">
            {t('rows.triads')}
          </div>
          {MODES.map((mode) => (
            <button
              key={`triad-${mode.id}`}
              type="button"
              className="mf-quality-cell"
              data-row="triads"
              data-testid="triad-cell"
              data-mode={mode.id}
              aria-label={t('play.triad', {
                mode: t(`modes.${mode.id}` as 'modes.ionian'),
              })}
              onClick={() => onPlayVoice(mode.column, 'triad')}
            >
              <span>{t(`triads.${mode.triad}` as 'triads.major')}</span>
            </button>
          ))}
        </>
      ) : null}

      {showTetrads ? (
        <>
          <div
            className="mf-label mf-quality-row-label"
            data-row="tetrads"
            aria-hidden="true"
          >
            {advancedChords ? null : t('rows.tetrads')}
          </div>
          {MODES.map((mode) => (
            <TetradCell
              key={`tetrad-${mode.id}`}
              mode={mode}
              advanced={advancedChords}
              className="mf-quality-cell"
              label={t('play.tetrad', {
                mode: t(`modes.${mode.id}` as 'modes.ionian'),
              })}
              onPlay={() => onPlayVoice(mode.column, 'tetrad')}
            />
          ))}
        </>
      ) : null}
    </>
  )
}
