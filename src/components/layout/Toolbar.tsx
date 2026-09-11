import { useTranslation } from 'react-i18next'

import { ShareButton } from '@/components/ShareButton'
import { SidebarTrigger } from '@/components/ui/sidebar'

export function Toolbar() {
  const { t } = useTranslation('common')

  return (
    <header
      className="absolute top-2 left-2 z-50 flex items-center gap-1 rounded-md border bg-background/80 p-1 shadow-sm backdrop-blur"
      data-testid="toolbar"
    >
      <SidebarTrigger data-testid="sidebar-trigger" aria-label={t('sidebar.openMenu')} />
      <ShareButton variant="icon" />
    </header>
  )
}
