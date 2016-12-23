import satellizer from 'satellizer';
import permissions from './permissions/permissions.js'
import './authentication.scss';

angular.module('modules.authentication', [
    'modules.authentication.permissions',
	'satellizer',
	'modules.user-subdomain',
	'modules.users',
]);
angular.module('modules.authentication').


run(function ($rootScope, Authentication, $state, $q, CoreLibrary) {
	/**************************************************************
	This redircts if authLevel is not adequate

	state('app.state', {
		url : '/state',
		template: require('./state.html'),
		authLevel: 'user' || 'admin' || 'public'
	})

	Options are:
	public || user || admin
	It will default to public behavior if undefined
	**************************************************************/

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
//        console.log(toState.$$state());
		var toStateDetailed = toState.$$state();
        var authLevel = CoreLibrary.checkStateParents(toStateDetailed, 'authLevel');
        processAuthLevel(authLevel);
    });

    $rootScope.$on("user.save", function(event, data){
        Authentication.loadUserData();
    })

	/////////////////////////////////////////////////////////////////

    function processAuthLevel(authLevel){
        if (authLevel === 'user') {
            // if the user isn't logged in, we must get their userdata to see if they can access this state
            var userlookup;
            if (!Authentication.currentUser.isLoggedIn()) {
                userlookup = Authentication.loadUserData();
            }
            // check that the accessing user is logged in and thus is allowed to access this state
            $q.when(userlookup).then(function() {
                // if they're not a logged in user, reject the state change
                if (!Authentication.currentUser.isLoggedIn()) {
                    // reject to login
                    event.preventDefault();
                    // reload: true will force transition even if the state or params have not changed, aka a reload of the same state.
                    $state.go('app.login', {}, {reload: true, location: false});
                }
                // Else
                // proceed to state
            });
        }
        else if(authLevel === 'admin'){
            if(!Authentication.currentUser.isAdmin){
                event.preventDefault();
                $state.go('app.admin-only', {}, {reload: true, location: false});
            }
            // Else
            // We must be admin is transition normally
        }
    }
}).

/**
 * @ngdoc directive
 * @name authentication.directive:hidepublic
 * @attribute hidepublic
 * @function
 *
 * @description
 * This will hide an element if the user is not logged in.
 *
 * **Note:**
 *
 * @example
   <div hidepublic>
       This content will be hidden if not logged in
   </div>
 */
directive('hidepublic', function (Authentication) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            checkHide();
            scope.$on("authentication.logIn", checkHide);
            scope.$on("authentication.logOut", checkHide);

            function checkHide(){
                if(attrs.hidepublic !== 'false'){
                    if (!Authentication.currentUser.isLoggedIn()) {
                        // Not logged in
                        element.addClass('hidden');
                    }
                    else{
                        element.removeClass('hidden');
                    }
                }
            }
        }
    };
}).

directive('showIfOwner', function (Authentication) {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            // Takes in Attibute of 'owner'
            // Takes in Attribute 'dr-class' this will be applied
            if (Authentication.currentUser._id != attr.owner) {
                element.addClass(attr.drClass||'hidden');
            }
        }
    };
}).

directive('showIfOwnerOrAdmin', function (Authentication) {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            // Takes in Attibute of 'owner'
            // Takes in Attribute 'dr-class' this will be applied
            if (Authentication.currentUser._id != attr.owner && !Authentication.currentUser.isAdmin) {
                element.addClass(attr.drClass||'hidden');
            }
        }
    };
}).

directive('showIfAdmin', function (Authentication) {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            element.addClass(attr.drClass||'hidden');
            if (Authentication.currentUser.isAdmin) {
                element.removeClass(attr.drClass||'hidden');
            }
        }
    };
}).

directive('showIfMember', function (Authentication) {
    return {
        restrict: 'E',
        scope:{
            members : '=',
            drClass : '@?'
        },
        link: function (scope, element, attr) {
            if(scope.members.indexOf(Authentication.currentUser._id) == -1){
//                && !Authentication.currentUser.isAdmin
                element.addClass(attr.drClass||'hidden');
            }
        }
    };
}).

directive('hideIfOwner', function (Authentication) {
    return {
        restrict: 'AE',
        scope   : {
            owner   : '@', // The ID of the owner
            drClass : '@?' // The class to be applied if owner (default is hidden)
        },
        link: function (scope, element, attr) {
            // Takes in Attibute of 'owner'
            // Takes in Attribute 'dr-class' this will be applied
            if (Authentication.currentUser._id == scope.owner) {
                element.addClass(scope.drClass||'hidden');
            }
            else if (!scope.owner){
                // Error log - Make sure that owner is defined. This function does NOT watch for changes.
                // Therefore owner must be initialised with the ID...
                console.error('Owner is not defined, make sure owner ID exists')
            }
        }
    };
}).

