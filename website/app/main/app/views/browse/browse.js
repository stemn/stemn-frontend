angular.module('views.browse', [
    'modules.pagination',
    'modules.organisations',
    'modules.jobs',
    'modules.location',

    'views.browse.organisations',
    'views.browse.projects',
    'views.browse.fields',
    'views.browse.jobs',
    'views.browse.threads',
    'views.browse.users',
]);
angular.module('views.browse').

config(function ($stateProvider) {
    $stateProvider.
    state('app.browse', {
        url: '/browse',
        templateUrl: 'app/views/browse/browse.html',
        abstract: true,
    }).
    state('app.browse.all', {
        url: '/',
        templateUrl: 'app/views/browse/browse-all.html',
        layout: {
            size: 'md',
            footer: true
        },
        seo: function(resolve){
            return {
                title : "Browse Projects, Questions and Organisations - STEMN",
            }
        }
    })
}).

directive('fieldsFilter', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/views/browse/tpls/fields-filter.html',
        replace: true,
		scope: {
			filter : '=',
		},
        controller: function($scope){
            $scope.select = select; //function(id)

            $scope.filter = $scope.filter || {};

            function select(id){
                $scope.filter.current = id;
            }
        },
    }
});
