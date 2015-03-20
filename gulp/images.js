'use strict';

var gulp = require('gulp');
var config = require('../gulp.config')();
var $ = require('gulp-load-plugins')({
    lazy: true
});

module.exports = function(log) {
    /**
     * Compress images
     * @return {Stream}
     */
    gulp.task('images', ['clean-images'], function() {
        log('Compressing and copying images');

        return gulp
            .src(config.images)
            .pipe($.imagemin({optimizationLevel: 4}))
            .pipe(gulp.dest(config.build + 'images'));
    });
};
