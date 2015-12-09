'use strict';
angular.module('main').directive('searchNavButton', function ($state) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'main/modules/common/directives/search-nav-button/search-nav-button.html',
    scope: {
      categoryKey: '='
    },    controller: function ($scope) {
      $scope.navigate = function () {
        if($scope.categoryKey){
          $state.go('catalog.salableSearch', { categoryKey: $scope.categoryKey });
        } else {
          $state.go('catalog.salableSearch');
        }
      };
    }
  };
});
