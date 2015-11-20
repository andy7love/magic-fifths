'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    runSequence = require('run-sequence'),
    config = require('../config');

// Watch files for changes & reload
gulp.task('serve', ['clean'], function () {
    runSequence('build', ['styles', 'jshint', 'watch'], function() {
        browserSync({
            notify: false,
            // Customize the BrowserSync console logging prefix
            logPrefix: 'WSK',
            // Run as an https by uncommenting 'https: true'
            // Note: this uses an unsigned certificate which on first access
            //       will present a certificate warning in the browser.
            // https: true,
            server: ['.tmp', 'app']
        });
    });
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function () {
    browserSync({
        notify: false,
        logPrefix: 'WSK',
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: 'dist'
    });
});

// Build production files, the default task
gulp.task('default', ['clean'], function (cb) {
    runSequence('build', ['styles:dist'], function() {
        runSequence('dist', cb);
    });
});