directive('authenticate', function (Authentication, AuthenticationModalService) {
    /****************************************************************
    Add this as an attribute and it will authenticate before keypress.
    Option 1: just add [authenticate]
    Option 2: add [authenticate] = true||false

    This method will not allow click actions to be queued.
    ****************************************************************/
    return {
        priority: 100,
        restrict: 'A',
        link: {
            pre: function (scope, element, attrs) {
                // Modal Data -------------------------------------
                var data = {
                    title : "1 click to join, it's easy!"
                }
                // Apply conditionally -----------------------------
                // If [authenticate]=? exists
                if(attrs.authenticate){
                    if(scope.$eval(attrs.authenticate)){
                        clickBind();
                    }
                    // else, authenticate is false, dont apply
                }
                // else, apply it
                else{
                    clickBind();
                }
                // Binding function ---------------------------------
                function clickBind(){
                    element.bind('click touchstart', function (e) {
                        // If not logged in
                        if (!Authentication.currentUser.isLoggedIn()) {
                            e.stopImmediatePropagation();
                            e.preventDefault();
                            AuthenticationModalService.login(e, data);
                        }
                        // Else, We run the click
                    });
                }

            }
        }
    }
}).


directive('registerForm', function (Authentication) {
    return {
        restrict: 'E',
        template: require('./tpls/register-form.html'),
    };
}).

service('AuthenticationModalService', function ($mdDialog) {

    this.loginRecruit = function(event){
        return $mdDialog.show({
            template: require('./tpls/login-recruit-modal.html'),
            controller: 'LoginRecruitModalCtrl',
            targetEvent: event,
            clickOutsideToClose: true
        })
    }

    this.login = function (event, data) {
        /*************************************************************
        Use the data object to change display:
        data = {
            title    : 'The title of the modal',
            subtitle : 'The subtitle of the modal',
        }
        *************************************************************/
        return $mdDialog.show({
            template: require('./tpls/login-modal.html'),
            controller: 'LoginModalCtrl',
            targetEvent: event,
            locals: {data:data}
        })
    }
    this.loginLocal = function (event) {
        return $mdDialog.show({
            template: require('./tpls/login-local-modal.html'),
            controller: 'LoginLocalModalCtrl',
            targetEvent: event,
        })
    }
    this.register = function (event) {
        return $mdDialog.show({
            template: require('./tpls/register-modal.html'),
            controller: 'RegisterModalCtrl',
            targetEvent: event,
        })
    }
    this.linkedinWarn = function (event) {
        return $mdDialog.show({
            template: require('./tpls/linkedin-warn-modal.html'),
            controller: 'LinkedinWarnModalCtrl',
            clickOutsideToClose: true,
            targetEvent: event,
        })
    }
    this.recoverPassword = function (event) {
        return $mdDialog.show({
            template: require('./tpls/recover-password-modal.html'),
            controller: 'RecoverPasswordModalCtrl',
            targetEvent: event,
        })
    }
}).

controller('LoginModalCtrl', function (data, $scope, $mdDialog, Authentication, AuthenticationModalService, $mdToast) {
    $scope.data = data;
    $scope.authenticate = function(provider) {
        $scope.loading = true;
        Authentication.authenticate(provider).then(function(response) {
            $mdToast.show(
                $mdToast.simple().
                content('Welcome back, good to see you again :)')
            );
            $scope.loading = false;
            Authentication.onboardingRedirect();
            $mdDialog.hide();
        }).catch(function(response) {
            $scope.loading = false;
        });
    }
    $scope.openRegister = function(event){
        AuthenticationModalService.register(event)
    }
    $scope.openLoginLocal = function(event){
        AuthenticationModalService.loginLocal(event)
    }
    $scope.cancel = function(){
        $mdDialog.cancel();
    }
}).

controller('LoginRecruitModalCtrl', function ($scope, $http, $mdToast, $mdDialog) {
    $scope.signup = {};
    $scope.points = [
        'Access thousands of Aerospace Engineers',
        'Search users by skills, experience and suitability',
        'Browse project portfolios',
        'Posts jobs to the job board',
        'Use the STEMN Applicants Tracking System',
    ]
    $scope.submitSignup = function(){
        if($scope.SignupForm.$valid){
            $http({
                method: 'POST',
                url: 'api/v1/mail/companyInquiry',
                data: $scope.signup
            }).then(function(){
                $mdToast.show($mdToast.simple().content('Application successful. We\'ll be in touch in 24h.'));
                $scope.signupFormSuccess = true;
                $mdDialog.hide();
            })
        }
        else{
            $mdToast.show($mdToast.simple().theme('warn').content('Signup form invalid'));
        }
    }
    $scope.cancel = function(){
        $mdDialog.cancel();
    }
}).


