angular.module('views.privacy', []);
angular.module('views.privacy').

config(function ($stateProvider) {
    $stateProvider.
    state('app.privacy', {
        url: '/privacy',
        templateUrl: 'app/views/privacy/privacy.html',
        controller: function ($rootScope) {
        },
        layout:{
            footer: true,
        },
        seo: function(resolve){
            return {
                title       : "Privacy Policy - STEMN",
            }
        }
    });
});
