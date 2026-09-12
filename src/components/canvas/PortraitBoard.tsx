import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  RefObject,
} from 'react'
import { useTranslation } from 'react-i18next'

import { FifthsStrip } from '@/components/canvas/FifthsStrip'
import { MODES, gradesForTonic, type ModeId } from '@/lib/music/modes'

const MODE_ALIAS: Partial<Record<ModeId, 'major' | 'minor'>> = {
  ionian: 'major',
  aeolian: 'minor',
}

interface PortraitBoardProps {
  measureRef: (element: HTMLElement | null) => void
  tonicModeId: ModeId
  onSelectTonicMode: (modeId: ModeId) => void
  snapIndex: number
  settled: boolean
  trackRef: RefObject<HTMLDivElement | null>
  windowRef: RefObject<HTMLDivElement | null>
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void
  onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void
  onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => void
}

/**
 * The flipped, vertical cardboard for portrait screens.
 *
 * Same tool, transposed: the seven modes are rows, and the paper strip threads
 * down the right-hand column so the strip scrolls under the thumb. Data
 * attributes and testids match the landscape board, so the `__mf__` bridge and
 * the E2E specs read both layouts the same way.
 *
 * The grid is explicit only for the strip and channel (right column, spanning
 * all seven mode rows); every other cell is emitted in row-major order and
 * auto-placed, skipping that occupied column.
 */
export function PortraitBoard({
  measureRef,
  tonicModeId,
  onSelectTonicMode,
  snapIndex,
  settled,
  trackRef,
  windowRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: PortraitBoardProps) {
  const { t } = useTranslation('music')
  const grades = gradesForTonic(tonicModeId)

  return (
    <>
      <div className="mf-phead" aria-hidden="true">
        {t('rows.modes')}
      </div>
      <div className="mf-phead" aria-hidden="true">
        {t('rows.grades')}
      </div>
      <div className="mf-phead" aria-hidden="true">
        {t('rows.triads')}
      </div>
      <div className="mf-phead" aria-hidden="true">
        {t('rows.tetrads')}
      </div>
      <div className="mf-phead" aria-hidden="true" />

      {MODES.map((mode, index) => {
        const selected = mode.id === tonicModeId
        const alias = MODE_ALIAS[mode.id]
        const grade = grades[index]
        return (
          <div key={mode.id} className="contents">
            <button
              type="button"
              ref={index === 0 ? measureRef : undefined}
              className="mf-mode-column"
              data-testid="mode-column"
              data-mode={mode.id}
              data-triad={mode.triad}
              data-tetrad={mode.tetrad}
              data-tonic-mode={selected ? 'true' : 'false'}
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
              onClick={() => onSelectTonicMode(mode.id)}
            >
              <span className="mf-mode-label">
                {t(`modes.${mode.id}` as 'modes.ionian')}
              </span>
              {alias ? (
                <span className="mf-mode-alias" aria-hidden="true">
                  {t(`scales.${alias}` as 'scales.major')}
                </span>
              ) : null}
            </button>
            <div
              className="mf-pcell"
              data-row="grades"
              data-testid="grade-cell"
              data-grade={grade}
              data-tonic-grade={grade === 1 ? 'true' : 'false'}
            >
              <span>{grade}</span>
            </div>
            <div className="mf-pcell" data-row="triads" data-mode={mode.id}>
              <span>{t(`triads.${mode.triad}` as 'triads.major')}</span>
            </div>
            <div className="mf-pcell" data-row="tetrads" data-mode={mode.id}>
              <span>{t(`tetrads.${mode.tetrad}` as 'tetrads.maj7')}</span>
            </div>
          </div>
        )
      })}

      <div className="mf-channel" aria-hidden="true" />
      <FifthsStrip
        snapIndex={snapIndex}
        tonicModeId={tonicModeId}
        settled={settled}
        trackRef={trackRef}
        windowRef={windowRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={onKeyDown}
      />
    </>
  )
}
