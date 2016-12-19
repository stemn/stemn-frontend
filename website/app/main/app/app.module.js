(function () {
    'use strict';

    var dependencies = [
        'ngCookies',
        'ngAnimate',
        'ngSanitize',
        'angularFileUpload',
        'sticky',
        'infinite-scroll',
        'unsavedChanges',
        'monospaced.elastic',
        'puElasticInput',
        'ng-showdown',

        'ui.router',
        'ct.ui.router.extras',

        // STEMN Core Modules
        'modules.app-version',
        'modules.material-design',
        'modules.restangular',
        'modules.http',
        'modules.banner-header',
        'modules.core',
        'modules.cards',
        'modules.lightbox',
        'modules.components',
        'modules.popup',
        'modules.favico',
        'modules.projects',
        'modules.page-loading-overlay',
        'modules.layout-options',
        'modules.error-handling',
        'modules.filters',
        'modules.animations',
        'modules.toc',
        'modules.seo',
        'modules.scroll',
        'modules.moment',
        'modules.modular-editor',
        'modules.pagination',
        'modules.validation',
        'modules.feed',
        'modules.dynamic-footer',
        'modules.contenteditable',
        'modules.line-clamp',
        'modules.row-views',
        'modules.easter-eggs',
        'modules.settings',
        'modules.sortable',
        'modules.realtime-editor',
        'modules.reading-time',
        'modules.browser-info',
        'modules.tab-dropdown',
        'modules.view-cache',
        'modules.posts',
        'modules.statistics',
        'modules.schema',
        'modules.referrals',
        'modules.user-widgets',
        'modules.footer',
        'modules.tables',
        'modules.loadbar',
        'modules.local-cache',
        'modules.analytics',
        'modules.lazy-loading',
        'modules.code-mirror',
        'modules.new-creations',
        'modules.explanation-modals',
        'modules.location',
        'modules.onboarding',
        'modules.tabs',
        'modules.related',
        'modules.state-history',
        'modules.sync',
        'modules.preview',
        'modules.intercom',


        // %%start Development Dependencies
//        'modules.development.digest-hud',
        // end%%


        // Views
        'views.app',
        'views.careers',
        'views.contact',
        'views.create',
        'views.creations',
        'views.error',
        'views.faq',
        'views.field',
        'views.home',
        'views.landing',
        'views.login',
        'views.organisation',
        'views.partners',
        'views.privacy',
        'views.project',
        'views.scholarship',
        'views.search',
        'views.security',
        'views.terms',
        'views.test',
        'views.thread',
        'views.user',
        'views.user-onboarding',
        'views.usersettings',
        'views.following',
        'views.browse',
        'views.password-reset',
        'views.map',
        'views.job',
        'views.index',
        'views.applications',
        'views.referrals',
        'views.notifications',
        'views.track',
        'views.open',
        'views.onboarding',
        'views.preview',
        'views.auth',
        'views.dashboard',
        'views.compare',

        // HTML templates compiled to JS
        'templates'
    ];

    angular.module('StemnApp', dependencies)
        .config(config)
        .controller('MainCtrl', MainCtrl);


    angular.module('infinite-scroll')
        .value('THROTTLE_MILLISECONDS', 500);

    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////

    function config($locationProvider, $urlRouterProvider, $stateProvider) {
        $locationProvider.html5Mode(true); // use html5Mode so the state routes don't have #/route

        // Inisitalise any 3rd party vanillla JS
        new WOW().init();

        $urlRouterProvider.rule(function ($injector, $location) {
            // what this function returns will be set as the $location.url
            var path = $location.path(),
                normalized = path.toLowerCase();
            if (path !== normalized) {
                $location.replace().path(normalized);
            }
            // because we've returned nothing, no state change occurs
        });

        // Route Redirects - Redirect all non-existing pages to 404
        //    $urlRouterProvider.otherwise(function (req, res) {
        //        return '/404';
        //    });

        $urlRouterProvider.otherwise(function ($injector, $location) {
            var $state = $injector.get('$state');
            $state.go('app.404', null, {
                location: false
            });
            return $location.path();
        });
    }

    function MainCtrl($scope, $document, $rootScope, $location, $sce, ProjectCreateModalService, $state, LayoutOptions, Authentication, $mdMedia, $dynamicFooter) {
        $rootScope.$state = $state;
        $rootScope.user = Authentication.currentUser;
        $rootScope.$mdMedia = $mdMedia;
        $scope.LayoutOptions = LayoutOptions;
        $scope.$dynamicFooter = $dynamicFooter;


        if (typeof console !== 'undefined' && typeof console.log === 'function' && !window.test) {
            console.log('\r\n%c                     *      .--.\r\n%c                           \/ \/  `\r\n%c          +               | |\r\n%c                 \'         \\ \\__,\r\n%c             *          +   \'--\'  *\r\n%c                 +   \/\\\r\n%c    +              .\'  \'.   *\r\n%c           *      \/======\\      +\r\n%c                 ;:.  _   ;\r\n%c                 |:. (_)  |\r\n%c                 |:.  _   |\r\n%c       +         |:. (_)  |          *\r\n%c                 ;:.      ;\r\n%c               .\' \\:.    \/ `.\r\n%c              \/ .-\'\':._.\'`-. \\\r\n%c              |\/    \/||\\    \\|\r\n%c            _..--\"\"\"````\"\"\"--.._\r\n%c      _.-\'``                    ``\'-._\r\n%c    -\'         %cHello, explorer%c        \'-\r\n%c' +
                '\n       Curious? http://stemn.com/thread/join-our-rocketship',
                'color:#D0E3F1', 'color:#D0E3F1', 'color:#C0DAEC', 'color:#C0DAEC', 'color:#B0D1E8', 'color:#B0D1E8', 'color:#A1C7E3', 'color:#A1C7E3', 'color:#91BEDE', 'color:#91BEDE', 'color:#81B5D9', 'color:#81B5D9', 'color:#72ABD5', 'color:#72ABD5', 'color:#62A2D0', 'color:#62A2D0', 'color:#5299CB', 'color:#5299CB', 'color:#4390C7', 'color:#4390C7', 'color:#4390C7', 'color: #000000');
        }
    }
}());
