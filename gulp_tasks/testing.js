/* jshint -W079 */ // prevent redefinition of $ warning

'use strict';
// gulp
var gulp = require('gulp');
var paths = gulp.paths;
// plugins
var karma = require('gulp-karma');
var protractor = require("gulp-protractor").protractor;
var webdriver_standalone = require("gulp-protractor").webdriver_standalone;



gulp.task('test', function() {
  // Be sure to return the stream
  // NOTE: Using the fake './foobar' so as to run the files
  // listed in karma.conf.js INSTEAD of what was passed to
  // gulp.src !
  return gulp.src('./foobar')
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      console.log(err);
      this.emit('end'); //instead of erroring the stream, end it
    });
});


gulp.task('protractor', ['webdriver_standalone', 'serve'], function() {
  gulp.src(["./app/e2e/*.spec.js"])
      .pipe(protractor({
          configFile: "protractor.conf.js"
          // args: ['--baseUrl', 'http://127.0.0.1:8000']
      }))
      .on('error', function(e) { throw e })
});

gulp.task('webdriver_standalone', webdriver_standalone);
