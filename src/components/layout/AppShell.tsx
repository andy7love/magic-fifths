import { useEffect, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { AppSidebar } from '@/components/layout/AppSidebar'
import { Toolbar } from '@/components/layout/Toolbar'
import { UpdatePrompt } from '@/components/pwa/UpdatePrompt'
import { SidebarInset, SidebarProvider, useSidebar } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useSidebarEdgeSwipe } from '@/hooks/use-sidebar-edge-swipe'

/**
 * Desktop offcanvas has no sheet overlay of its own. This backdrop closes the
 * drawer on outside click so the collapsed rail + open panel behave as one unit.
 * Mobile uses the Sheet overlay already.
 */
function SidebarBackdrop() {
  const { t } = useTranslation('common')
  const { open, isMobile, setOpen } = useSidebar()

  if (isMobile || !open) return null

  return (
    <button
      type="button"
      className="fixed inset-0 z-[45] bg-black/40"
      data-testid="sidebar-backdrop"
      aria-label={t('sidebar.closeMenu')}
      onClick={() => setOpen(false)}
    />
  )
}

/**
 * Marks desktop-open on <html> so CSS can clip the inset. The strip track uses
 * translate3d and paints as its own compositor layer; z-index alone does not
 * keep that layer under the fixed drawer in Chromium.
 */
function SidebarOpenAttr() {
  const { open, isMobile } = useSidebar()
  const desktopOpen = !isMobile && open

  useEffect(() => {
    const root = document.documentElement
    if (desktopOpen) root.dataset.mfSidebar = 'open'
    else delete root.dataset.mfSidebar
    return () => {
      delete root.dataset.mfSidebar
    }
  }, [desktopOpen])

  return null
}

function SidebarEdgeSwipe() {
  useSidebarEdgeSwipe()
  return null
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={false}>
        {/* Inset first so the strip's compositor layer is under the drawer in
            paint order; gap is forced to 0 so sidebar-before-inset is not needed. */}
        <SidebarInset className="relative overflow-hidden">
          <Toolbar />
          {children}
        </SidebarInset>
        <SidebarBackdrop />
        <AppSidebar />
        <SidebarOpenAttr />
        <SidebarEdgeSwipe />
        <UpdatePrompt />
        <Toaster position="bottom-center" />
      </SidebarProvider>
    </TooltipProvider>
  )
}
