'use strict';
angular.module('main').controller('HomeCtrl', function (Config, $http,$ionicLoading, $scope) {
    var self = this;
    self.homePhrase = "";
    self.homePic = "";
    self.unread= "";
    self.disabled= "";

    // Trigger the loading indicator
    self.show = function() {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner><br /><span>Cargando</span>',
            showBackdrop: true,
            showDelay: 0
        });
    };

    self.show();

    $http.get(Config.ENV.SERVER_URL + '/home_phrases_random.json').then(function (response) {
        self.homePhrase = response.data.name;
    });

    $http.get(Config.ENV.SERVER_URL + '/unread.json').then(function (response) {
        self.unread = response.data.count;
    });

    $http.get(Config.ENV.SERVER_URL + '/disabled.json').then(function (response) {
        self.disabled = response.data.count;
    });

    $http.get(Config.ENV.SERVER_URL + '/home_pictures_random.json').then(function (response) {
        self.homePic = response.data.picture.picture.large.url;
        window.setTimeout(function(){
            $ionicLoading.hide();
        }, 2000);

    });

    var someDate = new Date(2016, 1, 10);

    self.countdown = countdown(new Date(), someDate, countdown.DAYS);
    console.log(self.countdown);
});
