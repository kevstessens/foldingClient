'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  'pascalprecht.translate',
  'tmh.dynamicLocale'  // TODO: load other modules selected during generation
]).config(function ($sceDelegateProvider, $httpProvider,$urlRouterProvider) {
  //Config for default route
  $urlRouterProvider.otherwise('/common/home');
  // Needed for authentication
  $httpProvider.defaults.withCredentials = true;
  // Needed for CORS
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.
    'http://localhost:8080/**',
    'http://gendev.tekgenesis.com/**',
    'http://graylog.tekgenesis.com/**',
    'http://srvlappsd51.garba.com.ar:8080/**',
    'http://*.garba.com.ar/**',
    // Allow loading from our assets domain.
    'http://*.garbarino.com/**'
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
angular.module('main').factory('gSales', function ($http, Config) {
  var URL = Config.ENV.SERVER_URL;
  var urlBase = URL + '/restapi/pos/sales';
  var gSales = {};
  gSales.getCart = function () {
    return $http.get(urlBase + '/cart');
  };
  gSales.addToCart = function (salableKey) {
    return gSales.addToCart(salableKey, null, null);
  };
  gSales.addToCart = function (salableKey, relatedSalableKey, relatedProductKey) {
    return $http.post(urlBase + '/cart', {
      salableKey: salableKey,
      quantity: 1,
      append: true,
      relatedItem: relatedSalableKey && relatedProductKey ? {
        salableKey: relatedSalableKey,
        productKey: relatedProductKey
      } : null
    });
  };
  gSales.updateItem = function (saleKey, itemIndex, quantity, relatedItem) {
    return $http.put(urlBase + '/' + saleKey + '/items/' + itemIndex,
    {
      quantity: quantity,
      relatedItem: relatedItem
    });
  };
  gSales.removeItem = function (saleKey, itemIndex) {
    return $http.delete(urlBase + '/' + saleKey + '/items/' + itemIndex);
  };
  gSales.getSale = function (saleKey) {
    return $http.get(urlBase + '/' + saleKey);
  };

  gSales.updateSale = function(saleKey,updatePayload){
    return $http.post(urlBase +'/'+saleKey, updatePayload);
  };

  gSales.getSalePayments = function (saleKey) {
    return $http.get(urlBase + '/' + saleKey + '/payments');
  };

  gSales.addPayment = function (payload,saleKey) {
    return $http.post(urlBase + '/' + saleKey + '/payments', payload);
  };

  gSales.getPlan = function(saleKey,index){
    return $http.get(urlBase + '/' + saleKey + '/payments/'+index+'/plan');
  };

  gSales.updatePayment = function(payload, saleKey, index){
    return $http.put(urlBase + '/' + saleKey + '/payments/'+index, payload);
  };

  gSales.getPayment = function(saleKey,index){
    return $http.get(urlBase + '/' + saleKey + '/payments/'+index);
  };

  gSales.removePayment = function(saleKey,index){
    return $http.delete(urlBase + '/' + saleKey + '/payments/'+index);
  };

  gSales.amountFix = function(saleKey, index){
    return $http.post(urlBase + '/' + saleKey + '/payments/'+index+'/amount_fix');
  };

  return gSales;
});

'use strict';
angular.module('main').factory('gPayments', function ($http, Config) {
  var URL = Config.ENV.SERVER_URL;
  var urlBase = URL + '/restapi/payment/payment_methods';
  var gPayments = {};
  gPayments.getPaymentMethods = function () {
    return $http.get(urlBase + '/');
  };
  gPayments.getPaymentMethod = function (key) {
    return $http.get(urlBase + '/' + key);
  };

  gPayments.suggest = function (queryString, maxResults) {
    return $http.get(urlBase + '/suggestions/', {
      params: {
        queryString: queryString,
        maxResults: maxResults
      }
    });
  };

  return gPayments;
});

'use strict';
angular.module('main').factory('gCustomers', function ($http, Config) {
  var URL = Config.ENV.SERVER_URL;
  var urlBase = URL + '/restapi/customer/customers';
  var gCustomers = {};
  gCustomers.getCustomers = function () {
    return $http.get(urlBase + '/');
  };
  gCustomers.getCustomer = function (key) {
    return $http.get(urlBase + '/' + key);
  };

  gCustomers.suggest = function (queryString, maxResults) {
    return $http.get(urlBase + '/suggestions/', {
      params: {
        queryString: queryString,
        maxResults: maxResults
      }
    });
  };

  return gCustomers;
});

'use strict';
angular.module('main').config(function ($stateProvider) {
  $stateProvider
    .state('sale', {
      url: '/sale',
      abstract: true,
      templateUrl: 'main/modules/common/components/menu/menu.html',
      controller: 'MenuCtrl as menuCtrl'
    })
    .state('sale.cart', {
      url: '/cart',
      cache: false,
      templateUrl: 'main/modules/sale/components/cart/cart.html',
      controller: 'CartCtrl as cartCtrl'
    })
    .state('sale.cartAddedProduct', {
      url: '/cart-added-product/:index',
      templateUrl: 'main/modules/sale/components/cart-added-product/cart-added-product.html',
      controller: 'CartAddedProductCtrl as cartAddedProductCtrl'
    })
    .state('sale.dispatchSale', {
      url: '/dispatch-sale',
      templateUrl: 'main/modules/sale/components/dispatch-sale/dispatch-sale.html',
      controller: 'DispatchSaleCtrl as dispatchSaleCtrl'
    })
    .state('sale.dispatchProduct', {
      url: '/dispatch-product',
      templateUrl: 'main/modules/sale/components/dispatch-product/dispatch-product.html',
      controller: 'DispatchProductCtrl as dispatchProductCtrl'
    })
    .state('sale.dispatchSignature', {
      url: '/dispatch-signature',
      templateUrl: 'main/modules/sale/components/dispatch-signature/dispatch-signature.html',
      controller: 'DispatchSignatureCtrl as dispatchSignatureCtrl'
    })
    .state('sale.checkout', {
      url: '/checkout/',
      abstract: true,
      cache: false,
      templateUrl: 'main/modules/sale/components/sale/sale.html',
      controller: 'SaleCtrl as saleCtrl',
      params: {
        saleKey: null
      }
    })
    .state('sale.checkout.sale-customer', {
      url: '{saleKey:string}/sale-customer',
      cache: false,
      views: {
        'tab-customer': {
          templateUrl: 'main/modules/sale/components/sale-customer/sale-customer.html',
          controller: 'SaleCustomerCtrl as saleCustomerCtrl',
          params: {
            saleKey: null
          }
        }
      }
    })
    .state('sale.checkout.sale-payment', {
      url: '{saleKey:string}/sale-payment',
      cache: false,
      views: {
        'tab-payment': {
          templateUrl: 'main/modules/sale/components/sale-payment/sale-payment.html',
          controller: 'SalePaymentCtrl as salePaymentCtrl',
          params: {
            saleKey: null
          }
        }
      }
    })
    .state('sale.checkout.payment-search', {
      url: '{saleKey:string}/payments/search',
      views: {
        'tab-payment': {
          templateUrl: 'main/modules/sale/components/payment-search/payment-search.html',
          controller: 'PaymentSearchCtrl as paymentSearchCtrl'
        }
      },
      params: {
        saleKey: null
      }
    })
    .state('sale.checkout.customer-search', {
      url: '{saleKey:string}/customers/search',
      views: {
        'tab-customer': {
          templateUrl: 'main/modules/sale/components/customer-search/customer-search.html',
          controller: 'CustomerSearchCtrl as customerSearchCtrl'
        },
        params: {
          saleKey: null
        }
      }
    })
    .state('sale.checkout.payment-plan', {
      url: '{saleKey:string}/payments/{paymentIndex:string}/plan',
      views: {
        'tab-payment': {
          templateUrl: 'main/modules/sale/components/payment-plan/payment-plan.html',
          controller: 'PaymentPlanCtrl as paymentPlanCtrl'
        }
      },
      params: {
        saleKey: null,
        paymentIndex: null,
        keepOnBack: true
      }
    })
    .state('sale.checkout.sale-summary', {
      url: '{saleKey:string}/summary',
      views: {
        'tab-summary': {
          templateUrl: 'main/modules/sale/components/sale-summary/sale-summary.html',
          controller: 'SaleSummaryCtrl as saleSummaryCtrl'
        }
      },
      params: {
        saleKey: null
      }
    })
  ;
});

'use strict';
angular.module('main').directive('cartSummary', function ($state) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'main/modules/sale/directives/cart-summary/cart-summary.html',
    scope: true,
    controller: function ($scope) {
      $scope.navigateToCart = function () {
          $state.go('sale.cart');
      };
    }
  };
});

