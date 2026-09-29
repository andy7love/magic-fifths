import { useEffect, useRef } from 'react'

import { useSidebar } from '@/components/ui/sidebar'
import { SIDEBAR_EDGE_SWIPE_PX } from '@/lib/config'

/** Minimum horizontal travel before the drawer opens. */
const MIN_OPEN_DX = 48

/** Reject mostly-vertical gestures so board taps stay taps. */
const MAX_VERTICAL_RATIO = 0.75

/**
 * Opens the offcanvas sidebar on a rightward swipe that begins at the left
 * screen edge.
 *
 * The hanging paper covers that edge, so the strip engine refuses drags that
 * start inside the same zone. Drags that start further in never reach here,
 * and a mostly-vertical move inside the zone does not open the drawer.
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
        window.removeEventListener('click', blockClick, true)
      }
      window.addEventListener('click', blockClick, true)
    }

    const onPointerDown = (event: PointerEvent) => {
      if (openRef.current) return
      if (event.pointerType === 'mouse' && event.button !== 0) return
      if (event.clientX > SIDEBAR_EDGE_SWIPE_PX) return

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
