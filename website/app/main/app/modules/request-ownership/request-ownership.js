angular.module('modules.request-ownership', [
]);
angular.module('modules.request-ownership').

directive('clickRequestOwnership', function ($http, $mdToast, Authentication) {
    return {
        restrict: 'A',
        scope: {
            parentType: '@',
            parentId  : '@',
        },
        link : function(scope, element, attrs){
            scope.message = 'Account: '+ JSON.stringify(Authentication.currentUser.accounts);
            element.bind('click', function (event) {
                $http({
                    url: '/api/v1/request-ownership',
                    method: "GET",
                    params: {
                        parentType : scope.parentType,
                        parentId   : scope.parentId,
                        message    : scope.message
                    }
                }).success(function(result){
                    element.css({
                        'opacity'        : '0.5',
                        'pointer-events' : 'none',
                        'display'        : 'inline-block',
                    })
                    $mdToast.show(
                        $mdToast.simple().
                        content('Review pending... We\'ll email you if we require more info')
                    );
                }).catch(function(){
                    $mdToast.show(
                        $mdToast.simple().
                        theme('warn').
                        content('Something went wrong. Please email requests@stemn.com')
                    );
                })
            });
        }
    }
});
