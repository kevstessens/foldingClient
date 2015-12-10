'use strict';
angular.module('main').constant('Config', {
  // gulp environment: injects environment vars
  // https://github.com/mwaylabs/generator-m#gulp-environment
  ENV: {
    /*inject-env*/
'SERVER_URL': 'https://folding-server.herokuapp.com',
'SETTINGS_KEY': 'genesis-mobile-settings-desa',
'GRAYLOG_URL': 'http://10.0.1.85:12666/gelf'
/*endinject*/
  },
  // gulp build-vars: injects build vars
  // https://github.com/mwaylabs/generator-m#gulp-build-vars
  BUILD: {}
});
