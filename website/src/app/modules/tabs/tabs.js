import './tabs.scss';

angular.module('modules.tabs', [
]);
angular.module('modules.tabs').

directive('textTabs', function ($timeout) {
    return {
        restrict: 'AC',
        transclude: true,
        templateUrl: 'app/modules/tabs/tpls/tabs.html',
        link : function (scope, element, attrs) {
            var scrollElement = angular.element(element.children()[1]);
            var fudgeFactor = 10; // If we are 10px from the end, the funtion will run
            $timeout(checkScroll,1);
            scrollElement.bind('scroll', checkScroll);

            /////////////////////

            function checkScroll(){
                // If we are 10px from the end
                if (scrollElement[0].scrollLeft + scrollElement[0].offsetWidth + fudgeFactor > scrollElement[0].scrollWidth) {
                    element.removeClass('isNotEnded')
                }
                else{
                    element.addClass('isNotEnded')
                }

                if(scrollElement[0].scrollLeft > fudgeFactor){
                    element.addClass('isNotStart')
                }
                else{
                    element.removeClass('isNotStart')
                }
            }

        }
    };
});
