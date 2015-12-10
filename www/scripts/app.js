'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  'pascalprecht.translate',
  'tmh.dynamicLocale'  // TODO: load other modules selected during generation
]).config(function ($sceDelegateProvider, $httpProvider,$urlRouterProvider) {
  //Config for default route
  $urlRouterProvider.otherwise('/auth/login');
  // Needed for authentication
  $httpProvider.defaults.withCredentials = true;
  // Needed for CORS
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.
    'http://localhost:9000/**'
  ]);
}).config(function ($translateProvider) {
  $translateProvider.useMissingTranslationHandlerLog();
  $translateProvider.useStaticFilesLoader({
    prefix: 'main/resources/locale-',
    // path to translations files
    suffix: '.json'  // suffix, currently- extension of the translations
  });
  $translateProvider.preferredLanguage('es');  // is applied on first load
}).config(function (tmhDynamicLocaleProvider) {
  tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
}).config(function ($ionicConfigProvider) {
  // Use native scrolling
  if (ionic.Platform.isAndroid()) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
    $ionicConfigProvider.tabs.position('bottom');
  }
  // Disable cache
  $ionicConfigProvider.views.maxCache(10);
}).run(function($ionicPlatform, $state,$ionicHistory) {
  // Disable BACK button on home
  $ionicPlatform.registerBackButtonAction(function(event) {
    if (!$ionicHistory.backView()) { // your check here
      $ionicHistory.nextViewOptions({
        historyRoot: true
      });
      $state.go('common.home');
    } else {
      $ionicHistory.goBack();
    }
  }, 100);
});

'use strict';
angular.module('main').factory('gToast', function ($ionicLoading, $ionicPopup, $cordovaToast, $rootScope, $timeout) {
  var gToast = {};

  gToast.showShort = function (message) {
    gToast.show(message, 'short');
  }

  gToast.showLong = function (message) {
    gToast.show(message, 'long');
  }

  gToast.show = function (message, duration) {

    // Use the Cordova Toast plugin
    if (!!window.cordova) {
					$cordovaToast.show(message, duration, 'center');
    }
    else {
        if (duration === 'long') {
            duration = 3500;
        }
        else {
            duration = 2000;
        }
        var myPopup = $ionicPopup.show({
          subTitle: message,
          scope: $rootScope,
          buttons: []
        });
        $timeout(function() {
          myPopup.close();
        }, duration);
    }
  };

  return gToast;
});

'use strict';
angular.module('main').factory('gSettings', function (Config) {

  var settingsKey = Config.ENV.SETTINGS_KEY;

  function retrieveSettings() {
    var settings = localStorage[settingsKey];
    return settings ? angular.fromJson(settings) : {homeCategories: []};
  }

  function saveSettings(settings) {
    localStorage[settingsKey] = angular.toJson(settings);
  }

  return {
    get: retrieveSettings,
    set: saveSettings,
    getCategories: function () {
      var s = retrieveSettings().categories;
      return s === undefined ?
        // Default settings
      {
        listView: false
      } : s;
    },
    getSalables: function () {
      var s = retrieveSettings().salables;
      return s === undefined ?
        // Default settings
      {
        listView: false,
        orderBy: "RELEVANCE",
        stockFilter: {
          store: true,
          exhibition: true,
          shipping: true
        }
      } : s;
    },
    setCategories: function (s) {
      var settings = retrieveSettings();
      settings.categories = s;
      saveSettings(settings);
    },
    addHomeCategory: function (s) {
      var settings = retrieveSettings();
      if (settings.homeCategories.indexOf(s) > -1) {
        return false;
      } else {
        settings.homeCategories.push(s);
        saveSettings(settings);
        return true;
      }
    },
    removeHomeCategory: function (s) {
      var settings = retrieveSettings();
      var index = settings.homeCategories.indexOf(s);
      if (index > -1) {
        settings.homeCategories.splice(index, 1);
        saveSettings(settings);
        return true;
      } else {
        return false;
      }
    },
    getHomeCategories: function () {
      var s = retrieveSettings().homeCategories;
      return s === undefined ? [] : s;
    },
    setSalables: function (s) {
      var settings = retrieveSettings();
      settings.salables = s;
      saveSettings(settings);
    },
    getAuthToken: function () {
      return retrieveSettings().authToken;
    },
    setAuthToken: function (at) {
      var settings = retrieveSettings();
      settings.authToken = at;
      saveSettings(settings);
    }
  }

});