'use strict';
angular.module('main').directive('cartBadge', function (gSales, gBroadcast) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'main/modules/sale/directives/cart-badge/cart-badge.html',
    controllerAs: 'cartBadgeCtrl',
    bindToController: true,
    controller: function () {
      var self = this;
      function updateCart() {
        gSales.getCart().then(function (response) {
          self.quantity = response.data.quantity;
        }, function () {
          self.quantity = 0;
        });
      }
      gBroadcast.listen(gBroadcast.CART_CHANGED, function () {
        updateCart();
      });
      updateCart();
    }
  };
});

'use strict';
angular.module('main').directive('addToCart', function (gSales, $ionicHistory, gBroadcast, $state, gFeedback) {
  return {
    restrict: 'AE',
    replace: true,
    templateUrl: 'main/modules/sale/directives/add-button/add-button.html',
    scope: {
      salableKey: '=',
      relatedSalableKey: '=',
      relatedProductKey: '='
    },
    controller: function () {
      var self = this;
      self.addToCart = function () {
        gSales.addToCart(self.salableKey, self.relatedSalableKey, self.relatedProductKey).then(function (data) {
          gFeedback.vibrate(500);
          $ionicHistory.nextViewOptions({ disableBack: true });
          $state.go('sale.cartAddedProduct', { index: data.data.index });
          gBroadcast.notify(gBroadcast.CART_CHANGED);
        }, function (error) {
          console.log('Error when retrieving cart summary: ' + error);
        });
      };
    },
    controllerAs: 'addToCartCtrl',
    bindToController: true  // Needed to bind scope to controller instance instead of $scope
  };
});

'use strict';
angular.module('main').controller('SaleSummaryCtrl', function ($scope, $ionicPopover,gCustomers,gSales, $stateParams,$state,gI18n) {
  var self = this;
  self.saleKey = $stateParams.saleKey;
  self.customer=null;
  self.sale=null;
  self.vatType=null;
  self.loading=true;

  self.setSale = function(){
      gSales.getSale(self.saleKey).then(function (response) {
        self.sale = response.data;
        if(self.sale.vatType){
          self.vatType = self.sale.vatType.label;
        }
        if(self.sale.customer) {
          gCustomers.getCustomer(self.sale.customer.key).success(function (results) {
            self.customer = results;
            self.loading=false;
          });
        } else{
          self.loading=false;
        }
      });
  };

  self.setSale();
});

'use strict';
angular.module('main').controller('SalePaymentCtrl', function ($ionicPopup, gI18n, $scope, $ionicPopover, gSales, $stateParams, $state) {
  var self = this;
  self.sale = null;
  self.saleKey = $stateParams.saleKey;
  self.paymentIndex = null;
  self.loading = true;

  self.setSale = function () {
    gSales.getSale(self.saleKey).success(function (data) {
      self.sale = data;
      self.loading = false;
    });
  };

  self.setSale();

  self.navigateToSearch = function () {
    $state.go('sale.checkout.payment-search', {saleKey: self.saleKey});
  };

  self.navigateToPlan = function () {
    self.popover.hide();
    $state.go('sale.checkout.payment-plan', {paymentIndex: self.paymentIndex, saleKey: self.saleKey});

  };

  self.removePayment = function () {
    self.popover.hide();
    gSales.removePayment(self.saleKey, self.paymentIndex).then(function (data) {
      self.setSale();
    });
  };

  // Hack: We must create and show the popover at the same time. Otherwise, it will mess scopes between items...
  self.openPopover = function (event, index) {
    $ionicPopover.fromTemplateUrl('main/modules/sale/components/sale-payment/sale-payment-popover.html', {scope: $scope})
      .then(function (popover) {
        self.popover = popover;
        self.paymentIndex = index;
        self.popover.show(event);
      });
  };

  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function () {
    if (self.popover) {
      self.popover.remove();
    }
  });

  $scope.$on('$ionicView.enter', function () {
    self.setSale();
  });


  self.adjust = function () {
    self.popover.hide();
    gSales.amountFix(self.saleKey, self.paymentIndex).then(function () {
      self.setSale();
    });
  };

  self.openPopup = function () {
    self.popover.hide();
    $ionicPopup.prompt({
      title: gI18n.translate('sale-payment.popupTitle'),
      inputType: 'number',
      inputPlaceholder: gI18n.translate('sale-payment.newAmount'),
      okText: gI18n.translate('sale-payment.modify'),
      cancelText: gI18n.translate('sale-payment.cancel')
    }).then(function (res) {
      if (res != null) {
        gSales.getPayment(self.saleKey, self.paymentIndex).then(function (response) {
          var payload = {
            amount: res,
            installments: response.data.installments
          };
          gSales.updatePayment(payload, self.saleKey, self.paymentIndex).then(function () {
            self.setSale();
          });
        });
      }
    });
  };


});

'use strict';
angular.module('main').controller('SaleCustomerCtrl', function ($scope, $ionicPopover,gCustomers,gSales, $stateParams,$state,gI18n) {
  var self = this;
  self.saleKey = $stateParams.saleKey;
  self.customer=null;
  self.sale=null;
  self.vatType=null;
  self.loyaltyProgramKey=null;
  self.loading=true;

  self.setSale = function(){
      gSales.getSale(self.saleKey).then(function (response) {
        self.sale = response.data;
        if(self.sale.vatType){
          self.vatType = self.sale.vatType.value;
        }
        if(self.sale.customer) {
          gCustomers.getCustomer(self.sale.customer.key).success(function (results) {
            self.customer = results;
            self.loading=false;
          });
        } else {
          self.loading=false;
        }
      });

  };

  self.updateVatTypeAndLoyaltyProgram = function(){
    var loyaltyProgramKey = self.sale.loyaltyProgram ? self.sale.loyaltyProgram.key : null;
    var customerKey = self.sale.customer ? self.sale.customer.key : null;
    var vatType =  self.vatType ?  self.vatType : null;
    gSales.updateSale(self.saleKey,{ customerKey: customerKey, loyaltyProgramKey : loyaltyProgramKey, vatType :vatType });
  };

  self.taxTypes = [
    {key:"SMALL_BUSINESS", value: gI18n.translate("sale-customer.smallBussines")},
    {key:"END_CONSUMER", value: gI18n.translate("sale-customer.endConsumer")},
    {key:"REGISTERED", value: gI18n.translate("sale-customer.registered")},
    {key:"REGISTERED_FIXED_ASSETS", value: gI18n.translate("sale-customer.registeredFixedAssets")},
    {key:"EXEMPT", value: gI18n.translate("sale-customer.exempt")},
    {key:"EXEMPT_LAW_19640", value: gI18n.translate("sale-customer.exemptLaw19640")},
    {key:"EXEMPT_LAW_19640_A", value: gI18n.translate("sale-customer.exemptLaw19640A")},
    {key:"NOT_REGISTERED", value: gI18n.translate("sale-customer.notRegistered")},
    {key:"REGISTERED_EXPORT", value: gI18n.translate("sale-customer.registeredExport")},
    {key:"NOT_RESPONSIBLE", value: gI18n.translate("sale-customer.notResponsible")},
    {key:"REGISTERED_GOODS_AND_CAPITAL", value: gI18n.translate("sale-customer.registeredGoodsAndCapital")},
    {key:"RG3337", value: gI18n.translate("sale-customer.rg3337")}
  ];


  self.clearCustomer = function(){
    self.customer = null;
    self.popover.hide();
  };

  self.navigateToSearchPopover = function(){
    self.popover.hide();
    $state.go('sale.checkout.customer-search', {saleKey:self.saleKey});
  };

  self.navigateToSearch = function(){
    $state.go('sale.checkout.customer-search', {saleKey:self.saleKey});
  };


  self.navigateNextView = function(){
    $state.go('sale.checkout.sale-payment', { saleKey: self.saleKey });
  };

  // Hack: We must create and show the popover at the same time. Otherwise, it will mess scopes between items...
  self.openPopover = function(event){
    $ionicPopover.fromTemplateUrl('main/modules/sale/components/sale-customer/sale-customer-popover.html',{ scope: $scope })
      .then(function (popover) {
        self.popover = popover;
        self.popover.show(event);
      });

  };

  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    if(self.popover){
      self.popover.remove();
    }
  });

  $scope.$on('$ionicView.enter', function() {
    self.setSale();
  });


});

'use strict';
angular.module('main').controller('SaleCtrl', function ($state, $stateParams) {
  var self = this;
  self.saleKey = $stateParams.saleKey;

  self.navigateToCustomer = function(){
    $state.go('sale.checkout.sale-customer', {saleKey:self.saleKey});
  };


  self.navigateToPayment = function(){
    $state.go('sale.checkout.sale-payment', {saleKey:self.saleKey});
  };

  self.navigateToSummary = function(){
    $state.go('sale.checkout.sale-summary', {saleKey:self.saleKey});
  };

});

