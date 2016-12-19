(function () {
    'use strict';

    var dependencies = [
        'ngAnimate',
        'templates',
        'ui.router',
        'angular-loading-bar',

        'views.app',
        'views.preview',
        'views.home',
        'views.error',
        'views.preview-github',

        'modules.core',
        'modules.filters',
        'modules.preview',
        'modules.sync',
        'modules.moment',
        'modules.lazy-loading',
        'modules.code-mirror',

//        'material.components.icon',

    ];
    angular.module('app', dependencies)
    angular.module('app')
        .config(config)
        .run(run);

    config.$inject = ['$urlRouterProvider', '$locationProvider'];
    run.$inject    = ['$rootScope', '$state', '$stateParams'];

    function config($urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/');
    }

    function run($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }
}());
