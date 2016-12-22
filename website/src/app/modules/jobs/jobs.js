import './jobs.scss';

import modalRequirementsTpl from 'ngtemplate!./tpls/job-application-modal.requirements.html';
import modalCoverletterTpl  from 'ngtemplate!./tpls/job-application-modal.coverletter.html';
import modalOtherTpl        from 'ngtemplate!./tpls/job-application-modal.other.html';

angular.module('modules.jobs', [
]);
angular.module('modules.jobs').

directive('jobRows', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            parentType: '@',
            parentId  : '@',
            size      : '@',
            currentJobId: '@', // Hide the current job from the list
            hideMore  : '=?',  // Hides the more button
            query     : '=?',  // Query object to be passed up to the parent
            near      : '=?'   // Near location
        },
        template: require('./tpls/job-rows.html'),
        controller: function ($scope, HttpQuery, SearchService) {
            $scope.size = $scope.size || 6;

            $scope.query = HttpQuery({
                url: '/api/v1/search',
                params: {
                    type       : 'job',
                    size       : $scope.size,
                    key        : 'name',
                    select     : ['name','organisation','location.name','pay','jobType','level', 'stub', 'organisations'],
                    parentType : $scope.parentType,
                    parentId   : $scope.parentId,
                    near       : $scope.near,
                    radius     : 0
                }
            });
            $scope.query.more();
//            if($scope.parentId){
//            }
        }
    };
}).

directive('jobTile', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            entityId   : '@?',
        },
        template: require('./tpls/job-tile.html'),
        controller: function($scope, EntityService, CoreLibrary){
            $scope.loading = true;
            EntityService.get('job', $scope.entityId, 'sm').then(function(response){
                $scope.item  = response;
                $scope.item.url =  CoreLibrary.getHref('job', response.stub);
                $scope.loading = false;
            });
        }
    };
}).

directive('resubmitApplicationButton', function () {
    return {
        restrict: 'EA',
        scope: {
            application   : '=',
            resubmitted   : '=?'
        },
        template: require('./tpls/resubmit-application-button.html'),
        controller: function($scope, EntityService, $mdToast){
            $scope.resubmitApplication = function(){
                $scope.application.status.state = 'pendingReview';
                $scope.resubmitted = true;
                EntityService.update('application', $scope.application).then(function(){
                    $mdToast.show($mdToast.simple().content('Application successfully resubmitted.'));
                });
            }
        }
    };
}).


directive('applicationRows', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            parentType : '@',
            parentId   : '@',
            job        : '=?'
        },
        template: require('./tpls/application-rows.html'),
        controller: function ($scope, HttpQuery, SearchService) {
            $scope.query = HttpQuery({
                url: '/api/v1/search',
                params: {
                    type       : 'application',
                    size       : 6,
                    parentType : $scope.parentType,
                    parentId   : $scope.parentId,
                },
                onSuccess: function(response){
                    return response
                }
            });
            $scope.query.more();
        }
    };
}).

directive('applyButton', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            job: '=?', // Users to pass job.organisations[0].name to apply modal
            jobId: '@',
            jobStub: '@',
            changeState: '@', // true || false - will go to the job state when true
            textApplied: '@?',
            textApply: '@?',
            buttonStatus: '=?' // Status to be used in parent scope
        },
        template: require('./tpls/apply-button.html'),
        controller: function ($scope, $state, $timeout, ApplicationService, JobModalService, Authentication) {
            if(Authentication.currentUser.isLoggedIn()){
                ApplicationService.getStatus($scope.jobId).then(function(response){
                    $scope.buttonStatus = response;
                })
            }

            $scope.jobApply = function(event){

                // If we have applied - go to the application
                if($scope.buttonStatus.status){
                    $state.go('app.application', {stub: $scope.buttonStatus.status});
                }
                else if($scope.changeState){
                    $state.go('app.job',{stub:($scope.jobStub || $scope.jobId)}).then(function(response){
                        $timeout(function(){
                            popApplyModal(event)
                        },200)
                    });
                }
                else{
                    popApplyModal(event)
                }
            }

            function popApplyModal(event){
                JobModalService.applyForJob(event, $scope.job).then(function(application){
                    ApplicationService.sendApplication($scope.jobId, application).then(function(response){
                        JobModalService.applicationSuccess(event, response);
                        $scope.buttonStatus.status = response._id;
                    });
                })
            }
        }
    };
}).