controller('RegisterModalCtrl', function ($scope, $mdDialog, Authentication, $mdToast, AuthenticationModalService, ReferralsService) {
    $scope.signupFormSubmit = function () {
        if($scope.RegisterForm.$valid){
            Authentication.signup({
                firstname : $scope.data.firstname,
                lastname  : $scope.data.lastname,
                email     : $scope.data.email,
                password  : $scope.data.password,
                ref       : ReferralsService.getRefCode()
            }).then(function (response) {
                Authentication.onboardingRedirect();
                $mdDialog.hide();
            })
        }
    }
    $scope.openLogin = function(event){
        AuthenticationModalService.login(event)
    }
    $scope.cancel = function(){
        $mdDialog.cancel();
    }
    $scope.back = function(event){
        AuthenticationModalService.login(event)
    }
}).

controller('LoginLocalModalCtrl', function ($scope, $mdDialog, Authentication, $mdToast, AuthenticationModalService) {
    $scope.loginLocal = function() {
        if($scope.LoginForm.$valid){
            $scope.loading = true;
            Authentication.login({
                email : $scope.login.email,
                password : $scope.login.password
            }).then(function (response) {
                Authentication.onboardingRedirect();
                $mdToast.show(
                    $mdToast.simple().
                    content('Welcome back, good to see you again :)')
                );
                $mdDialog.hide();
            })

        }
    }
    $scope.recoverPassword = function(event){
        AuthenticationModalService.recoverPassword(event)
    }
    $scope.cancel = function(){
        $mdDialog.cancel();
    }
    $scope.back = function(event){
        AuthenticationModalService.login(event)
    }
}).

controller('LinkedinWarnModalCtrl', function ($scope, $mdDialog, Authentication, $mdToast, AuthenticationModalService) {
    $scope.finish = function(provider) {
        $scope.loading = true;
        Authentication.authenticate('linkedin').then(function(response) {
            $mdToast.show(
                $mdToast.simple().
                content('You accounts are linked and info imported')
            );
            $scope.loading = false;
            $mdDialog.hide();
        })
    }
    $scope.cancel = function(){
        $mdDialog.cancel();
    }
}).

controller('RecoverPasswordModalCtrl', function ($scope, $mdDialog, AuthenticationModalService, $http, $mdToast) {
    $scope.submit = function() {
//        confirm('This isn\'t working yet. Please email lostpassword@stemn.com and we\'ll help you.')
        $http.post('/api/v1/auth/reset-password', {
            email   : $scope.data.email,
        }).success(function () {
            $mdToast.show(
                $mdToast.simple().
                content('Check your email for the password reset link.').
                hideDelay(6000)
            );
            $mdDialog.hide();
        });
    }
    $scope.cancel = function(){
        $mdDialog.cancel();
    }
    $scope.back = function(event){
        AuthenticationModalService.login(event)
    }
}).


config(function($authProvider, $httpProvider){
//    $authProvider.httpInterceptor = false; // Don't auto add headers

    $authProvider.facebook({
        url      : '/auth/facebook',
        clientId : '710281375734499',
    });

    $authProvider.google({
        url      : '/auth/google',
        clientId : '502305750839-8m9aian8ka9qb6j64t3dtjs2nq96tdae.apps.googleusercontent.com',
		scope : 'openid profile email https://www.googleapis.com/auth/drive',
        optionalUrlParams: ['access_type'],
        accessType: 'offline'
    });

    $authProvider.linkedin({
        url               : '/auth/linkedin',
        clientId          : '75gm1u1gda1xoe',
        scope             : ['r_fullprofile', 'r_emailaddress'],
        optionalUrlParams : ['scope']
    });

    $authProvider.oauth2({
        name: 'dropbox',
        url: 'auth/dropbox',
        clientId: '0wgo11dn573805b',
        redirectUri: window.location.origin + '/auth/dropbox',
        authorizationEndpoint: 'https://www.dropbox.com/oauth2/authorize',
    });

    $authProvider.baseUrl        = '/api/v1';
    $authProvider.signupRedirect = '';
    $authProvider.loginRedirect  = '';
    $authProvider.loginUrl       = '/auth/login';
    $authProvider.signupUrl      = '/auth/register';
    $authProvider.unlinkUrl      = '/auth/unlink';
}).

