/**
 * Scale registry. Only the major scale is modelled today; the others are listed
 * so the sidebar can show where the app is going without pretending they work.
 */

export interface Scale {
  id: string
  available: boolean
}

export const SCALES: readonly Scale[] = [
  { id: 'major', available: true },
  { id: 'minor', available: false },
  { id: 'harmonicMinor', available: false },
]

export const DEFAULT_SCALE_ID = 'major'

export function isScaleId(value: unknown): value is string {
  return typeof value === 'string' && SCALES.some((scale) => scale.id === value)
}

export function isAvailableScaleId(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    SCALES.some((scale) => scale.id === value && scale.available)
  )
}
