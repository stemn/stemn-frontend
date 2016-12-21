angular.module('views.onboarding.select', [
]);
angular.module('views.onboarding.select').

config(function ($stateProvider) {
    $stateProvider.
    state('app.onboarding.select', {
        url: '',
        templateUrl: 'app/views/onboarding/onboarding-select/tpls/onboarding-select.html',
        controller: 'OnboardingSelectViewCtrl',
    })
}).

controller('OnboardingSelectViewCtrl', function ($scope, $state) {


});
