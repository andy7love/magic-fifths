import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { usePWAUpdate } from '@/hooks/use-pwa-update'

export function UpdatePrompt() {
  const { t } = useTranslation('common')
  const { needRefresh, applyUpdate, dismiss } = usePWAUpdate()

  if (!needRefresh) return null

  return (
    <div
      className="fixed bottom-4 left-1/2 z-[90] flex max-w-md -translate-x-1/2 items-center gap-3 rounded-lg border bg-background p-3 shadow-lg"
      data-testid="pwa-update-prompt"
      role="status"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{t('pwa.updateTitle')}</p>
        <p className="text-xs text-muted-foreground">{t('pwa.updateBody')}</p>
      </div>
      <Button size="sm" data-testid="pwa-update-reload" onClick={applyUpdate}>
        {t('pwa.update')}
      </Button>
      <Button size="sm" variant="ghost" onClick={dismiss}>
        {t('pwa.dismiss')}
      </Button>
    </div>
  )
}
