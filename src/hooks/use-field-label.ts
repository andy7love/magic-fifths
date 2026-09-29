import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { tonicColumnFor, type ModeId } from '@/lib/music/modes'
import { tonicNote } from '@/lib/music/snap'

/** Same wording as the key readout: "C major", "A minor", "D Dorian". */
export function useFieldLabel() {
  const { t } = useTranslation(['common', 'music'])

  return useCallback(
    (snapIndex: number, tonicModeId: ModeId) => {
      const note = tonicNote(snapIndex, tonicColumnFor(tonicModeId)).ascii
      if (tonicModeId === 'ionian') return t('common:readout.valueMajor', { note })
      if (tonicModeId === 'aeolian') return t('common:readout.valueMinor', { note })
      return t('common:readout.valueMode', {
        note,
        mode: t(`music:modes.${tonicModeId}` as 'music:modes.dorian'),
      })
    },
    [t],
  )
}
