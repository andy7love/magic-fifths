import { useCallback, useEffect, useMemo, type CSSProperties } from 'react'

import { FifthsStrip } from '@/components/canvas/FifthsStrip'
import { KeyReadout } from '@/components/canvas/KeyReadout'
import { ModesHeader } from '@/components/canvas/ModesHeader'
import { QualityRows } from '@/components/canvas/QualityRows'
import { useColumnWidth } from '@/hooks/use-column-width'
import { useFifthsStrip } from '@/hooks/use-fifths-strip'
import { getAlignmentDeltas } from '@/lib/alignment'
import { CANVAS_MAX_WIDTH, SHARE_PARAM } from '@/lib/config'
import { TONIC_COLUMN } from '@/lib/music/modes'
import {
  DEFAULT_SNAP,
  clampSnap,
  isSnapIndex,
  offsetFor,
} from '@/lib/music/snap'
import { encodeKeyToken, readShareParam } from '@/lib/share'
import { STORAGE_KEYS, readSetting, writeSetting } from '@/lib/storage'

import '@/styles/cardboard.css'

interface MfBridge {
  getSnapIndex: () => number
  setSnapIndex: (index: number) => void
  getGeometry: () => { columnWidth: number; offset: number; snapIndex: number }
  getAlignmentDeltas: () => number[]
}

declare global {
  interface Window {
    __mf__?: MfBridge
  }
}

function resolveInitialSnap(): number {
  const fromUrl = readShareParam(window.location.href)
  if (fromUrl !== null) return fromUrl

  const raw = readSetting(STORAGE_KEYS.snapIndex)
  if (raw !== null) {
    const parsed = Number(raw)
    if (isSnapIndex(parsed)) return parsed
  }

  return DEFAULT_SNAP
}

function replaceShareParam(snapIndex: number) {
  const url = new URL(window.location.href)
  url.searchParams.set(SHARE_PARAM, encodeKeyToken(snapIndex))
  window.history.replaceState(window.history.state, '', url)
}

export function Canvas() {
  const [columnWidth, measureRef] = useColumnWidth()
  const initialIndex = useMemo(() => resolveInitialSnap(), [])

  const onSettle = useCallback((index: number) => {
    writeSetting(STORAGE_KEYS.snapIndex, String(index))
    replaceShareParam(index)
  }, [])

  const {
    snapIndex,
    settled,
    trackRef,
    windowRef,
    goTo,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onKeyDown,
  } = useFifthsStrip({
    columnWidth,
    initialIndex,
    onSettle,
  })

  // Keep URL and storage aligned with the live position, including the initial
  // deep-link case where `?key=` beat a stale localStorage value.
  useEffect(() => {
    writeSetting(STORAGE_KEYS.snapIndex, String(snapIndex))
    replaceShareParam(snapIndex)
  }, [snapIndex])

  useEffect(() => {
    if (!(import.meta.env.DEV || import.meta.env.VITE_E2E)) return

    window.__mf__ = {
      getSnapIndex: () => snapIndex,
      setSnapIndex: (index: number) => goTo(clampSnap(index), { animate: false }),
      getGeometry: () => ({
        columnWidth,
        offset: offsetFor(snapIndex, columnWidth),
        snapIndex,
      }),
      getAlignmentDeltas: () => getAlignmentDeltas(),
    }

    return () => {
      delete window.__mf__
    }
  }, [snapIndex, columnWidth, goTo])

  const style = {
    '--col-w': columnWidth > 0 ? `${columnWidth}px` : undefined,
    '--canvas-max-w': `${CANVAS_MAX_WIDTH}px`,
    '--tonic-column': String(TONIC_COLUMN),
  } as CSSProperties

  return (
    <div className="mf-stage" data-testid="canvas-stage">
      <div className="mf-canvas" style={style} data-testid="canvas">
        <div className="mf-board" aria-hidden="true" />
        <ModesHeader measureRef={measureRef} />
        {/* Empty gutter cell: covers strip bleed under the label column so the
            paper appears to thread through the board, not over the labels. */}
        <div className="mf-label mf-strip-gutter" aria-hidden="true" />
        <div className="mf-channel" aria-hidden="true" />
        <FifthsStrip
          snapIndex={snapIndex}
          settled={settled}
          trackRef={trackRef}
          windowRef={windowRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onKeyDown={onKeyDown}
        />
        <QualityRows />
      </div>
      <KeyReadout snapIndex={snapIndex} />
    </div>
  )
}
