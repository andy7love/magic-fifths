import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { buildShareUrl } from '@/lib/share'
import { tonicNote } from '@/lib/music/snap'

interface SharePayload {
  title: string
  text: string
  url: string
}

/**
 * Builds the current share URL from the live snap index (via `window.__mf__`
 * when available, otherwise from the default C-major position).
 */
export function useShareLink() {
  const { t } = useTranslation('common')
  const [busy, setBusy] = useState(false)

  const buildPayload = useCallback((): SharePayload => {
    const snapIndex = window.__mf__?.getSnapIndex() ?? 14
    const url = buildShareUrl(snapIndex, window.location.href)
    const note = tonicNote(snapIndex).ascii
    return {
      title: t('share.title'),
      text: t('share.text', { key: note }),
      url,
    }
  }, [t])

  const share = useCallback(async () => {
    if (busy) return
    setBusy(true)
    const payload = buildPayload()

    try {
      if (typeof navigator.share === 'function') {
        await navigator.share(payload)
        return
      }

      await navigator.clipboard.writeText(payload.url)
      toast.success(t('share.copied'), {
        description: t('share.copiedDescription', {
          key: tonicNote(window.__mf__?.getSnapIndex() ?? 14).ascii,
        }),
      })
    } catch (error) {
      // User cancelling the native sheet is not a failure.
      if (error instanceof DOMException && error.name === 'AbortError') return
      toast.error(t('share.failed'))
    } finally {
      setBusy(false)
    }
  }, [busy, buildPayload, t])

  return { share, busy }
}
