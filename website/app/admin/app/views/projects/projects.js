angular.module('views.projects', [
]);
angular.module('views.projects').

config(function ($stateProvider) {
    $stateProvider.state('app.projects', {
        url: "/projects?page&criteria",
        templateUrl: "app/views/projects/projects.html",
        controller: 'ProjectsViewCtrl'
    });
}).

controller('ProjectsViewCtrl', function ($scope, $timeout, SearchService, HttpQuery, $http, $stateParams) {
    var parsedCriteriaParams = $stateParams.criteria ? JSON.parse($stateParams.criteria) : {};

    $scope.query = HttpQuery({
        url: '/api/v1/search',
        urlParams: ['page', 'criteria'],
        params: {
            type: 'project',
            sort: 'signedup',
            size: 30,
            select: ['stub'],
            page: ($stateParams.page || 0),
            criteria: parsedCriteriaParams
        },
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
                template: '<a ng-href="https://stemn.com/projects/{{item.stub}}" target="blank">{{item.name}}</a>',
                model: 'name',
            },{
                status: true,
                name: 'Followers',
                model: 'followers',
                width: '85px'
            },{
                status: true,
                name: 'Comments',
                model: 'numComments',
                width: '85px'
            },{
                status: true,
                name: 'Updated',
                model: 'updated',
                width: '85px'
            },{
                status: true,
                name: 'Connected',
                model: 'remote',
                template: `<span style="text-transform: capitalize">{{item.remote.provider}}</span>`,
                width: '85px'
            },{
                status: true,
                name: 'Private',
                model: 'permissions',
                template: `<span>{{item.permissions.projectType == 'private' ? 'Yes' : ''}}</span>`,
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
