import { AppWindow, MonitorDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { useInstallPrompt } from '@/hooks/use-install-prompt'

interface InstallButtonProps {
  variant?: 'icon' | 'menu'
}

export function InstallButton({ variant = 'icon' }: InstallButtonProps) {
  const { t } = useTranslation('common')
  const { canInstall, canOpen, promptInstall, openInstalledApp } = useInstallPrompt()

  // Hidden unless Chrome offered BIP (install) or getInstalledRelatedApps /
  // appinstalled says we are installed but still in a browser tab (open).
  // iOS Safari never reaches the install branch; open needs Chromium + related_applications.
  if (!canInstall && !canOpen) return null

  const onClick = () => {
    if (canInstall) promptInstall()
    else openInstalledApp()
  }

  const label = canInstall ? t('pwa.install.label') : t('pwa.open.label')
  const menu = canInstall ? t('pwa.install.menu') : t('pwa.open.menu')
  const Icon = canInstall ? MonitorDown : AppWindow

  if (variant === 'menu') {
    return (
      <SidebarMenuButton
        data-testid={canInstall ? 'install-button-menu' : 'open-app-button-menu'}
        onClick={onClick}
      >
        <Icon />
        <span>{menu}</span>
      </SidebarMenuButton>
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      data-testid={canInstall ? 'install-button-toolbar' : 'open-app-button-toolbar'}
      aria-label={label}
      onClick={onClick}
    >
      <Icon className="size-4" />
    </Button>
  )
}
