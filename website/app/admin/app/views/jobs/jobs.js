angular.module('views.jobs', [
    'modules.jobs'
]);
angular.module('views.jobs').

config(function ($stateProvider) {
    $stateProvider.state('app.jobs', {
        url: "/jobs",
        templateUrl: "app/views/jobs/jobs.html",
        controller: 'JobsViewCtrl'
    });
}).

controller('JobsViewCtrl', function ($scope, HttpQuery, CoreLibrary, $http, SearchService) {
    $scope.query = HttpQuery({
        url: 'api/v1/search',
        params: {
            type: 'job',
            select: ['stub'],
            criteria: {},
            size: 20,
        },
        columns: [{
            status: true,
            sort: false,

            model: 'picture',
            template: '<a class="avatar-square-contain block" style="background-image: url(\'https://stemn.com{{item.picture || \'/assets/images/default/org.png\'}}?size=thumb\')")"></a>',
            width: '50px',
        }, {
            status: true,
            sort: true,

            name: 'Organisation',
            model: 'organisations[0].name',

            template: '<a target="_blank" ng-href="https://stemn.com/org/{{item.organisations[0].stub}}/jobs" class="underlined">{{item.organisations[0].name}}</a>',
            width: '200px',
        }, {
            status: true,
            sort: true,

            name: 'Name',
            model: 'name',

            template: '<a target="_blank" ng-href="https://stemn.com/jobs/{{item.stub}}" class="underlined">{{item.name}}</a>',

        }, {
            status: true,
            sort: true,

            name: '# Applications',
            model: 'numApplications',
            width: '110px',
        }, {
            status: true,
            sort: true,

            name: '# Fields',
            model: 'numFields',
            width: '100px',
        }, {
            status: true,
            sort: true,

            name: 'Owner',
            model: 'owners',
            template: '<core-entity-picture entity-type="user" entity-id="{{item.owners[0]}}" entity="entity"></core-entity-picture>',
            width: '50px',
        }],
        filters: {
            columnOrder: {}
        },
    })
    $scope.query.determineSelect();
    $scope.query.more();

});
