'use strict';

var gulp = require('gulp');
var config = require('../gulp.config')();
var browserSync = require('browser-sync');
var args = require('yargs').argv;
var $ = require('gulp-load-plugins')({
    lazy: true
});

module.exports = function(log) {
    var port = process.env.PORT || config.defaultPort;

    /**
     * When files change, log it
     * @param  {Object} event - event that fired
     */
    function changeEvent(event) {
        var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
        log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
    }

    /**
     * Start BrowserSync
     * --nosync will avoid browserSync
     */
    function startBrowserSync(isDev, specRunner) {
        if (args.nosync || browserSync.active) {
            return;
        }

        log('Starting BrowserSync on port ' + port);

        // If build: watches the files, builds, and restarts browser-sync.
        // If dev: watches sass, compiles it to css, browser-sync handles reload
        if (isDev) {
            gulp.watch([config.sass], ['styles'])
                .on('change', changeEvent);
        } else {
            gulp.watch([config.sass, config.js, config.html], ['optimize', browserSync.reload])
                .on('change', changeEvent);
        }

        var options = {
            proxy: 'localhost:' + port,
            port: 3000,
            files: isDev ? [
                config.client + '**/*.*',
                '!' + config.sass,
                config.temp + '**/*.css'
            ] : [],
            ghostMode: { // these are the defaults t,f,t,t
                clicks: true,
                location: false,
                forms: true,
                scroll: true
            },
            injectChanges: true,
            logFileChanges: true,
            logLevel: 'debug',
            logPrefix: 'angular-template',
            notify: true,
            reloadDelay: 0 //1000
        } ;
        if (specRunner) {
            options.startPath = config.specRunnerFile;
        }

        browserSync(options);
    }

    /**
     * serve the code
     * --debug-brk or --debug
     * --nosync
     * @param  {Boolean} isDev - dev or build mode
     * @param  {Boolean} specRunner - server spec runner html
     */
    function serve(isDev, specRunner) {
        var debug = args.debug || args.debugBrk;
        var exec;
        var nodeOptions = {
            script: config.nodeServer,
            delayTime: 1,
            env: {
                'PORT': port,
                'NODE_ENV': isDev ? 'dev' : 'build'
            },
            watch: [config.server]
        };

        if (debug) {
            log('Running node-inspector. Browse to http://localhost:8080/debug?port=5858');
            exec = require('child_process').exec;
            exec('node-inspector');
            nodeOptions.nodeArgs = ['--debug=5858'];
        }

        return $.nodemon(nodeOptions)
            .on('restart', ['vet'], function(ev) {
                log('*** nodemon restarted');
                log('files changed:\n' + ev);
                setTimeout(function() {
                    browserSync.notify('reloading now ...');
                    browserSync.reload({stream: false});
                }, config.browserReloadDelay);
            })
            .on('start', function () {
                log('*** nodemon started');
                startBrowserSync(isDev, specRunner);
            })
            .on('crash', function () {
                log('*** nodemon crashed: script crashed for some reason');
            })
            .on('exit', function () {
                log('*** nodemon exited cleanly');
            });
    }

    /**
     * Run the spec runner
     * @return {Stream}
     */
    gulp.task('serve-specs', ['build-specs'], function(done) {
        log('run the spec runner');
        serve(true /* isDev */, true /* specRunner */);
        done();
    });

    /**
     * serve the dev environment
     * --debug-brk or --debug
     * --nosync
     */
    gulp.task('serve-dev', ['inject'], function() {
        serve(true /*isDev*/);
    });

    /**
     * serve the build environment
     * --debug-brk or --debug
     * --nosync
     */
    gulp.task('serve-build', ['build'], function() {
        var msg = {
            title: 'gulp build',
            subtitle: 'Deployed to the build folder',
            message: 'Running `gulp serve-build`'
        };
        log(msg);
        notify(msg);
        serve(false /*isDev*/);
    });
};
