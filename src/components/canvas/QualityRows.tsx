import { useTranslation } from 'react-i18next'

import { TetradCell } from '@/components/canvas/TetradCell'
import { useSettings } from '@/context/settings'
import { MODES } from '@/lib/music/modes'

export function QualityRows() {
  const { t } = useTranslation('music')
  const { advancedChords } = useSettings()

  return (
    <>
      <div className="mf-label mf-quality-row-label" aria-hidden="true">
        {t('rows.triads')}
      </div>
      {MODES.map((mode) => (
        <div
          key={`triad-${mode.id}`}
          className="mf-quality-cell"
          data-row="triads"
          data-mode={mode.id}
        >
          <span>{t(`triads.${mode.triad}` as 'triads.major')}</span>
        </div>
      ))}

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
        />
      ))}
    </>
  )
}
