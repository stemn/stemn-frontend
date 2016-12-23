angular.module('views.password-reset', []);
angular.module('views.password-reset').

config(function ($stateProvider) {
    $stateProvider.
    state('password-reset', {
        url: '/password-reset?id&token',
        template: require('./password-reset.html'),
        resolve: {
            jwt: function(Authentication, $stateParams) {
                // login via the jwt
                if ($stateParams.id) {
                    return Authentication.setToken($stateParams.id, false);
                }
            },
        },
        controller: function (jwt, $stateParams, $scope, $state, $mdToast, SettingsService) {
            $scope.password = {};
            $scope.updatePassword = function() {
                if ($scope.password.newPassword !== $scope.password.confirmPassword) {
                    $mdToast.show(
                        $mdToast.simple().
                        theme('warn').
                        content('The passwords you entered don\'t match!')
                    );
                } else {
                    SettingsService.updatePassword($scope.password.oldPassword, $scope.password.newPassword, $stateParams.token).then(function() {
                        $mdToast.show(
                            $mdToast.simple().
                            content('Great, your password has been updated.')
                        );
                        $state.go('app.home')
                    })
                }
            }
        },
        seo: function(resolve){
            return {
                title : "Change and Reset your Password - STEMN",
            }
        }
    });
});
