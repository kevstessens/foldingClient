'use strict';
angular.module('main').controller('CountdownCtrl', function () {
  var self = this;
  var someDate = new Date(2016,1,10);

  self.countdown = countdown(new Date(), someDate, countdown.DAYS);
    console.log(self.countdown);

});
