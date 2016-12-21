angular.module('views.terms', []);
angular.module('views.terms').

config(function ($stateProvider) {
    $stateProvider.
    state('app.terms', {
        url: '/terms',
        template: require('./terms.html'),
        layout:{
            footer: true,
        },
        seo: function(resolve){
            return {
                title       : "Terms of Service - STEMN",
            }
        }
    });
});
