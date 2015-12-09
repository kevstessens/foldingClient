'use strict';
angular.module('main').controller('HomeCtrl', function (Config, $http) {
    var self = this;
    self.homePhrase = "";
    self.homePic = "";

    $http.get(Config.ENV.SERVER_URL + '/home_phrases_random.json').then(function (response) {
        self.homePhrase = response.data.name;
    });

    $http.get(Config.ENV.SERVER_URL + '/home_pictures_random.json').then(function (response) {
        self.homePic = "http://localhost:3000/" + response.data.picture.picture.url;
    })
});
