angular.module('modules.keyboard-navigation', []);
angular.module('modules.keyboard-navigation').

directive('keyboardNavigationTabs', function (SearchService) {
    /*********************************************************
    This directive allows the use of left/right arrows to
    change tab.

    The tabs should be structured with:
    $scope.tabs = [
        label: 'tab name',
        sref : 'the state name' - this is used to get the active tab and $state.go(sref)
    ]
    *********************************************************/
    return {
        restrict: 'A',
        scope: {
            enable : '=',
            tabs   : '=', // list items array
        },
        controller: function ($scope, $timeout, $document, KeyboardNavigationService, $state) {
            var rawSelected;
            var activeIndex = 0;
            $scope.$watch('enable',function(){
                if($scope.enable){
                    $document.on('keydown', onKeydown);
                }
                else{
                    $document.off('keydown', onKeydown);
                }
            })
            $scope.$on('$destroy', onDestroy);

            //////////////////////////////////
            function onKeydown(event) {
                if(event.keyCode == KeyboardNavigationService.keyCodes.LEFTARROW){
                    event.preventDefault();
                    rawSelected = findIndex();
                    rawSelected--
                    if(rawSelected == -1){
                        rawSelected = $scope.tabs.length-1;
                    }
                    activeIndex = rawSelected % $scope.tabs.length;
                    $state.go($scope.tabs[activeIndex].sref);
                }
                else if(event.keyCode == KeyboardNavigationService.keyCodes.RIGHTARROW){
                    event.preventDefault();
                    rawSelected = findIndex();
                    rawSelected++
                    activeIndex = rawSelected % $scope.tabs.length;
                    $state.go($scope.tabs[activeIndex].sref);
                }
            }

            function onDestroy() {
				$document.off('keydown', onKeydown);
			}

            function findIndex(){
                return _.findIndex($scope.tabs, function(tab){
                    return $state.includes(tab.sref)
                });
            }
        }
    };
}).

service('KeyboardNavigationService', function(){
   this.keyCodes = {
        BACKSPACE : 8,
        TABKEY : 9,
        RETURNKEY : 13,
        ESCAPE : 27,
        SPACEBAR : 32,
        LEFTARROW : 37,
        UPARROW : 38,
        RIGHTARROW : 39,
        DOWNARROW : 40,
    }
});
