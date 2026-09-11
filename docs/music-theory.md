# Music theory notes

## Why a straight strip works

Start on F and keep going up a perfect fifth: F C G D A E B. After seven notes
every letter has been used once, and those seven notes are exactly C major.
A major scale is a stack of fifths in disguise, so laying the fifths out in a
line lets one strip carry a complete scale.

## Modes are homes, not different notes

A mode is the same seven notes with a different note treated as home. The
columns are ordered by fifths rather than by scale degree, which is why all
seven line up at once.

## The tonic sits under Ionian

Ionian is the major scale. Whichever note stops under that column is the key.
`tonic = snapIndex + 1` (`TONIC_COLUMN = 1`).

## Chord qualities never move

Three major, three minor, one diminished, always in that order. Qualities are
printed on the board because they depend on position in the scale, not on the
key.

## The 35-note chain

Five blocks of `F C G D A E B` at bb / b / natural / # / ##. Continuity holds
across block seams (`Bb → F`, `B → F#`). 29 valid snap positions (0..28), 29
distinct tonics from Cbb to C##.
