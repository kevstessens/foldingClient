'use strict';
angular.module('main').factory('gLoading', function ($ionicLoading) {
  var gLoading = {};
  gLoading.show = function (message, delay) {
    // Display the searching dialog when fetching the first page, using a small delay
    // so it does not flicker in fast searches
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner><br /><span>' + message + '</span>',
      delay: delay
    });
  };
  gLoading.hide = function (message) {
    $ionicLoading.hide();
  };
  return gLoading;
});