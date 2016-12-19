angular.module('views.error', [
    'modules.layout-options',
]);
angular.module('views.error').

config(function ($stateProvider) {
    $stateProvider.
    state('app.verify', {
        url: '/verify?id',
        resolve: {
			jwt: function(Authentication, $stateParams) {
                // login via the jwt
                if ($stateParams.id) {
                    return Authentication.setToken($stateParams.id, false);
                }
            },
            verify: function ($http, $stateParams, jwt, Authentication) {
                return $http.get('/api/v1/account/verify').then(function (response) {
                    // reload the current user to get the latest data after verification
                    Authentication.currentUser.verified = !!response.data.success;
                    return response.data;
                });
            },
        },
        templateUrl: 'app/views/error/error.html',
        controller: 'VerifyCtrl',
        layout: {
            size: 'md',
            bgColor: 'rgba(0, 0, 0, 0.03)'
        },
    }).
    state('app.404', {
        url: '/404',
        controller: '404PageCtrl',
        templateUrl: 'app/views/error/error.html',
		seo: function(resolve){
            return {
                title : "Lost in Space - STEMN",
            }
        },
        layout: {
            size: 'md',
            bgColor: 'rgba(0, 0, 0, 0.03)'
        },
    }).
    state('app.permissions', {
        url: '/permissions',
        controller: 'ErrorPermissionsCtrl',
        templateUrl: 'app/views/error/error.html',
        layout: {
            size: 'md',
            bgColor: 'rgba(0, 0, 0, 0.03)'
        },
    }).
    state('app.admin-only', {
        url: '/admin-only',
        controller: 'AdminOnlyCtrl',
        templateUrl: 'app/views/error/error.html',
        layout: {
            size: 'md',
            bgColor: 'rgba(0, 0, 0, 0.03)'
        },
    });
}).

controller('VerifyCtrl', function ($rootScope, $scope, verify, LayoutOptions) {
    if (verify.success) {
        $scope.title       = "SUCCESS!";
        $scope.description = "Your account is fully verified.";
        $scope.buttontext  = "Head to your news feed";
    } else {
        $scope.title = "OOPS, SOMETHING WENT WRONG";
        $scope.description = "Something went wrong. Your user ID does not exist. If this keeps occuring, please contact us.";
        $scope.buttontext = "Head back to base";
        $scope.image = "assets/images/TransFull-Rect-600.png";
    }
}).

controller('404PageCtrl', function ($scope, $rootScope) {
    $scope.title = "LOST IN SPACE";
    $scope.description = "It looks like the page your were looking for is gone.";
    $scope.buttontext = "Head back to base";
    $scope.image = "assets/images/TransFull-Rect-600.png";
}).
controller('ErrorPermissionsCtrl', function ($scope, $rootScope) {
    $scope.title = "CAN'T SHOW YOU THAT";
    $scope.description = "You don't have the right permissions to see this.";
    $scope.buttontext = "Head back to base";
}).
controller('AdminOnlyCtrl', function ($scope, $rootScope) {
    $scope.title = "SORRY, ADMINS ONLY";
    $scope.description = "This is where we keep our secrets.";
    $scope.buttontext = "Get outa here";
});
