angular.module('modules.transition-overlay', []);
// This will apply a transition overlay on State-Change start
// Overlay will be removed after success
angular.module('modules.transition-overlay').

directive('transitionOverlay', function ($rootScope) {
    return {
        restrict: 'E',
        scope:{},
        replace: true,
        template : '<div class="transition-overlay" ng-show="showOverlay"></div>',
        controller : function ($scope, $rootScope){
            $rootScope.$on('$stateChangeStart', function () {
                $scope.showOverlay = true;
            });
            $rootScope.$on('$stateChangeSuccess', function () {
                $scope.showOverlay = false;
            });
            $rootScope.$on('$stateChangeError', function () {
                $scope.showOverlay = false;
            });
        }
    };
});
