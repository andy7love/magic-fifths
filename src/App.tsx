import { useTranslation } from 'react-i18next'

import { useSettings } from '@/context/settings'
import { SUPPORTED_LANGUAGES } from '@/i18n'
import { MODES } from '@/lib/music/modes'
import { DEFAULT_SNAP, assignmentsFor, tonicNote } from '@/lib/music/snap'

// Phase 2 harness. Replaced by the real cardboard canvas and app shell in
// phases 3 and 4; it exists so i18n, theming and the music domain can be
// verified in a browser before any layout work starts.
export function App() {
  const { t } = useTranslation(['common', 'music'])
  const { language, setLanguage, resolvedTheme, setTheme } = useSettings()

  return (
    <main className="flex h-full flex-col items-center justify-center gap-6 p-8" data-testid="app-root">
      <h1 className="font-hand text-4xl">{t('common:app.name')}</h1>
      <p className="text-muted-foreground text-sm">{t('common:app.tagline')}</p>

      <table className="text-sm" data-testid="harness-table">
        <tbody>
          <tr>
            <th className="pr-3 text-left font-normal">{t('music:rows.modes')}</th>
            {MODES.map((mode) => (
              <td key={mode.id} className="px-2">
                {t(`music:modes.${mode.id}` as 'music:modes.ionian')}
              </td>
            ))}
          </tr>
          <tr>
            <th className="pr-3 text-left font-normal">C</th>
            {assignmentsFor(DEFAULT_SNAP).map((a) => (
              <td key={a.mode.id} className="px-2 font-mono">
                {a.note.ascii}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <p data-testid="harness-readout">
        {t('common:readout.value', { note: tonicNote(DEFAULT_SNAP).ascii })}
      </p>

      <div className="flex gap-2">
        {SUPPORTED_LANGUAGES.map((option) => (
          <button
            key={option.code}
            type="button"
            className="rounded border px-3 py-1 text-sm"
            data-testid={`harness-lang-${option.code}`}
            aria-pressed={language === option.code}
            onClick={() => setLanguage(option.code)}
          >
            {option.label}
          </button>
        ))}
        <button
          type="button"
          className="rounded border px-3 py-1 text-sm"
          data-testid="harness-theme"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        >
          {t('common:theme.label')}: {resolvedTheme}
        </button>
      </div>
    </main>
  )
}