'use strict';
angular.module('main').controller('PaymentSearchCtrl', function ($scope,$ionicPlatform, $rootScope, $state, gSales, $stateParams, $ionicHistory, gPayments) {
  var self = this;
  self.queryString = '';
  self.results = [];
  self.suggesting = false;
  self.saleKey = $stateParams.saleKey;
  self.sale = null;


  self.isEmpty = function () {
    return self.queryString.length === 0;
  };

  self.clear = function () {
    self.queryString = '';
  };

  self.cancel = function () {
    $ionicHistory.backView();
  };


  self.navigateToPayments = function (key) {
    gSales.addPayment({paymentMethodKey: key}, self.saleKey).success(function (data) {
      var paymentIndex = data.index;
      gSales.getSale(self.saleKey).success(function (data) {
        self.sale = data;
        if (self.sale.payments.length === 0 || self.sale.payments[self.sale.payments.length - 1].amount > 0) {
          // Forget this state in ionic history
          $ionicHistory.currentView($ionicHistory.backView());
          $state.go('sale.checkout.payment-plan', {
            paymentIndex: paymentIndex,
            saleKey: self.saleKey,
            keepOnBack:false
          }, {location: 'replace'});
        } else {
          // Forget this state in ionic history
          $ionicHistory.currentView($ionicHistory.backView());
          // Also, use location: replace option when navigating out so browser history also forgets this state
          $state.go('sale.checkout.sale-payment', {saleKey: self.saleKey}, {location: 'replace'});
        }
      });
    });
  };

  self.suggest = function () {
    if (!self.queryString) {
      self.results = [];
      return;
    }
    self.suggesting = true;
    gPayments.suggest(self.queryString, 10).success(function (results) {
      for (var i = 0; i < results.length; i++) {
        results[i].description = results[i].description.replace("\t", " ");
      }
      self.results = results;
      self.suggesting = false;
    }).error(function (error) {
      self.suggesting = false;
      console.log('Error when retreving customers suggestions: ' + error);
    });
  };
  // Watch for a change in the queryString variable (as we are using ControllerAs, we need to provide
  // a function that resolves the value of self.queryString).
  $scope.$watch(function () {
    return self.queryString;
  }, self.suggest);
});

'use strict';
angular.module('main').controller('PaymentPlanCtrl', function ($scope,$rootScope, $ionicPlatform, $state, $stateParams, gSales, $ionicHistory) {
  var self = this;

  self.saleKey = $stateParams.saleKey;
  self.paymentIndex = $stateParams.paymentIndex;

  gSales.getPlan(self.saleKey, self.paymentIndex).then(function (response) {
    self.results = response.data;
  });

  self.setPaymentPlan = function (paymentPlan) {
    gSales.getPayment(self.saleKey, self.paymentIndex).then(function (response) {
      var payload = {
        amount: response.data.amount,
        installments: paymentPlan.installments
      };
      gSales.updatePayment(payload, self.saleKey, self.paymentIndex).then(function () {
        // Forget this state in ionic history
        $ionicHistory.currentView($ionicHistory.backView());
        // Also, use location: replace option when navigating out so browser history also forgets this state
        $state.go('sale.checkout.sale-payment', {saleKey: self.saleKey}, { location: 'replace' })
      });
    });
  };


  self.customBack = function () {
    if ($stateParams.keepOnBack) { // your check here
      $ionicHistory.goBack();
    } else {
      gSales.removePayment(self.saleKey, self.paymentIndex).then(function (data) {
        $ionicHistory.goBack();
      });
    }
  };

  self.oldSoftBack = $rootScope.$ionicGoBack;

  $rootScope.$ionicGoBack = function () {
    self.customBack();
  };

  self.deregisterSoftBack = function () {
    $rootScope.$ionicGoBack = self.oldSoftBack;
  };


  self.deregisterHardBack = $ionicPlatform.registerBackButtonAction(function (event) {
    self.customBack();
  }, 100);

// cancel custom back behaviour
  $scope.$on('$destroy', function () {
    self.deregisterHardBack();
    self.deregisterSoftBack();
  });


});

'use strict';
angular.module('main').controller('DispatchSignatureCtrl', function ($rootScope) {
  var self = this;
  self.products = [];
  self.confirmationCode = null;
  //window.plugins.orientationLock.lock('landscape');
  self.signaturePad = new SignaturePad(document.querySelector('canvas'));
  //$rootScope.$on('$stateChangeStart', function () {
  //  window.plugins.orientationLock.lock('portrait');
  //  window.plugins.orientationLock.unlock();
  //});
  self.clearCanvas = function () {
    self.signaturePad.clear();
  };
  self.isSigned = function () {
    return self.signaturePad.isEmpty();
  };
});

'use strict';
angular.module('main').controller('DispatchSaleCtrl', function () {
  var self = this;
  self.sales = [];
});

'use strict';
angular.module('main').controller('DispatchProductCtrl', function () {
  var self = this;
  self.products = [];
  self.confirmationCode = null;
});

'use strict';
angular.module('main').controller('CustomerSearchCtrl', function ($scope, $state, gSales, $stateParams, $ionicHistory, gBroadcast, gCustomers) {
  var self = this;
  self.queryString = '';
  self.results = [];
  self.suggesting = false;
  self.saleKey = $stateParams.saleKey;

  self.isEmpty = function () {
    return self.queryString.length === 0;
  };

  self.clear = function () {
    self.queryString = '';
  };

  self.cancel = function () {
    $ionicHistory.backView();
  };


  self.navigateToCustomer = function (key) {
    if (self.saleKey) {
      gSales.updateSale(self.saleKey, {customerKey: key}).then(function () {
        // WE BROADCAST A CART CHANGED TO ENSURE THAT ALL BADGES ARE CLEARED AND NEW CART CAN BE GENERATED
        gBroadcast.notify(gBroadcast.CART_CHANGED);


        // Forget this state in ionic history
        $ionicHistory.currentView($ionicHistory.backView());
        // Also, use location: replace option when navigating out so browser history also forgets this state
        $state.go('sale.checkout.sale-customer', {saleKey: self.saleKey}, { location: 'replace' });
      });
    }
  };
  self.suggest = function () {
    if (!self.queryString) {
      self.results = [];
      return;
    }
    self.suggesting = true;
    gCustomers.suggest(self.queryString, 10).success(function (results) {
      for (var i = 0; i < results.length; i++) {
        results[i].description = results[i].description.replace("\t", " ");
      }
      self.results = results;
      self.suggesting = false;
    }).error(function (error) {
      self.suggesting = false;
      console.log('Error when retreving customers suggestions: ' + error);
    });
  };
  // Watch for a change in the queryString variable (as we are using ControllerAs, we need to provide
  // a function that resolves the value of self.queryString).
  $scope.$watch(function () {
    return self.queryString;
  }, self.suggest);
});

'use strict';
angular.module('main').controller('CartAddedProductCtrl', function ($state, $stateParams, gSales, gSalables,gToast, $ionicHistory, gBroadcast, gFeedback, gI18n) {
  var self = this;
  self.cartSummary = null;
  self.cart = null;
  self.item = null;
  self.suggestions = [];
  updateCart();
  function updateCart() {
    gSales.getCart().then(function (response) {
      self.cartSummary = response.data;
      var saleKey = self.cartSummary.saleKey;
      if (saleKey) {
        gSales.getSale(saleKey).then(function (response) {
          self.cart = response.data;
          self.item = self.cart.items[$stateParams.index];
          gSalables.listSuggestions(self.item.salable.key, true).then(function (response) {
            self.suggestions = response.data;
          });
        });
      }
    });
  }
  self.navigateToCart = function () {
    // Forget this state in ionic history
    $ionicHistory.currentView($ionicHistory.backView());
    // Also, use location: replace option when navigating out so browser history also forgets this state
    $state.go('sale.cart', {}, { location: 'replace' });
  };
  self.navigateHome = function () {
    // Forget this state in ionic history
    $ionicHistory.currentView($ionicHistory.backView());
    // Also, use location: replace option when navigating out so browser history also forgets this state
    $state.go('common.home', {}, { location: 'replace' });
  };
  self.addToCart = function (salableKey, relatedSalableKey, relatedProductKey) {
    gSales.addToCart(salableKey, relatedSalableKey, relatedProductKey).then(function (data) {
      gFeedback.vibrate(500);
      gBroadcast.notify(gBroadcast.CART_CHANGED);
      updateCart();
      gToast.showShort(gI18n.translate('cart.succesfullyAdded'));
    }, function (error) {
      console.log('Error when retrieving cart summary: ' + error);
    });
  };
});

