'use strict';
angular.module('main').directive('ionAutoFocus', function () {
  return {
    restrict: 'A',
    require: '^^ionNavView',
    link: function (scope, el, attrs, ctrl) {
      ctrl.scope.$on('$ionicView.afterEnter', function () {
        el[0].focus();
      });
    }
  };
});