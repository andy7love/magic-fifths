import { useMediaQuery } from '@/hooks/use-media-query'
import { MIN_LANDSCAPE_WIDTH } from '@/lib/config'

/** True when the viewport is too narrow for the cardboard. */
export function useViewportGate(): boolean {
  return useMediaQuery(`(max-width: ${MIN_LANDSCAPE_WIDTH - 1}px)`)
}
