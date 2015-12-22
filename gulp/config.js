'use strict';

module.exports = {
    AUTOPREFIXER_BROWSERS: [
        'ie >= 10',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
    ],
    paths : {
        templates: [
            'app/src/**/*.html'
        ],
        images: [
            'app/images/**/*'
        ],
        libs: [
            'app/vendor/fastclick/lib/fastclick.js',
            'app/vendor/hammerjs/hammer.js',
            'app/vendor/angular/angular.js',
            'app/vendor/html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js',
            'app/vendor/angular-route/angular-route.js',
            'app/vendor/angular-animate/angular-animate.js',
            'app/vendor/angular-ui-router/release/angular-ui-router.js',
            'app/vendor/AngularHammer/angular.hammer.min.js',
            //'app/vendor/ngCordova/dist/ng-cordova.min.js'
        ],
        styles: [
            'app/src/*.scss',
            'app/src/**/*.scss'
        ],
        htmlSource: [
            'app/*.html'
        ],
        jsSource: [
            'app/src/**/*.js',
            'app/src/*.js'
        ],
        requirejs: 'app/vendor/requirejs/require.js',
        distCopy: [
            'app/**/*',
            '!app/src',
            '!app/src/**/*',
            '!app/images',
            '!app/images/**/*',
            '!app/vendor',
            '!app/vendor/**/*',
            '!app/*.html',
            'node_modules/apache-server-configs/dist/.htaccess'
        ],
        distCopyLibs: [
            '.tmp/js/libs.js',
            '.tmp/js/templates.js',
            '.tmp/js/require.js'
        ],
        mobileDir: 'phonegap/www',
        mobileCopy: [
            'dist/**/*',
            '!dist/index.html',
            '!dist/index-mobile.html',
            '!dist/.htaccess',
            '!dist/favicon.ico',
            '!dist/humans.txt',
            '!dist/manifest.json',
            '!dist/manifest.webapp',
            '!dist/robots.txt'
        ]
    }
};