'use strict';
angular.module('main').factory('gLoading', function ($ionicLoading) {
  var gLoading = {};
  gLoading.show = function (message, delay) {
    // Display the searching dialog when fetching the first page, using a small delay
    // so it does not flicker in fast searches
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner><br /><span>' + message + '</span>',
      delay: delay
    });
  };
  gLoading.hide = function (message) {
    $ionicLoading.hide();
  };
  return gLoading;
});
'use strict';
angular.module('main').factory('gI18n', function ($translate, $filter) {
  var gI18n = {};
  gI18n.translate = function (key) {
    return $filter('translate')(key);
  };
  gI18n.translate = function (key, params) {
    return $filter('translate')(key, params);
  };
  return gI18n;
}).run(function ($translate) {
  $translate.use('es');
});
'use strict';
angular.module('main').factory('gFeedback', function () {
  var gFeedback = {};
  gFeedback.vibrate = function (ms) {
    // Vibrates for the amount of milliseconds recieved as parameter
    navigator.vibrate(ms);
  };
  gFeedback.vibrateAndRing = function (ms) {
    // Vibrates for the amount of milliseconds recieved as parameter
    try {
      navigator.vibrate(ms);
      window.plugins.deviceFeedback.acoustic();
    } catch (e) {
    }
  };
  return gFeedback;
});

'use strict';
angular.module('main').factory('gBroadcast', function ($rootScope) {
  var gBroadcast = {};
  gBroadcast.CART_CHANGED = 'cart-changed';
  gBroadcast.COMPARATOR_CHANGED = 'comparator-changed';
  gBroadcast.listen = function (event, callback) {
    return $rootScope.$on(event, callback);
  };
  gBroadcast.notify = function (event) {
    return $rootScope.$broadcast(event);
  };
  return gBroadcast;
});

'use strict';
angular.module('main').directive('searchNavButton', function ($state) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'main/modules/common/directives/search-nav-button/search-nav-button.html',
    scope: {
      categoryKey: '='
    },    controller: function ($scope) {
      $scope.navigate = function () {
        if($scope.categoryKey){
          $state.go('catalog.salableSearch', { categoryKey: $scope.categoryKey });
        } else {
          $state.go('catalog.salableSearch');
        }
      };
    }
  };
});

'use strict';
angular.module('main').directive('ionAutoFocus', function () {
  return {
    restrict: 'A',
    require: '^^ionNavView',
    link: function (scope, el, attrs, ctrl) {
      ctrl.scope.$on('$ionicView.afterEnter', function () {
        el[0].focus();
      });
    }
  };
});
'use strict';
angular.module('main').directive('dynamicImage', function ($state) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'main/modules/common/directives/dynamic-image/dynamic-image.html',
    scope: {
      url: '=',
      mode: '@',
      size: '@'
    },
    controller: function ($scope) {
      // Listen to any change to url and recalculate the fixedUrl
      $scope.$watch('url', function () {
        var width = null;
        switch ($scope.mode) {
          case 'TINY':
            width = 32;
            break;
          case 'THUMB':
            width = 64;
            break;
          case 'SMALL':
            width = 128;
            break;
          case 'MEDIUM':
            width = 256;
            break;
          case 'LARGE':
            width = 512;
            break;
          case 'XLARGE':
            width = 1024;
            break;
          case 'CUSTOM':
            width = $scope.size;
          case 'ORIGINAL':
          default:
            // Nothing to do
        }
        $scope.fixedUrl = $scope.url + (width ? '?w=' + width : '');
      });
    }
  };
});

