import { useCallback, useSyncExternalStore } from 'react'

import {
  getInstallPromptServerSnapshot,
  getInstallPromptSnapshot,
  openInstalledApp,
  promptInstall,
  subscribeInstallPrompt,
  type InstallPromptSnapshot,
} from '@/lib/install-prompt'

/**
 * Subscribes to the module-level install-prompt store started in `main.tsx`.
 * `canInstall` / `canOpen` update when BIP fires (including after engagement
 * delay) or when the app is installed — without polling.
 */
export function useInstallPrompt() {
  const snapshot: InstallPromptSnapshot = useSyncExternalStore(
    subscribeInstallPrompt,
    getInstallPromptSnapshot,
    getInstallPromptServerSnapshot,
  )

  const install = useCallback(() => {
    void promptInstall()
  }, [])

  const openApp = useCallback(() => {
    openInstalledApp()
  }, [])

  return {
    canInstall: snapshot.canInstall,
    canOpen: snapshot.canOpen,
    promptInstall: install,
    openInstalledApp: openApp,
  }
}
