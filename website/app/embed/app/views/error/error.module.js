angular.module('views.error', [
])

angular.module('views.error').

run(function ($rootScope, $state, $timeout) {
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        $state.go('app.error', null, {location: false});
    });
}).

config(function($stateProvider){
    $stateProvider.state('app.error', {
        templateUrl: 'app/views/error/error.tpl.html',
        controller: 'ErrorViewCtrl',
        url: '/error',
        data: {
            pageTitle: 'Error',
            viewClass: 'error'
        },
    });
});
