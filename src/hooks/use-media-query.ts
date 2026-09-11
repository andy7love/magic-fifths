import { useCallback, useSyncExternalStore } from 'react'

/**
 * `useSyncExternalStore` is the right primitive for a media query: it reads the
 * value during render instead of after mount, so there is no first-paint flash
 * of the wrong layout and no setState-inside-effect cascade.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onStoreChange)
      return () => mql.removeEventListener('change', onStoreChange)
    },
    [query],
  )

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
