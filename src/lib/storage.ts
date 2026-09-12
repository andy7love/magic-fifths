/**
 * Minimal persistence. Values are stored as plain strings under a versioned
 * prefix so they are easy to read in devtools and easy to invalidate wholesale.
 *
 * Every access is wrapped: `localStorage` throws on access in Safari private
 * mode and when a user has disabled site data, and none of this is important
 * enough to break the app over.
 */

const PREFIX = 'mf:v1:'

export const STORAGE_KEYS = {
  theme: 'theme',
  language: 'language',
  scale: 'scale',
  snapIndex: 'snapIndex',
  tonicMode: 'tonicMode',
  advancedChords: 'advancedChords',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

export function readSetting(key: StorageKey): string | null {
  try {
    return window.localStorage.getItem(PREFIX + key)
  } catch {
    return null
  }
}

export function writeSetting(key: StorageKey, value: string): void {
  try {
    window.localStorage.setItem(PREFIX + key, value)
  } catch {
    // Persistence is best-effort.
  }
}

export function removeSetting(key: StorageKey): void {
  try {
    window.localStorage.removeItem(PREFIX + key)
  } catch {
    // Persistence is best-effort.
  }
}
