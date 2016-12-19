angular.module('views.user', [
    'modules.emails'
]);
angular.module('views.user').

config(function ($stateProvider) {
    $stateProvider.state('app.users.user', {
        url: "/:stub",
        abstract: true,
        templateUrl: "app/views/user/user.html",
        controller: 'UserViewCtrl',
        resolve: {
            user: function (EntityService, $stateParams) {
                return EntityService.get('user', $stateParams.stub, 'lg')
            }
        }
    }).
    state('app.users.user.analytics', {
        url: "/analytics",
        sticky: true,
        views: {
            'analytics': {
                templateUrl: 'app/views/user/tpls/user-analytics.html',
            }
        }
    }).
    state('app.users.user.info', {
        url: "",
        sticky: true,
        views: {
            'info': {
                templateUrl: 'app/views/user/tpls/user-info.html',
            }
        }
    }).
    state('app.users.user.applications', {
        url: "/applications",
        sticky: true,
        views: {
            'applications': {
                templateUrl: 'app/views/user/tpls/user-applications.html',
            }
        }
    }).
    state('app.users.user.crm', {
        url: "/crm",
        sticky: true,
        views: {
            'crm': {
                templateUrl: 'app/views/user/tpls/user-crm.html',
                controller: function($scope, $http){
                    $http({
                        method: 'GET',
                        url   : 'api/v1/analytics/contactedButNotUpdated',
                        params: {
                            user : $scope.entity._id
                        }
                    }).then(function(response){
                    })

                }
            }
        }
    });
}).



controller('UserViewCtrl', function (user, $scope, $stateParams, $http, CoreLibrary, $mdToast, EntityService, HttpQuery, EmailService) {
    $scope.entity = user;

    // Assign functions
    $scope.saveEntity = saveEntity; // function()

    $scope.applicationsQuery = HttpQuery({
        url: '/api/v1/search',
        params: {
            type: 'application',
            parentType: 'user',
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

    $scope.tabs = [
        {
            label: 'Info',
            sref: 'app.users.user.info'
        },{
            label: 'CRM',
            sref: 'app.users.user.crm'
        },{
            label: 'Analytics',
            sref: 'app.users.user.analytics'
        },{
            label: 'Applications',
            sref: 'app.users.user.applications'
        }
	];


    ///////////////////////////////

    function saveEntity() {
        EntityService.update('user', $scope.entity).then(EntityService.updateSuccess);
    }

    $http({
        url: 'api/v1/users/' + user._id + '/campaign',
        method: "GET",
    }).then(function (response) {
        $scope.campaign = response.data;
    })


    $http({
        url: "api/v1/analytics/userDevices",
        method: "GET",
        params: {
            user: user._id
        }
    }).then(function (response) {
        _.forEach(response.data, function (device) {
            device.date = CoreLibrary.getDateFromId(device._id);
        })
        $scope.devices = response.data;
    })
});
