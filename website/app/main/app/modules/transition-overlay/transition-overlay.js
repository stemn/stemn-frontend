angular.module('modules.transition-overlay', []);
// This will apply a transition overlay on State-Change start
// Overlay will be removed after success
angular.module('modules.transition-overlay').

directive('transitionOverlay', function ($rootScope) {
    return {
        restrict: 'E',
        scope:{},
        replace: true,
        template : '<div class="transition-overlay" ng-show="OverlayService.transitionOverlay.show"></div>',
        controller : function ($scope, $rootScope, OverlayService){
			$scope.OverlayService = OverlayService;
            $rootScope.$on('$stateChangeStart', function () {
                OverlayService.transitionOverlay.show = true;
            });
            $rootScope.$on('$stateChangeSuccess', function () {
                OverlayService.transitionOverlay.show = false;
            });
            $rootScope.$on('$stateChangeError', function () {
                OverlayService.transitionOverlay.show = false;
            });
        }
    };
}).
service('OverlayService', function () {
    this.transitionOverlay = {
		show: false,
    }
});
