import { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { useSettings } from '@/context/settings'
import type { ChainNote } from '@/lib/music/notes'

interface NoteCellProps {
  note: ChainNote
  inWindow: boolean
  modeId?: string
}

export const NoteCell = memo(function NoteCell({ note, inWindow, modeId }: NoteCellProps) {
  const { t } = useTranslation('music')
  const { notation } = useSettings()

  return (
    <div
      className="mf-note-cell"
      data-testid="note-cell"
      data-chain-index={note.index}
      data-note={note.ascii}
      data-notation={notation}
      data-in-window={inWindow ? 'true' : 'false'}
      data-mode={modeId}
    >
      {notation === 'solfege' ? (
        <span className="mf-note-solfege">{t(note.solfegeKey as 'solfege.do')}</span>
      ) : (
        <span className="mf-note-letter">{note.letter}</span>
      )}
      <span className="mf-note-accidental" aria-hidden={note.glyph === ''}>
        {note.glyph || '\u00a0'}
      </span>
    </div>
  )
})
