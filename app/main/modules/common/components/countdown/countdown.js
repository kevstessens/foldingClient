'use strict';
angular.module('main').controller('CountdownCtrl', function (Config, $http) {
    var self = this;
    self.backPic = "";

    $http.get(Config.ENV.SERVER_URL + '/home_pictures_random.json').then(function (response) {
        self.backPic = "http://localhost:3000/" + response.data.picture.picture.url;
    });

    var someDate = new Date(2016, 1, 10);

    self.countdown = countdown(new Date(), someDate, countdown.DAYS);
    console.log(self.countdown);

});
