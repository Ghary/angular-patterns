'use strict';

var gulp = require('gulp');
var config = require('../gulp.config')();
var del = require('del');
var args = require('yargs').argv;
var $ = require('gulp-load-plugins')({
    lazy: true
});

module.exports = function(log) {
    /**
     * Inject all the spec files into the specs.html
     * @return {Stream}
     */
    gulp.task('build-specs', ['templatecache'], function(done) {
        log('building the spec runner');

        var wiredep = require('wiredep').stream;
        var templateCache = config.temp + config.templateCache.file;
        var options = config.getWiredepDefaultOptions();
        var specs = config.specs;

        if (args.startServers) {
            specs = [].concat(specs, config.serverIntegrationSpecs);
        }
        options.devDependencies = true;

        return gulp
            .src(config.specRunner)
            .pipe(wiredep(options))
            .pipe($.inject(gulp.src(config.js)))
            .pipe($.inject(gulp.src(config.testlibraries),
                {name: 'inject:testlibraries', read: false}))
            .pipe($.inject(gulp.src(config.specHelpers),
                {name: 'inject:spechelpers', read: false}))
            .pipe($.inject(gulp.src(specs),
                {name: 'inject:specs', read: false}))
            .pipe($.inject(gulp.src(templateCache),
                {name: 'inject:templates', read: false}))
            .pipe(gulp.dest(config.client));
    });

    /**
     * Build everything
     * This is separate so we can run tests on
     * optimize before handling image or fonts
     */
    gulp.task('build', ['optimize', 'images', 'fonts'], function() {
        log('Building everything');
        del(config.temp);
    });
};
