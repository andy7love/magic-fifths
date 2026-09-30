/**
 * Lets the sidebar / toolbar seek the strip without lifting gesture state into
 * React context. Canvas publishes the live `goTo` + `snapIndex`; consumers
 * subscribe via `useSyncExternalStore`.
 */

import { DEFAULT_TONIC_MODE, type ModeId } from '@/lib/music/modes'
import { DEFAULT_SNAP, enharmonicSnap, fieldHasDoubleAccidental } from '@/lib/music/snap'

export type StripGoTo = (index: number, options?: { animate?: boolean }) => void

export interface StripActionsSnapshot {
  snapIndex: number
  tonicModeId: ModeId
  goTo: StripGoTo | null
  canSeekEnharmonic: boolean
  /** Double flat or double sharp is in the window, and a jump is possible. */
  suggestEnharmonic: boolean
}

type Listener = () => void

let snapshot: StripActionsSnapshot = {
  snapIndex: DEFAULT_SNAP,
  tonicModeId: DEFAULT_TONIC_MODE,
  goTo: null,
  canSeekEnharmonic: false,
  suggestEnharmonic: false,
}

const listeners = new Set<Listener>()

function emit() {
  for (const listener of listeners) listener()
}

export function getStripActionsSnapshot(): StripActionsSnapshot {
  return snapshot
}

export function getStripActionsServerSnapshot(): StripActionsSnapshot {
  return {
    snapIndex: DEFAULT_SNAP,
    tonicModeId: DEFAULT_TONIC_MODE,
    goTo: null,
    canSeekEnharmonic: false,
    suggestEnharmonic: false,
  }
}

export function subscribeStripActions(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function publishStripActions(
  snapIndex: number,
  tonicModeId: ModeId,
  goTo: StripGoTo | null,
) {
  const canSeek = goTo !== null && enharmonicSnap(snapIndex) !== null
  snapshot = {
    snapIndex,
    tonicModeId,
    goTo,
    canSeekEnharmonic: canSeek,
    suggestEnharmonic: canSeek && fieldHasDoubleAccidental(snapIndex),
  }
  emit()
}

export function seekEnharmonicField(): boolean {
  const { snapIndex, goTo } = snapshot
  if (!goTo) return false
  const next = enharmonicSnap(snapIndex)
  if (next === null) return false
  goTo(next)
  return true
}
