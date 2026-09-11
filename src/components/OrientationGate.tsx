import { useTranslation } from 'react-i18next'
import { Smartphone } from 'lucide-react'

import { MIN_LANDSCAPE_WIDTH } from '@/lib/config'
import { useViewportGate } from '@/hooks/use-viewport-gate'

export function OrientationGate() {
  const blocked = useViewportGate()
  const { t } = useTranslation('common')

  if (!blocked) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-background p-6 text-center"
      data-testid="orientation-gate"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="orientation-title"
      aria-describedby="orientation-body"
    >
      <Smartphone className="size-12 rotate-90 text-muted-foreground" aria-hidden="true" />
      <h2 id="orientation-title" className="font-hand text-3xl">
        {t('orientation.title')}
      </h2>
      <p id="orientation-body" className="max-w-sm text-muted-foreground">
        {t('orientation.body')}
      </p>
      <p className="text-xs text-muted-foreground">
        {t('orientation.hint', { width: MIN_LANDSCAPE_WIDTH })}
      </p>
    </div>
  )
}
