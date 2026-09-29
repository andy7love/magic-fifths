import { createContext, useContext } from 'react'

import type { LanguageCode } from '@/i18n'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

/** Which name system the paper strip prints. One at a time, never both. */
export type NoteNotation = 'solfege' | 'letter'

export function isNoteNotation(value: unknown): value is NoteNotation {
  return value === 'solfege' || value === 'letter'
}

export interface SettingsValue {
  theme: ThemePreference
  setTheme: (theme: ThemePreference) => void
  /** `theme` with 'system' already resolved against the OS preference. */
  resolvedTheme: ResolvedTheme
  language: LanguageCode
  setLanguage: (language: LanguageCode) => void
  scaleId: string
  setScaleId: (scaleId: string) => void
  /** Full chord spellings (color tones) instead of bare tetrads. */
  advancedChords: boolean
  setAdvancedChords: (advanced: boolean) => void
  /** Show the triad quality row under the strip. */
  showTriads: boolean
  setShowTriads: (show: boolean) => void
  /** Show the tetrad / advanced-chord row under the strip. */
  showTetrads: boolean
  setShowTetrads: (show: boolean) => void
  /** Show the scale-degree row above the strip. */
  showGrades: boolean
  setShowGrades: (show: boolean) => void
  /** Show Tonic, Supertonic, … under each degree number. */
  showGradeNames: boolean
  setShowGradeNames: (show: boolean) => void
  /** Fixed-do solfège, or letter names when the switch is on. */
  notation: NoteNotation
  setNotation: (notation: NoteNotation) => void
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
