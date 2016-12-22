import angular            from 'angular';
import configValues       from './config.js';

// Css Globals
import '../../bower_components/angular-material/angular-material.css';
import './css/index.js';

import ngAnimate          from 'angular-animate'; 
import ngAria             from 'angular-aria'; 
import ngSantize          from 'angular-sanitize'; 
import ngCookies          from 'angular-cookies'; 
import ngMessages         from 'angular-messages'; 
import angularFileUpload  from 'angular-file-upload/angular-file-upload.js'; 
import ngInfiniteScroll   from 'ng-infinite-scroll/build/ng-infinite-scroll.js';
import react              from 'ngreact'
import uiRouter           from 'angular-ui-router';
import uiRouterExtras     from 'ui-router-extras';

import routes             from './routes.js';
import modules            from './modules.js';

// Globals
import * as lodash        from 'lodash';
import wowjs              from 'wowjs';
window._   = lodash;
window.WOW = wowjs.WOW;





const moduleName = 'app';

const dependencies = [
    'ngAnimate',
    'ngAria',
    'ngSanitize',
    'ngCookies',
    'ngMessages',
    'angularFileUpload',
    'infinite-scroll',
    'react',
    'ui.router',
    'ct.ui.router.extras',
//    'sticky',
//    'unsavedChanges',
//    'monospaced.elastic',
//    'puElasticInput',
//    'ng-showdown',
    routes,
    modules
];

angular.module('app', dependencies)
    .config(config)
    .controller('MainCtrl', MainCtrl);
//
//
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
    $rootScope.env = configValues.env;
    $scope.LayoutOptions = LayoutOptions;
    $scope.$dynamicFooter = $dynamicFooter;


    if (typeof console !== 'undefined' && typeof console.log === 'function' && !window.test) {
        console.log('\r\n%c                     *      .--.\r\n%c                           \/ \/  `\r\n%c          +               | |\r\n%c                 \'         \\ \\__,\r\n%c             *          +   \'--\'  *\r\n%c                 +   \/\\\r\n%c    +              .\'  \'.   *\r\n%c           *      \/======\\      +\r\n%c                 ;:.  _   ;\r\n%c                 |:. (_)  |\r\n%c                 |:.  _   |\r\n%c       +         |:. (_)  |          *\r\n%c                 ;:.      ;\r\n%c               .\' \\:.    \/ `.\r\n%c              \/ .-\'\':._.\'`-. \\\r\n%c              |\/    \/||\\    \\|\r\n%c            _..--\"\"\"````\"\"\"--.._\r\n%c      _.-\'``                    ``\'-._\r\n%c    -\'         %cHello, explorer%c        \'-\r\n%c' +
            '\n       Curious? http://stemn.com/thread/join-our-rocketship',
            'color:#D0E3F1', 'color:#D0E3F1', 'color:#C0DAEC', 'color:#C0DAEC', 'color:#B0D1E8', 'color:#B0D1E8', 'color:#A1C7E3', 'color:#A1C7E3', 'color:#91BEDE', 'color:#91BEDE', 'color:#81B5D9', 'color:#81B5D9', 'color:#72ABD5', 'color:#72ABD5', 'color:#62A2D0', 'color:#62A2D0', 'color:#5299CB', 'color:#5299CB', 'color:#4390C7', 'color:#4390C7', 'color:#4390C7', 'color: #000000');
    }
}

//

export default moduleName
