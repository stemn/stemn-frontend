angular.module('views.job-applications', [
    'modules.jobs'
]);
angular.module('views.job-applications').

config(function ($stateProvider) {
    $stateProvider.state('app.job-manager', {
        url: "/job-applications",
        templateUrl: "app/views/job-applications/job-applications.html",
        abstract: true,
        controller: function($scope){
            $scope.tabs = [{
                label: 'Applications',
                sref : 'app.job-manager.applications',
            },{
                label: 'Applicants',
                sref : 'app.job-manager.applicants',
            },{
                label: 'Companies',
                sref : 'app.job-manager.organisations',
            }];
        }
    }).
    state('app.job-manager.applications', {
        url: "",
        sticky: true,
        views: {
            'applications': {
                templateUrl: "app/views/job-applications/job-applications.applications.html",
                controller: 'JobManagerApplicationsCtrl'
            }
        }
    }).
    state('app.job-manager.applicants', {
        url: "/applicants",
        sticky: true,
        views: {
            'applicants': {
                templateUrl: "app/views/job-applications/job-applications.applicants.html",
                controller: 'JobManagerApplicantsCtrl'
            }
        }
    }).
    state('app.job-manager.organisations', {
        url: "/organisations",
        sticky: true,
        views: {
            'organisations': {
                templateUrl: "app/views/job-applications/job-applications.organisations.html",
                controller: 'JobManagerOrganisationsCtrl'
            }
        }
    });
}).

