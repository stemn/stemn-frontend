angular.module('views.browse.projects', [

]);
angular.module('views.browse.projects').

config(function ($stateProvider) {
    $stateProvider.
    state('app.browse.projects', {
        url: '/projects?page&sort',
        templateUrl: 'app/views/browse/browse-projects/browse-projects.html',
        layout: {
            size: 'md',
            footer: true
        },
        seo: function(resolve){
            return {
                title : "Browse Engineering and Space Projects - STEMN",
            }
        },
        controller: 'BrowseProjectsViewCtrl',
        resolve: {
            fields: function (SearchService, $stateParams) {
                return SearchService.search({
                    type: 'field',
                    page: 1,
                    size: 11,
                    sort: 'numProjects',
                    key: 'name',
                }).then(function (response) {
                    return response.data
                });
            }
        },
        data: {
            name: 'Projects'
        }
    })
}).

controller('BrowseProjectsViewCtrl', function (fields, $rootScope, $scope, $state, $location, $stateParams, FeedService) {
    // Scope data
    $scope.fieldFilter = {
        current: '',
        options: fields
    };
    $scope.sortFilter = {
        current : $stateParams.sort || 'updated',
        options : [
            {
                model : 'views',
                name  : 'Views'
            },{
                model : 'numComments',
                name  : 'Comments'
            },{
                model : 'likes',
                name  : 'Likes'
            },{
                model : 'updated',
                name  : 'Updated'
            }
        ]
    };

//    function changeSort(){
//        $location.search({
//            'sort' : $scope.sortFilter.current,
//            'page' : 1
//        });
//    }
});
