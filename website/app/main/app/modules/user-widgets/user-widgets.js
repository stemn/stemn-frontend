angular.module('modules.user-widgets', [
	'modules.checklist',
    'modules.feed'
]);
angular.module('modules.user-widgets').
directive('userPortfolioWidget', function ($state, $timeout, $window, OrganisationModalService, UserService, ProjectCreateModalService, UserWidgetService, UserWidgetModalService, FeedService) {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/user-widgets/tpls/user-portfolio-widget.html',
        controller: function($scope, Authentication){

        }
    };
}).

directive('userCompletionWidget', function ($timeout, $window, UserService, ProjectCreateModalService, UserWidgetService, UserWidgetModalService) {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/user-widgets/tpls/user-completion-widget.html',
        scope: {
            displayType          : '@?', // banner
            completionPercentage : '=?'  // The completion percentage to be passed up the scope.
        },
        controller: function($scope, Authentication){
			getCompletionPercentage();
            $scope.$on("user.save", getCompletionPercentage)
			$scope.checklistModal = UserWidgetModalService.checklist; // function(event)

            ///////////////////////////////////////////////////////////

            function getCompletionPercentage(){
                UserService.getUser(Authentication.currentUser._id, 'lg').then(function(user){
                    $scope.status               = UserWidgetService.getCompletionStatus(user);
                    $scope.completionPercentage = UserWidgetService.getCompletionPercentage();
                })
            }
        }
    };
}).

directive('userOrganisationsWidget', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/user-widgets/tpls/user-organisations-widget.html',
        controller: function($scope, $state, Authentication, UserService, OrganisationModalService){
            UserService.getUserOrgs(Authentication.currentUser._id).then(function (results) {
                $scope.organisations = results.data;
            })
            $scope.newOrganisation = function (event) {
                OrganisationModalService.organisationNewModal(event).then(function (result) {
                    $state.go('app.organisation.settings.overview', {
                        stub: result.stub,
                    });
                })
            }
        }
    };
}).

directive('userProjectsWidget', function () {
    return {
        restrict: 'E',
        scope: {
            query: '=?',
            size : '@?'
        },
        templateUrl: 'app/modules/user-widgets/tpls/user-projects-widget.html',
        controller: function($scope, Authentication, HttpQuery){
            $scope.size = $scope.size || 7;
            $scope.query = HttpQuery({
                url: '/api/v1/search',
                params: {
                    type       : 'project',
                    size       : $scope.size,
                    sort       : 'submitted',
                    select     : ['name','stub','picture'],
                    parentType : 'user',
                    parentId   : Authentication.currentUser._id
                },
            });
            $scope.query.more();
        }
    };
}).

directive('userRecentWidget', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/user-widgets/tpls/user-recent-widget.html',
        scope: {
            displayType          : '@?', // banner
            completionPercentage : '=?'  // The completion percentage to be passed up the scope.
        },
        controller: function($scope, $http){
            var page = 1;
            var size = 14;
			getRecentUsers();
            $scope.more = getRecentUsers; // function()

            ///////////////////////////////////////////////////////////

            function getRecentUsers(){
                var weekInMs = 7 * 24 * 60 * 60 * 1000;
                return $http({
                    url    : "/api/v1/analytics/activeUsersInPeriod",
                    params : {
                        start   : Date.now() - weekInMs,
                        days    : 7,
                        repeat  : 1,
                        page    : page,
                        size    : size,
                        picture : true
                    },
                    method : "GET",
                }).then(function(response){
                    $scope.users = $scope.users || []
                    if(response.data.length < size){
                        $scope.noMoreResults = true;
                    }
                    $scope.users = $scope.users.concat(response.data);
                    page++
                })
            }
        }
    };
}).

service('UserWidgetService', function ($mdDialog, ThreadCreateModalService, ProjectCreateModalService) {
	var service = this;
    this.completionStatus        = {};
	this.getCompletionStatus     = getCompletionStatus;     // function(user)
	this.getCompletionPercentage = getCompletionPercentage; // function()

	//////////////////////////////////////////////

	function getCompletionStatus(user){
		service.completionStatus = [{
				status : user.name ? true : false,
				message: 'Add your name.',
				href   : '/users/'+user.stub+'?edit=OverviewForm#name',
			},{
				status : user.blurb ? true : false,
				message: 'Add a blurb.',
				href   : '/users/'+user.stub+'?edit=OverviewForm#blurb',
			},{
				status : user.picture ? true : false,
				message: 'Upload a profile picture.',
				href   : '/users/'+user.stub+'?edit=OverviewForm#picture',
			},{
				status : user.profile.banner.url ? true : false,
				message: 'Upload a custom image banner.',
				href   : '/users/'+user.stub+'?edit=OverviewForm',
			},{
//			school     : {
//				status : user.profile.school,
//				message: 'Add your education',
//				click  : ''
//			},{
				status : user.profile.profileDetails.education[0] && (user.profile.profileDetails.education[0].degree || user.profile.profileDetails.education[0].organisations.length > 0) ? true : false,
				message: 'Add your education.',
				href   : '/users/'+user.stub+'?edit=EducationForm#education',
			},{
				status : user.profile.profileDetails.experience[0] && (user.profile.profileDetails.experience[0].company || user.profile.profileDetails.experience[0].organisations.length > 0) ? true : false,
				message: 'Add your work experience.',
				href   : '/users/'+user.stub+'?edit=ExperienceForm#experience',
			},{
				status : user.profile.profileDetails.summary ? true : false,
				message: 'Add a profile summary.',
				href   : '/users/'+user.stub+'?edit=AboutForm#summary',
			},{
				status : _.some(user.profile.socialLinks) ? true : false,
				message: 'Add links to your website / social media.',
				href   : '/users/'+user.stub+'?edit=FooterForm#social',
			},{
				status : user.numProjects ? true : false,
				message: 'Add a project.',
				click  : ProjectCreateModalService.newProject
			},{
				status : user.numBlogs ? true : false,
				message: 'Add a blog.',
				click  : function(event){
					ThreadCreateModalService.newThread(event, {type:'blog'})
				}
			},{
				status : user.numThreads ? true : false,
				message: 'Add a discussion.',
				click  : function(event){
					ThreadCreateModalService.newThread(event, {type:'general'})
				}
			},{
				status : user.numQuestions ? true : false,
				message: 'Ask a question.',
				click  : function(event){
					ThreadCreateModalService.newThread(event, {type:'question'})
				}
			},
		]
		return service.completionStatus;
	}

	function getCompletionPercentage(){
		var total  = 0;
		var truthy = 0;
		_.forEach(service.completionStatus, function(item){
			if(item.status){truthy ++}
			total ++
		})
		return Math.round(truthy/total * 100)
	}

}).
service('UserWidgetModalService', function ($mdDialog) {
    this.checklist = function (event) {
        return $mdDialog.show({
            templateUrl: 'app/modules/user-widgets/tpls/user-portfolio-checklist-modal.html',
            targetEvent: event,
			clickOutsideToClose: true,
            controller: function ($scope, $mdDialog, UserWidgetService) {
				$scope.completionStatus    = UserWidgetService.completionStatus;
                $scope.completionPecentage = UserWidgetService.getCompletionPercentage();
				$scope.cancel = function(){
					$mdDialog.cancel();
				}
			}
        })
    }
});


