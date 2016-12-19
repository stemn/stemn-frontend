angular.module('views.applications', [
]);
angular.module('views.applications').

config(function ($stateProvider) {
    $stateProvider.
    state('app.applications', {
        url: '/applications',
        templateUrl: 'app/views/applications/tpls/applications.html',
        authLevel: 'user',
        seo: function(resolve){
            return {
                title       : 'My Applications - STEMN',
            }
        },
        layout: {
            size: 'md',
            footer: false,
            bgColor: 'rgba(0, 0, 0, 0.03)'
        },
        controller: function($scope, HttpQuery, Authentication, CoreLibrary, ApplicationStatusService, EntityService){
            $scope.query = HttpQuery({
                url    : 'api/v1/search',
                params : {
                    parentType : 'user',
                    parentId   : Authentication.currentUser._id,
                    type       : 'application',
                    sort       : '_id',
                    size       : 10,
                    'select[]' : ['*']
                },
                onSuccess: function(response){
                    _.forEach(response, function (item) {
                        var mappedStatus  = ApplicationStatusService.getMappedStatus(item.status.state);
                        item.mappedStatusText = ApplicationStatusService.getMappedStatusText(mappedStatus);
                    })
                    setHref(response);
                    return response
                }
            });
            $scope.query.more();

            /////////////////////////////////////////////////////

            function setHref(feed){
                _.forEach(feed, function (item) {
//                    item.href = CoreLibrary.getHref(item.entityType, item._id);
                    item.href = CoreLibrary.getHref('application', item._id);
                })
            }

        },
    }).
    state('app.application', {
        url: '/applications/:stub',
        templateUrl: 'app/views/applications/tpls/application.html',
        resolve: {
            entity: function (EntityService, $stateParams, $state, $timeout) {
                return EntityService.get('application', $stateParams.stub)
            },
        },
        seo: function(resolve){
            return {
                title : 'Job Application - STEMN',
            }
        },
        layout: {
            size: 'md',
            footer: false
        },
        controller: function(entity, $scope, Authentication, EntityService, ApplicationStatusService){
            $scope.saveApplication = saveApplication; //function
            $scope.entity = entity;
            $scope.mappedStatus  = ApplicationStatusService.getMappedStatus($scope.entity.status.state);
            $scope.statusMessage = ApplicationStatusService.getStatusExplanation($scope.mappedStatus, $scope.entity.organisations[0].name);

            $scope.showEdit = $scope.entity.child._id == Authentication.currentUser._id;
            if(!$scope.showEdit){
                $scope.isAdmin  = Authentication.currentUser.isAdmin;
            }

            $scope.ratings = [0,1,2,3,4,5];

            //////////////////////////////////

            function saveApplication(){
                return EntityService.update('application', $scope.entity).then(EntityService.updateSuccess);
            }
        },
    });
}).

service('ApplicationStatusService', function(){
    var service = this;
    this.getStatuses          = getStatuses;
    this.getMappedStatus      = getMappedStatus;
    this.getStatusExplanation = getStatusExplanation;
    this.getMappedStatusText  = getMappedStatusText;

    //////////////////////////////////////////

    function getMappedStatus(statusModel){
        var statuses = service.getStatuses();
        var currentStatus = statuses[statusModel];
        return currentStatus.map;
    }

    function getMappedStatusText(mappedStatus){
        var statusText = {
            pendingReview  : 'Pending Review',
            underReview    : 'Under Review',
            awaitingUpdate : 'Awaiting Profile Update',
            submitted      : 'Submitted',
            rejected       : 'Rejected',
            archived       : 'Archived',
        }
        return statusText[mappedStatus] || statusText.pendingReview
    }

    function getStatusExplanation(mappedStatus, companyName){
        var explanations = {
            pendingReview  : 'Your application is <b>Pending Review</b>. A member of the STEMN talent team will be in contact with you in the next few days to polish up your application for free (before it is sent off to '+companyName+').',
            underReview    : 'Your application is <b>Under Review</b>. You can continue to update your user profile and project portfolio whilst your application is under review.',
            awaitingUpdate : 'Your application is <b>Awaiting Update</b>. Before we can send it through to <b>'+companyName+'</b> you must add additional detail to your project portfolio. Once your updates are complete, your application will be reviewed again.',
            submitted      : 'Your application has been <b>Submitted</b> to <b>'+companyName+'</b>. They should contact you directly within the next week if they wish to proceed with an interview.',
            rejected       : 'Your application has been <b>Rejected</b>. This is usually because you skills and experience did not match those required for this role.',
            archived       : 'Your application has been <b>Archived</b>. Email <b>applications@stemn.com</b> if you want us to re-assess you application',
        }
        return explanations[mappedStatus] || explanations.pendingReview;
    }

    function getStatuses(){
        return {
            pendingReview : {
                model:'pendingReview',
                name: 'Pending Review',
                nextSteps: ['pendingReview','underReview', 'awaitingUpdate', 'readyToSubmit', 'archived', 'processLater'],
                map   : 'pendingReview'
            },
            underReview : {
                model:'underReview',
                name: 'Under Review',
                nextSteps: ['underReview', 'awaitingUpdate', 'readyToSubmit', 'archived', 'processLater'],
                map   : 'underReview'
            },
            awaitingUpdate : {
                model:'awaitingUpdate',
                name: 'Awaiting Profile Update',
                nextSteps : ['awaitingUpdate', 'pendingReview', 'archived'],
                map   : 'awaitingUpdate'
            },
            readyToSubmit : {
                model:'readyToSubmit',
                name: 'Read to Submit',
                nextSteps : ['readyToSubmit', 'submittedToCompany', 'archived'],
                map   : 'submitted'
            },
            submittedToCompany : {
                model:'submittedToCompany',
                name: 'Submitted',
                nextSteps: ['submittedToCompany', 'rejected', 'hired', 'archived'],
                map   : 'submitted'
            },
            rejected : {
                model:'rejected',
                name: 'Rejected',
                nextSteps: ['rejected'],
                map   : 'rejected'
            },
            hired : {
                model:'hired',
                name: 'Hired',
                nextSteps: ['hired', 'archived'],
                map   : 'submitted'
            },
            archived : {
                model:'archived',
                name: 'Archived',
                nextSteps: ['archived'],
                map   : 'archived'
            },
            processLater : {
                model: 'processLater',
                name: 'Process Later',
                nextSteps: ['processLater', 'pendingReview'],
                map   : 'submitted'
            }
        }
    }
});
