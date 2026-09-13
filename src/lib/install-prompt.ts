/**
 * Module-level install-prompt capture.
 *
 * `beforeinstallprompt` fires at most once per page load and often on load
 * itself (especially on a return visit once Chrome's engagement heuristics
 * are already met). A React `useEffect` listener is too late and misses it —
 * Chrome's own Install menu still works, but the in-app button never appears.
 *
 * Register here at import time (see `main.tsx`), keep the deferred event in a
 * tiny store, and let React subscribe via `useSyncExternalStore`. No polling.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeinstallprompt_event
 * @see https://developer.chrome.com/docs/capabilities/get-installed-related-apps
 */

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  prompt: () => Promise<void>
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export interface InstallPromptSnapshot {
  /** Browser offered a deferred install prompt and we are not already installed. */
  canInstall: boolean
  /** PWA is installed on-device but this tab is still the browser (not standalone). */
  canOpen: boolean
}

type Listener = () => void

let deferred: BeforeInstallPromptEvent | null = null
let installed = false
let started = false
let snapshot: InstallPromptSnapshot = { canInstall: false, canOpen: false }
const listeners = new Set<Listener>()

function emit() {
  for (const listener of listeners) listener()
}

export function isStandaloneDisplay(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari exposes standalone launch state here instead of display-mode.
    (window.navigator as { standalone?: boolean }).standalone === true
  )
}

function recomputeSnapshot(): InstallPromptSnapshot {
  const standalone = isStandaloneDisplay()
  const next: InstallPromptSnapshot = {
    canInstall: !installed && deferred !== null && !standalone,
    canOpen: installed && !standalone,
  }
  // useSyncExternalStore compares with Object.is — must reuse the same
  // object when nothing changed or React loops forever.
  if (
    next.canInstall === snapshot.canInstall &&
    next.canOpen === snapshot.canOpen
  ) {
    return snapshot
  }
  snapshot = next
  return snapshot
}

function onBeforeInstall(event: Event) {
  // Suppress Chrome's default mini-infobar; we surface our own button.
  event.preventDefault()
  deferred = event as BeforeInstallPromptEvent
  installed = false
  recomputeSnapshot()
  emit()
}

function onInstalled() {
  deferred = null
  installed = true
  recomputeSnapshot()
  emit()
}

async function refreshInstalledRelated() {
  const nav = navigator as Navigator & {
    getInstalledRelatedApps?: () => Promise<Array<{ platform: string }>>
  }
  if (!nav.getInstalledRelatedApps) return
  try {
    const apps = await nav.getInstalledRelatedApps()
    if (apps.some((app) => app.platform === 'webapp')) {
      deferred = null
      installed = true
      recomputeSnapshot()
      emit()
    }
  } catch {
    // Unsupported / denied — leave state alone.
  }
}

/**
 * Idempotent. Must run before React mounts so a load-time BIP is not missed.
 */
export function startInstallPromptCapture() {
  if (typeof window === 'undefined' || started) return
  started = true
  window.addEventListener('beforeinstallprompt', onBeforeInstall)
  window.addEventListener('appinstalled', onInstalled)
  void refreshInstalledRelated()
}

export function subscribeInstallPrompt(onStoreChange: Listener) {
  listeners.add(onStoreChange)
  return () => {
    listeners.delete(onStoreChange)
  }
}

export function getInstallPromptSnapshot(): InstallPromptSnapshot {
  return recomputeSnapshot()
}

const SERVER_SNAPSHOT: InstallPromptSnapshot = { canInstall: false, canOpen: false }

export function getInstallPromptServerSnapshot(): InstallPromptSnapshot {
  return SERVER_SNAPSHOT
}

export async function promptInstall(): Promise<void> {
  if (!deferred) return
  const event = deferred
  await event.prompt()
  const choice = await event.userChoice
  deferred = null
  if (choice.outcome === 'accepted') installed = true
  recomputeSnapshot()
  emit()
}

/**
 * Best-effort launch of the installed PWA from a browser tab.
 * Chrome may capture this user-gesture navigation into the installed app
 * (especially with `launch_handler`); otherwise it opens a normal tab.
 */
export function openInstalledApp(): void {
  const url = new URL('/', window.location.origin)
  url.searchParams.set('utm_source', 'open_app')
  window.open(url.href, '_blank', 'noopener,noreferrer')
}
