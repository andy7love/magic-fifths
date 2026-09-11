import { useTranslation } from 'react-i18next'

import { gradesForTonic, type ModeId } from '@/lib/music/modes'

interface GradesRowProps {
  tonicModeId: ModeId
}

export function GradesRow({ tonicModeId }: GradesRowProps) {
  const { t } = useTranslation('music')
  const grades = gradesForTonic(tonicModeId)

  return (
    <>
      <div className="mf-label mf-quality-row-label" aria-hidden="true">
        {t('rows.grades')}
      </div>
      {grades.map((grade, index) => (
        <div
          key={`grade-${index}`}
          className="mf-quality-cell"
          data-row="grades"
          data-testid="grade-cell"
          data-grade={grade}
          data-tonic-grade={grade === 1 ? 'true' : 'false'}
        >
          <span>{grade}</span>
        </div>
      ))}
    </>
  )
}
