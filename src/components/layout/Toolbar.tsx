import { useState } from 'react'
import { BookOpen, CircleHelp, Layers } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { HowToUseDialog } from '@/components/dialogs/HowToUseDialog'
import { FifthsTheoryDialog } from '@/components/dialogs/FifthsTheoryDialog'
import { InstallButton } from '@/components/InstallButton'
import { ShareButton } from '@/components/ShareButton'
import { Button } from '@/components/ui/button'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { useSettings } from '@/context/settings'

/**
 * Collapsed drawer rail. Hidden while the sidebar is open so the open drawer
 * replaces these icons instead of stacking on top of them.
 */
export function Toolbar() {
  const { t } = useTranslation('common')
  const { advancedChords, setAdvancedChords } = useSettings()
  const { open, openMobile, isMobile } = useSidebar()
  const [howtoOpen, setHowtoOpen] = useState(false)
  const [theoryOpen, setTheoryOpen] = useState(false)

  const sidebarOpen = isMobile ? openMobile : open

  return (
    <>
      {!sidebarOpen ? (
        <header
          className="absolute top-0 left-0 z-50 flex flex-col items-center gap-0.5 rounded-none rounded-br-md border border-t-0 border-l-0 bg-background/80 p-0 shadow-sm backdrop-blur"
          data-testid="toolbar"
        >
          <SidebarTrigger data-testid="sidebar-trigger" aria-label={t('sidebar.openMenu')} />
          <Button
            type="button"
            variant={advancedChords ? 'secondary' : 'ghost'}
            size="icon"
            data-testid="advanced-toggle"
            aria-label={t('advanced.toggle')}
            aria-pressed={advancedChords}
            onClick={() => setAdvancedChords(!advancedChords)}
          >
            <Layers className="size-4" />
          </Button>
          <ShareButton variant="icon" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            data-testid="howto-open-toolbar"
            aria-label={t('howto.open')}
            onClick={() => setHowtoOpen(true)}
          >
            <CircleHelp className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            data-testid="theory-open-toolbar"
            aria-label={t('theory.open')}
            onClick={() => setTheoryOpen(true)}
          >
            <BookOpen className="size-4" />
          </Button>
          <InstallButton variant="icon" />
        </header>
      ) : null}

      <HowToUseDialog open={howtoOpen} onOpenChange={setHowtoOpen} />
      <FifthsTheoryDialog open={theoryOpen} onOpenChange={setTheoryOpen} />
    </>
  )
}
