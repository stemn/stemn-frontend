angular.module('modules.page-loading-overlay', []);
// The 'page-loading-overlay' should be placed on the index page
// This directive will hide the overlay when the document is ready.
// This is done by applying the ng-hide class
// This does NOT have a template because if it did Angular would first have to load before the
// overlay was shown, this would defeat the purpose...
angular.module('modules.page-loading-overlay').

directive('pageLoadingOverlay', function ($timeout) {
    return {
        restrict: 'E',
        link : function (scope, element, attr){
            angular.element(document).ready(function () {
                $timeout( function(){element.addClass('animate')},100);
                // There is a 200ms gap here because the CSS animation is 200ms
                $timeout( function(){element.addClass('ng-hide')},300);
            });
        }
    };
});
