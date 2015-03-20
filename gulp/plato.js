'use strict';

var gulp = require('gulp');
var config = require('../gulp.config')();
var glob = require('glob');
var args = require('yargs').argv;

module.exports = function(log) {
    /**
     * Create a visualizer report
     */
    gulp.task('plato', function(done) {
        log('Analyzing source with Plato');
        log('Browse to /report/plato/index.html to see Plato results');

        startPlatoVisualizer(done);
    });

    /**
     * Start Plato inspector and visualizer
     */
    function startPlatoVisualizer(done) {
        log('Running Plato');

        var files = glob.sync(config.plato.js);
        var excludeFiles = /.*\.spec\.js/;
        var plato = require('plato');

        var options = {
            title: 'Plato Inspections Report',
            exclude: excludeFiles
        };
        var outputDir = config.report + '/plato';

        plato.inspect(files, outputDir, options, platoCompleted);

        function platoCompleted(report) {
            var overview = plato.getOverviewReport(report);
            if (args.verbose) {
                log(overview.summary);
            }
            if (done) { done(); }
        }
    }
};
