'use strict';
angular.module('main').factory('gI18n', function ($translate, $filter) {
  var gI18n = {};
  gI18n.translate = function (key) {
    return $filter('translate')(key);
  };
  gI18n.translate = function (key, params) {
    return $filter('translate')(key, params);
  };
  return gI18n;
}).run(function ($translate) {
  $translate.use('es');
});