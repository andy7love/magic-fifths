import { useEffect, useState } from 'react'

import { DEFAULT_TONIC_MODE, tonicColumnFor } from '@/lib/music/modes'
import { tonicNote } from '@/lib/music/snap'

export interface DebugSnapshot {
  snapIndex: number
  tonic: string
  tonicModeId: string
  columnWidth: number
  offset: number
  deltas: number[]
}

/** Polls `window.__mf__` so the overlay can render without owning canvas state. */
export function useDebugSnapshot(enabled: boolean): DebugSnapshot | null {
  const [snapshot, setSnapshot] = useState<DebugSnapshot | null>(null)

  useEffect(() => {
    if (!enabled) return

    const tick = () => {
      const bridge = window.__mf__
      if (!bridge) return
      const geometry = bridge.getGeometry()
      const tonicModeId = bridge.getTonicModeId?.() ?? DEFAULT_TONIC_MODE
      setSnapshot({
        snapIndex: geometry.snapIndex,
        tonic: tonicNote(geometry.snapIndex, tonicColumnFor(tonicModeId)).ascii,
        tonicModeId,
        columnWidth: geometry.columnWidth,
        offset: geometry.offset,
        deltas: bridge.getAlignmentDeltas(),
      })
    }

    tick()
    const id = window.setInterval(tick, 200)
    return () => window.clearInterval(id)
  }, [enabled])

  return snapshot
}
