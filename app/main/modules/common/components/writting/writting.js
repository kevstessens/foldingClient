'use strict';
angular.module('main').controller('WrittingCtrl', function (Config, $http,$state, $stateParams, $ionicLoading) {
    var self = this;
    self.writting = {};

    $http.get(Config.ENV.SERVER_URL + '/writtings/' + $stateParams.writtingId+'.json').then(function (response) {
        self.writting = response.data;
    });

    $http.get(Config.ENV.SERVER_URL + '/mark_as_read?id=' + $stateParams.writtingId+'.json').then(function (response) {
        window.setTimeout(function(){
            $ionicLoading.hide();
        }, 3000);
    });

    // Trigger the loading indicator
    self.show = function() {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner><br /><span>Cargando</span>',
            showBackdrop: true,
            showDelay: 0
        });
    };

    self.show();

});
