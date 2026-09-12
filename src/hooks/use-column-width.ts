import { useCallback, useState } from 'react'

/**
 * Measures the real extent of one mode slot and republishes it as a number.
 *
 * The landscape grid sizes its seven columns with `1fr` and the portrait grid
 * sizes its seven rows with `1fr`, so there is no percentage arithmetic to get
 * wrong; this hook then turns the resulting layout into the single px value
 * that the strip, the track and every cell are built from - `--col-w` when
 * measuring `'width'`, `--row-h` when measuring `'height'`.
 *
 * Always uses `getBoundingClientRect()` (border-box). `contentRect` from
 * ResizeObserver excludes borders, and the mode columns have a 1 px left border
 * - using contentRect made every note cell ~1 px too narrow and alignment
 * deltas accumulated as 0, -1, -2, ... across the window.
 *
 * It measures through a ref callback rather than an effect, which gets the first
 * value during commit (no frame of zero-size cells) and lets React 19's ref
 * cleanup tear the observer down.
 */
export function useColumnWidth(
  axis: 'width' | 'height' = 'width',
): [number, (element: HTMLElement | null) => void] {
  const [extent, setExtent] = useState(0)

  const measureRef = useCallback(
    (element: HTMLElement | null) => {
      if (!element) return

      const publish = () => {
        const value = element.getBoundingClientRect()[axis]
        setExtent((prev) => (Math.abs(prev - value) < 0.01 ? prev : value))
      }

      publish()

      const observer = new ResizeObserver(publish)
      observer.observe(element)

      return () => observer.disconnect()
    },
    [axis],
  )

  return [extent, measureRef]
}
