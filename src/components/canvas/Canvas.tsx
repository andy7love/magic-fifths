import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react'

import { FifthsStrip } from '@/components/canvas/FifthsStrip'
import { GradesRow } from '@/components/canvas/GradesRow'
import { KeyReadout } from '@/components/canvas/KeyReadout'
import { ModesHeader } from '@/components/canvas/ModesHeader'
import { QualityRows } from '@/components/canvas/QualityRows'
import { useColumnWidth } from '@/hooks/use-column-width'
import { useFifthsStrip } from '@/hooks/use-fifths-strip'
import { getAlignmentDeltas } from '@/lib/alignment'
import { CANVAS_MAX_WIDTH, SHARE_MODE_PARAM, SHARE_PARAM, TOOLBAR_RAIL_WIDTH } from '@/lib/config'
import {
  DEFAULT_TONIC_MODE,
  isModeId,
  tonicColumnFor,
  type ModeId,
} from '@/lib/music/modes'
import {
  DEFAULT_SNAP,
  clampSnap,
  isSnapIndex,
  offsetFor,
} from '@/lib/music/snap'
import { encodeKeyToken, readSharePosition } from '@/lib/share'
import { STORAGE_KEYS, readSetting, writeSetting } from '@/lib/storage'

import '@/styles/cardboard.css'

interface MfBridge {
  getSnapIndex: () => number
  setSnapIndex: (index: number) => void
  getTonicModeId: () => ModeId
  setTonicModeId: (modeId: ModeId) => void
  getGeometry: () => { columnWidth: number; offset: number; snapIndex: number }
  getAlignmentDeltas: () => number[]
}

declare global {
  interface Window {
    __mf__?: MfBridge
  }
}

function resolveInitialSnap(): number {
  const fromUrl = readSharePosition(window.location.href)
  if (fromUrl !== null) return fromUrl.snapIndex

  const raw = readSetting(STORAGE_KEYS.snapIndex)
  if (raw !== null) {
    const parsed = Number(raw)
    if (isSnapIndex(parsed)) return parsed
  }

  return DEFAULT_SNAP
}

function resolveInitialTonicMode(): ModeId {
  const fromUrl = readSharePosition(window.location.href)
  if (fromUrl !== null) return fromUrl.tonicModeId

  const raw = readSetting(STORAGE_KEYS.tonicMode)
  if (isModeId(raw)) return raw

  return DEFAULT_TONIC_MODE
}

function replaceShareParams(snapIndex: number, tonicModeId: ModeId) {
  const url = new URL(window.location.href)
  url.searchParams.set(SHARE_PARAM, encodeKeyToken(snapIndex, tonicModeId))
  if (tonicModeId === DEFAULT_TONIC_MODE) {
    url.searchParams.delete(SHARE_MODE_PARAM)
  } else {
    url.searchParams.set(SHARE_MODE_PARAM, tonicModeId)
  }
  window.history.replaceState(window.history.state, '', url)
}

export function Canvas() {
  const [columnWidth, measureRef] = useColumnWidth()
  const initialIndex = useMemo(() => resolveInitialSnap(), [])
  const [tonicModeId, setTonicModeId] = useState(resolveInitialTonicMode)
  const tonicColumn = tonicColumnFor(tonicModeId)

  const onSettle = useCallback(
    (index: number) => {
      writeSetting(STORAGE_KEYS.snapIndex, String(index))
      replaceShareParams(index, tonicModeId)
    },
    [tonicModeId],
  )

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
    tonicColumn,
    initialIndex,
    onSettle,
  })

  const selectTonicMode = useCallback((modeId: ModeId) => {
    setTonicModeId(modeId)
    writeSetting(STORAGE_KEYS.tonicMode, modeId)
  }, [])

  // Keep URL and storage aligned with the live position, including the initial
  // deep-link case where `?key=` beat a stale localStorage value.
  useEffect(() => {
    writeSetting(STORAGE_KEYS.snapIndex, String(snapIndex))
    writeSetting(STORAGE_KEYS.tonicMode, tonicModeId)
    replaceShareParams(snapIndex, tonicModeId)
  }, [snapIndex, tonicModeId])

  useEffect(() => {
    if (!(import.meta.env.DEV || import.meta.env.VITE_E2E)) return

    window.__mf__ = {
      getSnapIndex: () => snapIndex,
      setSnapIndex: (index: number) => goTo(clampSnap(index), { animate: false }),
      getTonicModeId: () => tonicModeId,
      setTonicModeId: (modeId: ModeId) => selectTonicMode(modeId),
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
  }, [snapIndex, tonicModeId, columnWidth, goTo, selectTonicMode])

  const stageStyle = {
    '--toolbar-rail-w': `${TOOLBAR_RAIL_WIDTH}px`,
  } as CSSProperties

  const style = {
    '--col-w': columnWidth > 0 ? `${columnWidth}px` : undefined,
    '--canvas-max-w': `${CANVAS_MAX_WIDTH}px`,
    '--tonic-column': String(tonicColumn),
  } as CSSProperties

  return (
    <div className="mf-stage" style={stageStyle} data-testid="canvas-stage">
      <div className="mf-canvas" style={style} data-testid="canvas">
        <div className="mf-board" aria-hidden="true" />
        <ModesHeader
          measureRef={measureRef}
          tonicModeId={tonicModeId}
          onSelectTonicMode={selectTonicMode}
        />
        <GradesRow tonicModeId={tonicModeId} />
        {/* Empty gutter cell: covers strip bleed under the label column so the
            paper appears to thread through the board, not over the labels. */}
        <div className="mf-label mf-strip-gutter" aria-hidden="true" />
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
        <QualityRows />
      </div>
      <KeyReadout snapIndex={snapIndex} tonicModeId={tonicModeId} />
    </div>
  )
}
