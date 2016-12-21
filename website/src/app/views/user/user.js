import './user.scss';

angular.module('views.user', [
    'modules.skills'
]);
angular.module('views.user').

config(function ($stateProvider) {
    $stateProvider.
    state('app.user', {
        abstract: true,
        url: '/users/:stub?edit',
        templateUrl: 'app/views/user/user.html',
        controller: 'ProfileViewCtrl as ProfileCtrl',
        resolve: {
            user: function (UserService, $stateParams, $timeout, $state) {
                return UserService.getUser($stateParams.stub, 'lg').catch(function(error){
                    $timeout(function(){
                        $state.go('app.404', null, {location: false});
                    })
                })
            }
        },
        seo: function(resolve){
            return {
                title       : resolve.user.name + ' - STEMN',
                picture     : resolve.user.picture,
                description : resolve.user.blurb
            }
        }
    }).
    state('app.user.projects', {
        url: '/projects',
        sticky: true,
        views: {
            'projects': {
                template: '<feed type="projects" parent-type="user" parent-id="{{user._id}}" parent="user" size="sm" show-edit="showEdit"></feed>',
            }
        },
        layout: {
            bgColor: 'rgba(0, 0, 0, 0.03)'
        }
    }).
    state('app.user.profile', {
        url: '',
        sticky: true,
        views: {
            'profile': {
                templateUrl: 'app/views/user/user-profile.html',
            }
        }
    }).
    state('app.user.threads', {
        url: '/threads',
        sticky: true,
        views: {
            'threads': {
                template: '<div layout="row" layout-align="center"><div class="md-content-container"><forum size="12" parent-id="{{user._id}}" parent-type="user" query="discussionQuery"></forum></div></div>',
            }
        },
        layout: {
            bgColor: 'rgba(0, 0, 0, 0.03)'
        }
    }).
    state('app.user.comments', {
        url: '/comments',
        sticky: true,
        views: {
            'comments': {
                template: '<user-posts user-id="{{user._id}}"></user-posts>',
            }
        },
        layout: {
            bgColor: 'rgba(0, 0, 0, 0.03)'
        }
    }).
    state('app.user.blogs', {
        url: '/blog',
        sticky: true,
        views: {
            'blog': {
                template: '<feed type="blogs" parent-type="user" parent-id="{{user._id}}" parent="user" size="sm" show-edit="showEdit"></feed>',
            }
        },
        layout: {
            bgColor: 'rgba(0, 0, 0, 0.03)'
        }
    }).
    state('app.user.following', {
        url: '/following',
        sticky: true,
        overlay: true,
        views: {
            'tab3@app': {
                templateUrl: 'app/views/user/tpls/user-following.html',
                controller: function(user, $scope){
                    $scope.user = user;
                }
            }
        }
    }).
    state('app.user.followers', {
        url: '/followers',
        sticky: true,
        overlay: true,
        views: {
            'tab4@app': {
                template: '<md-container><h2 class="md-headline">Followers</h2><stat-display parent-id="{{user._id}}" parent-type="user" type="follow"></stat-display></md-container>',
                controller: function(user, $scope){
                    $scope.user = user;
                }
            }
        }
    });
}).

