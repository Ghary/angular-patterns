'use strict';

var gulp = require('gulp');
var config = require('../gulp.config')();
var $ = require('gulp-load-plugins')({
    lazy: true
});

module.exports = function(log) {
    /**
     * Compile Sass to CSS
     * @return {Stream}
     */
    gulp.task('styles', ['clean-styles'], function() {
        log('Compiling Sass --> CSS');

        return gulp
            .src(config.sassRoot)
            .pipe($.plumber()) // exit gracefully if something fails after this
            .pipe($.sass())
            .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
            .pipe(gulp.dest(config.temp));
    });
};
