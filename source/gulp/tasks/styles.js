'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    minifyCss = require('gulp-minify-css'),
    config = require('../config');

// Compile and automatically prefix stylesheets
gulp.task('styles', function () {
    // For best performance, don't add Sass partials to `gulp.src`
    return gulp.src(config.paths.styles)
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            precision: 10,
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe($.autoprefixer({browsers: config.AUTOPREFIXER_BROWSERS}))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('.tmp/styles'))
        .pipe($.size({title: 'styles'}));
});

gulp.task('styles:dist', function () {
    // For best performance, don't add Sass partials to `gulp.src`
    return gulp.src(config.paths.styles)
        .pipe($.sass({
            precision: 10,
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe($.autoprefixer({browsers: config.AUTOPREFIXER_BROWSERS}))
        .pipe(minifyCss())
        // Concatenate and minify styles
        .pipe(gulp.dest('dist/styles'))
        .pipe($.size({title: 'styles'}));
});