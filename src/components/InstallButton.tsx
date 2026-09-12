import { MonitorDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { useInstallPrompt } from '@/hooks/use-install-prompt'

interface InstallButtonProps {
  variant?: 'icon' | 'menu'
}

export function InstallButton({ variant = 'icon' }: InstallButtonProps) {
  const { t } = useTranslation('common')
  const { canInstall, promptInstall } = useInstallPrompt()

  // Hidden unless the browser offered an install prompt (Chromium only) and the
  // app is not already installed. iOS Safari never reaches this branch.
  if (!canInstall) return null

  if (variant === 'menu') {
    return (
      <Button
        type="button"
        variant="ghost"
        className="w-full justify-start gap-2"
        data-testid="install-button-menu"
        onClick={() => void promptInstall()}
      >
        <MonitorDown className="size-4" />
        {t('pwa.install.menu')}
      </Button>
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      data-testid="install-button-toolbar"
      aria-label={t('pwa.install.label')}
      onClick={() => void promptInstall()}
    >
      <MonitorDown className="size-4" />
    </Button>
  )
}
