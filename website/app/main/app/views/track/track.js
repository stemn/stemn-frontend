angular.module('views.track', []);
angular.module('views.track').

config(function ($stateProvider) {
    $stateProvider.
    state('app.track', {
        url: '/:stub/track',
        templateUrl: 'app/views/track/tpls/track.html',
        layout: {
            size: 'lg',
            bgColor: 'rgba(0, 0, 0, 0.03)'
        },

        resolve: {
            organisation: function (EntityService, $stateParams) {
                return EntityService.get('organisation', $stateParams.stub, 'sm').then(function (organisation) {
                    return organisation;
                });
            },
        },

        controller: function (organisation, $scope, $http, TrackService) {
            $scope.organisation = organisation;


            $scope.trackColumns = [
                {
                    name: 'Inbound',
                    status: 'pendingReview',
                }, {
                    name: 'Phone Interview',
                    status: 'awaitingUpdate',
                }, {
                    name: 'On-site Interview',
                    status: 'submittedToCompany',
                }, {
                    name: 'Offer Pending',
                }, {
                    name: 'Hired',
                }, {
                    name: 'Archived',
                    status: 'archived',
                }
            ];
            $http({
                method: 'GET',
                url: 'api/v1/search',
                params: {
                    type: 'job',
                    criteria: {
                        organisations: $scope.organisation._id
                    },
                    size: 999
                }
            }).then(function (response) {
                $scope.jobs = response.data;
            })

            $http({
                method: 'GET',
                url: 'api/v1/search',
                params: {
                    type: 'application',
                    criteria: {
                        organisations: $scope.organisation._id
                    },
                    size: 999
                }
            }).then(function (response) {
                TrackService.editCandidate(null, response.data[0]);

                var groupedApplicants = {};
                _.forEach(response.data, function (applicant) {
                    groupedApplicants[applicant.status.state] = groupedApplicants[applicant.status.state] || [];
                    groupedApplicants[applicant.status.state].push(applicant);
                });
                // Apply data to trackColumns array
                _.forEach($scope.trackColumns, function (column) {
                    column.applicants = groupedApplicants[column.status] || [];
                })
            })

            $scope.filters = {
                job: ''
            };


            $scope.sortableConfig = {
                handle: ".my-handle",
                animation: 150,
                group: 'column',
                chosenClass: "sortable-chosen", // Class name for the chosen item
            };

            ///////////////////////////////////////////////////////////

        }
    });
}).

directive('trackComments', function () {
    return {
        restrict: 'E',
        scope: {
        },
        templateUrl: 'app/views/track/tpls/track-comments.html',
        controller : function($scope){
            console.log('here');
        }
    }
}).

directive('trafficButtons', function () {
    return {
        restrict: 'E',
        scope: {
        },
        templateUrl: 'app/views/track/tpls/traffic-buttons.html',
        controller : function($scope){
            console.log('here');
        }
    }
}).

service('TrackService', function ($mdDialog) {

    this.editCandidate = editCandidate;


    ///////////////////

    function editCandidate(event, application) {
        return $mdDialog.show({
            templateUrl: 'app/views/track/tpls/edit-candidate-modal.html',
            controller: function (application, $scope, $state, Authentication, $mdToast, HttpQuery, LocationService, $http, EntityService) {

                $scope.application = application;

                $http({
                    method: 'GET',
                    url: '/api/v1/jobs/matchRating',
                    params: {
                        jobId: application.parent._id,
                        userId: Authentication.currentUser._id
                    }
                }).then(function (response) {
                    $scope.matchRating = response.data.matchRating;
                })
                
                EntityService.get('job', application.parent._id).then(function(response){
                    $scope.job = response;

                    $scope.match = {
                        requiredSkills : $scope.job.requriedSKills,
                        relatedSkills  : $scope.job.fields
                    }

                })

                EntityService.get('user', application.child._id).then(function(response){
                    $scope.user = response;
                })

               

                $scope.tabs = [
                    {
                        label: 'Score',
                        click: function () {
                            $scope.activeTab = 'Score';
                        }
                    }, {
                        label: 'Interview',
                        click: function () {
                            $scope.activeTab = 'Interview';
                        }
                    }, {
                        label: 'Other Info',
                        click: function () {
                            $scope.activeTab = 'Other Info';
                        }
                    }
                ];
                $scope.activeTab = $scope.tabs[0].label;


        
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
            },
            locals: {
                application: application
            },
            targetEvent: event,
        })
    }
})
