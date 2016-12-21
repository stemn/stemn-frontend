angular.module('views.security', []);
angular.module('views.security').

config(function ($stateProvider) {
    $stateProvider.
    state('app.security', {
        url: '/security',
        template: require('./security.html'),
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
