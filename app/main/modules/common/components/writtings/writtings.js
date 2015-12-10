'use strict';
angular.module('main').controller('WrittingsCtrl', function (Config, $http,$state) {
    var self = this;
    self.writtings = [];
    self.currentDate = new Date();

    $http.get(Config.ENV.SERVER_URL + '/writtings.json').then(function (response) {
        self.writtings = response.data;
    });

    self.navigateToWritting = function(id){
        $state.go('common.writting', {writtingId: id})
    }
});
