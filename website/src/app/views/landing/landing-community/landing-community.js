import './landing-community.scss';
angular.module('views.landing.community', [
]);
angular.module('views.landing.community').

config(function ($stateProvider) {
    $stateProvider.
    state('app.landing.community', {
        url: '/community',
        template: require('./tpls/landing-community.html'),
        controller: function($scope, $timeout, $interval){

        },
        seo: function(){
            return {
                title : "Open-Source Community - STEMN",
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
