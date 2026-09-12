import { describe, expect, it } from 'vitest'

import enCommon from './locales/en/common.json'
import enHowto from './locales/en/howto.json'
import enMusic from './locales/en/music.json'
import enTheory from './locales/en/theory.json'
import esCommon from './locales/es/common.json'
import esHowto from './locales/es/howto.json'
import esMusic from './locales/es/music.json'
import esTheory from './locales/es/theory.json'

/**
 * The English catalog shapes the TypeScript types, which means a key missing
 * from Spanish would not be a compile error - it would just silently fall back
 * to English at runtime. These tests are what actually hold the catalogs
 * together.
 */

const CATALOGS = {
  common: { en: enCommon, es: esCommon },
  music: { en: enMusic, es: esMusic },
  howto: { en: enHowto, es: esHowto },
  theory: { en: enTheory, es: esTheory },
} as const

/** Flattens to leaf paths, indexing into arrays so lengths must match too. */
function keyPaths(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => keyPaths(item, `${prefix}[${index}]`))
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) =>
      keyPaths(child, prefix ? `${prefix}.${key}` : key),
    )
  }
  return [prefix]
}

function leaves(value: unknown, prefix = ''): Map<string, string> {
  const map = new Map<string, string>()
  const walk = (node: unknown, path: string) => {
    if (Array.isArray(node)) {
      node.forEach((item, index) => walk(item, `${path}[${index}]`))
    } else if (node !== null && typeof node === 'object') {
      for (const [key, child] of Object.entries(node)) {
        walk(child, path ? `${path}.${key}` : key)
      }
    } else {
      map.set(path, String(node))
    }
  }
  walk(value, prefix)
  return map
}

function placeholders(text: string): string[] {
  return [...text.matchAll(/\{\{(\w+)\}\}/g)].map((match) => match[1]).sort()
}

describe.each(Object.entries(CATALOGS))('%s namespace', (_namespace, catalog) => {
  it('has identical key structure across every language', () => {
    const expected = keyPaths(catalog.en).sort()
    expect(keyPaths(catalog.es).sort()).toEqual(expected)
  })

  it('keeps the same interpolation placeholders in every language', () => {
    const en = leaves(catalog.en)
    const es = leaves(catalog.es)
    for (const [path, text] of en) {
      expect(placeholders(es.get(path) ?? ''), `${path}`).toEqual(placeholders(text))
    }
  })

  it('has no empty strings left as placeholders for real copy', () => {
    for (const [path, text] of leaves(catalog.es)) {
      expect(text.trim().length, `${path}`).toBeGreaterThan(0)
    }
  })

  it('is actually translated rather than copied from English', () => {
    // Chord symbols, the app name, and a few template-only strings that keep
    // the same word order in Spanish are intentionally identical.
    const shared = [
      'triads.',
      'tetrads.',
      'chordExtras.',
      'solfege.',
      'app.name',
      'share.title',
      'readout.valueMode',
      'strip.valueMode',
    ]
    const en = leaves(catalog.en)
    const es = leaves(catalog.es)
    const untranslated = [...en.entries()].filter(
      ([path, text]) =>
        !shared.some((prefix) => path.startsWith(prefix)) && es.get(path) === text,
    )
    expect(untranslated.map(([path]) => path)).toEqual([])
  })
})
