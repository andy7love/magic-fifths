angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

})

.controller('MajorCtrl', function($scope, $ionicActionSheet, $ionicPopup, theory) {
    $scope.selectedNote = 14;
    $scope.modes = theory.getModes();
    $scope.uinotes = theory.getCombinedAlteredNotes();

    $scope.$on('note-change', function(event, data) {
      $scope.$apply(function() {
        $scope.selectedNote = data;
      });
    });

    $scope.$on('$ionicView.enter', function(e) {
      // restore note?
    });

    var showSynonymField = function() {
      var synonymFieldNote = $scope.selectedNote+12;
      if(synonymFieldNote > 24) {
        synonymFieldNote = $scope.selectedNote-12;
      }
      $scope.selectedNote = synonymFieldNote;
    };

    $scope.onTapMode = function() {
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
              // About mode.
              $ionicPopup.alert({
                title: 'About this mode',
                template: 'Lorem ipsum dolor sit amet.'
              });
              break;
            case 1:
              // Listen field from a node.
              $ionicPopup.alert({
                title: 'Listen field from a mode',
                template: 'This feature is not implemented yet.'
              });
            break;
            case 2:
              // Synonym Field.
              showSynonymField();
              break;
          }

          return true;
        }
      });
    };
});
