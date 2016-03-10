angular.module('starter.directives', [])

  .directive('mfScroller', function($ionicGesture, $ionicSideMenuDelegate) {
    return {
      restrict :  'A',
      scope: {
        noteIndex: '='
      },

      link : function($scope, elem, attrs) {
        var scrollPosition = 0,
          startPosition = null,

          setPosition = function (position) {
            scrollPosition = position;
            elem.attr('style', 'transform: translate3d(' + scrollPosition + 'px, 0px, 0px)');
          },

          noteIndexToPosition = function(noteIndex) {
            var totalWidth = elem.width();
            var totalItems = elem.children().length;
            var itemWidth = totalWidth/totalItems;
            var newPosition = -itemWidth*noteIndex;
            return newPosition;
          };

        $scope.$watch('noteIndex', function() {
          setPosition(noteIndexToPosition($scope.noteIndex));
        });

        $ionicGesture.on('touch', function(e) {
          $ionicSideMenuDelegate.canDragContent(false);
          startPosition = scrollPosition;
          elem.addClass('dragging');
        }, elem);

        $ionicGesture.on('drag', function(e) {
          setPosition(startPosition + e.gesture.deltaX);
        }, elem);

        $ionicGesture.on('release', function(e) {
          $ionicSideMenuDelegate.canDragContent(true);
          startPosition = null;
          elem.removeClass('dragging');

          var totalWidth = elem.width();
          var scrollerWidth = elem.parent().width();
          var totalItems = elem.children().length;
          var itemWidth = totalWidth/totalItems;
          var itemsPerPage = scrollerWidth / itemWidth;
          var maxItemToSelect = totalItems - itemsPerPage;
          // Selected item with decelerate effect = current item position + swipe velocity factor.
          var selectedItem = Math.round(-scrollPosition/itemWidth) + Math.round(e.gesture.velocityX*Math.sign(-e.gesture.deltaX));
          if(selectedItem > maxItemToSelect) {
            selectedItem = maxItemToSelect;
          } else if(selectedItem < 0) {
            selectedItem = 0;
          }

          $scope.$emit('note-change', selectedItem);
        }, elem);
      }
    }
  });
