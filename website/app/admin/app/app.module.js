(function () {
    'use strict';

    var dependencies = [
    'ngAnimate',
    'ngMessages',
    'ngSanitize',
    'ngMaterial',

    'templates',
//    'app.home',
//    'app.posts',
//    'app.post',

    'ui.router',
    'angular-loading-bar',
    'ngMdIcons',
	'ngTable',
    'infinite-scroll',
    'nvd3',

    'views.app',
	'views.campaigns',
	'views.error',
    'views.home',
    'views.marketing',
	'views.live',
	'views.login',
	'views.users',
    'views.states',
    'views.state',
    'views.user',
    'views.usage',
    'views.popular',
    'views.emails',
    'views.fields',
    'views.jobs',
    'views.job-applications',
    'views.organisations',
    'views.organisation',
    'views.projects',
    'views.threads',
    'views.crm',
    'views.growth-accounting',
    'views.reminders',
    'views.referrals',
    'views.github',

	'modules.authentication',
    'modules.d3',
	'modules.error-handling',
	'modules.core',
	'modules.restangular',
	'modules.filters',
	'modules.material',
	'modules.projects',
    'modules.transition-overlay',
    'modules.threads',
    'modules.page-loading-overlay',
    'modules.queryUsers',
	'modules.users',
	'modules.organisation',
	'modules.field',
	'modules.logs',
    'modules.local-cache',
    'modules.loading',
    'modules.posts',
    'modules.http',
    'modules.tables',
    'modules.moment',
    'modules.analytics',
    'modules.timeline',
    'modules.confirm-click',
    'modules.keyboard-navigation',
    'modules.tabs'
  ];
    angular.module('app', dependencies)
    angular.module('app')
        .config(config)
        .run(run);

    angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 500)



    config.$inject = ['$urlRouterProvider', '$mdThemingProvider', '$locationProvider'];
    run.$inject = ['$rootScope', '$state', '$stateParams'];

    function config($urlRouterProvider, $mdThemingProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/');
    }

    function run($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }
}());
