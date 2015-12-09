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