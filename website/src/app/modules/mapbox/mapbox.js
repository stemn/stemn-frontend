import './mapbox.scss';

angular.module('modules.mapbox', [
]);
angular.module('modules.mapbox').

directive('mapbox', function () {
    return {
        restrict: 'E',
        scope: {
            callback: '=',
        },
        templateUrl:'app/modules/mapbox/tpls/mapbox.html',
        link: function (scope, element, attributes) {


            L.mapbox.accessToken = 'pk.eyJ1IjoiZGF2aWRyZXZheSIsImEiOiJjaWdrMXdzbjgwMDhtdW5sem80ZzU2ZnB1In0.Rnao2anlQSjflypv84f-Xw';
            var map = L.mapbox.map(element[0], 'davidrevay.o2lae1db', {
                maxBounds: [[-90,-180],[90,180]],
                maxBoundsViscosity: 1.0,
                minZoom: 3,
            });
            scope.callback(map);
          }
    }
});
