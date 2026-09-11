import type common from './locales/en/common.json'
import type howto from './locales/en/howto.json'
import type music from './locales/en/music.json'
import type theory from './locales/en/theory.json'

/**
 * Typing the resources off the English catalog makes `t()` keys compile-time
 * checked, so a typo or a removed key is a build error rather than a string
 * like "common.share.opne" rendered into the UI.
 *
 * English shapes the types; `locales.test.ts` is what guarantees the other
 * catalogs actually match it.
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof common
      music: typeof music
      howto: typeof howto
      theory: typeof theory
    }
  }
}
