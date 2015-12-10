'use strict';
angular.module('main').controller('HomeCtrl', function (Config, $http) {
    var self = this;
    self.homePhrase = "";
    self.homePic = "";
    self.unread= "";
    self.disabled= "";

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
    });

    var someDate = new Date(2016, 1, 10);

    self.countdown = countdown(new Date(), someDate, countdown.DAYS);
    console.log(self.countdown);
});