service('JobModalService', function($mdDialog){
    this.applyForJob         = applyForJob;
    this.createJob           = createJob;
    this.applicationSuccess  = applicationSuccess; // function(event, application)

    ///////////////////////////

    function createJob(event, data){
        return $mdDialog.show({
            template: require('./tpls/create-job-modal.html'),
            controller: function(data, $scope, $state, Authentication, $mdToast, UserService, OrganisationService, NewCreationsService, OrganisationModalService, HttpQuery){

                $scope.entity = {
                    organisations: []
                };

                $scope.queryOrganisations = HttpQuery({
                    url: '/api/v1/search',
                    params: {
                        type       : 'organisation',
                        size       : 3,
                        sort       : 'submitted',
                        'select[]' : ['name'],
                        parentType : 'user',
                        parentId   : Authentication.currentUser._id
                    },
                });
                $scope.queryOrganisations.more();

                $scope.createOrganisation = function(event){
                    OrganisationModalService.organisationNewModal(event).then(function (result) {
                        $state.go('app.organisation.settings.overview', {
                            stub: result.stub,
                        });
                    })
                }

                $scope.confirm = function () {
                    if($scope.form.$valid){
                        NewCreationsService.create('job', $scope.entity)
                        $mdDialog.hide();
                    }
                    else{
                        $mdToast.show($mdToast.simple().theme('warn').content('Organisation or name is missing'));
                    }
                };

				$scope.cancel = function () {
                    $mdDialog.cancel();
                };
            },
			locals: {data: data},
            targetEvent: event,
            clickOutsideToClose: true
        })
    }

    function applicationSuccess(event, data){
        return $mdDialog.show({
            template: require('./tpls/application-success-modal.html'),
            controller: function($scope, $state){
				$scope.cancel = function () {
                    $mdDialog.cancel();
                };
                $scope.confirm = function () {
                    $state.go('app.applications');
                };
            },
            targetEvent: event,
            clickOutsideToClose: true
        })
    }

    function applyForJob(event, job){
        return $mdDialog.show({
            template: require('./tpls/job-application-modal.html'),
            controller: function(job, $scope, $state, Authentication, $mdToast, HttpQuery, LocationService, $http, EntityService){
                $scope.job = job;
                $scope.forms = {};

                $scope.modalRequirementsTpl = modalRequirementsTpl;
                $scope.modalCoverletterTpl = modalCoverletterTpl;
                $scope.modalOtherTpl = modalOtherTpl;

                // Get User, Job and Projects
                EntityService.get('user', Authentication.currentUser._id, 'lg').then(function(response){
                    $scope.user = response;
                });
                EntityService.get('job', job._id, 'lg').then(function(response){
                    $scope.job = response;
                });

                $scope.application = {
                    email: Authentication.currentUser.email,
                    coverLetter: ''
                };

                $http({
                    method: 'GET',
                    url:'/api/v1/jobs/matchRating',
                    params: {
                        jobId: job._id,
                        userId: Authentication.currentUser._id
                    }
                }).then(function(response){
                    $scope.matchRating = response.data.matchRating;
                })

                // Get the user's projects
                $scope.projectsQuery = HttpQuery({
                    url: '/api/v1/search',
                    params: {
                        type       : 'project',
                        size       : 3,
                        sort       : 'submitted',
                        select     : ['name','stub','picture', 'blurb'],
                        parentType : 'user',
                        parentId   : Authentication.currentUser._id
                    },
                });
                $scope.projectsQuery.more();


                $scope.activeTab = 'Requirements';
                $scope.tabs = [
                    {
                        label: 'Requirements',
                        click: function(){
                            $scope.activeTab = 'Requirements';
                        }
                    },{
                        label: 'Cover Letter',
                        click: function(){
                            $scope.activeTab = 'Cover Letter';
                        }
                    },{
                        label: 'Other Info',
                        click: function(){
                            $scope.activeTab = 'Other Info';
                        }
                    }
                ];
                $scope.isFailedRequiredFields = function(){
                    return _.find($scope.job.requiredFields, 'active', false);
                }

                $scope.isFailedRequiredProjects = function(){
                    return !$scope.projectsQuery.results || $scope.projectsQuery.results.length < 2
                }

                $scope.isFailedRequirements = function(){
                    return $scope.isFailedRequiredProjects() || $scope.isFailedRequiredFields();
                }

                $scope.steps = {
                    'Requirements' : {
                        nextText : 'Next',
                        nextFn : function(){
                            $scope.activeTab = 'Cover Letter';
                        },
                        isDisabled : $scope.isFailedRequirements //function()
                    },
                    'Cover Letter' : {
                        nextText : 'Next',
                        nextFn : function(){
                            $scope.activeTab = 'Other Info';
                        },
                    },
                    'Other Info' : {
                        nextText : 'Submit',
                        nextFn : function(){
                            EntityService.update('user', $scope.user);
                            $mdDialog.hide($scope.application);
                        },
                        isDisabled : function(){
                            return $scope.forms.infoForm && $scope.forms.infoForm.$invalid;
                        }
                    },
                };

				$scope.cancel = function () {
                    $mdDialog.cancel();
                };
            },
			locals: {job: job},
            targetEvent: event,
        })
    }
}).

