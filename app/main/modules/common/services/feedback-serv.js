'use strict';
angular.module('main').factory('gFeedback', function () {
  var gFeedback = {};
  gFeedback.vibrate = function (ms) {
    // Vibrates for the amount of milliseconds recieved as parameter
    navigator.vibrate(ms);
  };
  gFeedback.vibrateAndRing = function (ms) {
    // Vibrates for the amount of milliseconds recieved as parameter
    try {
      navigator.vibrate(ms);
      window.plugins.deviceFeedback.acoustic();
    } catch (e) {
    }
  };
  return gFeedback;
});
