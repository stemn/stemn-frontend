angular.module('views.organisation', []);
angular.module('views.organisation').

config(function ($stateProvider) {
    $stateProvider.state('app.organisation', {
        url: "/org/:stub",
        templateUrl: "app/views/organisation/organisation.html",
        controller: 'OrganisationViewCtrl',
        resolve: {
            entity: function (EntityService, $stateParams) {
                return EntityService.get('organisation', $stateParams.stub, 'lg')
            }
        }
    });
}).



controller('OrganisationViewCtrl', function (entity, $scope, $stateParams, $http, CoreLibrary, EntityService, $mdToast, HttpQuery) {
    $scope.entity = entity;

    // Assign functions
    $scope.saveEntity = saveEntity; // function()

    $scope.applicationsQuery = HttpQuery({
        url: '/api/v1/search',
        params: {
            type: 'application',
            parentType: 'organisation',
            parentId: $scope.entity._id,
            size: 100,
            sort: '_id',
            order: 'dsc',
            'select[]': ['*']
        },
        columns: [
            {
                status: true,
                template: '<a ui-sref="app.users.user({\'stub\': item.child.stub})" class="avatar-circle block" style="background-image: url(\'https://stemn.com{{item.child.picture || \'/assets/images/default/org.png\'}}?size=thumb&crop=true\')")"></a>',
                model: 'child.picture',
                width: '40px',
                sort: false
            }, {
                status: true,
                search: true,
                name: 'Position',
                template: '<a href="https://stemn.com/applications/{{item._id}}" class="underlined">{{item.parent.name}}</a>',
                model: 'child.name',
            }, {
                status: true,
                name: 'Cover Letter',
                model: 'coverLetter',
                template: '{{item.coverLetter | letters: 100}}',
            }, {
                status: true,
                search: true,
                name: 'Company',
                template: '<a href="https://stemn.com/org/{{item.organisations[0].stub}}" class="underlined">{{item.organisations[0].name}}</a>',
                model: 'child.name',
                width: '200px',
            }, {
                status: true,
                name: 'Time',
                model: '_id',
                template: '{{item.timestamp | amTimeAgo}}',
                width: '140px'
            }, {
                status: true,
                name: 'Status',
                model: 'status',
                width: '140px',
                template: "<application-status entity='item' entities='query.results' selected-rows='selectedRows'></application-status>",
            },
        ],
        filters: {
            columnOrder: {}
        },
        onSucess: function (response) {
            _.forEach(response, function (item) {
                item.timestamp = CoreLibrary.getDateFromId(item._id);
            })
            return response
        }
    });


    $scope.applicationsQuery.determineSelect();
    $scope.applicationsQuery.more();


    ///////////////////////////////

    function saveEntity() {
        EntityService.update('organisation', $scope.entity).then(EntityService.updateSuccess);
    }
});