'use strict';
angular.module('main').directive('cartItem', function (gSales, $ionicHistory, gBroadcast, $state,gProducts, gI18n, $ionicPopover, $ionicActionSheet, $timeout, gFeedback, gToast) {
  return {
    restrict: 'AE',
    replace: true,
    templateUrl: 'main/modules/sale/components/cart/cart-item.html',
    scope: {
      item: '=',
      saleKey: '='
    },
    controller: function($scope){
      var self = this;

      gSales.getSale(self.saleKey).then(function (response) {
        self.sale = response.data;
      });



      if (self.item.requiresRelated) {
        if (self.item.relatedItem) {
          gProducts.getProduct(self.item.relatedItem.productKey).success(function (response) {
            self.relatedLabel = gI18n.translate('cart-added-product.relatedProduct', { product: response.description });
          });
        } else {
          self.relatedLabel = gI18n.translate('cart-added-product.requiresRelatedProduct');
        }
      }

      self.productButtons=[];

      self.showAssociations = function() {
        self.productButtons=[];
        for (var i = 0; i < self.sale.items.length; i++) {
          if(!self.sale.items[i].requiresRelated){
            self.productButtons.push({ text: self.sale.items[i].description, product: self.sale.items[i] });
          }
        }

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
          buttons: self.productButtons,
          titleText: gI18n.translate('cart-item.associate'),
          cancelText: gI18n.translate('cart-item.cancel'),
          cancel: function() {
            self.popover.hide();
          },
          buttonClicked: function(index) {
            self.popover.hide();
            var related= {
              saleKey: self.productButtons[index].product.saleKey,
              salableKey:self.productButtons[index].product.salable.key,
              productKey:self.productButtons[index].product.product.key
            };
            gSales.updateItem(self.saleKey, self.item.index,self.item.quantity,related).then(function () {
              gFeedback.vibrate(500);
            }).catch(function() {
              gToast.showShort(gI18n.translate('cart-item.relationError'));
            }).finally(function(){
              gBroadcast.notify(gBroadcast.CART_CHANGED);
              hideSheet();
              return true;
            });
          }
        });

        // Autoclose after 10 seconds
        $timeout(function() {
          hideSheet();
          self.popover.hide();
        }, 10000);

      };

      self.navigateToSuggestions = function () {
        self.popover.hide();
        $state.go('catalog.salables', {
          associatedSalableKey: self.item.salable.key,
          associatedProductKey: self.item.product.key,
          associationType: 'SUGGESTED'
        });
      };
      self.navigateToSalable = function () {
        $state.go('catalog.salable', { key: self.item.salable.key });
      };
      self.removeElement = function () {
        gSales.updateItem(self.saleKey, self.item.index, self.item.quantity - 1, self.item.relatedItem).then(function () {
          gBroadcast.notify(gBroadcast.CART_CHANGED);
        });
      };
      self.removeFromCart = function () {
        gSales.removeItem(self.saleKey, self.item.index).then(function () {
          gBroadcast.notify(gBroadcast.CART_CHANGED);
        });
      };
      self.addElement = function () {
        gSales.updateItem(self.saleKey, self.item.index, self.item.quantity + 1, self.item.relatedItem).then(function () {
          gBroadcast.notify(gBroadcast.CART_CHANGED);
        });
      };

      // Hack: We must create and show the popover at the same time. Otherwise, it will mess scopes between items...
      self.openPopover = function(event){
        $ionicPopover.fromTemplateUrl('main/modules/sale/components/cart/cart-item-popover.html',{ scope: $scope })
          .then(function (popover) {
            self.popover = popover;
            self.popover.show(event);
        });

      };

      //Cleanup the popover when we're done with it!
      $scope.$on('$destroy', function() {
        if(self.popover){
          self.popover.remove();
        }
      });
    },
    controllerAs: 'cartItemCtrl',
    bindToController: true
  };
});

'use strict';
angular.module('main').controller('CartCtrl', function (gSales, $state, gProducts, gBroadcast, gFeedback) {
  var self = this;
  self.cart;
  self.loading = true;
  updateCart();
  self.navigateToSalable = function (key) {
    $state.go('catalog.salable', {key: key});
  };
  gBroadcast.listen(gBroadcast.CART_CHANGED, function () {
    updateCart();
  });

  self.navigateToCustomerSelection = function () {
    gSales.getCart().then(function (response) {
      var saleKey = response.data.saleKey;
      if (saleKey) {
        $state.go('sale.checkout.sale-customer', {saleKey: saleKey});
      }
    });

  };
  function updateCart() {
    gSales.getCart().then(function (response) {
      var saleKey = response.data.saleKey;
      if (saleKey) {
        gSales.getSale(saleKey).then(function (response) {
          self.cart = response.data;
          self.loading = false;
        });
      } else {
        self.loading = false;
      }
    });
  }
});

'use strict';
angular.module('main').factory('gStore', function ($http, Config) {
  var urlBase = Config.ENV.SERVER_URL + '/restapi/organization/stores';
  var gStore = {};
  gStore.getCurrentStore = function () {
    return $http.get(urlBase + '/current');
  };
  return gStore;
});

'use strict';
angular.module('main').factory('gCredit', function ($http, Config) {
  var URL = Config.ENV.SERVER_URL;
  var urlBase = URL + '/restapi/credit/mobile';
  var gCredit = {};
  gCredit.request = function (idType, idNumber, gender, firstName, lastName, dateOfBirth) {
    return $http.post(urlBase + '/requests',
    {
      idType: idType,
      idNumber: idNumber,
      gender : gender,
      firstName : firstName,
      lastName  : lastName,
      dateOfBirth : dateOfBirth
    });
  };
  gCredit.reanalyzeRequest = function (requestNumber, nacionality, maritalStatus, professionType, initialDate, income, showsPaymentReceipt) {
    return $http.post(urlBase + '/requests/reanalyze',
    {
      creditRequestNumber: requestNumber,
      nacionality: nacionality,
      maritalState: maritalStatus,
      professionType: professionType,
      dateOfEntrance: initialDate,
      income: income,
      payReceiptDisplayed: showsPaymentReceipt
    });
  };

  return gCredit;
});

'use strict';
angular.module('main').config(function ($stateProvider) {
$stateProvider
.state('credit', {
    url: '/credit',
    abstract: true,
    templateUrl: 'main/modules/common/components/menu/menu.html',
    controller: 'MenuCtrl as menuCtrl'
  })
.state('credit.creditRequest', {
    cache: false,
    url: '/credit-request',
    templateUrl: 'main/modules/credit/components/credit-request/credit-request.html',
    controller: 'CreditRequestCtrl as creditRequestCtrl'
  })
.state('credit.creditReanalyze', {
    cache: false,
    url: '/credit-reanalyze/{requestNumber:int}',
    templateUrl: 'main/modules/credit/components/credit-request/credit-reanalyze.html',
    controller: 'CreditReanalyzeCtrl as creditReanalyzeCtrl'
  })
.state('credit.creditResult', {
    cache: false,
    url: '/credit-result',
    templateUrl: 'main/modules/credit/components/credit-request/credit-result.html',
    controller: 'CreditResultCtrl as creditResultCtrl',
    params: {
      result: null,
    }
  });
});

'use strict';
angular.module('main').controller('CreditResultCtrl', function ($stateParams, gI18n) {

  var self = this;
  self.result = $stateParams.result;
  self.resultTitle;
  self.resultTitleClass;

  if (self.result) {
    if (self.result.result === 'PRE_APPROVED'){
      self.resultTitle = gI18n.translate('credit-result.requestPreApproved');
      self.resultTitleClass = 'pre-approved';
    }
    else if (self.result.result === 'DOES_NOT_APPLY'){
      self.resultTitle = gI18n.translate('credit-result.requestDoesNotApply');
      self.resultTitleClass = 'does-not-apply';
    }
    else if (self.result.result === 'REJECTED'){
      self.resultTitle = gI18n.translate('credit-result.requestRejected');
      self.resultTitleClass = 'rejected';
    }
    else if (self.result.result === 'AVAILABLE'){
      self.resultTitle = gI18n.translate('credit-result.requestAvailable');
      self.resultTitleClass = 'available';
    }
  }

});

'use strict';
angular.module('main').controller('CreditRequestCtrl', function ($state, $ionicHistory, gCredit, gI18n, gLoading, gToast) {

  var self = this;
  self.idType = "DNI";
  self.gender = null;
  self.firstName = null;
  self.lastName = null;
  self.dateOfBirth = null;

  self.request = function() {
    gLoading.show(gI18n.translate('credit-request.processingRequest'), 0);
    gCredit.request(self.idType, self.idNumber, self.gender, self.firstName, self.lastName, self.dateOfBirth)
    .then(function(response) {
        var data = response.data;
        if (!!data.reanalyzable) {
          $state.go('credit.creditReanalyze', {
            requestNumber: data.creditRequestNumber
          });
        }
        else {
          // Do not display the back in next view
          $ionicHistory.nextViewOptions({ disableBack: true });
          $state.go('credit.creditResult', {
            result: data
          });
        }
    }, function(response) {
      gToast.showLong(response.data.msg);
    }).finally(function() {
      gLoading.hide();
    });
  }

});

