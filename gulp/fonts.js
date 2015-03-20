'use strict';

var gulp = require('gulp');
var config = require('../gulp.config')();

module.exports = function(log) {
    /**
     * Copy fonts
     * @return {Stream}
     */
    gulp.task('fonts', ['clean-fonts'], function() {
        log('Copying fonts');

        return gulp
            .src(config.fonts)
            .pipe(gulp.dest(config.build + 'fonts'));
    });
};
