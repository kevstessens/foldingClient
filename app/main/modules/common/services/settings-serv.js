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
