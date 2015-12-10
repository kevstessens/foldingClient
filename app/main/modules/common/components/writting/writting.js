'use strict';
angular.module('main').controller('WrittingCtrl', function (Config, $http,$state, $stateParams) {
    var self = this;
    self.writting = {};

    $http.get(Config.ENV.SERVER_URL + '/writtings/' + $stateParams.writtingId+'.json').then(function (response) {
        self.writting = response.data;
    });

    $http.get(Config.ENV.SERVER_URL + '/mark_as_read?id=' + $stateParams.writtingId+'.json').then(function (response) {
    });

});
