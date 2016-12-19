
angular.module('views.open', []);
angular.module('views.open').

config(function ($stateProvider) {
    $stateProvider.
    state('app.open', {
        url: '/open',
        menu: {
            main: [],
            more: [],
        },
        controller: function($scope, AuthenticationModalService, Authentication, $state){
            $scope.login = function(event, state){
                if (!Authentication.currentUser.isLoggedIn()) {
                    AuthenticationModalService.login(event)
                }
                else {
                    $state.go(state||'app.home');
                }
            }
        },
        templateUrl: 'app/views/open/open.html',
        layout: {
            chat: false,
            topBanner: false
        },
        seo: function(resolve){
            return {
                title : "Open-Source Science & Engineering - STEMN ",
            }
        }
    });
});
