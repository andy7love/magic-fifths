import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { DEFAULT_TONIC_MODE, tonicColumnFor, type ModeId } from '@/lib/music/modes'
import { tonicNote } from '@/lib/music/snap'
import { buildShareUrl } from '@/lib/share'

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
  const { t: tCommon } = useTranslation('common')
  const { t: tMusic } = useTranslation('music')
  const [busy, setBusy] = useState(false)

  const shareTextFor = useCallback(
    (note: string, tonicModeId: ModeId) => {
      if (tonicModeId === 'ionian') {
        return tCommon('share.textMajor', { key: note })
      }
      if (tonicModeId === 'aeolian') {
        return tCommon('share.textMinor', { key: note })
      }
      return tCommon('share.textMode', {
        key: note,
        mode: tMusic(`modes.${tonicModeId}` as 'modes.dorian'),
      })
    },
    [tCommon, tMusic],
  )

  const buildPayload = useCallback((): SharePayload => {
    const snapIndex = window.__mf__?.getSnapIndex() ?? 14
    const tonicModeId = window.__mf__?.getTonicModeId?.() ?? DEFAULT_TONIC_MODE
    const url = buildShareUrl(snapIndex, window.location.href, tonicModeId)
    const note = tonicNote(snapIndex, tonicColumnFor(tonicModeId)).ascii
    return {
      title: tCommon('share.title'),
      text: shareTextFor(note, tonicModeId),
      url,
    }
  }, [shareTextFor, tCommon])

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
      const snapIndex = window.__mf__?.getSnapIndex() ?? 14
      const tonicModeId = window.__mf__?.getTonicModeId?.() ?? DEFAULT_TONIC_MODE
      const note = tonicNote(snapIndex, tonicColumnFor(tonicModeId)).ascii
      const description =
        tonicModeId === 'ionian'
          ? tCommon('share.copiedDescriptionMajor', { key: note })
          : tonicModeId === 'aeolian'
            ? tCommon('share.copiedDescriptionMinor', { key: note })
            : tCommon('share.copiedDescriptionMode', {
                key: note,
                mode: tMusic(`modes.${tonicModeId}` as 'modes.dorian'),
              })
      toast.success(tCommon('share.copied'), { description })
    } catch (error) {
      // User cancelling the native sheet is not a failure.
      if (error instanceof DOMException && error.name === 'AbortError') return
      toast.error(tCommon('share.failed'))
    } finally {
      setBusy(false)
    }
  }, [busy, buildPayload, tCommon, tMusic])

  return { share, busy }
}
