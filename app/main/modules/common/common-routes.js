'use strict';
angular.module('main').config(function ($stateProvider) {
    $stateProvider.state('common', {
        url: '/common',
        abstract: true,
        templateUrl: 'main/modules/common/components/menu/menu.html',
        controller: 'MenuCtrl as menuCtrl'
    })
        // this state is placed in the <ion-nav-view> in the index.html
        .state('common.home', {
            url: '/home',
            cache: false,
            templateUrl: 'main/modules/common/components/home/home.html',
            controller: 'HomeCtrl as homeCtrl'
        })
        .state('common.countdown', {
            url: '/countdown',
            cache: false,
            templateUrl: 'main/modules/common/components/countdown/countdown.html',
            controller: 'CountdownCtrl as countdownCtrl'
        })
        .state('common.writtings', {
            url: '/writtings',
            cache: false,
            templateUrl: 'main/modules/common/components/writtings/writtings.html',
            controller: 'WrittingsCtrl as writtingsCtrl'
        })
        .state('common.writting', {
            url: '/writting/:writtingId',
            params: {
                writtingId: null
            },
            cache: false,
            templateUrl: 'main/modules/common/components/writting/writting.html',
            controller: 'WrittingCtrl as writtingCtrl'
        });
});
