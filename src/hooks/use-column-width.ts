import { useCallback, useState } from 'react'

/**
 * Measures the real width of one mode column and republishes it as a number.
 *
 * The canvas grid sizes its seven columns with `1fr`, so there is no percentage
 * arithmetic to get wrong; this hook then turns the resulting layout into the
 * single px value that the strip, the track and every cell are built from.
 *
 * It measures through a ref callback rather than an effect, which gets the first
 * value during commit (no frame of zero-width cells) and lets React 19's ref
 * cleanup tear the observer down.
 */
export function useColumnWidth(): [number, (element: HTMLElement | null) => void] {
  const [columnWidth, setColumnWidth] = useState(0)

  const measureRef = useCallback((element: HTMLElement | null) => {
    if (!element) return

    setColumnWidth(element.getBoundingClientRect().width)

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) setColumnWidth(entry.contentRect.width)
    })
    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return [columnWidth, measureRef]
}
