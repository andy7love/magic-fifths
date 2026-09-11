import { useTranslation } from 'react-i18next'

import { tonicColumnFor, type ModeId } from '@/lib/music/modes'
import { tonicNote } from '@/lib/music/snap'

interface KeyReadoutProps {
  snapIndex: number
  tonicModeId: ModeId
}

export function KeyReadout({ snapIndex, tonicModeId }: KeyReadoutProps) {
  const { t: tCommon } = useTranslation('common')
  const { t: tMusic } = useTranslation('music')
  const note = tonicNote(snapIndex, tonicColumnFor(tonicModeId))

  let value: string
  if (tonicModeId === 'ionian') {
    value = tCommon('readout.valueMajor', { note: note.ascii })
  } else if (tonicModeId === 'aeolian') {
    value = tCommon('readout.valueMinor', { note: note.ascii })
  } else {
    value = tCommon('readout.valueMode', {
      note: note.ascii,
      mode: tMusic(`modes.${tonicModeId}` as 'modes.dorian'),
    })
  }

  return (
    <p className="text-center text-sm text-muted-foreground" data-testid="key-readout">
      <span className="sr-only">{tCommon('readout.label')}: </span>
      {value}
    </p>
  )
}
