'use strict';
angular.module('main').controller('MenuCtrl', function ($state, gBroadcast,gFeedback, $ionicPlatform) {
  var self = this;

  $ionicPlatform.ready(function () {
    // This method relies on cordova and will fail in browser. Just don't fail if cordova not present...
  });

  self.refresh = function(){
    gFeedback.vibrate(500);
  };

  self.logout = function () {
    $state.go('auth.login');
  };

  self.navigateToCountdown = function () {
    $state.go('common.countdown');
  };

  self.navigateToWrittings = function () {
    $state.go('common.writtings');
  };

});
