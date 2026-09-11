import { useEffect, useState } from 'react'

import { tonicNote } from '@/lib/music/snap'

export interface DebugSnapshot {
  snapIndex: number
  tonic: string
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
      setSnapshot({
        snapIndex: geometry.snapIndex,
        tonic: tonicNote(geometry.snapIndex).ascii,
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