'use strict';
angular.module('main').controller('CreditReanalyzeCtrl', function ($stateParams, $state, $ionicHistory, gLoading, gCredit, gI18n, gToast) {

  var self = this;
  self.advancedData = {};
  self.requestNumber = $stateParams.requestNumber;

  self.reanalyze = function() {
    gLoading.show(gI18n.translate('credit-reanalyze.reanalyzingRequest'), 0);
    gCredit.reanalyzeRequest(self.requestNumber, self.advancedData.nacionality, self.advancedData.maritalStatus,
        self.advancedData.professionType, self.advancedData.initialDate, self.advancedData.income,
        self.advancedData.showsPaymentReceipt)
    .then(function(response) {
        // Do not display the back in next view
        $ionicHistory.nextViewOptions({ disableBack: true });
        $state.go('credit.creditResult', {
          result: response.data
        });
    }, function(response) {
      gToast.showLong(response.data.msg);
    }).finally(function() {
      gLoading.hide();
    });
  }

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
angular.module('main').factory('gLogger', function ($http, Config) {
  var gLogger = {};
  var logURL = Config.ENV.GRAYLOG_URL;
  var DEBUG = 0;
  var INFO = 1;
  var WARN = 2;
  var ERROR = 3;
  var FATAL = 4;
  var UNKNOWN = 5;
  gLogger.error = function (message, fullMessage) {
    gLogger.log(message, fullMessage, ERROR);
  };
  gLogger.fatal = function (message, fullMessage) {
    gLogger.log(message, fullMessage, FATAL);
  };
  gLogger.unknown = function (message, fullMessage) {
    gLogger.log(message, fullMessage, UNKNOWN);
  };
  gLogger.info = function (message, fullMessage) {
    gLogger.log(message, fullMessage, INFO);
  };
  gLogger.debug = function (message, fullMessage) {
    gLogger.log(message, fullMessage, DEBUG);
  };
  gLogger.warn = function (message, fullMessage) {
    gLogger.log(message, fullMessage, WARN);
  };
  gLogger.log = function (message, fullMessage, level) {
    $http.post(logURL, {
      'short_message': message,
      'full_message': full_message,
      'level': level
    });
  };
  return gLogger;
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
angular.module('main').controller('OfflineCtrl', function ($state) {
  var self = this;

  self.retry = function() {
    $state.go('common.home');
  }

});

'use strict';
angular.module('main').controller('MenuCtrl', function ($state, gAuth, gComparator, gBroadcast, gStore,gFeedback, $ionicPlatform, $cordovaAppVersion) {
  var self = this;
  self.user = {};
  self.store = {};
  self.version = 'DEV';
  gAuth.getCurrentUser().then(function (response) {
    self.user = response.data;
  });
  gStore.getCurrentStore().then(function (response) {
    self.store = response.data;
  });
  $ionicPlatform.ready(function () {
    // This method relies on cordova and will fail in browser. Just don't fail if cordova not present...
    try {
      $cordovaAppVersion.getVersionNumber().then(function (version) {
        self.version = version;
      });
    } catch (e) {
    }
  });

  self.getComparatorQuantity = function(){
    return gComparator.getQuantity();
  };

  self.refresh = function(){
    gFeedback.vibrate(500);
    gBroadcast.notify(gBroadcast.CART_CHANGED);
  };
  self.logout = function () {
    gAuth.logout();
    $state.go('auth.login');
  };
  self.navigateToCart = function () {
    $state.go('sale.cart');
  };

  self.navigateToComparator = function () {
    $state.go('catalog.comparator');
  };

});

'use strict';
angular.module('main').controller('HomeCtrl', function ($state, gSettings, gCategories, gToast, $scope, gI18n) {
  var self = this;
  self.categories = [];
  self.loading = true;

  self.populateCategories = function () {
    self.categories = [];
    for (var i = 0; i < gSettings.getHomeCategories().length; i++) {
      gCategories.findCategory(gSettings.getHomeCategories()[i]).success(function (cCat) {
        self.categories.push(cCat);
        if(i ==gSettings.getHomeCategories().length){
          self.loading = false;
        }
      })
    }
  };


  self.navigateToCart = function () {
    $state.go('sale.cart', {});
  };

  self.navigateToSearch = function () {
    $state.go('catalog.salableSearch', {});
  };

  self.removeFromHome = function (cat) {
    if (gSettings.removeHomeCategory(cat)) {
      self.loading = true;
      self.populateCategories();
    } else {
      gToast.showShort(gI18n.translate('home.errorRemoving'));
    }
  };


  self.navigate = function (c) {
    if (c.leaf) {
      self.navigateToSalables(c.key)
    } else {
      $state.go('catalog.salables', {
        categoryKey: c.key
      });
    }
  };

  $scope.$on('$ionicView.beforeEnter', function () {
    self.loading = true;
    self.populateCategories();
  });

  self.navigateToSalables = function (categoryKey) {
    $state.go('catalog.salables', {categoryKey: categoryKey});
  };


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
.state('offline', {
    url: '/offline',
    templateUrl: 'main/modules/common/components/offline/offline.html',
    controller: 'OfflineCtrl as offlineCtrl'

  }).state('common.home', {
      url: '/home',
      templateUrl: 'main/modules/common/components/home/home.html',
      controller: 'HomeCtrl as homeCtrl'
    });
});

'use strict';
angular.module('main').factory('gSalables', function ($http, Config) {
  var URL = Config.ENV.SERVER_URL;
  var urlBase = URL + '/restapi/catalog/salables';
  var gSalables = {};
  gSalables.getSalables = function () {
    return $http.get(urlBase + '/');
  };
  gSalables.getSalableFromSha = function (sha) {
    return $http.get(urlBase + '/sha/' + sha);
  };
  gSalables.getSalableFromEan = function (ean) {
    return $http.get(urlBase + '/ean/' + ean);
  };
  gSalables.getSalable = function (key) {
    return $http.get(urlBase + '/' + key);
  };
  gSalables.getFeatures = function (key) {
    return $http.get(urlBase + '/' + key + '/features');
  };
  gSalables.getImportantFeatures = function (key) {
    return $http.get(urlBase + '/' + key + '/features/important');
  };
  gSalables.getStocks = function (key, availableOnly) {
    return $http.get(urlBase + '/' + key + '/stocks', { params: { availableOnly: availableOnly } });
  };
  gSalables.list = function (categoryKey, queryString) {
    return $http.get(urlBase, {
      params: {
        categoryKey: categoryKey,
        queryString: queryString
      }
    });
  };

  gSalables.getComparationItems = function(salables){
    var params = "?salableKey="+salables[0];
    for (var i = 1; i < salables.length; i++) {
      params = params + "&salableKey="+salables[i];
    }
    return $http.get(urlBase +"/comparator/"+params)
  };

  gSalables.listPaginating = function (categoryKey, queryString, pageNumber, pageSize,
                                       maxResults, orderBy, stockFilter) {
    return $http.get(urlBase, {
      params: {
        categoryKey: categoryKey,
        queryString: queryString,
        pageNumber: pageNumber,
        pageSize: pageSize,
        maxResults: maxResults,
        orderBy: orderBy,
        stockFilter: stockFilter
      }
    });
  };
  gSalables.listSimilars = function (salableKey) {
    return $http.get(urlBase + '/' + salableKey + '/similars');
  };
  gSalables.listSuggestions = function (salableKey, recommendedOnly) {
    return $http.get(urlBase + '/' + salableKey + '/suggestions', { params: { recommendedOnly: recommendedOnly } });
  };
  gSalables.suggest = function (categoryKey, queryString, maxResults) {
    return $http.get(urlBase + '/suggestions/', {
      params: {
        categoryKey: categoryKey,
        queryString: queryString,
        maxResults: maxResults
      }
    });
  };
  gSalables.getSHAFromUrl = function (url) {
    var array = url.split('/');
    return array[array.length - 1];
  };
  return gSalables;
});

'use strict';
angular.module('main').factory('gProducts', function ($http, Config) {
  var URL = Config.ENV.SERVER_URL;
  var urlBase = URL + '/restapi/catalog/products';
  var gProducts = {};
  gProducts.getProduct = function (id) {
    return $http.get(urlBase + '/' + id);
  };
  return gProducts;
});
'use strict';
angular.module('main').factory('gComparator', function (Config) {

  var comparatorKey = Config.ENV.SETTINGS_KEY + "-comparator";

  function retrievecomparator() {
    var comparator = localStorage[comparatorKey];
    return comparator ? angular.fromJson(comparator) : {salables: []}
  }

  function savecomparator(comparator) {
    localStorage[comparatorKey] = angular.toJson(comparator);
  }

  return {
    get: retrievecomparator,
    set: savecomparator,
    getSalables: function () {
      var s = retrievecomparator().salables;
      return s === undefined ?
        // Default comparator
      {
        salables: []
      } : s;
    },
    setSalables: function (s) {
      var comparator = retrievecomparator();
      comparator.salables = s;
      savecomparator(comparator);
      return true;
    },
    addSalable: function (s) {
      var comparator = retrievecomparator();
      if (comparator.salables.indexOf(s) > -1) {
        return false;
      } else if(comparator.salables.length > 4) {
        return "FULL"
      } else {
        comparator.salables.push(s);
        savecomparator(comparator);
        return "OK"
      }
    },
    removeSalable: function (s) {
      var comparator = retrievecomparator();
      var index = comparator.salables.indexOf(s);
      if (index > -1) {
        comparator.salables.splice(index, 1);
        savecomparator(comparator);
        return true;
      } else {
        return false;
      }
    },
    getQuantity: function () {
      return retrievecomparator().salables.length;
    }
  }

});

'use strict';
angular.module('main').factory('gCategories', function ($http, Config) {
  var URL = Config.ENV.SERVER_URL;
  var urlBase = URL + '/restapi/catalog/categories';
  var gCategories = {};
  gCategories.getChildCategories = function (categoryKey) {
    return $http.get(urlBase, { params: { parentKey: categoryKey ? categoryKey : '' } });
  };
  gCategories.findCategory = function (id) {
    return $http.get(urlBase + '/' + id);
  };
  return gCategories;
});

'use strict';
angular.module('main').directive('qrScannerFab', function () {
  return {
    restrict: 'AE',
    replace: true,
    templateUrl: 'main/modules/catalog/directives/scanner/scanner-fab.html',
    controller: scanFunction
  };
}).directive('qrScannerIco', function () {
  return {
    restrict: 'AE',
    replace: true,
    templateUrl: 'main/modules/catalog/directives/scanner/scanner-ico.html',
    controller: scanFunction
  };
}).directive('qrScannerMenu', function () {
  return {
    restrict: 'AE',
    replace: true,
    templateUrl: 'main/modules/catalog/directives/scanner/scanner-menu.html',
    controller: scanFunction
  };
});

var scanFunction = function ($scope, gSalables, gI18n, $state,gToast) {
  $scope.scan = function () {
    var scanner = cordova.plugins.barcodeScanner;
    scanner.scan(function (result) {
      if(result.format == 'QR_CODE'){
        if(result.text.indexOf("http") != -1) {
          gSalables.getSalableFromSha(gSalables.getSHAFromUrl(result.text)).success(function (salable) {
            $state.go('catalog.salable', {key: salable.key});
          }).error(function (error) {
            gToast.showShort(gI18n.translate('scanner.invalid-qr'));
          });
        } else{
          gSalables.getSalable(result.text).success(function (salable) {
            $state.go('catalog.salable', {key: salable.key});
          }).error(function (error) {
            gToast.showShort(gI18n.translate('scanner.invalid-qr'));
          });
        }
      } else if(result.format) {
        gSalables.getSalableFromEan(result.text).success(function (salable) {
          $state.go('catalog.salable', { key: salable.key });
        }).error(function (error) {
          gToast.showShort(gI18n.translate('scanner.invalid-ean'));
        });
      }

    }, function (error) {
      console.log('Scanning failed: ', error);
    });
  };
};

'use strict';
angular.module('main').directive('comparatorSummary', function (gComparator, $state,gToast,gFeedback) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'main/modules/catalog/directives/comparator-summary/comparator-summary.html',
    scope: true,
    controller: function ($scope) {
      $scope.navigateToComparator = function () {
          $state.go('catalog.comparator');
      };
      $scope.getQuantity= function(){
        return gComparator.getQuantity()
      };
      $scope.clearComparator = function(){
        if(gComparator.setSalables([])){
          gFeedback.vibrate(500);
        }
      };
    }
  };
});

'use strict';
angular.module('main').directive('comparatorBadge', function (gComparator, gBroadcast) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'main/modules/catalog/directives/comparator-badge/comparator-badge.html',
    controllerAs: 'comparatorBadgeCtrl',
    bindToController: true,
    controller: function () {
      var self = this;
      self.quantity = 0;
      function updateComparator() {
        self.quantity = gComparator.getQuantity();
      }
      gBroadcast.listen(gBroadcast.COMPARATOR_CHANGED, function () {
        updateComparator();
      });
      updateComparator();
    }
  };
});

