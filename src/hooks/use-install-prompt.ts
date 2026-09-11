import { useCallback, useEffect, useState } from 'react'

/**
 * The `beforeinstallprompt` event is not in the standard DOM lib. Only
 * Chromium-based browsers fire it; iOS Safari never does, which is why the
 * install affordance simply stays hidden there (see `canInstall`).
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  prompt: () => Promise<void>
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

function isStandalone() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari exposes standalone launch state here instead of display-mode.
    (window.navigator as { standalone?: boolean }).standalone === true
  )
}

/**
 * Captures the deferred install prompt so the app can offer its own install
 * button. `canInstall` is only true on browsers that fired the event, when the
 * app is neither already installed nor running standalone.
 */
export function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      // Suppress Chrome's default mini-infobar; we surface our own button.
      event.preventDefault()
      setDeferred(event as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setInstalled(true)
      setDeferred(null)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const promptInstall = useCallback(async () => {
    if (!deferred) return
    await deferred.prompt()
    const choice = await deferred.userChoice
    if (choice.outcome === 'accepted') setInstalled(true)
    // The prompt can only be used once; drop it either way.
    setDeferred(null)
  }, [deferred])

  const canInstall = !installed && deferred !== null && !isStandalone()

  return { canInstall, promptInstall }
}
