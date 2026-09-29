import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useFieldLabel } from '@/hooks/use-field-label'
import { useStripActions } from '@/hooks/use-strip-actions'
import { enharmonicSnap } from '@/lib/music/snap'

/**
 * Jumps twelve fifths and tells the user that the field they left is the
 * enharmonic spelling of the one now in view.
 */
export function useEnharmonicSeek() {
  const { t } = useTranslation('common')
  const fieldLabel = useFieldLabel()
  const {
    snapIndex,
    tonicModeId,
    canSeekEnharmonic,
    suggestEnharmonic,
    seekEnharmonic,
  } = useStripActions()

  const seek = useCallback(() => {
    const next = enharmonicSnap(snapIndex)
    if (!canSeekEnharmonic || next === null) return false
    const before = fieldLabel(snapIndex, tonicModeId)
    const after = fieldLabel(next, tonicModeId)
    if (!seekEnharmonic()) return false
    toast.message(t('enharmonic.switched', { before, after }), { duration: 3200 })
    return true
  }, [canSeekEnharmonic, fieldLabel, seekEnharmonic, snapIndex, t, tonicModeId])

  return { canSeekEnharmonic, suggestEnharmonic, seek }
}
