angular.module('views.login', [
    'modules.authentication'
]);
angular.module('views.login').

config(function ($stateProvider) {
    $stateProvider.
    state('app.login', {
        url: '/login',
        dialog: true,
        onEnter: function(AuthenticationModalService, $state, $timeout) {
            $timeout(function(){
                $state.go('app.home').then(function () {
                    $timeout(AuthenticationModalService.login, 1000)
                });
            },1)
        }
    });
});
