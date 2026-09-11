import i18next from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next'

import { STORAGE_KEYS, readSetting } from '@/lib/storage'

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Espa\u00f1ol' },
] as const

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code']

export const FALLBACK_LANGUAGE: LanguageCode = 'en'

export const NAMESPACES = ['common', 'music', 'howto', 'theory'] as const

export function isLanguageCode(value: unknown): value is LanguageCode {
  return (
    typeof value === 'string' &&
    SUPPORTED_LANGUAGES.some((language) => language.code === value)
  )
}

/** Stored preference wins, then the browser's list, then English. */
export function resolveInitialLanguage(): LanguageCode {
  const stored = readSetting(STORAGE_KEYS.language)
  if (isLanguageCode(stored)) return stored

  const tags = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const tag of tags) {
    const base = tag.split('-')[0]
    if (isLanguageCode(base)) return base
  }

  return FALLBACK_LANGUAGE
}

/**
 * Catalogs are loaded with a dynamic `import()` rather than over HTTP. Vite
 * emits each one as its own chunk, and the service worker precaches all chunks,
 * so every language keeps working offline with no extra PWA configuration.
 */
export const i18n = i18next.use(
  resourcesToBackend(
    (language: string, namespace: string) =>
      import(`./locales/${language}/${namespace}.json`),
  ),
)

export function initI18n() {
  return i18n.use(initReactI18next).init({
    lng: resolveInitialLanguage(),
    fallbackLng: FALLBACK_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES.map((language) => language.code),
    // Keeps `i18n.language` as 'en' rather than 'en-US', so it round-trips
    // through the settings store and the <html lang> attribute cleanly.
    load: 'languageOnly',
    ns: NAMESPACES,
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    react: { useSuspense: true },
  })
}
