'use strict';

var gulp = require('gulp');
var config = require('../gulp.config')();

module.exports = function(log) {
    gulp.task('sass-watcher', function() {
        gulp.watch([config.sass], ['styles']);
    });
};
