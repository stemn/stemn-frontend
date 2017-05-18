//        resolve: {
//            jwt: function(Authentication, $stateParams) {
//                // login via the jwt
//                if ($stateParams.id) {
//                    return Authentication.setToken($stateParams.id, false);
//                }
//            },
//        },
//        controller: function (jwt, $stateParams, $scope, $state, $mdToast, SettingsService) {
//            $scope.password = {};
//            $scope.updatePassword = function() {
//                if ($scope.password.newPassword !== $scope.password.confirmPassword) {
//                    $mdToast.show(
//                        $mdToast.simple().
//                        theme('warn').
//                        content('The passwords you entered don\'t match!')
//                    );
//                } else {
//                    SettingsService.updatePassword($scope.password.oldPassword, $scope.password.newPassword, $stateParams.token).then(function() {
//                        $mdToast.show(
//                            $mdToast.simple().
//                            content('Great, your password has been updated.')
//                        );
//                        $state.go('app.home')
//                    })
//                }
//            }
//        },
//          

//        return Restangular.one('settings').all('password').post({
//            oldPassword : oldPassword,
//            newPassword : newPassword,
//            resetToken : resetToken
//        }).then(function(response) {
//            return response;
//        });
//          
export default ({ oldPassword, newPassword, resetToken }) => ({
  type: 'AUTH/PASSWORD_UPDATE',
  http: true,
  payload: {
    method: 'POST',
    url: '/api/v1/settings/password',
    data: {
      oldPassword,
      newPassword,
      resetToken,
    }
  }
})