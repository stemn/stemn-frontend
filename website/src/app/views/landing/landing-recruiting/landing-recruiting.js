import './landing-recruiting.scss';

angular.module('views.landing.recruiting', [
]);
angular.module('views.landing.recruiting').

config(function ($stateProvider) {
    $stateProvider.
    state('app.landing.recruiting', {
        url: '/recruiting',
        template: require('./landing-recruiting.html'),
        controller: function($scope, OnboardingService, AuthenticationModalService){
            OnboardingService.beenLanding = true;
            $scope.loginRecruit = AuthenticationModalService.loginRecruit; // function(event)
        },
        seo: function(){
            return {
                title : "For Employers - Recruit the world's best scientists and engineers - STEMN",
            }
        },
        layout: {
            size      : 'md',
            sidebar   : false,
            footer    : true,
            topBanner : false
        },
    })
});
