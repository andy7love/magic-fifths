import { Canvas } from '@/components/canvas/Canvas'
import { DebugOverlay } from '@/components/DebugOverlay'
import { AppShell } from '@/components/layout/AppShell'

export function App() {
  return (
    <AppShell>
      <main className="relative h-svh w-full" data-testid="app-root">
        <Canvas />
        <DebugOverlay />
      </main>
    </AppShell>
  )
}
