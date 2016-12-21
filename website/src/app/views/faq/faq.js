angular.module('views.faq', []);
angular.module('views.faq').

config(function ($stateProvider) {
    $stateProvider.
    state('app.faq', {
        url: '/faq',
        templateUrl: 'app/views/faq/faq.html',
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
