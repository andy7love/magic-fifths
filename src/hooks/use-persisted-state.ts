import { useCallback, useState } from 'react'

import { readSetting, writeSetting, type StorageKey } from '@/lib/storage'

interface Options<T> {
  key: StorageKey
  fallback: T
  /** Returns `null` for stored values that are absent, stale or malformed. */
  parse: (raw: string) => T | null
  serialize?: (value: T) => string
}

/**
 * `useState` with write-through persistence. The stored value is read in the
 * lazy initializer rather than in an effect, so the first paint is already
 * correct and there is no flash of the default.
 */
export function usePersistedState<T>({
  key,
  fallback,
  parse,
  serialize = String,
}: Options<T>): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const raw = readSetting(key)
    if (raw === null) return fallback
    return parse(raw) ?? fallback
  })

  const set = useCallback(
    (next: T) => {
      setValue(next)
      writeSetting(key, serialize(next))
    },
    [key, serialize],
  )

  return [value, set]
}