service('Authentication', function ($http, $q, $auth, $window, $rootScope, ReferralsService, UserSubdomainService, FacebookAnalytics, TwitterAnalytics, SettingsService, $state, OnboardingService) {
    var service = this;

    this.currentUser = {
        isLoggedIn: isLoggedIn,                     // function()
        logout: logout,                             // function()
    };

    this.login = login;                             // function(credentials)
    this.signup = signup;                           // function(user)
    this.authenticate = authenticate;               // function(provider)
    this.onboardingRedirect = onboardingRedirect;   // function(provider)

    this.getToken = getToken;                       // function()
    this.setToken = setToken;                       // function()
    this.authenticateAsUser = authenticateAsUser;   // function(userId)

    this.loadUserData = loadUserData;               // function()

    /////////////////////////////////////////////////////////

    function login(credentials) {
        var deferred = $q.defer();
        $auth.login(credentials).then(function (response) {
            loadUserData().then(function() {
                analytics.track('Signed Up/In (local)');
                processLogin();
                deferred.resolve(response);
            });
        }).catch(function(response) {
            deferred.reject(response);
        });
        return deferred.promise;
    }

    function signup(user) {
        var deferred = $q.defer();
        $auth.signup(user).then(function (response) {
            loadUserData().then(function() {
                analytics.track('Signed Up/In (local)');
                FacebookAnalytics.track('CompleteRegistration');
                TwitterAnalytics.trackSignup();
                processLogin();
                deferred.resolve(response);
            });
        }).catch(function(response) {
            deferred.reject(response);
        });
        return deferred.promise;
    }


    function authenticate(provider) {
        var deferred = $q.defer();
        $auth.authenticate(provider, { ref : ReferralsService.getRefCode() }).then(function(response) {
            loadUserData().then(function() {
                analytics.track('Signed Up/In (social)');
                FacebookAnalytics.track('CompleteRegistration');
                TwitterAnalytics.trackSignup();
                processLogin();
                deferred.resolve(response);
            });
        }).catch(function(response) {
            deferred.reject(response);
        });
        return deferred.promise;
    }

    function processLogin(){
        $rootScope.$broadcast('authentication.logIn');
        UserSubdomainService.saveUsername(service.currentUser._id);
        analytics.identify(service.currentUser._id, {
            name        : service.currentUser.name,
            username    : service.currentUser.stub,
            email       : service.currentUser.email,
            description : service.currentUser.blurb,
            avatar      : 'https://stemn.com' + service.currentUser.picture
        });
    }

    function getToken() {
        return $auth.getToken();
    }

    function setToken(token, redirect) {
        $auth.setToken(token, redirect);
        return loadUserData();
    }

    function loadUserData() {
        var deferred = $q.defer();
//        var userDataLookup = deferred.promise;

        // load the user's data
        $http.get('/api/v1/me').then(function (response) {
            _.extend(service.currentUser, response.data);
            // Jacksons Gooba database delete prevention warning
            if(response.data.database === 'production'){
                // Make background pink if we are on production
                document.body.style['background-color'] = 'rgba(255, 0, 0, 0.2)';
            }
            deferred.resolve(service.currentUser);
        }).catch(function(response) {
            $auth.removeToken();
            deferred.resolve();
        });

        // load the user's settings
//        var settingsLookup = {};
        return deferred.promise
    }


    function isLoggedIn() {
        return !!service.currentUser.name;
    }

    function logout() {
        $auth.logout();
        $rootScope.$broadcast('authentication.logOut')
        //nullify all properties of the current user
        _.each(_.keys(service.currentUser), function (property) {
            if (typeof (service.currentUser[property]) !== 'function') {
                service.currentUser[property] = undefined;
            }
        });
        service.currentUser.isAdmin     = false;
        // Refresh to clear DOM and all data
        $window.location.reload();
    }

    function onboardingRedirect(){
        SettingsService.getSettings().then(function(settings){
            // If we should do user onboarding
            if(settings.messages.userOnboarding){
                settings.messages.userOnboarding = false;
                settings.save();
                OnboardingService.goToOnboarding();
            }
            // Othwise all onboarding is done
            else if($state.includes('app.landing')){
                $state.go('app.home')
            }
        })
    }

    function authenticateAsUser(userId){
        $http({
            method: 'GET',
            url: 'api/v1/auth/token/'+userId
        }).then(function(response){
            service.setToken(response.data.token, false);
        })
    }
});
