angular.module('modules.toggle-menu', []);
angular.module('modules.toggle-menu').

directive('toggleMenu', function ($timeout, $state) {
    return {
        scope: {
            section: '='
        },
        templateUrl: 'app/modules/toggle-menu/toggle-menu.html',
        controller: function ($scope, $rootScope) {
            $scope.toggle = function () {
                $scope.section.isOpen = !$scope.section.isOpen;
            };

            determineActive();
            $rootScope.$on('$stateChangeSuccess', determineActive);

            //////////////

            function determineActive(){
                var sectionActive = _.find($scope.section.pages, 'sref', $state.current.name);
                $scope.section.isActive = !!sectionActive;
                $scope.section.isOpen   = !!sectionActive;
            }

        }
    };
});
