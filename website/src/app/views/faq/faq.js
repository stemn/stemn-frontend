angular.module('views.faq', []);
angular.module('views.faq').

config(function ($stateProvider) {
    $stateProvider.
    state('app.faq', {
        url: '/faq',
        template: require('./faq.html'),
        controller: function ($scope, $rootScope, NewCreationsService) {
            $scope.newSomething =  NewCreationsService.createModal // function($event)
        },
        seo: function(resolve){
            return {
                title       : "FAQs - STEMN",
            }
        }
    });
});
