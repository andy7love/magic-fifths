import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

/**
 * Registers the service worker and surfaces update / offline-ready toasts.
 * Safe to mount even when the plugin is absent in plain `vite` without PWA —
 * the virtual module is only resolved when vite-plugin-pwa is active.
 */
export function usePWAUpdate() {
  const { t } = useTranslation('common')
  const [needRefresh, setNeedRefresh] = useState(false)
  const [updateSW, setUpdateSW] = useState<((reload?: boolean) => Promise<void>) | null>(
    null,
  )

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const { registerSW } = await import('virtual:pwa-register')
        if (cancelled) return

        const update = registerSW({
          immediate: true,
          onNeedRefresh() {
            setNeedRefresh(true)
          },
          onOfflineReady() {
            toast.success(t('pwa.offlineReady'))
          },
        })
        setUpdateSW(() => update)
      } catch {
        // Dev without the plugin, or browsers without SW support.
      }
    })()

    return () => {
      cancelled = true
    }
  }, [t])

  const applyUpdate = useCallback(() => {
    void updateSW?.(true)
  }, [updateSW])

  const dismiss = useCallback(() => setNeedRefresh(false), [])

  return { needRefresh, applyUpdate, dismiss }
}
