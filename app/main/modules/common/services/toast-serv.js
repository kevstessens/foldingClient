'use strict';
angular.module('main').factory('gToast', function ($ionicLoading, $ionicPopup, $cordovaToast, $rootScope, $timeout) {
  var gToast = {};

  gToast.showShort = function (message) {
    gToast.show(message, 'short');
  }

  gToast.showLong = function (message) {
    gToast.show(message, 'long');
  }

  gToast.show = function (message, duration) {

    // Use the Cordova Toast plugin
    if (!!window.cordova) {
					$cordovaToast.show(message, duration, 'center');
    }
    else {
        if (duration === 'long') {
            duration = 3500;
        }
        else {
            duration = 2000;
        }
        var myPopup = $ionicPopup.show({
          subTitle: message,
          scope: $rootScope,
          buttons: []
        });
        $timeout(function() {
          myPopup.close();
        }, duration);
    }
  };

  return gToast;
});
