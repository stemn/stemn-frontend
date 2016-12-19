angular.module('views.threads', [
]);
angular.module('views.threads').

config(function ($stateProvider) {
    $stateProvider.state('app.threads', {
        url: "/threads?page&criteria",
        templateUrl: "app/views/threads/threads.html",
        controller: 'ThreadsViewCtrl'
    });
}).

controller('ThreadsViewCtrl', function ($scope, $timeout, SearchService, HttpQuery, $http, $stateParams) {
    var parsedCriteriaParams = $stateParams.criteria ? JSON.parse($stateParams.criteria) : {};

    $scope.query = HttpQuery({
        url: '/api/v1/search',
        urlParams: ['page', 'criteria'],
        params: {
            type: 'thread',
            sort: 'signedup',
            size: 30,
            select: ['stub'],
            page: ($stateParams.page || 0),
            criteria: parsedCriteriaParams
        },
        paginate: true,
        columns: [
            {
                status: true,
                name: '',
                template: '<a class="avatar-circle block" style="background-image: url(\'https://stemn.com{{item.picture || \'/assets/images/default/org.png\'}}?size=thumb&crop=true\')")"></a>',
                model: 'picture',
                width: '40px',
                sort: false
            },{
                status: true,
                search: true,
                name: 'Name',
                model: 'name',
            },{
                status: true,
                name: 'Followers',
                model: 'followers',
                width: '85px'
            },{
                status: true,
                name: 'Comments',
                model: 'numPosts',
                width: '85px'
            },{
                status: true,
                name: 'Updated',
                model: 'updated',
                width: '85px'
            },{
                status: true,
                name: 'Type',
                model: 'type',
                width: '85px'
            }
        ],
        filters: {
            columnOrder : {}
        }
    });
    $scope.query.determineSelect();
    $scope.query.init();

    // Search Filter -------------------------------
    $scope.searchFilter = SearchService.newFilter({
        type : 'search',
        query: $scope.query,
        key  : 'name',
        options: [{
            model : 'name',
            name  : 'Name'
        }],
    });
    $scope.searchFilter.parseParams(parsedCriteriaParams)
});
