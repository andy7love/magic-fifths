import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  RefObject,
} from 'react'
import { useTranslation } from 'react-i18next'

import { NoteCell } from '@/components/canvas/NoteCell'
import { FIFTHS_CHAIN } from '@/lib/music/notes'
import { COLUMNS, MODES } from '@/lib/music/modes'
import { tonicNote } from '@/lib/music/snap'

interface FifthsStripProps {
  snapIndex: number
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
  settled,
  trackRef,
  windowRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: FifthsStripProps) {
  const { t } = useTranslation('common')
  const tonic = tonicNote(snapIndex)

  return (
    <div
      ref={windowRef}
      className="mf-strip-window"
      data-testid="fifths-strip"
      data-snap-index={snapIndex}
      data-tonic={tonic.ascii}
      data-settled={settled ? 'true' : 'false'}
      role="slider"
      tabIndex={0}
      aria-label={t('strip.label')}
      aria-valuemin={0}
      aria-valuemax={28}
      aria-valuenow={snapIndex}
      aria-valuetext={t('strip.value', { note: tonic.ascii })}
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
