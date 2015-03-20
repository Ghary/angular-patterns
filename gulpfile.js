/* jshint node: true, -W024, -W040, -W098, -W126 */

'use strict';

var config = require('./gulp.config')();
var wrench = require('wrench');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    lazy: true
});

/**
 * yargs variables can be passed in to alter the behavior, when present.
 * Example: gulp serve-dev
 *
 * --verbose  : Various tasks will produce more output to the console.
 * --nosync   : Don't launch the browser with browser-sync when serving code.
 * --debug    : Launch debugger with node-inspector.
 * --debug-brk: Launch debugger and break on 1st line with node-inspector.
 * --startServers: Will start servers for midway tests on the test task.
 */

 /**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

/**
 * Import all gulp task files from the gulp directory
 */
wrench.readdirSyncRecursive(config.gulpDir)
    .filter(function(file) {
        return (/\.(js|coffee)$/i).test(file);
    })
    .map(function(file) {
        require(config.gulpDir + file)(log);
    });

/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

module.exports = gulp;
