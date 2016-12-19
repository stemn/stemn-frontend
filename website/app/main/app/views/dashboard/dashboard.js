angular.module('views.dashboard', [

]);
angular.module('views.dashboard').

config(function ($stateProvider) {
    $stateProvider.
    state('app.dashboard', {
        url : '/dashboard',
        abstract: true,
        authLevel: 'user',
        templateUrl: 'app/views/dashboard/tpls/dashboard.html',
        controller: function ($scope) {

			// Tabs ------------------------------------------------------
			$scope.tabs = [
                {
                    label: 'My Projects',
                    sref: 'app.dashboard.projects'
                },{
                    label: 'Change Log',
                    sref: 'app.dashboard.feed'
                }
			];
        },
        layout: {
            size: 'md',
            footer: false,
            bgColor: 'rgba(0, 0, 0, 0.03)'
        },
        seo: function(resolve){
            return {
                title       : 'Your Dashboard - STEMN',
            }
        }
    }).
    state('app.dashboard.projects', {
        url : '',
        templateUrl: 'app/views/dashboard/tpls/dashboard-projects.html',
        controller: function($scope, HttpQuery, Authentication){
            $scope.query = HttpQuery({
                url: '/api/v1/search',
                params: {
                    type       : 'project',
                    size       : 20,
                    sort       : 'updated',
                    key        : 'name',
                    select     : ['name','stub','entityType','type','updated', 'published',
                                 'likes', 'numPosts', 'numComments', 'permissions.projectType'],
                    parentType : 'user',
                    published  : 'both',
                    parentId   : Authentication.currentUser._id,
                },
                onSuccess      : function(results){
                    return results
                }
            });
            $scope.query.more();
        }
    }).
    state('app.dashboard.feed', {
        url : '/feed',
        templateUrl: 'app/views/dashboard/tpls/dashboard-feed.html',
    })
});
