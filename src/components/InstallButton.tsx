import { useState } from 'react'
import { AppWindow, MonitorDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { IosInstallDialog } from '@/components/dialogs/IosInstallDialog'
import { Button } from '@/components/ui/button'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { useInstallPrompt } from '@/hooks/use-install-prompt'

interface InstallButtonProps {
  variant?: 'icon' | 'menu'
}

export function InstallButton({ variant = 'icon' }: InstallButtonProps) {
  const { t } = useTranslation('common')
  const {
    canInstall,
    canOpen,
    needsIosInstallHelp,
    promptInstall,
    openInstalledApp,
  } = useInstallPrompt()
  const [iosGuideOpen, setIosGuideOpen] = useState(false)

  // Chrome BIP install, Chromium "open installed app", or iOS Home Screen guide.
  if (!canInstall && !canOpen && !needsIosInstallHelp) return null

  const isInstallAction = canInstall || needsIosInstallHelp

  const onClick = () => {
    if (canInstall) {
      promptInstall()
      return
    }
    if (needsIosInstallHelp) {
      setIosGuideOpen(true)
      return
    }
    openInstalledApp()
  }

  const label = isInstallAction ? t('pwa.install.label') : t('pwa.open.label')
  const menu = isInstallAction ? t('pwa.install.menu') : t('pwa.open.menu')
  const Icon = isInstallAction ? MonitorDown : AppWindow
  const testIdPrefix = isInstallAction ? 'install-button' : 'open-app-button'

  return (
    <>
      {variant === 'menu' ? (
        <SidebarMenuButton
          data-testid={`${testIdPrefix}-menu`}
          onClick={onClick}
        >
          <Icon />
          <span>{menu}</span>
        </SidebarMenuButton>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          data-testid={`${testIdPrefix}-toolbar`}
          aria-label={label}
          onClick={onClick}
        >
          <Icon className="size-4" />
        </Button>
      )}
      {needsIosInstallHelp ? (
        <IosInstallDialog open={iosGuideOpen} onOpenChange={setIosGuideOpen} />
      ) : null}
    </>
  )
}
