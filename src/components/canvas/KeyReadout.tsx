import { useTranslation } from 'react-i18next'

import { useFieldLabel } from '@/hooks/use-field-label'
import type { ModeId } from '@/lib/music/modes'

interface KeyReadoutProps {
  snapIndex: number
  tonicModeId: ModeId
}

export function KeyReadout({ snapIndex, tonicModeId }: KeyReadoutProps) {
  const { t } = useTranslation('common')
  const fieldLabel = useFieldLabel()

  return (
    <p className="text-center text-sm text-muted-foreground" data-testid="key-readout">
      <span className="sr-only">{t('readout.label')}: </span>
      {fieldLabel(snapIndex, tonicModeId)}
    </p>
  )
}
