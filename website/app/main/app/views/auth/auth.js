angular.module('views.auth', [
]);
angular.module('views.auth').

config(function ($stateProvider) {
    $stateProvider.
    state('app.auth', {
        url: '/auth',
        templateUrl: 'app/views/auth/tpls/auth.html',
        abstract: true,
        layout: {
            chat: false,
            topBanner: false,
            size: 'md',
            bgColor: 'rgba(0, 0, 0, 0.03)'
        },
    }).
    state('app.auth.dropbox', {
        url: '/dropbox',
        templateUrl: 'app/views/auth/tpls/auth-dropbox.html',
        controller: function($scope, SyncService){
            $scope.authorize = function(){
                SyncService.authorize('dropbox').then(function(response){
                    console.log(response);
                })
            }

        }
    }).
    state('app.auth.google', {
        url: '/google',
        templateUrl: 'app/views/auth/tpls/auth-google.html',
        controller: function($scope, SyncService){
            $scope.authorize = function(){
                SyncService.authorize('google').then(function(response){
                    console.log(response);
                })
            }
        }
    });
});
