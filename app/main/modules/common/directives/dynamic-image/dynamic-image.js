'use strict';
angular.module('main').directive('dynamicImage', function ($state) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'main/modules/common/directives/dynamic-image/dynamic-image.html',
    scope: {
      url: '=',
      mode: '@',
      size: '@'
    },
    controller: function ($scope) {
      // Listen to any change to url and recalculate the fixedUrl
      $scope.$watch('url', function () {
        var width = null;
        switch ($scope.mode) {
          case 'TINY':
            width = 32;
            break;
          case 'THUMB':
            width = 64;
            break;
          case 'SMALL':
            width = 128;
            break;
          case 'MEDIUM':
            width = 256;
            break;
          case 'LARGE':
            width = 512;
            break;
          case 'XLARGE':
            width = 1024;
            break;
          case 'CUSTOM':
            width = $scope.size;
          case 'ORIGINAL':
          default:
            // Nothing to do
        }
        $scope.fixedUrl = $scope.url + (width ? '?w=' + width : '');
      });
    }
  };
});
