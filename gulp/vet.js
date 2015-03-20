'use strict';

var gulp = require('gulp');
var config = require('../gulp.config')();
var args = require('yargs').argv;
var $ = require('gulp-load-plugins')({
    lazy: true
});

module.exports = function(log) {
    /**
    * vet the code and create coverage report
    * @return {Stream}
    */
    gulp.task('vet', function() {
        log('Analyzing source with JSHint and JSCS');

        return gulp
            .src(config.alljs)
            .pipe($.if(args.verbose, $.print()))
            .pipe($.jshint())
            .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
            .pipe($.jshint.reporter('fail'))
            .pipe($.jscs());
    });
};
