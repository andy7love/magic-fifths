import type { ReactNode } from 'react'

import { AppSidebar } from '@/components/layout/AppSidebar'
import { Toolbar } from '@/components/layout/Toolbar'
import { OrientationGate } from '@/components/OrientationGate'
import { UpdatePrompt } from '@/components/pwa/UpdatePrompt'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset className="relative overflow-hidden">
          <Toolbar />
          {children}
        </SidebarInset>
        <OrientationGate />
        <UpdatePrompt />
        <Toaster position="bottom-center" />
      </SidebarProvider>
    </TooltipProvider>
  )
}
