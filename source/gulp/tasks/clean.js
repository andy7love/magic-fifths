'use strict';

var gulp = require('gulp'),
    del = require('del');

// Clean output directory
gulp.task('clean', del.bind(null, ['.tmp', 'dist/*', '!dist/.git'], {dot: true}));