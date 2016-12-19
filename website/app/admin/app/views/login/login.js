angular.module('views.login', [
    'modules.galaxy'
]);
angular.module('views.login').

config(function ($stateProvider) {
    $stateProvider.state('login', {
        url: "/login",
        templateUrl: "app/views/login/login.html",
        controller: 'LoginViewCtrl',
        data: {
            pageTitle: 'Login',
            viewClass: 'login'
        }
    });
}).

controller('LoginViewCtrl', function ($scope, $auth) {


});
