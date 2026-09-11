import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  RefObject,
} from 'react'
import { useTranslation } from 'react-i18next'

import { NoteCell } from '@/components/canvas/NoteCell'
import { FIFTHS_CHAIN } from '@/lib/music/notes'
import { COLUMNS, MODES, type ModeId, tonicColumnFor } from '@/lib/music/modes'
import { tonicNote } from '@/lib/music/snap'

interface FifthsStripProps {
  snapIndex: number
  tonicModeId: ModeId
  settled: boolean
  trackRef: RefObject<HTMLDivElement | null>
  windowRef: RefObject<HTMLDivElement | null>
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void
  onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void
  onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => void
}

export function FifthsStrip({
  snapIndex,
  tonicModeId,
  settled,
  trackRef,
  windowRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: FifthsStripProps) {
  const { t: tCommon } = useTranslation('common')
  const { t: tMusic } = useTranslation('music')
  const tonicColumn = tonicColumnFor(tonicModeId)
  const tonic = tonicNote(snapIndex, tonicColumn)

  let valueText: string
  if (tonicModeId === 'ionian') {
    valueText = tCommon('strip.valueMajor', { note: tonic.ascii })
  } else if (tonicModeId === 'aeolian') {
    valueText = tCommon('strip.valueMinor', { note: tonic.ascii })
  } else {
    valueText = tCommon('strip.valueMode', {
      note: tonic.ascii,
      mode: tMusic(`modes.${tonicModeId}` as 'modes.dorian'),
    })
  }

  return (
    <div
      ref={windowRef}
      className="mf-strip-window"
      data-testid="fifths-strip"
      data-snap-index={snapIndex}
      data-tonic={tonic.ascii}
      data-tonic-mode={tonicModeId}
      data-settled={settled ? 'true' : 'false'}
      role="slider"
      tabIndex={0}
      aria-label={tCommon('strip.label')}
      aria-valuemin={0}
      aria-valuemax={28}
      aria-valuenow={snapIndex}
      aria-valuetext={valueText}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      <div className="mf-tonic-marker" aria-hidden="true" />
      <div ref={trackRef} className="mf-strip-track">
        {FIFTHS_CHAIN.map((note) => {
          const column = note.index - snapIndex
          const inWindow = column >= 0 && column < COLUMNS
          const modeId = inWindow ? MODES[column]?.id : undefined
          return (
            <NoteCell
              key={note.index}
              note={note}
              inWindow={inWindow}
              modeId={modeId}
            />
          )
        })}
      </div>
    </div>
  )
}
