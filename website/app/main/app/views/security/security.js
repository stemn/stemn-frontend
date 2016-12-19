angular.module('views.security', []);
angular.module('views.security').

config(function ($stateProvider) {
    $stateProvider.
    state('app.security', {
        url: '/security',
        templateUrl: 'app/views/security/security.html',
        layout:{
            footer: true,
        },
        seo: function(resolve){
            return {
                title       : "Security - STEMN",
            }
        }
    })
});
