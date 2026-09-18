import { useEffect, useRef } from 'react'

import { useSidebar } from '@/components/ui/sidebar'

/** How far from the left screen edge a swipe-to-open may begin. */
const EDGE_PX = 22

/** Minimum horizontal travel before the drawer opens. */
const MIN_OPEN_DX = 48

/** Reject mostly-vertical gestures so board taps / strip flicks stay clean. */
const MAX_VERTICAL_RATIO = 0.75

/**
 * Opens the offcanvas sidebar when the user swipes right from the left screen
 * edge. Ignores gestures that begin on the fifths strip so strip dragging wins.
 */
export function useSidebarEdgeSwipe() {
  const { open, openMobile, isMobile, setOpen, setOpenMobile } = useSidebar()
  const openRef = useRef(false)

  useEffect(() => {
    openRef.current = isMobile ? openMobile : open
  }, [isMobile, open, openMobile])

  useEffect(() => {
    let startX = 0
    let startY = 0
    let tracking = false
    let pointerId: number | null = null

    const reset = () => {
      tracking = false
      pointerId = null
    }

    const onPointerDown = (event: PointerEvent) => {
      if (openRef.current) return
      if (event.pointerType === 'mouse' && event.button !== 0) return
      if (event.clientX > EDGE_PX) return

      const target = event.target
      if (
        target instanceof Element &&
        target.closest('[data-testid="fifths-strip"]')
      ) {
        return
      }

      tracking = true
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

      reset()
      if (isMobile) setOpenMobile(true)
      else setOpen(true)
    }

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerId === pointerId) reset()
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
  }, [isMobile, setOpen, setOpenMobile])
}
