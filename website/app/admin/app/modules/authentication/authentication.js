angular.module('modules.authentication', [
	'satellizer'
]);
angular.module('modules.authentication').

run(function ($rootScope, Authentication, $state, $q, CoreLibrary) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        Authentication.loadUserData().then(function(response){
            if(Authentication.userData.isContractor){
                if(toState.name != 'app.campaigns' && toState.name != 'error' && toState.name != 'login'){
                    event.preventDefault();
                    $state.go('app.campaigns', {}, {reload: true});
                }
            }
        })
    });
}).

config(function($authProvider) {
	$authProvider.facebook({
        url      : '/api/v1/auth/facebook',
        clientId : '710281375734499'
    });
}).

service('Authentication', function ($http, $state, $mdToast, $q) {
    var service = this;
	var lib = {
   		isLoggedIn          : false,
		userData            : {},
		loadUserData        : loadUserData, // function()
        loadUserDataPromise : '',
    };

	return lib;

	//////////////////////////////////

	function loadUserData(fresh){
        if(fresh){
            lib.loadUserDataPromise = '';
        }
        if(!lib.loadUserDataPromise){
            var deferred = $q.defer();
            lib.loadUserDataPromise = deferred.promise;
            $http.get('/api/v1/me').then(function (response) {
                // They are logged in if a name is sent back
                if(response.data.isAdmin){
                    lib.userData = response.data;
                    lib.isLoggedIn = true;
                    deferred.resolve(lib.userData);
                }
                else if(response.data.isContractor){
                    lib.userData = response.data;
                    lib.isLoggedIn = true;
                    deferred.resolve(lib.userData);
                }
                else{
                    lib.isLoggedIn = false;
                    authFailedToast();
                    if($state.current.name != 'login'){
                        $state.go('error', null, {location: false});
                    }
                    deferred.reject(response);
                }
            }).catch(function(response){
                authFailedToast();
                if($state.current.name != 'login'){
                    $state.go('error', null, {location: false});
                }
                deferred.reject(response)
            });

        }
        return lib.loadUserDataPromise;
	}

    function authFailedToast(){
        $mdToast.show($mdToast.simple().content('Authorisation Failed').theme('warn'));
    }
}).

directive('authenticationLogin', function ($http, $auth, Authentication) {
    return {
        restrict: 'A',
        link : function (scope, element, attrs){
			element.bind('click', function (event) {
				$auth.authenticate('facebook').then(function(response) {
					Authentication.loadUserData(true)
				})
			})
		}
    };
}).

directive('authenticationLocal', function ($mdDialog) {
    return {
        restrict: 'A',
        link : function (scope, element, attrs){
			element.bind('click', function (event) {
                $mdDialog.show({
                    templateUrl: 'app/modules/authentication/tpls/local-login-modal.html',
                    controller: function ($scope, $auth, Authentication, $mdDialog) {
                        $scope.login = function(token){
                            if(token){
                                $auth.setToken(token);
                                Authentication.loadUserData(true).then(function(){
                                    $mdDialog.cancel();
                                });
                            }
                        }
                    },
                    targetEvent: event,
                    clickOutsideToClose: true,
                })
			})
		}
    };
}).

directive('authenticationLogout', function ($auth, Authentication, $state) {
    return {
        restrict: 'A',
        link : function (scope, element, attrs){
			element.bind('click', function (event) {
				Authentication.isLoggedIn            = false;
                Authentication.userData              = {};
                Authentication.loadUserDataPromise   = '';
				$auth.removeToken();
				$state.go('login');
			})
		}
    };
});
