import { SIDEBAR_EDGE_SWIPE_PX } from '@/lib/config'

/**
 * Right edge, in viewport pixels, of the gesture that opens the drawer.
 *
 * That zone is the toolbox plus the dark margin to the left of the cardboard.
 * A drag that begins on the board belongs to the strip. The fixed 36px edge
 * is only the fallback before those elements have been measured.
 */
export function sidebarSwipeZoneRight(): number {
  const toolbar = document.querySelector('[data-testid="toolbar"]')
  const canvas = document.querySelector('[data-testid="canvas"]')
  const toolbarRight = toolbar?.getBoundingClientRect().right ?? 0
  const canvasLeft = canvas?.getBoundingClientRect().left ?? 0
  return Math.max(SIDEBAR_EDGE_SWIPE_PX, toolbarRight, canvasLeft)
}
