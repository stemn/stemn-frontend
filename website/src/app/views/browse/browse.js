import './browse.scss';
import './browse-fields/browse-fields.js'
import './browse-jobs/browse-jobs.js'
import './browse-organisations/browse-organisations.js'
import './browse-projects/browse-projects.js'
import './browse-threads/browse-threads.js'
import './browse-users/browse-users.js'

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
        template: require('./browse.html'),
        abstract: true,
    }).
    state('app.browse.all', {
        url: '/',
        template: require('./browse-all.html'),
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
        template: require('./tpls/fields-filter.html'),
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
