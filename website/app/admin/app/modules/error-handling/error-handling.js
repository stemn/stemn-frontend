angular.module('modules.error-handling', []);
angular.module('modules.error-handling').

config(function ($httpProvider) {
    // Http Intercetprs - https://docs.angularjs.org/api/ng/service/$http
    $httpProvider.interceptors.push(function ($q, $window, $injector) {
        return {
            response: function (response) {
                return response;
            },
            responseError: function (response) {
                var $mdToast = $injector.get("$mdToast"); // Avoid circulr reference (%mdToast cannot be injected into config)
                var errorMessage;

                // If we get a response (4XX) and we have an error property - set the message
                if(response.data && response.data.error){
                    errorMessage = response.data.error;
                }

                // Pop the error message
                if(errorMessage){
                    console.log(errorMessage);
                    $mdToast.show(
                        $mdToast.simple().
                        theme('warn').
                        content(errorMessage)
                    );
                }
                return $q.reject(response);
            }
        };
    });
}).


run(function ($rootScope, $state, $timeout) {
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        console.error('errored changing to ' + toState.name);
        console.error('stateChangeError:');
        if (error.getStack)
            console.error(error.getStack());
        console.error(error);
        $state.go('error', null, {location: false});
    });
});
