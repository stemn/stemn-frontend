angular.module('modules.keyboard-navigation', []);
angular.module('modules.keyboard-navigation').

directive('listKeyboardNavigation', function (SearchService) {
    // This must be used with ng-class to apply the selector
    return {
        restrict: 'A',
        scope: {
            enable      : '=',
            list        : '=', // list items array
            activeIndex : '=', // index of the active item
            selector    : '@', // css selector
            escFn       : '&?' // function to be run when escape is pressed
        },
        controller: function ($scope, $timeout, $document, CoreLibrary) {
            var rawSelected;

            $scope.activeIndex = 0;
            $scope.$watch('enable',function(){
                if($scope.enable){
                    rawSelected = 0;
                    $scope.activeIndex = 0;
                    $document.on('keydown', onKeydown);
                }
                else{
                    rawSelected = 0;
                    $scope.activeIndex = 0;
                    $document.off('keydown', onKeydown);
                }
            })
            $scope.$on('$destroy', onDestroy);

            //////////////////////////////////
            function onKeydown(event) {
                if(event.keyCode == CoreLibrary.keyCodes.ESCAPE){
                    event.preventDefault();
                    $scope.escFn();
                    $scope.$apply();
                }
                else if (event.keyCode == CoreLibrary.keyCodes.UPARROW){
                    event.preventDefault();
                    rawSelected--
                    if(rawSelected == -1){
                        rawSelected = $scope.list.length-1;
                    }
                    $scope.activeIndex = rawSelected % $scope.list.length;
                    $scope.$apply();
                }
                else if (event.keyCode == CoreLibrary.keyCodes.DOWNARROW){
                    event.preventDefault();
                    rawSelected++
                    $scope.activeIndex = rawSelected % $scope.list.length;
                    $scope.$apply();
                }
                else if (event.keyCode == CoreLibrary.keyCodes.RETURNKEY){
                    event.preventDefault();
                    event.stopPropagation();
                    // We evaluate the ng-click
                    angular.element('.'+$scope.selector).trigger('click');
                }
            };

            function onDestroy() {
				$document.off('keydown', onKeydown);
			}
        }
    };
});
