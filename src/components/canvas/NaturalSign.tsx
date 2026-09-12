/**
 * Classic natural (♮): left stem up, right stem down, slanted bars that stop
 * at the stems — not a sharp (♯), whose bars cross through both stems.
 *
 * Stroke-drawn with modest weight. Inter's upright ♮ glyph is never used;
 * that glyph reads like ♯ / "h" once the landscape chord column is vertical.
 */
export function NaturalSign() {
  return (
    <span className="mf-natural">
      <span className="sr-only">{'\u266e'}</span>
      <svg viewBox="0 0 16 36" aria-hidden="true">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2.45"
          strokeLinecap="square"
          strokeLinejoin="miter"
          d="
            M4 1.5 V26.5
            M12 9.5 V34.5
            M4 13.2 L12 9.5
            M4 26.5 L12 22.8
          "
        />
      </svg>
    </span>
  )
}
