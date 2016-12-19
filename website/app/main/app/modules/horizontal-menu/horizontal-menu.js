angular.module('modules.horizontal-menu', [
    'modules.search',
    'modules.authentication',
    'modules.notifications',
    'modules.layout-options',
    'modules.project',
    'modules.site-search',
	'modules.top-banner'
]);
// modules.search - Used for the search box in template
angular.module('modules.horizontal-menu').

directive('mainHorizontalMenu', function ($window, $mdSidenav) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'app/modules/horizontal-menu/tpls/main-horizontal-menu.html',
        controller: function ($rootScope, $scope, $window, Authentication, LayoutOptions, AuthenticationModalService, ProjectCreateModalService, MenuItems, $mdMedia, $timeout, $state, HorizontalMenuService, NewCreationsService) {
            $scope.user = Authentication.currentUser;
            $scope.LayoutOptions         = LayoutOptions;
            $scope.HorizontalMenuService = HorizontalMenuService;
            $scope.$mdMedia = $mdMedia;
            $scope.$state = $state;

            // Set the tab using the current state
            $scope.MenuItems = MenuItems;

            // Set functions to scope -----------------------------------------
            $scope.openLoginModal = function (event) {
                AuthenticationModalService.login(event);
            };
            $scope.newSomething = function(event){
                NewCreationsService.createModal(event)
            }
            $scope.toggleMenu = toggleMenu; // function()


			// Watch the menu, if it is open, remove the disabled scroll
			$scope.$watch(function () {
				if($mdSidenav('left').isOpen()){
					LayoutOptions.body.disableScroll = true;
				}
				else{
					LayoutOptions.body.disableScroll = false;
				}
			});

            // Hoisted functions ----------------------------------------------
            function toggleMenu(){
                $mdSidenav('left').toggle().then(function(){
					console.log('toggle');
				})
            }
        }
    };
}).

service('HorizontalMenuService', function($rootScope){
    var service  = this;

    this.enabled = '';
    this.enable  = enable; //function(true||false)

    enable(true);

    ////////////////////////////////////////////////////////////

    function enable(status){
        service.enabled = status === false ? false : true;
        if(service.enabled){
            angular.element(document.body).addClass('fixed-menu');
        }else{
            angular.element(document.body).removeClass('fixed-menu');
        }
    }
}).

directive('userSettingsDropdown', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/horizontal-menu/tpls/user-settings-dropdown.html',
        controller: 'userSettingsCtrl'
    };
}).

directive('userSettingsSidebar', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/horizontal-menu/tpls/user-settings-sidebar.html',
        controller: 'userSettingsCtrl'
    };
}).


controller('userSettingsCtrl', function ($scope, Authentication, MenuItems, LayoutOptions, ProjectCreateModalService, OrganisationModalService, $state, $mdToast, AuthenticationModalService, $mdSidenav, NewCreationsService) {
    $scope.user = Authentication.currentUser;
    $scope.MenuItems = MenuItems;

    $scope.newSomething = function (event) {
        NewCreationsService.createModal(event)
    }
    $scope.newOrganisation = function (event) {
        OrganisationModalService.organisationNewModal(event).then(function (result) {
            $state.go('app.organisation.settings.overview', {
                stub: result.stub,
            });
        })
    }
    $scope.login = AuthenticationModalService.login; // function($event)
    $scope.close = function(){
    	$mdSidenav('left').close();
    }

    $scope.popLogout = function () {
        $mdToast.show(
            $mdToast.simple().
            theme('warn').
            content('Goodbye. Hope to see you again soon :)')
        );
    };

    $scope.menu = [{
            label   : 'My profile',
            href    : '/users/'+$scope.user.stub,
        },{
            label   : 'My Creations',
            href    : "/creations",
        },{
            label   : 'My Job Applications',
            href    : "/applications",
        },{
            label   : 'Create something',
            click   : function(event){
                NewCreationsService.createModal(event)
            },
            divider : true,
        },{
        },{
            label   : 'Settings',
            href    : '/settings/account',
        },{
            label   : 'Sign out',
            click   : function(event){
                $scope.user.logout();
                $scope.popLogout()
            }
        },

    ]
}).

directive('stickOnScrollUp', function ($window) {
    return {
        restrict: 'A',
        link: function(scope, element, attr){
            // Hide Header on on scroll down
            var didScroll;
            var lastScrollTop = 0;
            var delta = 5;

            var windowEl     = angular.element($window);
            var navbarHeight = element[0].offsetHeight;

            windowEl.on('scroll', function(event){
                didScroll = true;
            });

            setInterval(function() {
                if (didScroll) {
                    hasScrolled();
                    didScroll = false;
                }
            }, 250);

            ////////////////////////////////////////

            function hasScrolled() {
                var st = windowEl.scrollTop();

                // Make sure they scroll more than delta
                if(Math.abs(lastScrollTop - st) <= delta)
                    return;

                if (st > lastScrollTop && st > navbarHeight){
                    // Scroll Down
                    hide()
                } else {
                    // Scroll Up
                    show()
                }

                lastScrollTop = st;
            }

            function hide(){
                element.css({transform: 'translateY(-'+navbarHeight+'px)'})
            }
            function show(){
                element.css({transform: 'translateY(0px)'})
            }
        }
    };
}).

directive('dockToMenu', function ($window) {
    return {
        restrict: 'A',
        link: function(scope, element, attr){
            // This will dock the element with the horizontal menu
            // This is done by adding padding-top to the element if we
            // are at the top of the page
            var windowEl = angular.element($window);

            if(attr.dockToMenu != 'false'){
                dockToMenu();
                windowEl.on('scroll', scope.$apply.bind(scope, dockToMenu));
            }

            // Hoisted functions --------------------------------------------
            function dockToMenu() {
                var scrollPosition = windowEl.scrollTop();
                if(scrollPosition < 64){
                    element.css({'padding-top' : 64 - scrollPosition +'px'})
                } else {
                    element.css({'padding-top' : '0px'})
                }
            }
        },
    };
}).

run(function ($rootScope,  CoreLibrary, MenuItems) {
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        var toStateDetailed = toState.$$state();
        // Set menu items
        var menu   = CoreLibrary.checkStateParents(toStateDetailed, 'menu');
        MenuItems.main = menu.main;
        MenuItems.more = menu.more;
        MenuItems.setBodyClasses();
    });
}).

service('MenuItems', function() {
    var service = this;
    this.setBodyClasses = setBodyClasses;   // function()
    this.main  = [];
    this.more  = [];

    //////////////////////

    function setBodyClasses(){
        // Add the no-tabs class to body if there are no tabs
        if(service.main && service.main.length === 0){
            angular.element(document.body).addClass('no-tabs');
        }
        else{
            angular.element(document.body).removeClass('no-tabs');
        }
    }

});
