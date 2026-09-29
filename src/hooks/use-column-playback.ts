import { useCallback } from 'react'

import { useSettings } from '@/context/settings'
import { playChords } from '@/lib/audio/piano'
import { spellVoice, type VoiceKind } from '@/lib/music/voicing'

/** Play the triad, tetrad, or scale sitting in one mode column. */
export function useColumnPlayback(snapIndex: number) {
  const { playbackStyle, arpeggioMs, advancedChords } = useSettings()

  return useCallback(
    (column: number, kind: VoiceKind) => {
      playChords([spellVoice(snapIndex, column, kind, advancedChords)], {
        style: playbackStyle,
        arpeggioSeconds: arpeggioMs / 1000,
      })
    },
    [advancedChords, arpeggioMs, playbackStyle, snapIndex],
  )
}
