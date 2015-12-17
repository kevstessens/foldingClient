/* jshint -W079 */ // prevent redefinition of $ warning

'use strict';
// gulp
var gulp = require('gulp');
var paths = gulp.paths;
// plugins
var $ = require('gulp-load-plugins')();

var fixmyjs = require("gulp-fixmyjs");


var fixjs = function () {
  return function () {
    return gulp.src(paths.jsFixFiles)
      .pipe(fixmyjs())
      .pipe(gulp.dest("app"));
  };
};

gulp.task('fix-js', fixjs());

// check for jsonlint errors
var jsonlint = function (fail) {
  var failReporter = function (file) {
    throw new Error(file.path + '\n' + file.jsonlint.message);
  };
  return function () {
    return gulp.src(paths.jsonFiles)
      .pipe($.jsonlint())
      .pipe($.jsonlint.reporter(fail ? failReporter : undefined));
  };
};
