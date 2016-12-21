import './landing-pricing.scss';

angular.module('views.landing.pricing', [
]);
angular.module('views.landing.pricing').

config(function ($stateProvider) {
    $stateProvider.
    state('app.landing.pricing', {
        url: '/pricing',
        templateUrl: 'app/views/landing/landing-pricing/tpls/landing-pricing.html',
//        controller: function(OnboardingService){
//            OnboardingService.beenLanding = true;
//        },
//        seo: function(){
//            return {
//                title : "Aerospace Jobs - Simple 2 Click Application - STEMN",
//            }
//        },
        layout: {
            size      : 'md',
            sidebar   : false,
            footer    : true,
            topBanner : false
        },
    });
});
