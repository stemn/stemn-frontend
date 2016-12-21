import './user-onboarding.scss';

angular.module('views.user-onboarding', [
]);
angular.module('views.user-onboarding').

config(function ($stateProvider) {
    $stateProvider.
    state('app.user-onboarding', {
        url: '/profile-wizard',
        templateUrl: 'app/views/user-onboarding/tpls/user-onboarding.html',
        controller: 'UserOnboardingCtrl',
        abstract: true,
        resolve: {
            user : function(userdata, UserService, Authentication){
                return UserService.getUser(userdata._id, 'lg').then(function(user){
                    return user;
                })
            }
        },
		authLevel: 'user', // Auth level does not seem to work on abstract states
        layout: {
            horizontalMenu: false,
            topBanner     : false,
            chat        : false,
            size          : 'md',
            bgColor       : 'rgba(0, 0, 0, 0.03)'
        },
    }).
    state('app.user-onboarding.intro', {
        url: '',
        templateUrl: 'app/views/user-onboarding/tpls/user-onboarding.intro.html',
        controller: 'UserOnboardingIntroModalCtrl',
		authLevel: 'user'
    }).
	state('app.user-onboarding.experience', {
        url: '/experience',
        templateUrl: 'app/views/user-onboarding/tpls/user-onboarding.experience.html',
        controller: 'UserOnboardingExperienceModalCtrl',
		authLevel: 'user'
    }).
	state('app.user-onboarding.final', {
        url: '/final',
        templateUrl: 'app/views/user-onboarding/tpls/user-onboarding.final.html',
		authLevel: 'user',
        controller: function($scope, $state, $timeout, HighlightElement, HttpQuery, Authentication){
            $scope.query = HttpQuery({
                url: '/api/v1/search',
                urlParams: ['near[]','sort', 'order', 'parentType', 'parentId'],
                params: {
                    type       : 'job',
                    size       : 4,
                    key        : 'name',
                    select     : ['name','organisation','location.name','pay','jobType','level', 'stub', 'organisations'],
                    criteria   : {},
                    skills     : Authentication.currentUser._id,
                    sort       : 'rating',
                    order      : 'dsc',
                },
            });
            $scope.query.more();

            $scope.addMoreFields = function(){
                $state.go('app.user-onboarding.intro');
                $timeout(function(){HighlightElement.scrollHighlightElement('technologiesEdit', {background: true, offset: 100})}, 0)
            }
        },
    })
}).

controller('UserOnboardingCtrl', function (user, $scope, $state, $mdDialog, UserService, Authentication, SettingsService) {
	$scope.user = user;
    $scope.steps = 4;
	$scope.currentStep = 0;
	$scope.$state   = $state;
	$scope.saveUser = saveUser; // function()
	$scope.complete = complete; // function()

    $scope.delRow = function(array,index){
        array.splice(index, 1);
    }
    $scope.sortConfig = {
        animation: 150,
        handle: '.my-handle'
    }
	$scope.forms = {};
	$scope.getUserData = getUserData; //function()


    $scope.tabs = [
        {
            label: 'About You',
            sref: 'app.user-onboarding.intro',
            click: function(){
                saveUser();
                $state.go('app.user-onboarding.intro')
            }
        },{
            label: 'Experience and Education',
            sref: 'app.user-onboarding.experience',
            click: function(){
                saveUser();
                $state.go('app.user-onboarding.experience')
            }
        },{
            label: 'Find matches',
            sref: 'app.user-onboarding.final',
            click: function(){
                saveUser();
                $scope.complete();
                $state.go('app.user-onboarding.final')
            }
        }
	];


    //////////////////////////////////////////////////

	function saveUser(){
        return UserService.updateUser($scope.user);
	}
	function getUserData(){
		UserService.getUser(Authentication.currentUser._id, 'lg').then(function(user){
			$scope.user = user;
		})
	}
	function complete(){
        SettingsService.getSettings().then(function(settings){
		// Save that we have now done onboarding
		settings.messages.userOnboarding = false;
		settings.save();
	})}
}).

controller('UserOnboardingIntroModalCtrl', function ($scope, $state, FieldService, FollowService, Authentication, $mdToast) {
	$scope.linkedinImport = function(provider) {
        $scope.linkedinLoading = true;
        Authentication.authenticate('linkedin').then(function(response) {
            $mdToast.show(
                $mdToast.simple().
                content('You accounts are linked and info imported')
            );
            $scope.linkedinImported  = true;
            $scope.linkedinLoading = false;
			$scope.getUserData();
        }).catch(function(response) {
            $mdToast.show(
                $mdToast.simple().
                theme('warn').
                content('Couldn\'t do it... '+response.data.message || response.data)
            );
            $scope.linkedinLoading = false;
        });
    }

    $scope.nextStep = function(){
        $scope.saveUser();
        $state.go('app.user-onboarding.experience')
    }
}).
controller('UserOnboardingExperienceModalCtrl', function ($scope, $state) {
	$scope.addExperience = function(){
        $scope.user.profile.profileDetails.experience.push({})
    }
	if($scope.user.profile.profileDetails.experience.length==0){
		$scope.addExperience()
	}
	$scope.addEducation = function(){
        $scope.user.profile.profileDetails.education.push({})
    }
	if($scope.user.profile.profileDetails.education.length === 0){
		$scope.addEducation()
	}
    $scope.nextStep = function(){
        $scope.saveUser();
        $state.go('app.user-onboarding.final')
    }
});
