'use strict';
angular.module('main').config(function ($stateProvider) {
  $stateProvider.state('auth', {
    url: '/auth',
    abstract: true,
    template: '<ion-nav-view></ion-nav-view>'
  }).state('auth.login', {
    cache: false,
    url: '/login',
    templateUrl: 'main/modules/auth/components/login/login.html',
    controller: 'LoginCtrl as loginCtrl'
  });
});
