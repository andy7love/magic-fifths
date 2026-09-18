import { useCallback, useEffect, useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import {
  SettingsContext,
  isThemePreference,
  type ResolvedTheme,
  type SettingsValue,
  type ThemePreference,
} from '@/context/settings'
import { useMediaQuery } from '@/hooks/use-media-query'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { FALLBACK_LANGUAGE, isLanguageCode, type LanguageCode } from '@/i18n'
import { DEFAULT_SCALE_ID, isAvailableScaleId } from '@/lib/music/scales'
import { STORAGE_KEYS, writeSetting } from '@/lib/storage'

/**
 * There is very little state in this app: a handful of settings, all
 * low-frequency.
 * A plain context is the right size for it, and the only high-frequency state -
 * the strip's drag offset - deliberately never enters React at all.
 */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()

  const [theme, setTheme] = usePersistedState<ThemePreference>({
    key: STORAGE_KEYS.theme,
    fallback: 'system',
    parse: (raw) => (isThemePreference(raw) ? raw : null),
  })

  const [scaleId, setScaleId] = usePersistedState<string>({
    key: STORAGE_KEYS.scale,
    fallback: DEFAULT_SCALE_ID,
    parse: (raw) => (isAvailableScaleId(raw) ? raw : null),
  })

  const [advancedChords, setAdvancedChords] = usePersistedState<boolean>({
    key: STORAGE_KEYS.advancedChords,
    fallback: false,
    parse: (raw) => (raw === 'true' ? true : raw === 'false' ? false : null),
    serialize: (value) => (value ? 'true' : 'false'),
  })

  const [showTriads, setShowTriads] = usePersistedState<boolean>({
    key: STORAGE_KEYS.showTriads,
    fallback: true,
    parse: (raw) => (raw === 'true' ? true : raw === 'false' ? false : null),
    serialize: (value) => (value ? 'true' : 'false'),
  })

  const [showTetrads, setShowTetrads] = usePersistedState<boolean>({
    key: STORAGE_KEYS.showTetrads,
    fallback: true,
    parse: (raw) => (raw === 'true' ? true : raw === 'false' ? false : null),
    serialize: (value) => (value ? 'true' : 'false'),
  })

  const [showGrades, setShowGrades] = usePersistedState<boolean>({
    key: STORAGE_KEYS.showGrades,
    fallback: true,
    parse: (raw) => (raw === 'true' ? true : raw === 'false' ? false : null),
    serialize: (value) => (value ? 'true' : 'false'),
  })

  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const resolvedTheme: ResolvedTheme =
    theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme

  // i18next already is a runtime store for the active language, so reading from
  // it avoids keeping a second copy that could drift.
  const language = isLanguageCode(i18n.resolvedLanguage)
    ? i18n.resolvedLanguage
    : FALLBACK_LANGUAGE

  const setLanguage = useCallback(
    (next: LanguageCode) => {
      writeSetting(STORAGE_KEYS.language, next)
      void i18n.changeLanguage(next)
    },
    [i18n],
  )

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', resolvedTheme === 'dark')
    root.style.colorScheme = resolvedTheme
  }, [resolvedTheme])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const value = useMemo<SettingsValue>(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      language,
      setLanguage,
      scaleId,
      setScaleId,
      advancedChords,
      setAdvancedChords,
      showTriads,
      setShowTriads,
      showTetrads,
      setShowTetrads,
      showGrades,
      setShowGrades,
    }),
    [
      theme,
      setTheme,
      resolvedTheme,
      language,
      setLanguage,
      scaleId,
      setScaleId,
      advancedChords,
      setAdvancedChords,
      showTriads,
      setShowTriads,
      showTetrads,
      setShowTetrads,
      showGrades,
      setShowGrades,
    ],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
