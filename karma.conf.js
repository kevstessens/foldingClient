// Karma configuration
// Generated on Mon Jul 13 2015 16:03:50 GMT-0300 (ART)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine-jquery', 'jasmine'],


    // list of files / patterns to load in the browser
    files: [


    'app/bower_components/angular/angular.js',
    'app/bower_components/angular-mocks/angular-mocks.js',
    'app/bower_components/ngCordova/dist/ng-cordova.js',
    'app/bower_components/angular-animate/angular-animate.js',
    'app/bower_components/angular-sanitize/angular-sanitize.js',
    'app/bower_components/angular-ui-router/release/angular-ui-router.js',
    'app/bower_components/ionic/release/js/ionic.js',
    'app/bower_components/ionic/release/js/ionic-angular.js',
    'app/app.js',
    'app/main/main.js',
    'app/main/**/*.js',
    'app/bower_components/angular-translate/angular-translate.js',
    'app/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
    'app/bower_components/angular-translate-handler-log/angular-translate-handler-log.js',
    'app/bower_components/angular-dynamic-locale/src/tmhDynamicLocale.js',

    //fixtures
    {pattern: 'app/main/**/mock/*.json', watched: true, served: true, included: false}
    //
    ],


    // list of files to exclude
    exclude: [
      'app/main/**/*-routes.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],
    //browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,
    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine-jquery',
      'karma-jasmine'
    ]

  })
};
