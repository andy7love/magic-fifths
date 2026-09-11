import { createContext, useContext } from 'react'

import type { LanguageCode } from '@/i18n'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

export interface SettingsValue {
  theme: ThemePreference
  setTheme: (theme: ThemePreference) => void
  /** `theme` with 'system' already resolved against the OS preference. */
  resolvedTheme: ResolvedTheme
  language: LanguageCode
  setLanguage: (language: LanguageCode) => void
  scaleId: string
  setScaleId: (scaleId: string) => void
}

export const SettingsContext = createContext<SettingsValue | null>(null)

/**
 * The single consumer API for app settings. Keeping every read behind this hook
 * means the implementation underneath could be swapped without touching callers.
 */
export function useSettings(): SettingsValue {
  const value = useContext(SettingsContext)
  if (!value) throw new Error('useSettings must be used inside <SettingsProvider>')
  return value
}

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system'
}
