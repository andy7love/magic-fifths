import { useTranslation } from 'react-i18next'

import { MODES } from '@/lib/music/modes'

interface ModesHeaderProps {
  measureRef?: (element: HTMLElement | null) => void
}

export function ModesHeader({ measureRef }: ModesHeaderProps) {
  const { t } = useTranslation('music')

  return (
    <>
      <div className="mf-label" aria-hidden="true">
        {t('rows.modes')}
      </div>
      {MODES.map((mode, index) => (
        <div
          key={mode.id}
          ref={index === 0 ? measureRef : undefined}
          className="mf-mode-column"
          data-testid="mode-column"
          data-mode={mode.id}
          data-triad={mode.triad}
          data-tetrad={mode.tetrad}
        >
          <span className="mf-mode-label">
            {t(`modes.${mode.id}` as 'modes.ionian')}
          </span>
        </div>
      ))}
    </>
  )
}
