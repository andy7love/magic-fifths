import { useDebugSnapshot } from '@/hooks/use-debug-snapshot'

/**
 * Dev / E2E overlay. Enable with `?debug=1`.
 * A single screenshot of this panel proves or disproves column alignment.
 */
export function DebugOverlay() {
  const enabled =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('debug')

  const snapshot = useDebugSnapshot(enabled)
  if (!enabled || !snapshot) return null

  return (
    <aside
      className="pointer-events-none fixed right-2 bottom-2 z-50 rounded-md border bg-background/90 p-3 font-mono text-xs shadow-lg backdrop-blur"
      data-testid="debug-overlay"
    >
      <div>snap={snapshot.snapIndex}</div>
      <div>tonic={snapshot.tonic}</div>
      <div>mode={snapshot.tonicModeId}</div>
      <div>colW={snapshot.columnWidth.toFixed(2)}px</div>
      <div>offset={snapshot.offset.toFixed(2)}px</div>
      <div>
        deltas=
        {snapshot.deltas
          .map((d) => (Number.isFinite(d) ? d.toFixed(1) : '?'))
          .join(', ')}
      </div>
    </aside>
  )
}
