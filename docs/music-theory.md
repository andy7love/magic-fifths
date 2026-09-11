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

## The tonic is grade 1

The degrees row shows 1–7 relative to whichever mode you treat as home. Tap a
mode name to move grade 1 there. The note under that column is the tonic:

`tonic = snapIndex + tonicColumn`

By default `tonicColumn` is Ionian (column 1). Ionian is the everyday **Major**
scale; Aeolian is the everyday **Minor** — both are labelled on the board.

## Chord qualities never move

Three major, three minor, one diminished, always in that order relative to the
parent major scale. Qualities are printed on the board because they depend on
position in that parent scale, not on which mode is currently grade 1.

## The 35-note chain

Five blocks of `F C G D A E B` at bb / b / natural / # / ##. Continuity holds
across block seams (`Bb → F`, `B → F#`). 29 valid snap positions (0..28). With
Ionian as home there are 29 distinct tonics from Cbb to C##.
