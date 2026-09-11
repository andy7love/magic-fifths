import { useTranslation } from 'react-i18next'

import { MODES } from '@/lib/music/modes'

export function QualityRows() {
  const { t } = useTranslation('music')

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

      <div className="mf-label mf-quality-row-label" aria-hidden="true">
        {t('rows.tetrads')}
      </div>
      {MODES.map((mode) => (
        <div
          key={`tetrad-${mode.id}`}
          className="mf-quality-cell"
          data-row="tetrads"
          data-mode={mode.id}
        >
          <span>{t(`tetrads.${mode.tetrad}` as 'tetrads.maj7')}</span>
        </div>
      ))}
    </>
  )
}
