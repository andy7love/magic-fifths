import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'

import {
  MIN_FLICK_VELOCITY,
  RELEASE_PROJECTION_MS,
  RUBBER_BAND_FACTOR,
  SNAP_DURATION_MS,
  VELOCITY_SAMPLE_MS,
} from '@/lib/config'
import { COLUMNS } from '@/lib/music/modes'
import { MAX_SNAP, clampSnap, offsetFor, snapFor, snapForTonic } from '@/lib/music/snap'

/**
 * The drag/snap engine for the paper strip.
 *
 * Two rules shape the whole thing:
 *
 * 1. **Nothing touches React during motion.** Both dragging and the settle
 *    animation write `--strip-x` straight onto the track node inside one rAF
 *    loop. Re-rendering 35 cells per frame is the only real performance risk
 *    here, so React sees exactly two renders per gesture: one when it starts,
 *    one when it settles.
 * 2. **All derived state is computed in `onSettle`.** The gesture stays pure
 *    motion, and observers (the UI, the URL, storage, Playwright) get a single
 *    deterministic moment to read.
 */

interface Sample {
  t: number
  x: number
}

interface DragState {
  pointerId: number
  startX: number
  startOffset: number
  samples: Sample[]
  moved: boolean
}

export interface UseFifthsStripOptions {
  /** Measured width of one mode column, in px. 0 until first layout. */
  columnWidth: number
  initialIndex: number
  onSettle?: (index: number) => void
}

export interface UseFifthsStripResult {
  snapIndex: number
  /** False while dragging or animating. Playwright waits on this. */
  settled: boolean
  trackRef: RefObject<HTMLDivElement | null>
  windowRef: RefObject<HTMLDivElement | null>
  goTo: (index: number, options?: { animate?: boolean }) => void
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void
  onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void
  onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => void
}

const TAP_SLOP_PX = 4
const WHEEL_THROTTLE_MS = 140

/**
 * Exponentially weighted so the most recent movement dominates. A raw
 * last-delta velocity is jittery enough to make identical flicks land on
 * different columns, which reads as the strip being unpredictable.
 */
function computeVelocity(samples: Sample[]): number {
  if (samples.length < 2) return 0

  const last = samples[samples.length - 1]
  const windowed = samples.filter((sample) => sample.t >= last.t - VELOCITY_SAMPLE_MS)
  if (windowed.length < 2) return 0

  const weight = 0.6
  let velocity = 0
  let seeded = false

  for (let i = 1; i < windowed.length; i += 1) {
    const dt = windowed[i].t - windowed[i - 1].t
    if (dt <= 0) continue
    const instant = (windowed[i].x - windowed[i - 1].x) / dt
    velocity = seeded ? velocity * (1 - weight) + instant * weight : instant
    seeded = true
  }

  return velocity
}

/** Strong, smooth deceleration. Reads as "thrown and caught" rather than "tweened". */
function easeOutQuart(t: number): number {
  return 1 - (1 - t) ** 4
}

