import { useTranslation } from 'react-i18next'

import { degreeNameId, type ModeId } from '@/lib/music/modes'

interface GradeMarksProps {
  grade: number
  tonicModeId: ModeId
  showName: boolean
}

/** The degree number, and optionally its functional name (Tonic, Dominant, …). */
export function GradeMarks({ grade, tonicModeId, showName }: GradeMarksProps) {
  const { t } = useTranslation('music')
  const nameId = degreeNameId(grade, tonicModeId)

  return (
    <>
      <span className="mf-grade-num">{grade}</span>
      {showName ? (
        <span className="mf-grade-name" data-testid="grade-name" data-grade-name={nameId}>
          {t(`degreeNames.${nameId}` as 'degreeNames.tonic')}
        </span>
      ) : null}
    </>
  )
}
