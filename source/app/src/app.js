require.config({
    baseUrl: 'src',
    paths: {
        bundles: '../js'
    },
    namespace: "magicFifths"
});

define([
    "config",
    "scales/major.controller"
], function() {
    'use strict';

    function startApp() {
        // Start the main app logic.
        angular.module('magicFifths', [
            // Angular libraries
            'ui.router',
            'ngRoute',
            'ngAnimate',
            'hmTouchEvents',
            // ngCordova,
            //'ngCordova',
            // Foundation UI components
            'foundation',
            // Templates
            'templates',
            // App modules
            'magicFifths.config',
            'magicFifths.major'
        ])
        .config(config)
        .run(run);

        function config($urlRouterProvider, $locationProvider) {
            $urlRouterProvider.otherwise('/major');

            // Use this to enable HTML5 mode
            $locationProvider
                .html5Mode(false)
                .hashPrefix('');
        }

        function run() {
            // Enable FastClick to remove the 300ms click delay on touch devices
            FastClick.attach(document.body);
        }

        angular.bootstrap(document, ['magicFifths']);
    }

    function usingPhonegap() {
        return (document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1);
    }

    if(usingPhonegap()) {
        window.deviceReady(startApp);
    } else {
        startApp();
    }
});

