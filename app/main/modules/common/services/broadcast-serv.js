'use strict';
angular.module('main').factory('gBroadcast', function ($rootScope) {
  var gBroadcast = {};
  gBroadcast.CART_CHANGED = 'cart-changed';
  gBroadcast.COMPARATOR_CHANGED = 'comparator-changed';
  gBroadcast.listen = function (event, callback) {
    return $rootScope.$on(event, callback);
  };
  gBroadcast.notify = function (event) {
    return $rootScope.$broadcast(event);
  };
  return gBroadcast;
});
