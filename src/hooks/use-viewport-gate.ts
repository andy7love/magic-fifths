import { useMediaQuery } from '@/hooks/use-media-query'

/**
 * True only when the viewport is taller than it is wide (`orientation:
 * portrait`). The original horizontal board is the default; the flipped
 * vertical board is used exclusively in this case.
 */
export function usePortraitLayout(): boolean {
  return useMediaQuery('(orientation: portrait)')
}
