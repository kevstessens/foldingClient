'use strict';
angular.module('main').controller('LoginCtrl', function ($state, gFeedback, $ionicHistory, gToast, gI18n) {
    var self = this;
    self.user = '';
    self.password = '';
    self.login = function () {
        if (self.user == 'celi' && self.password == 'teamo') {
            // Forget this state in ionic history
            $ionicHistory.currentView($ionicHistory.backView());
            // We must clear cache in case views were already loaded before authentication
            $ionicHistory.clearCache().then(function () {
                // Also, use location: replace option when navigating out so browser history also forgets this state
                $state.go('common.home', {}, {location: 'replace'});
            });
        } else {
            gToast.showShort(gI18n.translate('login.invalidUserPass'));
            gFeedback.vibrate(500);
        }
    };
});
