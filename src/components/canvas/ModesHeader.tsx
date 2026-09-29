import { useTranslation } from 'react-i18next'

import { MODES, type ModeId } from '@/lib/music/modes'
import type { VoiceKind } from '@/lib/music/voicing'

interface ModesHeaderProps {
  measureRef?: (element: HTMLElement | null) => void
  tonicModeId: ModeId
  onSelectTonicMode: (modeId: ModeId) => void
  onPlayVoice: (column: number, kind: VoiceKind) => void
}

const MODE_ALIAS: Partial<Record<ModeId, 'major' | 'minor'>> = {
  ionian: 'major',
  aeolian: 'minor',
}

export function ModesHeader({
  measureRef,
  tonicModeId,
  onSelectTonicMode,
  onPlayVoice,
}: ModesHeaderProps) {
  const { t } = useTranslation('music')

  return (
    <>
      <div className="mf-label mf-label-modes" aria-hidden="true">
        <span className="mf-mode-label">{t('rows.modes')}</span>
      </div>
      {MODES.map((mode, index) => {
        const selected = mode.id === tonicModeId
        const alias = MODE_ALIAS[mode.id]
        return (
          <button
            key={mode.id}
            type="button"
            ref={index === 0 ? measureRef : undefined}
            className="mf-mode-column"
            data-testid="mode-column"
            data-mode={mode.id}
            data-triad={mode.triad}
            data-tetrad={mode.tetrad}
            data-tonic-mode={selected ? 'true' : 'false'}
            data-edge={index === MODES.length - 1 ? 'end' : undefined}
            aria-pressed={selected}
            aria-label={
              alias
                ? t('modeSelect.withAlias', {
                    mode: t(`modes.${mode.id}` as 'modes.ionian'),
                    alias: t(`scales.${alias}` as 'scales.major'),
                  })
                : t('modeSelect.label', {
                    mode: t(`modes.${mode.id}` as 'modes.ionian'),
                  })
            }
            onClick={() => {
              onSelectTonicMode(mode.id)
              onPlayVoice(mode.column, 'mode')
            }}
          >
            {alias ? (
              <span className="mf-mode-alias" aria-hidden="true">
                {t(`scales.${alias}` as 'scales.major')}
              </span>
            ) : null}
            <span className="mf-mode-label">
              {t(`modes.${mode.id}` as 'modes.ionian')}
            </span>
          </button>
        )
      })}
    </>
  )
}
