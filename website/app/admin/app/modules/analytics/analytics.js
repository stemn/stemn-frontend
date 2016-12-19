angular.module('modules.analytics', [
]);
angular.module('modules.analytics').

directive('analyticsCount', function ($http, $auth, Authentication) {
    return {
        restrict: 'E',
        scope: {
            type       : '@?',
            criteria   : '=?',
            parentType : '@?',
            parentId   : '@?'
        },
        template: '<a ng-click="getCount()">{{count}}</a>',
        link : function (scope, element, attrs){
            scope.getCount = getCount;
            getCount();
            ////////////

            function getCount(){
                scope.count = '...'
                $http({
                    method: 'GET',
                    url: '/api/v1/search/',
                    params: {
                        type       : scope.type,
                        count      : true,
                        'select[]' : ['_id'],
                        criteria   : scope.criteria,
                        parentType : scope.parentType,
                        parentId   : scope.parentId,
                    },
                }).then(function (response) {
                    scope.count = response.data[0];
                })
            }

		}
    };
});
