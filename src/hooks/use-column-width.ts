import { useCallback, useState } from 'react'

/**
 * Measures the real width of one mode column and republishes it as a number.
 *
 * The canvas grid sizes its seven columns with `1fr`, so there is no percentage
 * arithmetic to get wrong; this hook then turns the resulting layout into the
 * single px value that the strip, the track and every cell are built from.
 *
 * Always uses `getBoundingClientRect().width` (border-box). `contentRect` from
 * ResizeObserver excludes borders, and the mode columns have a 1 px left border
 * - using contentRect made every note cell ~1 px too narrow and alignment
 * deltas accumulated as 0, -1, -2, ... across the window.
 *
 * It measures through a ref callback rather than an effect, which gets the first
 * value during commit (no frame of zero-width cells) and lets React 19's ref
 * cleanup tear the observer down.
 */
export function useColumnWidth(): [number, (element: HTMLElement | null) => void] {
  const [columnWidth, setColumnWidth] = useState(0)

  const measureRef = useCallback((element: HTMLElement | null) => {
    if (!element) return

    const publish = () => {
      const width = element.getBoundingClientRect().width
      setColumnWidth((prev) => (Math.abs(prev - width) < 0.01 ? prev : width))
    }

    publish()

    const observer = new ResizeObserver(publish)
    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return [columnWidth, measureRef]
}