export function useFifthsStrip({
  columnWidth,
  initialIndex,
  onSettle,
}: UseFifthsStripOptions): UseFifthsStripResult {
  const [snapIndex, setSnapIndex] = useState(() => clampSnap(initialIndex))
  const [settled, setSettled] = useState(true)

  const trackRef = useRef<HTMLDivElement | null>(null)
  const windowRef = useRef<HTMLDivElement | null>(null)

  const indexRef = useRef(clampSnap(initialIndex))
  const offsetRef = useRef(0)
  const frameRef = useRef<number | null>(null)
  const dragRef = useRef<DragState | null>(null)
  const columnWidthRef = useRef(columnWidth)
  const wheelAtRef = useRef(0)
  const onSettleRef = useRef(onSettle)

  // Refs are synced in effects rather than during render. Handlers only ever
  // run from user interaction, which is always after effects have flushed.
  useEffect(() => {
    onSettleRef.current = onSettle
  }, [onSettle])

  /** The only place the strip's position is written. Never goes through React. */
  const applyOffset = useCallback((offset: number) => {
    offsetRef.current = offset
    trackRef.current?.style.setProperty('--strip-x', `${offset}px`)
  }, [])

  const cancelAnimation = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
  }, [])

  const settle = useCallback(
    (index: number) => {
      applyOffset(offsetFor(index, columnWidthRef.current))
      frameRef.current = null
      indexRef.current = index
      setSnapIndex(index)
      setSettled(true)
      onSettleRef.current?.(index)
    },
    [applyOffset],
  )

  const animateTo = useCallback(
    (index: number, animate = true) => {
      cancelAnimation()

      const colW = columnWidthRef.current
      const from = offsetRef.current
      const to = offsetFor(index, colW)
      const distance = Math.abs(to - from)

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!animate || reduced || distance < 0.5 || colW <= 0) {
        settle(index)
        return
      }

      const columns = distance / colW
      const duration = Math.min(
        SNAP_DURATION_MS.max,
        Math.max(SNAP_DURATION_MS.min, columns * 190),
      )
      const start = performance.now()

      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration)
        applyOffset(from + (to - from) * easeOutQuart(progress))

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(tick)
        } else {
          settle(index)
        }
      }

      setSettled(false)
      frameRef.current = requestAnimationFrame(tick)
    },
    [applyOffset, cancelAnimation, settle],
  )

  const goTo = useCallback(
    (index: number, options?: { animate?: boolean }) => {
      animateTo(clampSnap(index), options?.animate ?? true)
    },
    [animateTo],
  )

  /** Resistance past either end, so the chain feels like it has physical ends. */
  const withRubberBand = useCallback((offset: number) => {
    const colW = columnWidthRef.current
    const min = offsetFor(MAX_SNAP, colW)
    const max = offsetFor(0, colW)
    if (offset > max) return max + (offset - max) * RUBBER_BAND_FACTOR
    if (offset < min) return min + (offset - min) * RUBBER_BAND_FACTOR
    return offset
  }, [])

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      if (columnWidthRef.current <= 0) return

      cancelAnimation()
      event.currentTarget.setPointerCapture(event.pointerId)

      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startOffset: offsetRef.current,
        samples: [{ t: event.timeStamp, x: event.clientX }],
        moved: false,
      }

      setSettled(false)
    },
    [cancelAnimation],
  )

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const drag = dragRef.current
      if (!drag || drag.pointerId !== event.pointerId) return

      const delta = event.clientX - drag.startX
      if (Math.abs(delta) > TAP_SLOP_PX) drag.moved = true

      drag.samples.push({ t: event.timeStamp, x: event.clientX })
      if (drag.samples.length > 12) drag.samples.shift()

      applyOffset(withRubberBand(drag.startOffset + delta))
    },
    [applyOffset, withRubberBand],
  )

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const drag = dragRef.current
      if (!drag || drag.pointerId !== event.pointerId) return
      dragRef.current = null

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }

      // A tap that never moved means "bring this note to the tonic column".
      if (!drag.moved) {
        const cell = (event.target as HTMLElement | null)?.closest('[data-chain-index]')
        const chainIndex = Number(cell?.getAttribute('data-chain-index'))
        if (Number.isInteger(chainIndex)) {
          animateTo(snapForTonic(chainIndex))
        } else {
          animateTo(indexRef.current)
        }
        return
      }

      const velocity = computeVelocity(drag.samples)
      const colW = columnWidthRef.current
      const projected = offsetRef.current + velocity * RELEASE_PROJECTION_MS
      let target = snapFor(projected, colW)

      // Dragging right increases the offset and moves *back* along the chain,
      // hence the inverted sign. A deliberate flick should always travel at
      // least one column, even if the finger barely covered any distance.
      if (Math.abs(velocity) >= MIN_FLICK_VELOCITY && target === indexRef.current) {
        target = clampSnap(indexRef.current + (velocity < 0 ? 1 : -1))
      }

      animateTo(target)
    },
    [animateTo],
  )

  const onKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLElement>) => {
      const current = indexRef.current
      let next: number

      switch (event.key) {
        case 'ArrowLeft':
          next = current - 1
          break
        case 'ArrowRight':
          next = current + 1
          break
        case 'PageDown':
          next = current - COLUMNS
          break
        case 'PageUp':
          next = current + COLUMNS
          break
        case 'Home':
          next = 0
          break
        case 'End':
          next = MAX_SNAP
          break
        default:
          return
      }

      event.preventDefault()
      goTo(next)
    },
    [goTo],
  )

  // Wheel needs a non-passive native listener to be able to preventDefault, so
  // a horizontal trackpad swipe moves the strip instead of the page.
  useEffect(() => {
    const node = windowRef.current
    if (!node) return

    const onWheel = (event: WheelEvent) => {
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
      if (!delta) return

      event.preventDefault()

      const now = performance.now()
      if (now - wheelAtRef.current < WHEEL_THROTTLE_MS) return
      wheelAtRef.current = now

      goTo(indexRef.current + Math.sign(delta))
    }

    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [goTo])

  // Keep the strip pinned to its column through resizes and the first layout
  // pass. Writes to the DOM only, so there is no render cascade.
  useEffect(() => {
    columnWidthRef.current = columnWidth
    if (columnWidth <= 0) return
    cancelAnimation()
    applyOffset(offsetFor(indexRef.current, columnWidth))
  }, [columnWidth, applyOffset, cancelAnimation])

  useEffect(() => cancelAnimation, [cancelAnimation])

  return {
    snapIndex,
    settled,
    trackRef,
    windowRef,
    goTo,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onKeyDown,
  }
}
