angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

})

.controller('MajorCtrl', function($scope, $ionicActionSheet, $ionicPopup) {
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

    var combineAltNotes = function(alts, notes) {
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

    $scope.scrollPosition = 0;
    $scope.selectedNoteId = 0;
    var startDragPos = $scope.scrollPosition;

    $scope.uinotes = combineAltNotes(alts, notes);

    $scope.$on('$ionicView.enter', function(e) {

    });

    $scope.onHoldMode = function() {
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: 'About this mode' },
          { text: 'Listen field using this mode' },
          { text: 'Show synonym field' }
        ],
        titleText: 'Mode options',
        cancelText: 'Cancel',
        cancel: function() {
          // add cancel code..
        },
        buttonClicked: function(index) {
          switch (index) {
            case 0:
              $ionicPopup.alert({
                title: 'About this mode',
                template: 'Lorem ipsum dolor sit amet.'
              });
              break;
            case 1:
              $ionicPopup.alert({
                title: 'Listen field from a mode',
                template: 'This feature is not implemented yet.'
              });
            break;
            case 2:
              // TODO.
              break;
          }

          return true;
        }
      });
    };
});
