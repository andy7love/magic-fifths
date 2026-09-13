import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/App'
import { SettingsProvider } from '@/context/SettingsProvider'
import { initI18n } from '@/i18n'
import { startInstallPromptCapture } from '@/lib/install-prompt'
import './index.css'

// Before React mounts: BIP often fires on load and is easy to miss from useEffect.
startInstallPromptCapture()
void initI18n()

const container = document.getElementById('root')
if (!container) throw new Error('Root element #root not found')

createRoot(container).render(
  <StrictMode>
    {/* Catalogs load as dynamic chunks, so the tree suspends briefly on first
        paint. The fallback is deliberately textless: no copy is available yet. */}
    <Suspense
      fallback={
        <div
          className="flex h-full items-center justify-center"
          data-testid="app-loading"
          role="status"
          aria-busy="true"
        >
          <span className="size-6 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
        </div>
      }
    >
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </Suspense>
  </StrictMode>,
)
