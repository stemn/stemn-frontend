angular.module('views.landing.jobs', [
]);
angular.module('views.landing.jobs').

config(function ($stateProvider) {
    $stateProvider.
    state('app.landing.jobs', {
        url: '/jobs',
        templateUrl: 'app/views/landing/landing-jobs/tpls/landing-jobs.html',
        controller: function(OnboardingService){
            OnboardingService.beenLanding = true;
        },
        seo: function(){
            return {
                title : "Aerospace Jobs - Simple 2 Click Application - STEMN",
            }
        },
        layout: {
            size      : 'md',
            sidebar   : false,
            footer    : true,
            topBanner : false
        },
    });
});
