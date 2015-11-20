'use strict';

var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    config = require('../config');

gulp.task('watch', function () {
    gulp.watch(config.paths.htmlSource, reload);
    gulp.watch(config.paths.templates, ['build-templates', reload]);
    gulp.watch(config.paths.styles, ['styles', reload]);
    gulp.watch(config.paths.styles, ['styles', reload]);
    gulp.watch(config.paths.jsSource, ['jshint', reload]);
    gulp.watch(config.paths.images, reload);
});