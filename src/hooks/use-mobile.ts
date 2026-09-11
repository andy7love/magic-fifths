import { useMediaQuery } from '@/hooks/use-media-query'
import { SIDEBAR_PERSISTENT_QUERY } from '@/lib/config'

/**
 * Consumed by the generated `components/ui/sidebar.tsx` to decide between the
 * persistent rail and the mobile drawer.
 *
 * Replaces shadcn's width-only 768px check: this app is landscape-first, so a
 * phone at 844x390 clears any width threshold while having nowhere near enough
 * height for a rail. See `SIDEBAR_PERSISTENT_QUERY`.
 */
export function useIsMobile() {
  return !useMediaQuery(SIDEBAR_PERSISTENT_QUERY)
}
