'use strict';
angular.module('main').controller('WrittingsCtrl', function (Config, $http,$state,$ionicLoading) {
    var self = this;
    self.writtings = [];
    self.currentDate = new Date();

    $http.get(Config.ENV.SERVER_URL + '/writtings.json').then(function (response) {
        self.writtings = response.data;
        window.setTimeout(function(){
            $ionicLoading.hide();
        }, 3000);
    });

    self.navigateToWritting = function(id){
        $state.go('common.writting', {writtingId: id})
    };

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
