'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  'pascalprecht.translate',
  'tmh.dynamicLocale'  // TODO: load other modules selected during generation
]).config(function ($sceDelegateProvider, $httpProvider,$urlRouterProvider) {
  //Config for default route
  $urlRouterProvider.otherwise('/auth/login');
  // Needed for authentication
  $httpProvider.defaults.withCredentials = true;
  // Needed for CORS
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.
    'http://localhost:9000/**'
  ]);
}).config(function ($translateProvider) {
  $translateProvider.useMissingTranslationHandlerLog();
  $translateProvider.useStaticFilesLoader({
    prefix: 'main/resources/locale-',
    // path to translations files
    suffix: '.json'  // suffix, currently- extension of the translations
  });
  $translateProvider.preferredLanguage('es');  // is applied on first load
}).config(function (tmhDynamicLocaleProvider) {
  tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
}).config(function ($ionicConfigProvider) {
  // Use native scrolling
  if (ionic.Platform.isAndroid()) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
    $ionicConfigProvider.tabs.position('bottom');
  }
  // Disable cache
  $ionicConfigProvider.views.maxCache(10);
}).run(function($ionicPlatform, $state,$ionicHistory) {
  // Disable BACK button on home
  $ionicPlatform.registerBackButtonAction(function(event) {
    if (!$ionicHistory.backView()) { // your check here
      $ionicHistory.nextViewOptions({
        historyRoot: true
      });
      $state.go('common.home');
    } else {
      $ionicHistory.goBack();
    }
  }, 100);
});