'use strict';
angular.module('main').controller('StockCtrl', function ($scope, $stateParams, gSalables) {
  var self = this;
  self.key = $stateParams.key;
  self.queryString = null;
  self.availableOnly = true;
  self.stocks = [];

  self.search = function(stock){
    if (!self.queryString) return true;
    return stock.warehouse.description.toLowerCase().indexOf(self.queryString.toLowerCase()) != -1;
  };

  self.toggleAvailableOnly = function() {
    self.availableOnly = !self.availableOnly;
    loadStock();
  }

  function loadStock() {
    gSalables.getStocks(self.key, self.availableOnly).then(function (response) {
      self.stocks = response.data;
    }, function (error) {
      console.log('Error when retrieving stock: ' + error);
    });
  }

  // Do stuff the first time this view is loaded (not when cached)
  $scope.$on('$ionicView.loaded', function () {
    loadStock();
  });
});

'use strict';
angular.module('main').controller('SalablesSettingsCtrl', function ($ionicHistory, gSettings) {

  var self = this;
  self.settings = gSettings.getSalables();
  self.apply = function() {
      gSettings.setSalables(self.settings);

      // As we are using cache, we must clear the cache of the previous view and then go back
      // By this way, the salables view will reload all data with new settings
      var prev = $ionicHistory.backView();
      $ionicHistory.clearCache([prev.stateId]).then(function(){
        $ionicHistory.goBack();
      });
  };

});

'use strict';
angular.module('main').controller('SalablesCtrl', function ($scope, $stateParams, gI18n, gToast, gSalables, gFeedback, gSales, $state, gLoading, gSettings, $ionicPopover,gComparator,gBroadcast) {
  var self = this;
  self.products = [];
  self.searching = true;
  self.listView = true;
  self.hasMore = true;
  self.recommendedOnly = true;
  self.totalResults = 0;
  self.pageSize = 15;
  self.pageNumber = 1;
  self.maxResults = 500;
  self.salableKeyForPopover = null;
  // Params
  self.categoryKey = $stateParams.categoryKey;
  self.queryString = $stateParams.queryString;
  self.associatedSalableKey = $stateParams.associatedSalableKey;
  self.associatedProductKey = $stateParams.associatedProductKey;
  self.associationType = $stateParams.associationType;
  self.mode = self.associatedSalableKey && self.associationType ? 'ASSOCIATED' : 'SEARCH';
  self.listView = gSettings.getSalables().listView;
  self.toggleView = function () {
    self.listView = !self.listView;
    // Save the new value to user settings
    var settings = gSettings.getSalables();
    settings.listView = self.listView;
    gSettings.setSalables(settings);
  };
  self.toggleRecommendedOnly = function () {
    self.recommendedOnly = !self.recommendedOnly;
    self.refresh();
  };
  self.navigateToSalable = function (key) {
    $state.go('catalog.salable', {
      key: key,
      relatedSalableKey: self.associatedSalableKey,
      relatedProductKey: self.associatedProductKey
    });
  };
  self.navigateToSettings = function (key) {
    $state.go('catalog.salablesSettings');
  };
  self.refresh = function() {
    self.pageNumber = 1;
    self.hasMore = true;
    self.loadMore();
  };
  function buildStockFilterArray(stockFilter) {
    var result = [];
    if (stockFilter.store) result.push('AVAILABLE_STORE');
    if (stockFilter.exhibition) result.push('AVAILABLE_EXHIBITION');
    if (stockFilter.shipping) result.push('AVAILABLE_SHIPPING');
    return result;
  }
  self.loadMore = function () {
    if (self.hasMore) {
      // TODO Improve this by allowing similars and suggestions to be paginated also
      var promise;
      if (self.mode === 'SEARCH') {
        promise = gSalables.listPaginating(self.categoryKey, self.queryString, self.pageNumber,
                        self.pageSize, self.maxResults, gSettings.getSalables().orderBy,
                        buildStockFilterArray(gSettings.getSalables().stockFilter));
      } else if (self.mode === 'ASSOCIATED') {
        if (self.associationType === 'SUGGESTED') {
          promise = gSalables.listSuggestions(self.associatedSalableKey, self.recommendedOnly);  // TODO List using self.associatedProductKey also if defined
        } else if (self.associationType === 'SIMILAR') {
          promise = gSalables.listSimilars(self.associatedSalableKey);
        }
      }
      // TODO List using self.associatedProductKey also if defined
      if (promise) {
        promise.success(function (result) {
          // TODO Remove this hack when pagination is fully supported in associated products
          if (self.mode === 'SEARCH') {
            // If page is 1, replace the entire array. Otherwise, append.
            // By this way, the refresh will work...
            if (self.pageNumber === 1) {
              self.products = result.salables;
            } else {
              self.products.push.apply(self.products, result.salables);
            }
            self.hasMore = result.hasMore;
            self.pageNumber++;
            self.totalResults = result.totalResults;
          } else {
            // Non paginated results
            self.products = result;
            self.hasMore = false;
            self.totalResults = result.length;
          }
        }).error(function (error) {
          console.log('Error when listing salables: ' + error);
        }).finally(function () {
          self.searching = false;
          gLoading.hide();
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.$broadcast('scroll.refreshComplete');
        });
      }
    }
  };

  self.addToCart = function(){
    gSales.addToCart(self.salableKeyForPopover).then(function (data) {
      gBroadcast.notify(gBroadcast.CART_CHANGED);
      self.popover.hide();
      gFeedback.vibrate(500);
      gToast.showShort(gI18n.translate('salables.successfullyAddedToCart'));
    }, function (error) {
      console.log('Error when retrieving cart summary: ' + error);
      self.popover.hide();
    });
  };

  self.addToComparator = function(){
    var addSalable = gComparator.addSalable(self.salableKeyForPopover);
    if( addSalable === 'OK' ){
      gFeedback.vibrate(500);
      gBroadcast.notify(gBroadcast.COMPARATOR_CHANGED);
      gToast.showShort(gI18n.translate('salables.successfullyAdded'));
      self.popover.hide();
    } else if(addSalable === 'FULL'){
      gToast.showShort(gI18n.translate('salables.comparatorFull'));
      gFeedback.vibrate(500);
      self.popover.hide();
    } else {
      gFeedback.vibrate(500);
      self.popover.hide();
    }
  };

  // Hack: We must create and show the popover at the same time. Otherwise, it will mess scopes between items...
  self.openPopover = function(event, salable){
    $ionicPopover.fromTemplateUrl('main/modules/catalog/components/salables/salables-popover.html',{ scope: $scope })
      .then(function (popover) {
        self.popover = popover;
        self.popover.show(event);
        self.salableKeyForPopover = salable;
      });

  };

  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    if(self.popover){
      self.popover.remove();
    }
  });


  // Do stuff the first time this view is loaded (not when cached)
  $scope.$on('$ionicView.loaded', function () {
    gLoading.show(gI18n.translate('salables.loading'), 500);
  });
});

