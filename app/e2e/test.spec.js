'use strict';

describe('Main View', function() {
  var page;

  beforeEach(function() {
    browser.get('/');
  });

  it('should be rerouted', function() {
    expect(browser.getCurrentUrl()).toBe('http://localhost:9000/#/main/list');
  });
});
