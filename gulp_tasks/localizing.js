/* jshint -W079 */ // prevent redefinition of $ warning

'use strict';
// gulp
var gulp = require('gulp');
var options = gulp.options;
var paths = gulp.paths;
var jsoncombine = require("gulp-jsoncombine");

var buildLocales = function () {
  var languages = ["en","es"];

  for (var ks= 0; ks < languages.length; ks++) {
    var localeKey = languages[ks];
    buildLocaleFor(localeKey);
  }
};

gulp.task('localize', buildLocales());

function buildLocaleFor(localeKey){
  gulp.src("app/main/**/*-" + localeKey + ".i18n")
    .pipe(jsoncombine("locale-" + localeKey + ".json",function(data){
      var result = "{\n";
      for (var key in data) {
        var keySplit= key.split('/')[key.split('/').length-1];
        if(keySplit.match("(.*)-" + localeKey + "")){
          var prefix = keySplit.match("(.*)-" + localeKey + "")[1];
          var keys = Object.keys(data[key]);
          for (var i = 0; i < keys.length; i++) {
            result = result + '"'+prefix+"." + keys[i]+ '": "' + data[key][keys[i]]+'",\n';
          }
        }
      }
      return new Buffer(result.slice(0,-2)+"\n}");

    }))
    .pipe(gulp.dest('app/main/resources'));
}
