angular.module('modules.tabs', [
]);
angular.module('modules.tabs').

directive('tabs', function ($timeout) {
    return {
        restrict: 'E',
        transclude: true,
        template: '<div flex layout="row" class="tabs-inner" ng-transclude></div>',
        link : function (scope, element, attrs) {
            var scrollElement = angular.element(element.children()[0]);
            var fudgeFactor = 10; // If we are 10px from the end, the funtion will run
            $timeout(checkScroll,1);
            scrollElement.bind('scroll', checkScroll);

            /////////////////////

            function checkScroll(){
              // If we are 10px from the end
                if (scrollElement[0].scrollLeft + scrollElement[0].offsetWidth + fudgeFactor > scrollElement[0].scrollWidth) {
                    element.addClass('isEnded')
                }
                else{
                    element.removeClass('isEnded')
                }
            }

        }
    };
});