'use strict';
angular.module('main').controller('SalableSearchCtrl', function ($scope, $state, $stateParams, $ionicHistory, gSalables, gCategories) {
  var self = this;
  self.category;
  self.queryString = '';
  self.results = [];
  self.filterByCategory = true;
  self.suggesting = false;
  if ($stateParams.categoryKey) {
    gCategories.findCategory($stateParams.categoryKey).success(function (c) {
      self.category = c;
    }).error(function (error) {
      console.log('Error when retreving category: ' + error);
    });
  }
  self.search = function () {
    var categoryFilter = self.filterByCategory && self.category ? self.category.key : null;
    $state.go('catalog.salables', {
      categoryKey: categoryFilter,
      queryString: self.queryString
    });
  };
  self.isEmpty = function () {
    return self.queryString.length === 0;
  };
  self.clear = function () {
    self.queryString = '';
  };
  self.cancel = function () {
    $ionicHistory.backView();
  };
  self.scan = function () {
    var scanner = cordova.plugins.barcodeScanner;
    scanner.scan(function (result) {
      gSalables.getSalableFromSha(gSalables.getSHAFromUrl(result.text)).success(function (salable) {
        $state.go('catalog.salable', { key: salable.key});
      }).error(function (error) {
        console.log('Error, no salable defined : ' + error);
      });
    });
  };
  self.navigateToSalable = function (key) {
    $state.go('catalog.salable', { key: key });
  };
  self.suggest = function () {
    if (!self.queryString) {
      self.results = [];
      return;
    }
    self.suggesting = true;
    var categoryFilter = self.filterByCategory && self.category ? self.category.key : null;
    gSalables.suggest(categoryFilter, self.queryString, 10).success(function (results) {
      self.results = results;
      self.suggesting = false;
    }).error(function (error) {
      self.suggesting = false;
      console.log('Error when retreving salable suggestions: ' + error);
    });
  };
  // Watch for a change in the queryString variable (as we are using ControllerAs, we need to provide
  // a function that resolves the value of self.queryString).
  $scope.$watch(function () {
    return self.queryString;
  }, self.suggest);
});

'use strict';
angular.module('main').controller('SalableCtrl', function ($scope,gFeedback, $state, $stateParams, $ionicSlideBoxDelegate,$ionicModal, gSalables, gComparator, gBroadcast,gToast,$ionicScrollDelegate, gI18n) {
  var self = this;
  self.salable = null;
  self.features = [];
  self.salableKey = $stateParams.key;
  self.salableKeyTest = 5;
  self.modalSrc="";
  // Parameters
  self.relatedSalableKey = $stateParams.relatedSalableKey;
  self.relatedProductKey = $stateParams.relatedProductKey;
  self.navigateToFeatures = function () {
    $state.go('catalog.features', { key: self.salableKey });
  };
  self.navigateToStock = function () {
    $state.go('catalog.stock', { key: self.salableKey });
  };
  self.navigateToSimilars = function () {
    $state.go('catalog.salables', {
      associatedSalableKey: self.salable.key,
      associatedProductKey: self.salable.mainProductKey,
      associationType: 'SIMILAR'
    });
  };
  self.navigateToSuggestions = function () {
    $state.go('catalog.salables', {
      associatedSalableKey: self.salable.key,
      associatedProductKey: self.salable.mainProductKey,
      associationType: 'SUGGESTED'
    });
  };
  self.filterByValidFeature = function(feature) {
    // Filter only those features that have value set
    return feature.value; // Return true if feature.value is set
  };
  // Do stuff the first time this view is loaded (not when cached)
  $scope.$on('$ionicView.loaded', function () {
    gSalables.getSalable(self.salableKey).success(function (sal) {
      self.salable = sal;
      $ionicSlideBoxDelegate.update();
    }).error(function (error) {
      console.log('Error, no salable found : ' + error);
    });
    gSalables.getImportantFeatures(self.salableKey).success(function (f) {
      self.features = f;
    }).error(function (error) {
      console.log('Error when retrieving features: ' + error);
    });
  });

  $ionicModal.fromTemplateUrl('main/modules/catalog/components/salable/image-modal.html', {
    scope: $scope,
    animation: 'scale-in'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  self.openModal = function(src) {
    self.modalSrc=src;
    $scope.modal.show();
  };

  self.addToComparator =function(){
    if( gComparator.addSalable(self.salable.key)){
      gBroadcast.notify(gBroadcast.COMPARATOR_CHANGED);
      gFeedback.vibrate(500);
      gToast.showShort(gI18n.translate('salable.succesfullyAdded'));
    }
  };

  self.closeModal = function() {
    $scope.modal.hide();
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  self.minZoom = 1;

  self.resetZoom = function(){
    var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle').getScrollPosition().zoom;
    if (zoomFactor == self.minZoom) {
      $ionicScrollDelegate.zoomBy(5,true);
    } else {
      $ionicScrollDelegate.zoomTo(1,true);
    }

  };

});

'use strict';
angular.module('main').controller('FeaturesCtrl', function ($scope, $stateParams, gSalables) {
  var self = this;
  self.features = [];
  // Do stuff the first time this view is loaded (not when cached)
  $scope.$on('$ionicView.loaded', function () {
    gSalables.getFeatures($stateParams.key).success(function (f) {
      self.features = f;
    }).error(function (error) {
      console.log('Error when retrieving features: ' + error);
    });
  });
});

'use strict';
angular.module('main').controller('ComparatorCtrl', function ($scope, $ionicPopover,gSales, $http, $stateParams, gComparator, gSalables,gBroadcast, gToast,gFeedback, $state, $ionicHistory, gI18n) {
  var self = this;
  self.comparatorItems = [];
  self.salables = gComparator.getSalables();
  self.hideDifferences = false;
  self.salableKeyForPopover=null;
  // Do stuff the first time this view is loaded (not when cached)
  $scope.$on('$ionicView.loaded', function () {
    self.getItems();
  });


  self.addToCart=function(){
    self.popover.hide();
    gSales.addToCart(self.salableKeyForPopover).then(function (data) {
      gBroadcast.notify(gBroadcast.CART_CHANGED);
      gFeedback.vibrate(500);
      gToast.showShort(gI18n.translate('salables.successfullyAddedToCart'));
    });
  };

  self.navigateToSalable=function(){
    self.popover.hide();
    $state.go('catalog.salable',{key: self.salableKeyForPopover});
  };

  self.clearComparator=function(){
    if( gComparator.setSalables([]) ){
      gFeedback.vibrate(500);
      gBroadcast.notify(gBroadcast.COMPARATOR_CHANGED);
      $ionicHistory.goBack();
    } else {
      gToast.showShort(gI18n.translate('comparator.errorAtRemoving'));
    }
  };

  self.getItems = function(){
    self.comparatorItems = [];
    gSalables.getComparationItems(gComparator.getSalables()).then(function(response){
      self.comparatorItems = response.data;
    });
    self.salables = gComparator.getSalables();
  };

  self.toggleDifferences = function(){
    gFeedback.vibrate(100);
    self.hideDifferences = !self.hideDifferences;
  };


  self.removeSalableFromComparator = function(){
    self.popover.hide();
    if( gComparator.removeSalable(self.salableKeyForPopover) ){
      gFeedback.vibrate(500);
      gBroadcast.notify(gBroadcast.COMPARATOR_CHANGED);
      if(gComparator.getSalables().length < 1){
        $ionicHistory.goBack();
      }
    } else {
      gToast.showShort(gI18n.translate('comparator.errorAtRemoving'));
    }
  };

  gBroadcast.listen(gBroadcast.COMPARATOR_CHANGED, function () {
    self.getItems();
    self.hideDifferences = false;
  });


  // Hack: We must create and show the popover at the same time. Otherwise, it will mess scopes between items...
  self.openPopover = function(event, salable){
    $ionicPopover.fromTemplateUrl('main/modules/catalog/components/comparator/comparator-popover.html',{ scope: $scope })
      .then(function (popover) {
        self.salableKeyForPopover = salable;
        self.popover = popover;
        self.popover.show(event);
      });

  };

  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    if(self.popover){
      self.popover.remove();
    }
  });

  gBroadcast.listen(gBroadcast.COMPARATOR_CHANGED, function () {
    self.getItems();
  });

});

'use strict';
angular.module('main').controller('CatCtrl', function ($scope, $stateParams, $state, $ionicHistory, gCategories, gLoading, gI18n,gToast, gSettings, $ionicPopover, gFeedback) {
  var self = this;
  self.categories = [];
  self.category = null;
  self.categoryKey = $stateParams.categoryKey;
  self.listView = gSettings.getCategories().listView;
  self.catKeyForPopover = null;

  self.navigate = function (c) {
    gCategories.findCategory(c).success(function (category) {
      if (category.leaf) {
        self.navigateToSalables(category.key);
      } else {
        $state.go('catalog.categories', {
          categoryKey: category.key
        });
      }
    }).error(function (error) {
      console.log('Error : ' + error);
    });
  };

  self.addToHome = function(cat){
    if(gSettings.addHomeCategory(cat)){
      gFeedback.vibrate(500);
      gToast.showShort(gI18n.translate('categories.successfullyAdded'));
    }
  };

  self.pinToHome=function(){
    self.addToHome(self.catKeyForPopover);
    self.popover.hide();
  };

  // Hack: We must create and show the popover at the same time. Otherwise, it will mess scopes between items...
  self.openPopover = function(event, category){
    $ionicPopover.fromTemplateUrl('main/modules/catalog/components/categories/categories-popover.html',{ scope: $scope })
      .then(function (popover) {
        self.popover = popover;
        self.popover.show(event);
        self.catKeyForPopover = category;
      });

  };

  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    if(self.popover){
      self.popover.remove();
    }
  });

  self.navigateToSalablesPopover = function () {
    self.popover.hide();
    self.navigateToSalables(self.catKeyForPopover);
  };



  self.navigateToSalables = function (categoryKey) {
    // Do not display the back in next view
    $ionicHistory.nextViewOptions({ disableBack: true });
    $state.go('catalog.salables', { categoryKey: categoryKey });
  };

  // Do stuff the first time this view is loaded (not when cached)
  $scope.$on('$ionicView.loaded', function () {
    gLoading.show(gI18n.translate('categories.loading'), 500);
    if (self.categoryKey) {
      gCategories.findCategory(self.categoryKey).success(function (cCat) {
        self.category = cCat;
      }).error(function (error) {
        console.log('Error : ' + error);
      });
    }
    gCategories.getChildCategories(self.categoryKey).success(function (cats) {
      self.categories = cats;
    }).error(function (error) {
      console.log('Error : ' + error);
    }).finally(function () {
      gLoading.hide();
    });
    self.toggleView = function () {
      self.listView = !self.listView;
      // Save the new value to user settings
      var settings = gSettings.getCategories();
      settings.listView = self.listView;
      gSettings.setCategories(settings);
    };
  });
});