controller('ProfileViewCtrl', function (user, $timeout, $scope, $window, $http, $rootScope, $state, CoreLibrary, EntityService, Authentication, UserService, FollowService, ProjectCreateModalService, NewCreationsService, AuthenticationModalService, $dynamicFooter, FeedService) {
    var vm = this;

    // Data -------------------------------------------------------
    $scope.user        = user;
    $scope.isAdmin     = Authentication.currentUser.isAdmin;
	$scope.userCanEdit = Authentication.currentUser._id === user._id || $scope.isAdmin; // We use _id because stub may be different if we just changed username
    $scope.showEdit    = $scope.userCanEdit;
	$scope.currentUser = Authentication.currentUser;
	$scope.forms       = {};
    getProjects();


    // Set defaults
    if(!$scope.user.profile.banner.url){
        $scope.alternateBanner = 'assets/images/banners/space'+$scope.user.profile.banner.gradient+'.jpg'
    }

    // Watch the state. Set the tabName when it changes
    $scope.$state = $state;
    var tabNames = {
        'app.user.threads'  :'Threads',
        'app.user.blogs'    :'Blogs',
        'app.user.projects' :'Projects',
        'app.user.comments' :'Comments',
    }
    $scope.$watch('$state.current.name',function(){
        if(tabNames[$state.current.name]){
            $scope.tabName = tabNames[$state.current.name];
        }
    })

    // Layout -----------------------------------------------------
	setStandardFooter()

	// Tabs ------------------------------------------------------
	$scope.tabs = [
        {
            label: 'Profile',
            sref: 'app.user.profile'
        },{
            label: CoreLibrary.pluralise(user.numProjects, 'Project'),
            sref: 'app.user.projects'
        },{
            label: CoreLibrary.pluralise(user.numThreads, 'Thread'),
            sref: 'app.user.threads'
        }
//        ,{
//            label: CoreLibrary.pluralise(user.numComments + user.numPosts, 'Comment'),
//            sref: 'app.user.comments'
//        }
	];
	$scope.$watch(function(){
		$scope.currentTab = CoreLibrary.getCurrentTab($scope.tabs);
	})


    // General functions ------------------------------------------
	$scope.togglePublicView = togglePublicView; // function();
    $scope.authenticateAsUser = Authentication.authenticateAsUser; //function(userId)

    $scope.SaveUser = function () {
        return UserService.updateUser($scope.user);
    }
    $scope.linkedinImport = function(event){
        AuthenticationModalService.linkedinWarn(event).then(function(){
            // If import success, re-query userdata and set to scope
            UserService.getUser($scope.user.stub, 'lg', true).then(function(user){
                $scope.user = user;
            });
        });
    };
	$scope.newSomething = function(event){
		NewCreationsService.createModal(event)
	}
	$scope.newProject = function(event){
		ProjectCreateModalService.newProject(event)
	}
	$scope.$watch(function () {
		return $window.innerWidth;
	}, function (width) {
		$scope.numProjectsToShow = determineNumberOfProjects(width)
	});

    // Experience and Education -----------------------------------
    $scope.addExperience = function(){
        $scope.user.profile.profileDetails.experience.push({})
    }
    $scope.addEducation = function(){
        $scope.user.profile.profileDetails.education.push({})
    }
    $scope.delRow = function(array,index){
        array.splice(index, 1);
    }
    $scope.sortConfig = {
        animation: 150,
        handle: '.my-handle'
    }
    $scope.isEmptyExperience = function(){
        return _.compact(_.map($scope.user.profile.profileDetails.experience, 'company')).length === 0;
    }
    $scope.isEmptyEducation = function(){
        return _.compact(_.map($scope.user.profile.profileDetails.education, 'school')).length === 0;
    }

    // Other Functions -----------------------------------------
	function setStandardFooter(){
        $dynamicFooter.content = "<user-footer refresh-id='"+user._id+"'></user-footer>";
        $dynamicFooter.scope   = $scope;
    }

	function determineNumberOfProjects(width){
		var projectWidth = 320;
		if($scope.showEdit){
			return Math.floor(width / projectWidth) - 1;
		}
		else {
			return Math.floor(width / projectWidth);
		}
	}

	function togglePublicView(){
		$scope.showEdit = !$scope.showEdit;
	}

    function getProjects(){
        FeedService.getFeed({
            parentType: 'user',
            parentId: user._id,
            type: 'projects',
            sort: 'submitted',
            size: 10,
            page: 1,
            published: true
        }).then(function (feed) {
            $scope.projects = feed;
        })
    }
}).

directive('userFooter', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/views/user/tpls/user-footer.html',
    };
}).

directive('addAnother', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            addFn : '&',
            white : '=?'
        },
        templateUrl: 'app/views/user/tpls/add-another.html',
    };
}).

directive('clickShowEvidence', function (CoreModalService, $parse) {
    return {
        restrict: 'A',
        /********************************************
        attrs: {
            clickShowEvidence
            entity
        }
        ********************************************/
        link : function (scope, element, attrs){
			element.bind('click', function (event) {
				CoreModalService.showEntity(event, $parse(attrs.clickShowEvidence)(scope), {title: 'Portfolio Evidence'})
			})
		}
    };
}).

directive('dateRange', function () {
    // This is very performance heavy.
    // Edit should only be true if we are actually editing.
    return {
        restrict: 'E',
        replace: true,
        scope: {
            start   : '=', // {year:2011, month:5}
            end     : '=', // {year:2011, month:5}
            current : '=', // true || false
            edit    : '='  // true || false
        },
        templateUrl: 'app/views/user/tpls/date-range.html',
        controller: function($scope, monthsService, $timeout){
            $scope.months = monthsService;
            $scope.years = _.range(1940, 2025);

//            $timeout(function(){
//            },100)

            if($scope.edit){
                if(!$scope.start){
                    $scope.start = {};
                    $scope.start.year = 2015;
                }
                else{
                    $scope.start.year = $scope.start.year || 2015;
                }
                if(!$scope.end){
                    $scope.end = {};
                    $scope.end.year = 2015;
                }
                else{
                    $scope.end.year = $scope.end.year || 2015;
                }
            }
        }
    };
}).

service('monthsService', function () {
    return [
        'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',
    ];
});
