define(function () {
    'use strict';

    function combineAltNotes(alts, notes) {
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
    }

    return angular.module('magicFifths.major', ['ngRoute'])
        .config(function($stateProvider) {
            $stateProvider
                .state('major', {
                    url: '/major',
                    templateUrl: 'scales/major.html',
                    controller: 'MajorController',
                    animation: {
                        enter: 'slideInRight',
                        leave: 'slideOutRight'
                    }
                });
        })
        .controller('MajorController', function ($scope) {
            $scope.modes = [
                {id: 1, name: 'Lidio', chord: 'Maj(#11)'},
                {id: 2, name: 'Jonico', chord: 'Maj7'},
                {id: 3, name: 'Mixolidio', chord: '7'},
                {id: 4, name: 'Dorico', chord: 'm7'},
                {id: 5, name: 'Eolico', chord: 'm(b6)'},
                {id: 6, name: 'Frigio', chord: 'm7(b9)'},
                {id: 7, name: 'Locrio', chord: 'm7(b5)'}
            ];

            var notes = [
                {id: 1, name: 'Fa'},
                {id: 2, name: 'Do'},
                {id: 3, name: 'Sol'},
                {id: 4, name: 'Re'},
                {id: 5, name: 'La'},
                {id: 6, name: 'Mi'},
                {id: 7, name: 'Si'}
            ];

            var alts = [
                {id: 1, name: 'bb'},
                {id: 2, name: 'b'},
                {id: 3, name: '[]'},
                {id: 4, name: '#'},
                {id: 5, name: 'x'}
            ];

            $scope.scrollPosition = 0;
            $scope.selectedNoteId = 0;
            var startDragPos = $scope.scrollPosition;

            $scope.onPan = function(evnt) {
                var scrollerWidth = document.querySelectorAll(".modes-wrapper")[0].clientWidth;
                var noteWidth = window.innerWidth/$scope.modes.length;
                var totalWidth = $scope.uinotes.length * noteWidth;
                var dragMargin = 25;

                var distance = evnt.deltaX;
                var finalPosition = startDragPos + distance;
                var minPos = scrollerWidth - totalWidth - dragMargin;

                if(finalPosition > dragMargin) {
                    finalPosition = dragMargin;
                } else if(finalPosition < minPos) {
                    finalPosition = minPos;
                }

                if(evnt.isFinal) {
                    var selectedNote =  Math.round(-finalPosition/noteWidth);
                    $scope.goToNote(selectedNote);
                } else {
                    $scope.scrollPosition = finalPosition;
                }
            };

            $scope.goToNote = function(note) {
                var noteWidth = window.innerWidth/$scope.modes.length;
                var finalPosition = -note*noteWidth;
                $scope.selectedNoteId = note;
                $scope.scrollPosition = finalPosition;
                startDragPos = $scope.scrollPosition;
            };

            $scope.synonymField = function() {
                var synonymFieldNote = $scope.selectedNoteId+12;
                if(synonymFieldNote > 24) {
                    synonymFieldNote = $scope.selectedNoteId-12;
                }
                $scope.goToNote(synonymFieldNote);
            };

            $scope.shareField = function() {
                alert('Not implemented yet');
            };

            $scope.uinotes = combineAltNotes(alts, notes);

            $scope.$on('$viewContentLoaded', function() {
                $scope.goToNote(14);
            });
        });
});