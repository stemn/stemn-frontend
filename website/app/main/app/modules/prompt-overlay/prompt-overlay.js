angular.module('modules.prompt-overlay', [
]);
angular.module('modules.prompt-overlay').

directive('promptOverlay', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            img: '@'
        },
        templateUrl: 'app/modules/prompt-overlay/tpls/prompt-overlay.html',
        controller: function($scope, PromptOverlayService){
            $scope.PromptOverlayService = PromptOverlayService;
            $scope.close    = function(){
                $scope.PromptOverlayService.showPrompt = false;
            }
        }
    };
}).
service('PromptOverlayService', function () {
    this.showPrompt = true;
});
