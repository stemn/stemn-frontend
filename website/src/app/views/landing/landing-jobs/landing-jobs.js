import jobStepTpl from 'ngtemplate!app/views/landing/landing-jobs/tpls/jobs-steps.html';
import './landing-jobs.scss';

angular.module('views.landing.jobs', [
]);
angular.module('views.landing.jobs').

config(function ($stateProvider) {
    $stateProvider.
    state('app.landing.jobs', {
        url: '/jobs',
        template: require('./tpls/landing-jobs.html'),
        controller: function(OnboardingService){
            OnboardingService.beenLanding = true;
            $scope.jobStepTpl = jobStepTpl;
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
