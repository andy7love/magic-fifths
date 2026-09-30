import { useEffect, useRef } from 'react'

import { useSidebar } from '@/components/ui/sidebar'
import { sidebarSwipeZoneRight } from '@/lib/sidebar-swipe'

/** Minimum horizontal travel before the drawer opens. */
const MIN_OPEN_DX = 48

/** Reject mostly-vertical gestures so board taps stay taps. */
const MAX_VERTICAL_RATIO = 0.75

/**
 * Opens the offcanvas sidebar on a rightward swipe that begins on the toolbox
 * or in the dark margin to the left of the cardboard.
 *
 * The strip engine refuses drags that start inside the same zone, so the
 * hanging paper does not scroll along with the drawer gesture. A tap in the
 * zone still reaches the toolbox buttons: the click is swallowed only after
 * the gesture has actually opened the drawer.
 */
export function useSidebarEdgeSwipe() {
  const { open, openMobile, isMobile, setOpen, setOpenMobile } = useSidebar()
  const openRef = useRef(false)
  const isMobileRef = useRef(isMobile)
  const setOpenRef = useRef(setOpen)
  const setOpenMobileRef = useRef(setOpenMobile)

  useEffect(() => {
    openRef.current = isMobile ? openMobile : open
    isMobileRef.current = isMobile
    setOpenRef.current = setOpen
    setOpenMobileRef.current = setOpenMobile
  }, [isMobile, open, openMobile, setOpen, setOpenMobile])

  useEffect(() => {
    let startX = 0
    let startY = 0
    let tracking = false
    let claimed = false
    let pointerId: number | null = null

    const reset = () => {
      tracking = false
      pointerId = null
    }

    const blockFollowingClick = () => {
      const blockClick = (clickEvent: Event) => {
        clickEvent.preventDefault()
        clickEvent.stopPropagation()
        cleanup()
      }
      const cleanup = () => {
        window.removeEventListener('click', blockClick, true)
      }
      window.addEventListener('click', blockClick, true)
      // A drag that ends off the start control may never synthesize a click.
      // Drop the blocker on the next turn so it cannot swallow a later tap.
      setTimeout(cleanup, 0)
    }

    const onPointerDown = (event: PointerEvent) => {
      if (openRef.current) return
      if (event.pointerType === 'mouse' && event.button !== 0) return
      if (event.clientX > sidebarSwipeZoneRight()) return

      tracking = true
      claimed = false
      pointerId = event.pointerId
      startX = event.clientX
      startY = event.clientY
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!tracking || event.pointerId !== pointerId) return

      const dx = event.clientX - startX
      const dy = event.clientY - startY

      if (dx < MIN_OPEN_DX) return
      if (Math.abs(dy) > dx * MAX_VERTICAL_RATIO) {
        reset()
        return
      }

      claimed = true
      reset()
      if (isMobileRef.current) setOpenMobileRef.current(true)
      else setOpenRef.current(true)
    }

    const onPointerUp = (event: PointerEvent) => {
      const ours = event.pointerId === pointerId
      if (!ours && !claimed) return
      if (claimed) {
        claimed = false
        blockFollowingClick()
      }
      if (ours) reset()
    }

    window.addEventListener('pointerdown', onPointerDown, { capture: true })
    window.addEventListener('pointermove', onPointerMove, { capture: true })
    window.addEventListener('pointerup', onPointerUp, { capture: true })
    window.addEventListener('pointercancel', onPointerUp, { capture: true })

    return () => {
      window.removeEventListener('pointerdown', onPointerDown, { capture: true })
      window.removeEventListener('pointermove', onPointerMove, { capture: true })
      window.removeEventListener('pointerup', onPointerUp, { capture: true })
      window.removeEventListener('pointercancel', onPointerUp, { capture: true })
    }
  }, [])
}
