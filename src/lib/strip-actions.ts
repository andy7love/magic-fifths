/**
 * Lets the sidebar / toolbar seek the strip without lifting gesture state into
 * React context. Canvas publishes the live `goTo` + `snapIndex`; consumers
 * subscribe via `useSyncExternalStore`.
 */

import { DEFAULT_SNAP, enharmonicSnap } from '@/lib/music/snap'

export type StripGoTo = (index: number, options?: { animate?: boolean }) => void

export interface StripActionsSnapshot {
  snapIndex: number
  goTo: StripGoTo | null
  canSeekEnharmonic: boolean
}

type Listener = () => void

let snapshot: StripActionsSnapshot = {
  snapIndex: DEFAULT_SNAP,
  goTo: null,
  canSeekEnharmonic: false,
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
    goTo: null,
    canSeekEnharmonic: false,
  }
}

export function subscribeStripActions(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function publishStripActions(snapIndex: number, goTo: StripGoTo | null) {
  snapshot = {
    snapIndex,
    goTo,
    canSeekEnharmonic: goTo !== null && enharmonicSnap(snapIndex) !== null,
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
