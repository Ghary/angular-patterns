'use strict';

var gulp = require('gulp');
var config = require('../gulp.config')();
var $ = require('gulp-load-plugins')({
    lazy: true
});

module.exports = function(log) {
    /**
     * Wire-up the bower dependencies
     * @return {Stream}
     */
    gulp.task('wiredep', function() {
        log('Wiring the bower dependencies into the html');

        var wiredep = require('wiredep').stream;
        var options = config.getWiredepDefaultOptions();

        return gulp
            .src(config.index)
            .pipe(wiredep(options))
            .pipe($.inject(gulp.src(config.js)))
            .pipe(gulp.dest(config.client));
    });
};
