import { useSyncExternalStore } from 'react'

import {
  getStripActionsServerSnapshot,
  getStripActionsSnapshot,
  seekEnharmonicField,
  subscribeStripActions,
} from '@/lib/strip-actions'

/**
 * Live strip controls for chrome outside `<Canvas>` (sidebar / toolbar).
 * Canvas publishes via `publishStripActions`; this hook is the read side.
 */
export function useStripActions() {
  const snapshot = useSyncExternalStore(
    subscribeStripActions,
    getStripActionsSnapshot,
    getStripActionsServerSnapshot,
  )

  return {
    snapIndex: snapshot.snapIndex,
    canSeekEnharmonic: snapshot.canSeekEnharmonic,
    seekEnharmonic: seekEnharmonicField,
  }
}