service('ApplicationService', function(HttpService, LocalCache, Authentication){
    var service = this;
    this.getStatus = getStatus;             // function(jobId)
    this.sendApplication = sendApplication; // function(jobId, application)

    ///////////////////////////////////

    function getStatus(jobId){
        var getPromise = function(jobId){
            return HttpService({
                url: '/api/v1/social',
                method: "GET",
                params: {
                    socialType    : 'application',
                    'parentIds[]' : jobId,
                    childId       : Authentication.currentUser._id
                }
            });
        };
        return LocalCache.getPackaged('application-status', jobId, getPromise)
    }

    function sendApplication(jobId, application){
        return HttpService({
            method: 'POST',
            url: 'api/v1/jobs/'+ jobId +'/apply',
            data: application
        }).then(function(response){
            LocalCache.save('application-status', {
                _id    : jobId,
                status : response._id
            });
            return response
        })
    }
}).


service('JobService', function(HttpService, LocalCache, CoreLibrary) {
    this.getJob      = getJob;      // function(jobId)
    this.createJob   = createJob;   // function(job)
    this.updateJob   = updateJob;   // function(job)
    this.deleteJob   = deleteJob;   // function(jobId)


    var endpoint       = 'job';
    var selectSm       = ['stub', 'name', 'picture', 'blurb'];
    var selectMd       = ['stub', 'name', 'picture', 'blurb', 'created', 'updated', 'fields', 'organisations', 'team' , 'likes', 'numComments', 'location'];
    var selectLg       = ['*']

    //////////////////////////////////////////


    function getJob(stubOrId, select) {

        // Default the selectFields
        var selectFields
        if(select == 'sm'){
            selectFields = selectSm;
        } else if (select == 'md'){
            selectFields = selectMd;
        } else{
            selectFields = selectLg;
            select = 'lg';
        }

        var getPromise = function(data){
            // data - [asfasffsa, asfafsasfasf] - Array of user ids
            return HttpService({
                url: '/api/v1/jobs',
                method: "GET",
                params: {
                    'select[]' : selectFields,
                    'ids[]'  : data,
                }
            });
        };
        return LocalCache.getPackaged(endpoint+select, stubOrId, getPromise)
	}

    function createJob(entity){
        return HttpService({
            method: 'POST',
            url: 'api/v1/jobs',
            data: entity
        })
    }

    function updateJob(entity) {
        LocalCache.save(endpoint+'lg', entity);
        return HttpService({
            method: 'PUT',
            url: 'api/v1/jobs/'+entity._id,
            data: entity
        })
    }

    function deleteJob(entityId) {
        return HttpService({
            url: '/api/v1/jobs/'+entityId,
            method: "DELETE",
        });
    }

});
