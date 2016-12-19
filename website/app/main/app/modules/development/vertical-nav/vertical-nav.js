angular.module('modules.scroll.vertical-nav', [
]);
angular.module('modules.scroll.vertical-nav').

directive('verticalNav', function() {
    return {
        restrict: 'E',
        scope: {
            menu: '='
        },

        /****************************

        $scope.menu = [
            {
                id    : 'stemn',
                name  : 'Welcome',
                color : 'light'
            },{
                id    : 'editor',
                name  : 'Workspace',
                color : 'dark'
            },{
                id    : 'portfolio',
                name  : 'Scientific Identity',
                color : 'light'
            },{
                id    : 'network',
                name  : 'Network',
                color : 'light'
            },        {
                id    : 'maps',
                name  : 'Map',
                color : 'light'
            },{
                id    : 'story',
                name  : 'Ready?',
                color : 'light'
            }
    ]

        ****************************/
        templateUrl: 'app/modules/scroll/vertical-nav/vertical-nav.html',
        controller: function ($scope, $rootScope, $window) {
            $rootScope.$on('duScrollspy:becameActive', function($event, $element, $target){
                var menuId = $element[0].getAttribute('du-scrollspy');
                $scope.activeIndex = _.findIndex($scope.menu, 'id', menuId);
                $scope.halfWindowHeight = $window.innerHeight/2;
                $scope.$apply();
            });
        }
    };
});
