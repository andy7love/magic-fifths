define(function () {
    'use strict';

    return angular.module('magicFifths.config', [])
        .value('env', 'Development')
        .value('mobileDevice', false);
});