import { useTranslation } from 'react-i18next'

import { tonicNote } from '@/lib/music/snap'

interface KeyReadoutProps {
  snapIndex: number
}

export function KeyReadout({ snapIndex }: KeyReadoutProps) {
  const { t } = useTranslation('common')
  const note = tonicNote(snapIndex)

  return (
    <p className="text-center text-sm text-muted-foreground" data-testid="key-readout">
      <span className="sr-only">{t('readout.label')}: </span>
      {t('readout.value', { note: note.ascii })}
    </p>
  )
}