'use strict';
angular.module('main').directive('avatarInitials', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'main/modules/common/directives/avatar-initials/avatar-initials.html',
    scope: {
      diameter: '@',
      model: '='
    },
    link: link
  };
  function link(scope, element, attrs) {
    var colours = [
      '#1abc9c',
      '#2ecc71',
      '#3498db',
      '#9b59b6',
      '#34495e',
      '#16a085',
      '#27ae60',
      '#2980b9',
      '#8e44ad',
      '#2c3e50',
      '#f1c40f',
      '#e67e22',
      '#e74c3c',
      '#95a5a6',
      '#f39c12',
      '#d35400',
      '#c0392b',
      '#bdc3c7',
      '#7f8c8d'
    ];
    scope.$watch('model', function () {
      var name = scope.model;
      var nameSplit = name ? name.split(' ') : [];
      var initials = '';
      var colourIndex = 0;
      if (nameSplit.length > 0) {
        // Always add the first initial
        initials += nameSplit[0].charAt(0).toUpperCase();
        // Append up to 2 initials
        if (nameSplit.length > 1) {
          initials += nameSplit[1].charAt(0).toUpperCase();
        }
        // Determine the color from first initial
        var charIndex = initials.charCodeAt(0) - 65;
        colourIndex = charIndex % 19;
      }
      var canvas = element[0];
      var context = canvas.getContext('2d');
      var canvasDiameter = scope.diameter, canvasCssDiameter = canvasDiameter;
      canvas.width = canvasDiameter;
      canvas.height = canvasDiameter;
      if (window.devicePixelRatio) {
        var fixedDiameter = canvasDiameter * window.devicePixelRatio;
        canvas.width = fixedDiameter;
        canvas.height = fixedDiameter;
        element.css('width', canvasCssDiameter + 'px');
        element.css('height', canvasCssDiameter + 'px');
        context.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
      context.fillStyle = colours[colourIndex];
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = scope.diameter / 2 + 'px Arial';
      context.textAlign = 'center';
      context.fillStyle = '#FFF';
      context.fillText(initials, canvasCssDiameter / 2, canvasCssDiameter / 1.5);
    });
  }
});
'use strict';
angular.module('main').controller('WrittingsCtrl', function (Config, $http,$state) {
    var self = this;
    self.writtings = [];
    self.currentDate = new Date();

    $http.get(Config.ENV.SERVER_URL + '/writtings.json').then(function (response) {
        self.writtings = response.data;
    });

    self.navigateToWritting = function(id){
        $state.go('common.writting', {writtingId: id})
    }
});

'use strict';
angular.module('main').controller('WrittingCtrl', function (Config, $http,$state, $stateParams) {
    var self = this;
    self.writting = {};

    $http.get(Config.ENV.SERVER_URL + '/writtings/' + $stateParams.writtingId+'.json').then(function (response) {
        self.writting = response.data;
    });

    $http.get(Config.ENV.SERVER_URL + '/mark_as_read?id=' + $stateParams.writtingId+'.json').then(function (response) {
    });

});

'use strict';
angular.module('main').controller('MenuCtrl', function ($state, gBroadcast,gFeedback, $ionicPlatform) {
  var self = this;

  $ionicPlatform.ready(function () {
    // This method relies on cordova and will fail in browser. Just don't fail if cordova not present...
  });

  self.refresh = function(){
    gFeedback.vibrate(500);
  };

  self.logout = function () {
    $state.go('auth.login');
  };

  self.navigateToCountdown = function () {
    $state.go('common.countdown');
  };

  self.navigateToWrittings = function () {
    $state.go('common.writtings');
  };

});

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

'use strict';
angular.module('main').constant('Config', {
  // gulp environment: injects environment vars
  // https://github.com/mwaylabs/generator-m#gulp-environment
  ENV: {
    /*inject-env*/
'SERVER_URL': 'https://folding-server.herokuapp.com',
'SETTINGS_KEY': 'genesis-mobile-settings-desa',
'GRAYLOG_URL': 'http://10.0.1.85:12666/gelf'
/*endinject*/
  },
  // gulp build-vars: injects build vars
  // https://github.com/mwaylabs/generator-m#gulp-build-vars
  BUILD: {}
});

angular.module('foldingDistance', ['main']);
