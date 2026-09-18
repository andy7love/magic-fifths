import { useState } from 'react'
import { BookOpen, CircleHelp, Music2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { HowToUseDialog } from '@/components/dialogs/HowToUseDialog'
import { FifthsTheoryDialog } from '@/components/dialogs/FifthsTheoryDialog'
import { InstallButton } from '@/components/InstallButton'
import {
  DegreeIcon,
  EnharmonicIcon,
  NoteCountIcon,
} from '@/components/layout/ChromeIcons'
import { ShareButton } from '@/components/ShareButton'
import { Button } from '@/components/ui/button'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { useSettings } from '@/context/settings'
import { useStripActions } from '@/hooks/use-strip-actions'

/**
 * Collapsed drawer rail. Hidden while the sidebar is open so the open drawer
 * replaces these icons instead of stacking on top of them.
 */
export function Toolbar() {
  const { t } = useTranslation('common')
  const {
    advancedChords,
    setAdvancedChords,
    showTriads,
    setShowTriads,
    showTetrads,
    setShowTetrads,
    showGrades,
    setShowGrades,
  } = useSettings()
  const { canSeekEnharmonic, seekEnharmonic } = useStripActions()
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
            variant={showTriads ? 'secondary' : 'ghost'}
            size="icon"
            data-testid="triads-toggle"
            aria-label={t('display.triads')}
            aria-pressed={showTriads}
            onClick={() => setShowTriads(!showTriads)}
          >
            <NoteCountIcon count={3} />
          </Button>
          <Button
            type="button"
            variant={showTetrads ? 'secondary' : 'ghost'}
            size="icon"
            data-testid="tetrads-toggle"
            aria-label={t('display.tetrads')}
            aria-pressed={showTetrads}
            onClick={() => setShowTetrads(!showTetrads)}
          >
            <NoteCountIcon count={4} />
          </Button>
          <Button
            type="button"
            variant={showGrades ? 'secondary' : 'ghost'}
            size="icon"
            data-testid="grades-toggle"
            aria-label={t('display.grades')}
            aria-pressed={showGrades}
            onClick={() => setShowGrades(!showGrades)}
          >
            <DegreeIcon />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            data-testid="enharmonic-seek"
            aria-label={t('enharmonic.label')}
            disabled={!canSeekEnharmonic}
            onClick={() => {
              seekEnharmonic()
            }}
          >
            <EnharmonicIcon />
          </Button>
          <Button
            type="button"
            variant={advancedChords ? 'secondary' : 'ghost'}
            size="icon"
            data-testid="advanced-toggle"
            aria-label={t('advanced.toggle')}
            aria-pressed={advancedChords}
            onClick={() => setAdvancedChords(!advancedChords)}
          >
            <Music2 className="size-4" />
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
