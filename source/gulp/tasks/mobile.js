'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    del = require('del'),
    rename = require('gulp-rename'),
    config = require('../config');

gulp.task('mobile', ['mobile:copy'], function () {
    var mobileIndex = config.paths.mobileDir + '/index-mobile.html';

    return gulp.src('dist/index-mobile.html')
        .pipe(rename(function (path) {
            path.basename = "index";
        }))
        .pipe(gulp.dest(config.paths.mobileDir));
});

gulp.task('mobile:copy', ['mobile:clean'], function () {
    return gulp.src(config.paths.mobileCopy)
        .pipe(gulp.dest(config.paths.mobileDir));
});

gulp.task('mobile:clean', del.bind(null, config.paths.mobileDir + '/**/*', {dot: true}));