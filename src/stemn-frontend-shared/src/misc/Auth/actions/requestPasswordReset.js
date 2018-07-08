// $scope.submit = function() {
// //        confirm('This isn\'t working yet. Please email lostpassword@stemn.com and we\'ll help you.')
//    $http.post('/api/v1/auth/reset-password', {
//        email   : $scope.data.email,
//    }).success(function () {
//        $mdToast.show(
//            $mdToast.simple().
//            content('Check your email for the password reset link.').
//            hideDelay(6000)
//        );
//        $mdDialog.hide();
//    });
// }
// $scope.cancel = function(){
//    $mdDialog.cancel();
// }
// $scope.back = function(event){
//    AuthenticationModalService.login(event)
// }

import { show as showToast } from 'stemn-shared/misc/Toasts/Toasts.actions.js'


export default ({ email }) => dispatch => dispatch({
  type: 'AUTH/REQUEST_PASSWORD_RESET',
  http: true,
  payload: {
    method: 'POST',
    url: '/api/v1/auth/reset-password',
    data: {
      email,
    },
  },
}).then(({ value }) => {
  dispatch(showToast({ title: 'Check your email for the password reset link' }))
})