'use strict';
angular.module('main').config(function ($stateProvider) {
$stateProvider
.state('catalog', {
    url: '/catalog',
    abstract: true,
    templateUrl: 'main/modules/common/components/menu/menu.html',
    controller: 'MenuCtrl as menuCtrl'
  })
.state('catalog.salables', {
    url: '/salables?:categoryKey&:query&:associatedSalableKey&:associatedProductKey&:associationType',
    templateUrl: 'main/modules/catalog/components/salables/salables.html',
    controller: 'SalablesCtrl as salablesCtrl',
    params: {
      categoryKey: null,
      queryString: null,
      associatedSalableKey: null,
      associatedProductKey: null,
      associationType: null
    }
  })
.state('catalog.salable', {
    url: '/salable/{key:string}',
    templateUrl: 'main/modules/catalog/components/salable/salable.html',
    controller: 'SalableCtrl as salableCtrl',
    params: {
      relatedSalableKey: null,
      relatedProductKey: null
    }
  })
.state('catalog.categories', {
    url: '/categories?{categoryKey:int}',
    templateUrl: 'main/modules/catalog/components/categories/categories.html',
    controller: 'CatCtrl as catCtrl',
    params: {
      categoryKey: null
    }
  })
.state('catalog.salableSearch', {
    url: '/salables/search?:categoryKey',
    templateUrl: 'main/modules/catalog/components/salable-search/salable-search.html',
    controller: 'SalableSearchCtrl as salableSearchCtrl',
    params: { categoryKey: null }
  })
.state('catalog.features', {
    url: '/salable/{key:string}/features',
    templateUrl: 'main/modules/catalog/components/features/features.html',
    controller: 'FeaturesCtrl as featuresCtrl'
  })
.state('catalog.stock', {
    url: '/salable/{key:string}/stock',
    templateUrl: 'main/modules/catalog/components/stock/stock.html',
    controller: 'StockCtrl as stockCtrl'
  })
.state('catalog.salablesSettings', {
    url: '/salables/settings',
    templateUrl: 'main/modules/catalog/components/salables-settings/salables-settings.html',
    controller: 'SalablesSettingsCtrl as salablesSettingsCtrl'
  })
.state('catalog.comparator', {
      url: '/salables/comparator',
      templateUrl: 'main/modules/catalog/components/comparator/comparator.html',
      controller: 'ComparatorCtrl as comparatorCtrl'
    });
});

'use strict';
angular.module('main').factory('gAuth', function ($http, Config, gSettings) {
  var urlBase = Config.ENV.SERVER_URL + '/restapi/auth';
  var appId = "gMob";
  var auth = {};
  auth.login = function (user, pass) {
    return $http.post(urlBase + '/login', {
      username: user,
      password: pass,
      appId: appId
    }).then(function (response) {
      gSettings.setAuthToken(response.data.token);
    }, function (response) {
      gSettings.setAuthToken(null);
      throw response;
    });
  };
  auth.logout = function () {
      gSettings.setAuthToken(null);
  };
  auth.getCurrentUser = function () {
    return $http.get(urlBase + '/users/current');
  };
  return auth;
})
// Configure interceptor so we can redirect to login state if a 401 error is intercepted
.config(function($httpProvider) {
  $httpProvider.interceptors.push(function($q, $injector, gSettings) {
    return {
      request: function(config) {
        // Append the auth token in every request
        var token = gSettings.getAuthToken();
        if (token) {
          config.headers['X-Tek-App-Token'] = token;
        }
        return config;
      },
      responseError: function(rejection) {
        // No connection
        if (rejection.status === 0) {
          // Using injector to avoid circular dependency on $state
          $injector.get('$state').go('offline');
          return $q.reject(rejection);
        }
        // Unauthorized
        else if (rejection.status === 401) {
          gSettings.setAuthToken(null);
          // Using injector to avoid circular dependency on $state
          $injector.get('$state').go('auth.login');
          return $q.reject(rejection);
        }
        return $q.reject(rejection);
      }
    };
  });
});

'use strict';
angular.module('main').controller('LoginCtrl', function ($state, gFeedback, gAuth, $ionicHistory, gLogger,gToast, gI18n) {
  var self = this;
  self.user = '';
  self.password = '';
  self.login = function () {
    gAuth.login(self.user, self.password).then(function (response) {

      // Forget this state in ionic history
      $ionicHistory.currentView($ionicHistory.backView());
      // We must clear cache in case views were already loaded before authentication
      $ionicHistory.clearCache().then(function () {
        // Also, use location: replace option when navigating out so browser history also forgets this state
        $state.go('common.home', {}, { location: 'replace' });
      });
    }, function (response) {
      gToast.showShort(gI18n.translate('login.invalidUserPass'));
      gFeedback.vibrate(500);
      gLogger.error('LoginCtrl Error when logging in', error);
    });
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
'SERVER_URL': 'http://gendesa.garba.com.ar',
'SETTINGS_KEY': 'genesis-mobile-settings-desa',
'GRAYLOG_URL': 'http://10.0.1.85:12666/gelf'
/*endinject*/
  },
  // gulp build-vars: injects build vars
  // https://github.com/mwaylabs/generator-m#gulp-build-vars
  BUILD: {}
});

angular.module('genesisMobile', ['main']);
angular.module('apptasticMock', []);
