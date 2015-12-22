'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    runSequence = require('run-sequence'),
    config = require('../config');

gulp.task('build', ['build-requirejsLib'], function(cb) {
    runSequence('build-libs', ['build-templates'], cb);
});

gulp.task('build-requirejsLib', function(cb) {
    return gulp.src(config.paths.requirejs)
        .pipe($.uglify())
        .pipe($.concat('require.js'))
        .pipe(gulp.dest('.tmp/js'))
        ;
});

gulp.task('build-libs', function(cb) {
    return gulp.src(config.paths.libs)
        .pipe($.uglify())
        .pipe($.concat('libs.js'))
        .pipe(gulp.dest('.tmp/js'))
        ;
});

gulp.task('build-templates', function(cb) {
    return gulp.src(config.paths.templates)
        .pipe($.ngHtml2js({
            moduleName: 'templates',
            declareModule: true
        }))
        .pipe($.uglify())
        .pipe($.concat('templates.js'))
        .pipe(gulp.dest('.tmp/js'))
        ;
});