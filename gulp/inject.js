'use strict';

var gulp = require('gulp');
var config = require('../gulp.config')();
var $ = require('gulp-load-plugins')({
    lazy: true
});

module.exports = function(log) {
    gulp.task('inject', ['wiredep', 'styles', 'templatecache'], function() {
        log('Wire up css into the html, after files are ready');

        return gulp
            .src(config.index)
            .pipe($.inject(gulp.src(config.css)))
            .pipe(gulp.dest(config.client));
    });
};
