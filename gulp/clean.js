'use strict';

var gulp = require('gulp');
var config = require('../gulp.config')();
var del = require('del');
var $ = require('gulp-load-plugins')({
    lazy: true
});

module.exports = function(log) {
    /**
     * Delete all files in a given path
     * @param  {Array}   path - array of paths to delete
     * @param  {Function} done - callback when complete
     */
    function clean(path, done) {
        log('Cleaning: ' + $.util.colors.blue(path));
        del(path, done);
    }

    /**
     * Remove all files from the build, temp, and reports folders
     * @param  {Function} done - callback when complete
     */
    gulp.task('clean', function(done) {
        var delconfig = [].concat(config.build, config.sassCache, config.temp, config.report);
        log('Cleaning: ' + $.util.colors.blue(delconfig));
        del(delconfig, done);
    });

    /**
     * Remove all fonts from the build folder
     * @param  {Function} done - callback when complete
     */
    gulp.task('clean-fonts', function(done) {
        clean(config.build + 'fonts/**/*.*', done);
    });

    /**
     * Remove all images from the build folder
     * @param  {Function} done - callback when complete
     */
    gulp.task('clean-images', function(done) {
        clean(config.build + 'images/**/*.*', done);
    });

    /**
     * Remove all styles from the build and temp folders
     * @param  {Function} done - callback when complete
     */
    gulp.task('clean-styles', function(done) {
        var files = [].concat(
            config.temp + '**/*.css',
            config.build + 'styles/**/*.css'
        );
        clean(files, done);
    });

    /**
     * Remove all js and html from the build and temp folders
     * @param  {Function} done - callback when complete
     */
    gulp.task('clean-code', function(done) {
        var files = [].concat(
            config.temp + '**/*.js',
            config.build + 'js/**/*.js',
            config.build + '**/*.html'
        );
        clean(files, done);
    });
};
