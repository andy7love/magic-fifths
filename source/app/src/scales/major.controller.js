define(function () {
    'use strict';

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
        .controller('MajorController', function ($scope, FoundationApi) {
            $scope.modes = [
                {id: 1, name: 'Lidio'},
                {id: 2, name: 'Jonico'},
                {id: 3, name: 'Mixolidio'},
                {id: 4, name: 'Dorico'},
                {id: 5, name: 'Eolico'},
                {id: 6, name: 'Frigio'},
                {id: 7, name: 'Locrio'}
            ];

            $scope.notes = [
                {id: 1, name: 'Fa'},
                {id: 2, name: 'Do'},
                {id: 3, name: 'Sol'},
                {id: 4, name: 'Re'},
                {id: 5, name: 'La'},
                {id: 6, name: 'Mi'},
                {id: 7, name: 'Si'}
            ];

            $scope.alts = [
                {id: 1, name: 'b'},
                {id: 2, name: '[]'},
                {id: 3, name: '#'}
            ];
        });
});