controller('JobManagerApplicationsCtrl', function ($scope, HttpQuery, CoreLibrary, SearchService, ApplicationStatusService) {
    $scope.applicationsQuery = HttpQuery({
        url: '/api/v1/search',
        params: {
            type: 'application',
            size: 20,
            sort: '_id',
            order: 'dsc',
            criteria: {},
            'select[]': ['*']
        },
        columns: [
            {
                status: true,
                template: '<a ui-sref="app.users.user.info({\'stub\': item.child.stub})" class="avatar-circle block" style="background-image: url(\'https://stemn.com{{item.child.picture || \'/assets/images/default/org.png\'}}?size=thumb&crop=true\')")"></a>',
                model: 'child.picture',
                width: '40px',
                sort: false
            }, {
                status: true,
                search: true,
                name: 'Applicant',
                template: '<a ui-sref="app.users.user.info({\'stub\': item.child.stub})" class="underlined">{{item.child.name}}</a>',
                model: 'child.name',
                width: '150px',
            }, {
                status: true,
                search: true,
                name: 'Position',
                template: '<a href="https://stemn.com/applications/{{item._id}}" class="underlined">{{item.parent.name}}</a>',
                model: 'parent.name',
            }, {
                status: true,
                search: true,
                name: 'Company',
                template: '<a href="https://stemn.com/org/{{item.organisations[0].stub}}" class="underlined">{{item.organisations[0].name}}</a>',
                model: 'item.organisations[0].name',
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
            columnOrder: {},
        },
        onSucess: function (response) {
            _.forEach(response, function (item) {
                item.timestamp = CoreLibrary.getDateFromId(item._id);
            })
            return response
        }
    });


    $scope.statusFilter = SearchService.newFilter({
        title   : 'Application Status',
        model   : 'criteria.status.state',
        options : ApplicationStatusService.getStatuses(),
        query   : $scope.applicationsQuery
    });


    $scope.applicationsQuery.determineSelect();
    $scope.applicationsQuery.more();
}).

controller('JobManagerApplicantsCtrl', function ($scope, HttpQuery, CoreLibrary, SearchService) {
    $scope.applicantsQuery = HttpQuery({
        url: '/api/v1/search',
        params: {
            type: 'user',
            size: 15,
            sort: 'date',
            order: 'dsc',
            select: ['stub', 'adminData'],
            criteria: {
                numApplications: ';>0'
            },
        },
        columns: [
            {
                status: true,
                name: '',
                template: '<a ui-sref="app.users.user.info({\'stub\': item.stub})" class="avatar-circle block" style="background-image: url(\'https://stemn.com{{item.picture || \'/assets/images/default/org.png\'}}?size=thumb&crop=true\')")"></a>',
                model: 'picture',
                width: '40px',
                sort: false
            }, {
                status: true,
                search: true,
                name: 'Name',
                template: '<a ui-sref="app.users.user.info({\'stub\': item.stub})" class="underlined">{{item.name}}</a>',
                model: 'name',
            }, {
                status: true,
                name: '# Projects',
                model: 'numProjects',
                width: '140px'
            }, {
                status: true,
                name: '# Applications',
                model: 'numApplications',
                template: '<div click-show-applications parent-type="user" parent-id="{{item._id}}">{{item.numApplications}}</div>',
                width: '140px'
            }, {
                status: true,
                name: 'Last Application',
                model: 'lastApplication',
                template: '{{item.lastApplication | amTimeAgo}}',
                width: '140px'
            }, {
                status: true,
                name: 'Contacted By',
                template: '{{item.adminData.contacted[0].contactedBy}}',
                model: 'adminData.contacted[0]',
            }, {
                status: true,
                name: 'Contacted Date',
                template: '{{item.adminData.contacted[0].date | amTimeAgo}}',
                model: 'adminData.contacted[0].date',
            }, {
                status: true,
                name: 'Rating',
                model: 'adminData.rating',
                width: '140px',
                template: "<user-rating entity='item' entities='query.results' selected-rows='selectedRows' rating-type='rating'></user-rating>",
            }, {
                status: true,
                name: 'Potential Rating',
                model: 'adminData.potentialRating',
                width: '140px',
                template: "<user-rating entity='item' entities='query.results' selected-rows='selectedRows' rating-type='potentialRating'></user-rating>",
            }, {
                status: false,
                name: 'Rating Inaccurate',
                model: 'updated',
                width: '140px',
                template: `
                    <span style='color: green' ng-show='item.adminData.ratingTime'>No</span>
                    <span style='color: red' ng-hide='item.adminData.ratingTime'>Yes</span>
                `,
            },
        ],
        filters: {
            columnOrder: {}
        }
    });


    $scope.applicantsQuery.determineSelect();
    $scope.applicantsQuery.more();


    // Search Filter -------------------------------
    $scope.searchFilterApplicants = SearchService.newFilter({
        type: 'search',
        query: $scope.applicantsQuery,
        key: 'name',
        options: [{
            model: 'name',
            name: 'Name'
        }],
    });

}).

controller('JobManagerOrganisationsCtrl', function ($scope, HttpQuery, CoreLibrary, SearchService) {
    $scope.organisationsQuery = HttpQuery({
        url: '/api/v1/search',
        params: {
            type: 'organisation',
            size: 15,
            sort: 'date',
            order: 'dsc',
            criteria: {
                numJobs: ';>0',
                numApplications: ';>0',
            },
            select: ['stub']
        },
        columns: [
            {
                status: true,
                name: '',
                template: '<a ui-sref="app.organisation({\'stub\': item.stub})" class="avatar-square-contain block" style="background-image: url(\'https://stemn.com{{item.picture || \'/assets/images/default/org.png\'}}?size=thumb&crop=true\')")"></a>',
                model: 'picture',
                width: '40px',
                sort: false
            }, {
                status: true,
                search: true,
                name: 'Name',
                template: '<a ui-sref="app.organisation({\'stub\': item.stub})" class="underlined">{{item.name}}</a>',
                model: 'name',
            }, {
                status: true,
                name: '# Applications',
                model: 'numApplications',
                width: '120px',
                template: '<a click-show-applications parent-type="organisation" parent-id="{{item._id}}">{{item.numApplications}}</a>',
            }, {
                status: true,
                name: '# Jobs',
                model: 'numJobs',
                width: '60px'
            }, {
                status: true,
                name: 'Contacted By',
                model: 'adminData.contacted[0].contactedBy',
                template: '{{item.adminData.contacted[0].contactedBy}}',

            }, {
                status: false,
                name: 'Contacted Date',
                template: '{{item.adminData.contacted[0].date | amTimeAgo}}',
                model: 'item.adminData.contacted[0].date',
            }, {
                status: true,
                width: '60px',
                name: 'Pending Review',
                model: 'numPendingReview',
                template: '<div click-show-applications parent-type="organisation" parent-id="{{item._id}}" status="pendingReview">{{item.numPendingReview}}</div>'
            }, {
                status: true,
                width: '60px',
                name: 'Under Review',
                model: 'numUnderReview',
                template: '<div click-show-applications parent-type="organisation" parent-id="{{item._id}}" status="underReview">{{item.numUnderReview}}</div>'
            }, {
                status: true,
                width: '60px',
                name: 'Awaiting Update',
                model: 'numAwaitingUpdate',
                template: '<div click-show-applications parent-type="organisation" parent-id="{{item._id}}" status="awaitingUpdate">{{item.numAwaitingUpdate}}</div>'
            }, {
                status: true,
                width: '80px',
                name: 'Ready to Submit',
                model: 'numReadyToSubmit',
                template: '<div click-show-applications parent-type="organisation" parent-id="{{item._id}}" status="readyToSubmit">{{item.numReadyToSubmit}}</div>'
            }, {
                status: true,
                width: '60px',
                name: 'Submitted',
                model: 'numSubmittedToCompany',
                template: '<div click-show-applications parent-type="organisation" parent-id="{{item._id}}" status="submittedToCompany">{{item.numSubmittedToCompany}}</div>'
            }, {
                status: true,
                width: '60px',
                name: 'Hired',
                model: 'numHired',
                template: '<div click-show-applications parent-type="organisation" parent-id="{{item._id}}" status="hired">{{item.numHired}}</div>'
            }, {
                status: true,
                width: '60px',
                name: 'Rejected',
                model: 'numRejected',
                template: '<div click-show-applications parent-type="organisation" parent-id="{{item._id}}" status="rejected">{{item.numRejected}}</div>'
            }
        ],
        filters: {
            columnOrder: {}
        }
    });

    $scope.organisationsQuery.determineSelect();
    $scope.organisationsQuery.more();



    // Search Filter -------------------------------
    $scope.searchFilterOrganisations = SearchService.newFilter({
        type: 'search',
        query: $scope.organisationsQuery,
        key: 'name',
        options: [{
            model: 'name',
            name: 'Name'
        }],
    });
}).


directive('clickShowApplications', function (CoreModalService, $http, HttpQuery) {
    return {
        restrict: 'A',
        scope: {
            parentType: '@',
            parentId: '@',
            status: '@'
        },
        link: function (scope, element, attrs) {
            element.bind('click', function (event) {
                CoreModalService.showApplications(event, {
                    parentType: scope.parentType,
                    parentId: scope.parentId,
                    criteria: {
                        'status.state': scope.status
                    },
                    size: 100,
                })
            })
        }
    };
}).

directive('applicationStatus', function () {
    return {
        restrict: 'E',
        scope: {
            entity: '=',
            selectedRows: '=?',
            entities: '=?'
        },
        template: `
        <div layout="row" layout-align="start center">
            <md-input-container flex>
                <md-select class="md-accent" ng-model="entity.status.state" ng-change="saveApplication()" placeholder="Application Status">
                    <md-option ng-repeat="item in applicationStatuses" value="{{item.model}}">
                        {{item.name}}
                    </md-option>
                </md-select>
            </md-input-container>
            <div style="margin-left: 5px;">
                <md-checkbox ng-model="entity.status.notify" aria-label="Notify" style="margin-bottom: 0px;" ng-change="saveApplication()"></md-checkbox>
                <md-tooltip>Notify</md-tooltip>
            </div>
        </div>
        `,
        controller: function ($scope, LogService, $http, CoreLibrary, EntityService, ApplicationStatusService) {
            $scope.entity.status = $scope.entity.status || {};
            $scope.saveApplication = function () {
                if ($scope.selectedRows.length > 1) {
                    _.forEach($scope.entities, function (item) {
                        if ($scope.selectedRows.indexOf(item._id) != -1) {
                            item.status.state  = $scope.entity.status.state;
                            item.status.notify = $scope.entity.status.notify;
                            EntityService.update('application', item).then(EntityService.updateSuccess);
                        }
                    })
                } else {
                    EntityService.update('application', $scope.entity).then(EntityService.updateSuccess);
                }
                $scope.applicationStatuses = ApplicationStatusService.getContrainedStatuses($scope.entity.status.state);
            }
            $scope.applicationStatuses = ApplicationStatusService.getContrainedStatuses($scope.entity.status.state);
        }
    };
}).

service('ApplicationStatusService', function(){
    var service = this;
    this.getStatuses = getStatuses;
    this.getContrainedStatuses = getContrainedStatuses;

    ////////////////////////////////////////////

    function getContrainedStatuses(currentStatus){
        var statuses = service.getStatuses();
        var currentStatusInfo = statuses[currentStatus] || statuses.pendingReview;
        return _.map(currentStatusInfo.nextSteps, function(step){
            return statuses[step];
        })
    }

    function getStatuses(){
        return {
            pendingReview : {
                model:'pendingReview',
                name: 'Pending Review',
                nextSteps: ['pendingReview','underReview', 'awaitingUpdate', 'readyToSubmit','archived', 'processLater']
            },
            underReview : {
                model:'underReview',
                name: 'Under Review',
                nextSteps: ['underReview', 'awaitingUpdate', 'readyToSubmit','archived', 'processLater'],
            },
            awaitingUpdate : {
                model:'awaitingUpdate',
                name: 'Awaiting Profile Update',
                nextSteps : ['awaitingUpdate', 'pendingReview','archived'],
            },
            readyToSubmit : {
                model:'readyToSubmit',
                name: 'Ready to Submit',
                nextSteps : ['readyToSubmit', 'submittedToCompany','archived'],
            },
            submittedToCompany : {
                model:'submittedToCompany',
                name: 'Submitted',
                nextSteps: ['submittedToCompany', 'rejected', 'hired','archived']
            },
            rejected : {
                model:'rejected',
                name: 'Rejected',
                nextSteps: ['rejected','archived'],
            },
            hired : {
                model:'hired',
                name: 'Hired',
                nextSteps: ['hired','archived'],
            },
            archived : {
                model:'archived',
                name: 'Archived',
                nextSteps: ['archived'],
            },
            processLater : {
                model: 'processLater',
                name: 'Process Later',
                nextSteps: ['processLater', 'pendingReview']
            }
        }
    }
}).

directive('userRating', function () {
    return {
        restrict: 'E',
        scope: {
            entity: '=',
            selectedRows: '=?',
            entities: '=?',
            ratingType: '@?' // 'rating' || 'potentialRating'
        },
        template: `
        <md-input-container>
            <md-select class="md-accent" ng-model="entity.adminData[ratingType]" ng-change="saveUser()" placeholder="Rating">
                <md-option ng-repeat="item in ratings" value="{{item}}">
                    {{item}}
                </md-option>
            </md-select>
        </md-input-container>
        `,
        controller: function ($scope, LogService, $http, CoreLibrary, EntityService) {
            $scope.ratingType = $scope.ratingType || 'rating'; // 'rating' || 'potentialRating'
            $scope.saveUser = function () {
                if ($scope.selectedRows && $scope.selectedRows.length > 1) {
                    _.forEach($scope.entities, function (item) {
                        if ($scope.selectedRows.indexOf(item._id) != -1) {
                            item.adminData.ratingTime = Date.now();
                            item.adminData[$scope.ratingType] = $scope.entity.adminData[$scope.ratingType];
                            EntityService.patch('user', {
                                _id: item._id,
                                adminData: item.adminData,
                            }).then(EntityService.updateSuccess);
                        }
                    });
                } else {
                    $scope.entity.adminData.ratingTime = Date.now();
                    EntityService.patch('user', {
                        _id: $scope.entity._id,
                        adminData: $scope.entity.adminData,
                    }).then(EntityService.updateSuccess);
                }
            }

            $scope.ratings = [0, 1, 2, 3, 4, 5];

        }
    };
});
