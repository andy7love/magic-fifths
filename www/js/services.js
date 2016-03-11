angular.module('starter.services', [])
  .factory('theory', function() {
    var modes = [
        {id: 1, name: 'Lidio', chord: 'Maj(#11)'},
        {id: 2, name: 'Jonico', chord: 'Maj7'},
        {id: 3, name: 'Mixolidio', chord: '7'},
        {id: 4, name: 'Dorico', chord: 'm7'},
        {id: 5, name: 'Eolico', chord: 'm(b6)'},
        {id: 6, name: 'Frigio', chord: 'm7(b9)'},
        {id: 7, name: 'Locrio', chord: 'm7(b5)'}
      ],
      notes = [
        {id: 1, name: 'Fa'},
        {id: 2, name: 'Do'},
        {id: 3, name: 'Sol'},
        {id: 4, name: 'Re'},
        {id: 5, name: 'La'},
        {id: 6, name: 'Mi'},
        {id: 7, name: 'Si'}
      ],
      alterations = [
        {id: 1, name: 'bb'},
        {id: 2, name: 'b'},
        {id: 3, name: '[]'},
        {id: 4, name: '#'},
        {id: 5, name: 'x'}
      ],

      combineAltNotes = function(alts, notes) {
        var combinedNotes = [];
        var i = 0;
        alts.forEach(function(alt) {
          notes.forEach(function(note) {
            combinedNotes.push({
              id: i,
              alt: alt.name,
              note: note.name
            });
            i++;
          });
        });
        return combinedNotes;
      };

    return {
      getModes: function() {
        return modes;
      },
      getNotes: function() {
        return notes;
      },
      getAlterations: function() {
        return alterations;
      },
      getCombinedAlteredNotes: function() {
        return combineAltNotes(alterations, notes);
      }
    };
  });
