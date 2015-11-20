'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    ngAnnotate = require('gulp-ng-annotate'),
    rjs = require('gulp-requirejs'),
    config = require('../config');

gulp.task('dist', ['dist-app', 'dist-libs', 'dist-images', 'dist-html', 'dist-requirejs'], function(cb) {
    cb();
});

// Copy all files at the root level (app)
gulp.task('dist-app', function () {
    return gulp.src(config.paths.distCopy, {
        dot: true
    }).pipe(gulp.dest('dist'))
        .pipe($.size({title: 'copy'}));
});

// Copy lib files to dist.
gulp.task('dist-libs', function () {
    return gulp.src(config.paths.distCopyLibs, {
        dot: true
    }).pipe(gulp.dest('dist/js'))
        .pipe($.size({title: 'copy libs'}));
});

// Optimize images
gulp.task('dist-images', function () {
    return gulp.src(config.paths.images)
        .pipe($.imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size({title: 'images'}));
});

// Scan your HTML for assets & optimize them
gulp.task('dist-html', function () {
    return gulp.src(config.paths.htmlSource)
        // .pipe($.if('*.html', $.minifyHtml())) Error on dist when enabling html minification.
        // Output files
        .pipe(gulp.dest('dist'))
        .pipe($.size({title: 'html'}));
});

// Process requirejs to build a unique js file with all dependencies and minified.
gulp.task('dist-requirejs', function(cb) {
    rjs({
        baseUrl: 'app/src',
        name: "app",
        out: 'app.js',
        paths: {
            bundles: '../../.tmp/js'
        }
    })
        .pipe(ngAnnotate())
        .pipe($.uglify())
        .pipe(gulp.dest('dist/src')); // pipe it to the output DIR
    cb();
});