'use strict';

(function () {
    'use strict';

    var dependencies = ['ngCookies', 'ngAnimate', 'ngSanitize', 'angularFileUpload', 'sticky', 'infinite-scroll', 'unsavedChanges', 'monospaced.elastic', 'puElasticInput', 'ng-showdown', 'ui.router', 'ct.ui.router.extras',

    // STEMN Core Modules
    'modules.app-version', 'modules.material-design', 'modules.restangular', 'modules.http', 'modules.banner-header', 'modules.core', 'modules.cards', 'modules.lightbox', 'modules.components', 'modules.popup', 'modules.favico', 'modules.projects', 'modules.page-loading-overlay', 'modules.layout-options', 'modules.error-handling', 'modules.filters', 'modules.animations', 'modules.toc', 'modules.seo', 'modules.scroll', 'modules.moment', 'modules.modular-editor', 'modules.pagination', 'modules.validation', 'modules.feed', 'modules.dynamic-footer', 'modules.contenteditable', 'modules.line-clamp', 'modules.row-views', 'modules.easter-eggs', 'modules.settings', 'modules.sortable', 'modules.realtime-editor', 'modules.reading-time', 'modules.browser-info', 'modules.tab-dropdown', 'modules.view-cache', 'modules.posts', 'modules.statistics', 'modules.schema', 'modules.referrals', 'modules.user-widgets', 'modules.footer', 'modules.tables', 'modules.loadbar', 'modules.local-cache', 'modules.analytics', 'modules.lazy-loading', 'modules.code-mirror', 'modules.new-creations', 'modules.explanation-modals', 'modules.location', 'modules.onboarding', 'modules.tabs', 'modules.related', 'modules.state-history', 'modules.sync', 'modules.preview', 'modules.intercom',

    // %%start Development Dependencies
    //        'modules.development.digest-hud',
    // end%%


    // Views
    'views.app', 'views.careers', 'views.contact', 'views.create', 'views.creations', 'views.error', 'views.faq', 'views.field', 'views.home', 'views.landing', 'views.login', 'views.organisation', 'views.partners', 'views.privacy', 'views.project', 'views.scholarship', 'views.search', 'views.security', 'views.terms', 'views.test', 'views.thread', 'views.user', 'views.user-onboarding', 'views.usersettings', 'views.following', 'views.browse', 'views.password-reset', 'views.map', 'views.job', 'views.index', 'views.applications', 'views.referrals', 'views.notifications', 'views.track', 'views.open', 'views.onboarding', 'views.preview', 'views.auth', 'views.dashboard', 'views.compare',

    // HTML templates compiled to JS
    'templates'];

    angular.module('StemnApp', dependencies).config(config).controller('MainCtrl', MainCtrl);

    angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 500);

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
            console.log('\r\n%c                     *      .--.\r\n%c                           \/ \/  `\r\n%c          +               | |\r\n%c                 \'         \\ \\__,\r\n%c             *          +   \'--\'  *\r\n%c                 +   \/\\\r\n%c    +              .\'  \'.   *\r\n%c           *      \/======\\      +\r\n%c                 ;:.  _   ;\r\n%c                 |:. (_)  |\r\n%c                 |:.  _   |\r\n%c       +         |:. (_)  |          *\r\n%c                 ;:.      ;\r\n%c               .\' \\:.    \/ `.\r\n%c              \/ .-\'\':._.\'`-. \\\r\n%c              |\/    \/||\\    \\|\r\n%c            _..--\"\"\"````\"\"\"--.._\r\n%c      _.-\'``                    ``\'-._\r\n%c    -\'         %cHello, explorer%c        \'-\r\n%c' + '\n       Curious? http://stemn.com/thread/join-our-rocketship', 'color:#D0E3F1', 'color:#D0E3F1', 'color:#C0DAEC', 'color:#C0DAEC', 'color:#B0D1E8', 'color:#B0D1E8', 'color:#A1C7E3', 'color:#A1C7E3', 'color:#91BEDE', 'color:#91BEDE', 'color:#81B5D9', 'color:#81B5D9', 'color:#72ABD5', 'color:#72ABD5', 'color:#62A2D0', 'color:#62A2D0', 'color:#5299CB', 'color:#5299CB', 'color:#4390C7', 'color:#4390C7', 'color:#4390C7', 'color: #000000');
        }
    }
})();
'use strict';

angular.module('modules.preview', ['modules.preview.cad', 'modules.preview.code', 'modules.preview.files', 'modules.preview.gerber', 'modules.preview.pcb', 'modules.preview.embed', 'modules.preview.pdf']);
angular.module('modules.preview');
'use strict';

angular.module('modules.analytics.segment', []);
angular.module('modules.analytics.segment').directive('analyticsTrack', function (SegmentAnalytics, $state) {
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            element.bind('click', function (event) {
                SegmentAnalytics.track(attrs.analyticsTrack, {
                    category: $state.current.name || undefined,
                    label: attrs.analyticsLabel || undefined
                });
            });
        }
    };
}).service('SegmentAnalytics', function ($state) {
    this.track = function (data, attrs) {
        if (window.analytics && window.analytics.track) {
            analytics.track(data, attrs);
        } else {
            console.error('Analytics Blocked');
        }
    };
}).service('FacebookAnalytics', function ($state) {
    this.track = function (event) {
        if (window.fbq) {
            window.fbq('track', event);
        } else {
            console.error('Analytics Blocked');
        }
    };
}).service('TwitterAnalytics', function () {
    this.trackSignup = function () {
        if (window.twttr && window.twttr.conversion && window.twttr.conversion.trackPid) {
            window.twttr.conversion.trackPid('nuo3n', { tw_sale_amount: 0, tw_order_quantity: 0 });
        } else {
            console.error('Analytics Blocked');
        }
    };
});
'use strict';

angular.module('modules.analytics', ['modules.idle', 'modules.location', 'modules.analytics.segment']);
angular.module('modules.analytics').run(function ($rootScope, AnalyticsService, $interval, $localStorage, $timeout, IdleService) {
    var numStates = 0;
    var refresh = false;
    var timeAtLoad = new Date().getTime();

    // If we were in the site in the last minute this is a refresh
    if (timeAtLoad - $localStorage.lastOpenTime <= 60 * 1000) {
        refresh = true;
    }

    // Save the lastOpenTime to local storage every 5 seconds
    $interval(function () {
        $localStorage.lastOpenTime = new Date().getTime();
    }, 5000);

    $rootScope.$on('$stateChangeSuccess', sendStateChangeEvents);
    window.onbeforeunload = closingCode;

    $rootScope.$on('Idle.active', function () {
        AnalyticsService.sendEvent({
            eventType: 'state-active'
        });
    });

    $rootScope.$on('Idle.inactive', function () {
        AnalyticsService.sendEvent({
            eventType: 'state-inactive'
        });
    });

    ///////////////////////////////////////////////////////

    function closingCode() {
        AnalyticsService.sendEvent({
            eventType: 'state-close'
        });
        return null;
    }

    function sendStateChangeEvents(event, toState, toParams, fromState, fromParams) {
        if (numStates === 0 && !refresh) {
            var data = {
                eventType: 'state-initialise',
                state: toState.name,
                params: toParams,
                url: window.location.pathname
            };
            // Timeout for 2s so page can fully load
            $timeout(function () {
                AnalyticsService.getMetaInfo().then(function (meta) {
                    _.assign(data, meta);
                    AnalyticsService.sendEvent(data);
                });
            }, 2000);
        } else if (numStates === 0 && refresh) {
            AnalyticsService.sendEvent({
                eventType: 'state-refresh',
                state: toState.name,
                params: toParams,
                url: window.location.pathname
            });
        } else {
            AnalyticsService.sendEvent({
                eventType: 'state-change',
                state: toState.name,
                params: toParams,
                url: window.location.pathname
            });
        }
        numStates++;
    }
}).service('AnalyticsService', function (CoreLibrary, FunctionLibrary, $localStorage, $http, $q, LocationService) {
    var service = this;

    this.sendEvent = sendEvent;
    this.getMetaInfo = getMetaInfo;

    ///////////////////////////////////////////////
    var metaInfo;
    var previousEventId;

    function getMetaInfo() {
        var deferred = $q.defer();
        // If we already have calculated the meta info
        if (metaInfo) {
            deferred.resolve(metaInfo);
        } else {
            var data = {
                referrer: document.referrer.split('/')[2],
                resolution: getScreenSize(),
                userAgent: navigator.userAgent
            };
            LocationService.getLocation().then(function (location) {
                data.location = location;
                metaInfo = data; // Save to service memory
                deferred.resolve(data);
            }).catch(function (err) {
                metaInfo = data; // Save to service memory
                deferred.resolve(data);
            });
        }
        return deferred.promise;
    }

    function sendEvent(data) {
        var newEventId = CoreLibrary.getUuid();
        var prevEventId = previousEventId;
        previousEventId = newEventId; // Save the id in memory for the next request
        if (!FunctionLibrary.isCrawler()) {
            return $http.post('/api/v1/events', {
                deviceId: getDeviceId(), // objectId
                eventId: newEventId, // objectId
                previousEventId: prevEventId, // objectId
                eventType: data.eventType, // string
                url: data.url, // string
                state: data.state, // string
                params: CoreLibrary.compactObject(data.params), // {stub: ?}
                referrer: data.referrer, // string
                resolution: data.resolution, // {width: ?, height: ?},
                userAgent: data.userAgent // string
            });
        }
    }
    function getDeviceId() {
        // Set User Uuid if it does not exist
        if (!$localStorage.deviceId || !CoreLibrary.isObjectId($localStorage.deviceId)) {
            $localStorage.deviceId = CoreLibrary.getUuid();
        }
        return $localStorage.deviceId;
    }

    function getScreenSize() {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0];
        return {
            width: w.innerWidth || e.clientWidth || g.clientWidth,
            height: w.innerHeight || e.clientHeight || g.clientHeight
        };
    }
});
'use strict';

/**
 * Created by Mariandi on 11/03/2014.
 */
/*global angular*/
angular.module('anguvideo', []).directive("anguvideo", ['$sce', function ($sce) {
    return {
        restrict: 'EA',
        scope: {
            source: '=ngModel',
            width: '@',
            height: '@'
        },
        replace: true,
        template: '<div class="anguvideo">' + '<iframe class="videoClass" type="text/html" width="{{width}}" height="{{height}}" ng-src="{{url}}" allowfullscreen frameborder="0"></iframe>' + '</div>',
        link: function link(scope, element, attrs) {
            var embedFriendlyUrl = "",
                urlSections,
                index;

            var youtubeParams = attrs.hideControls ? '?autoplay=0&showinfo=0&controls=0' : '';

            scope.$watch('source', function (newVal) {
                if (newVal) {
                    /*
                    * Need to convert the urls into a friendly url that can be embedded and be used in the available online players the services have provided
                    * for youtube: src="//www.youtube.com/embed/{{video_id}}"
                    * for vimeo: src="http://player.vimeo.com/video/{{video_id}}
                    */

                    if (newVal.indexOf("vimeo") >= 0) {
                        // Displaying a vimeo video
                        if (newVal.indexOf("player.vimeo") >= 0) {
                            embedFriendlyUrl = newVal;
                        } else {
                            embedFriendlyUrl = newVal.replace("http:", "https:");
                            urlSections = embedFriendlyUrl.split(".com/");
                            embedFriendlyUrl = embedFriendlyUrl.replace("vimeo", "player.vimeo");
                            embedFriendlyUrl = embedFriendlyUrl.replace("/" + urlSections[urlSections.length - 1], "/video/" + urlSections[urlSections.length - 1] + "");
                        }
                    } else if (newVal.indexOf("youtu.be") >= 0) {

                        index = newVal.indexOf(".be/");

                        embedFriendlyUrl = newVal.slice(index + 4, newVal.length);
                        embedFriendlyUrl = "https://www.youtube.com/embed/" + embedFriendlyUrl + youtubeParams;
                    } else if (newVal.indexOf("youtube.com") >= 0) {
                        // displaying a youtube video

                        if (newVal.indexOf("embed") >= 0) {
                            embedFriendlyUrl = newVal + youtubeParams;
                        } else {
                            embedFriendlyUrl = newVal.replace("/watch?v=", "/embed/") + youtubeParams;
                        }
                    }

                    scope.url = $sce.trustAsResourceUrl(embedFriendlyUrl);
                    //console.log("done",  scope.url, embedFriendlyUrl);
                }
            });
        }
    };
}]);
'use strict';

angular.module('modules.animations', []);
angular.module('modules.animations').directive('setNgAnimate', function ($animate) {
    return {
        link: function link($scope, $element, $attrs) {
            $scope.$watch(function () {
                return $scope.$eval($attrs.setNgAnimate, $scope);
            }, function (valnew, valold) {
                $animate.enabled(!!valnew, $element);
            });
        }
    };
}).directive('attentionAnimation', function () {
    return {
        restrict: 'A',
        link: function link(scope, element, attributes) {
            // INPUTS //
            // animate-toggle -- This will toggle the adding of the animation styles
            // animation      -- This will set the animation style

            // the first time the watch runs, it will trigger the animation,
            // so only run the shake if it isn't the first watch trigger
            var animation = attributes.animation || 'shake'; // Default animation
            var firstRun = true;
            var type = animation + ' 0.8s';

            attributes.$observe('animateToggle', function (value) {
                if (!firstRun) {
                    // Remove animation
                    element.css({
                        '-webkit-animation': '',
                        'animation': '' });
                    // Add animation
                    setTimeout(function () {
                        element.css({
                            '-webkit-animation': type,
                            'animation': type });
                    }, 10);
                }
                firstRun = false;
            });
        }
    };
});
'use strict';

angular.module('modules.app-version', []);
angular.module('modules.app-version').run(function ($http, ErrorModalService, $timeout) {
  //
  //	// The 'appVersionPlaceholder' is overwritten as part of the grunt build
  //	var appVersion = '%%appVersionPlaceholder%%';
  //
  //	// Get the config details from the server
  //	$http.get('/api/v1/config').then(function(response) {
  //		var config = response.data;
  //		// If versions dont match, we are out of date
  //		if(appVersion.indexOf('appVersionPlaceholder') > -1){
  //			console.error('Grunt not setting App Version Placeholder');
  //		} else {
  //			if (config.version !== appVersion && config.environment !== 'development') {
  //				console.log('local', appVersion, 'server', config.version);
  //				$timeout(function(){
  //					ErrorModalService.error(null, {
  //						title : 'Old App Version',
  //						body : '<p>Your browser has cached an old version of our website. You need to hard-refresh to get the new version.</p>',
  //						cancelText  : 'Continue anyway',
  //						confirmText : 'Get new version'
  //					}).then(function(){
  //						location.reload(true)
  //					})
  //				},3000)
  //			}
  //		}
  //		// If we are in development but using production database, Warn modal.
  //		if (config.environment === 'devlopment' && config.database === 'production') {
  //			$timeout(function(){
  //				ErrorModalService.error(null, {
  //					title : 'You are running the production database',
  //					body : '<p>Any changes you make will be reflected on the actual website!</p>',
  //					confirmText : 'Proceed with caution'
  //				})
  //			},3000)
  //		}
  //	});
});
'use strict';

angular.module('modules.authentication', ['modules.authentication.permissions', 'satellizer', 'modules.user-subdomain', 'modules.users']);
angular.module('modules.authentication').run(function ($rootScope, Authentication, $state, $q, CoreLibrary) {
    /**************************************************************
    This redircts if authLevel is not adequate
    
    state('app.state', {
    	url : '/state',
    	templateUrl: 'app/views/state/state.html',
    	authLevel: 'user' || 'admin' || 'public'
    })
    
    Options are:
    public || user || admin
    It will default to public behavior if undefined
    **************************************************************/

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        //        console.log(toState.$$state());
        var toStateDetailed = toState.$$state();
        var authLevel = CoreLibrary.checkStateParents(toStateDetailed, 'authLevel');
        processAuthLevel(authLevel);
    });

    $rootScope.$on("user.save", function (event, data) {
        Authentication.loadUserData();
    });

    /////////////////////////////////////////////////////////////////

    function processAuthLevel(authLevel) {
        if (authLevel === 'user') {
            // if the user isn't logged in, we must get their userdata to see if they can access this state
            var userlookup;
            if (!Authentication.currentUser.isLoggedIn()) {
                userlookup = Authentication.loadUserData();
            }
            // check that the accessing user is logged in and thus is allowed to access this state
            $q.when(userlookup).then(function () {
                // if they're not a logged in user, reject the state change
                if (!Authentication.currentUser.isLoggedIn()) {
                    // reject to login
                    event.preventDefault();
                    // reload: true will force transition even if the state or params have not changed, aka a reload of the same state.
                    $state.go('app.login', {}, { reload: true, location: false });
                }
                // Else
                // proceed to state
            });
        } else if (authLevel === 'admin') {
            if (!Authentication.currentUser.isAdmin) {
                event.preventDefault();
                $state.go('app.admin-only', {}, { reload: true, location: false });
            }
            // Else
            // We must be admin is transition normally
        }
    }
}).

/**
 * @ngdoc directive
 * @name authentication.directive:hidepublic
 * @attribute hidepublic
 * @function
 *
 * @description
 * This will hide an element if the user is not logged in.
 *
 * **Note:**
 *
 * @example
   <div hidepublic>
       This content will be hidden if not logged in
   </div>
 */
directive('hidepublic', function (Authentication) {
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            checkHide();
            scope.$on("authentication.logIn", checkHide);
            scope.$on("authentication.logOut", checkHide);

            function checkHide() {
                if (attrs.hidepublic !== 'false') {
                    if (!Authentication.currentUser.isLoggedIn()) {
                        // Not logged in
                        element.addClass('hidden');
                    } else {
                        element.removeClass('hidden');
                    }
                }
            }
        }
    };
}).directive('showIfOwner', function (Authentication) {
    return {
        restrict: 'AE',
        link: function link(scope, element, attr) {
            // Takes in Attibute of 'owner'
            // Takes in Attribute 'dr-class' this will be applied
            if (Authentication.currentUser._id != attr.owner) {
                element.addClass(attr.drClass || 'hidden');
            }
        }
    };
}).directive('showIfOwnerOrAdmin', function (Authentication) {
    return {
        restrict: 'AE',
        link: function link(scope, element, attr) {
            // Takes in Attibute of 'owner'
            // Takes in Attribute 'dr-class' this will be applied
            if (Authentication.currentUser._id != attr.owner && !Authentication.currentUser.isAdmin) {
                element.addClass(attr.drClass || 'hidden');
            }
        }
    };
}).directive('showIfAdmin', function (Authentication) {
    return {
        restrict: 'AE',
        link: function link(scope, element, attr) {
            element.addClass(attr.drClass || 'hidden');
            if (Authentication.currentUser.isAdmin) {
                element.removeClass(attr.drClass || 'hidden');
            }
        }
    };
}).directive('showIfMember', function (Authentication) {
    return {
        restrict: 'E',
        scope: {
            members: '=',
            drClass: '@?'
        },
        link: function link(scope, element, attr) {
            if (scope.members.indexOf(Authentication.currentUser._id) == -1) {
                //                && !Authentication.currentUser.isAdmin
                element.addClass(attr.drClass || 'hidden');
            }
        }
    };
}).directive('hideIfOwner', function (Authentication) {
    return {
        restrict: 'AE',
        scope: {
            owner: '@', // The ID of the owner
            drClass: '@?' // The class to be applied if owner (default is hidden)
        },
        link: function link(scope, element, attr) {
            // Takes in Attibute of 'owner'
            // Takes in Attribute 'dr-class' this will be applied
            if (Authentication.currentUser._id == scope.owner) {
                element.addClass(scope.drClass || 'hidden');
            } else if (!scope.owner) {
                // Error log - Make sure that owner is defined. This function does NOT watch for changes.
                // Therefore owner must be initialised with the ID...
                console.error('Owner is not defined, make sure owner ID exists');
            }
        }
    };
}).directive('authenticate', function (Authentication, AuthenticationModalService) {
    /****************************************************************
    Add this as an attribute and it will authenticate before keypress.
    Option 1: just add [authenticate]
    Option 2: add [authenticate] = true||false
      This method will not allow click actions to be queued.
    ****************************************************************/
    return {
        priority: 100,
        restrict: 'A',
        link: {
            pre: function pre(scope, element, attrs) {
                // Modal Data -------------------------------------
                var data = {
                    title: "1 click to join, it's easy!"
                };
                // Apply conditionally -----------------------------
                // If [authenticate]=? exists
                if (attrs.authenticate) {
                    if (scope.$eval(attrs.authenticate)) {
                        clickBind();
                    }
                    // else, authenticate is false, dont apply
                }
                // else, apply it
                else {
                        clickBind();
                    }
                // Binding function ---------------------------------
                function clickBind() {
                    element.bind('click touchstart', function (e) {
                        // If not logged in
                        if (!Authentication.currentUser.isLoggedIn()) {
                            e.stopImmediatePropagation();
                            e.preventDefault();
                            AuthenticationModalService.login(e, data);
                        }
                        // Else, We run the click
                    });
                }
            }
        }
    };
}).directive('registerForm', function (Authentication) {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/authentication/tpls/register-form.html'
    };
}).service('AuthenticationModalService', function ($mdDialog) {

    this.loginRecruit = function (event) {
        return $mdDialog.show({
            templateUrl: 'app/modules/authentication/tpls/login-recruit-modal.html',
            controller: 'LoginRecruitModalCtrl',
            targetEvent: event,
            clickOutsideToClose: true
        });
    };

    this.login = function (event, data) {
        /*************************************************************
        Use the data object to change display:
        data = {
            title    : 'The title of the modal',
            subtitle : 'The subtitle of the modal',
        }
        *************************************************************/
        return $mdDialog.show({
            templateUrl: 'app/modules/authentication/tpls/login-modal.html',
            controller: 'LoginModalCtrl',
            targetEvent: event,
            locals: { data: data }
        });
    };
    this.loginLocal = function (event) {
        return $mdDialog.show({
            templateUrl: 'app/modules/authentication/tpls/login-local-modal.html',
            controller: 'LoginLocalModalCtrl',
            targetEvent: event
        });
    };
    this.register = function (event) {
        return $mdDialog.show({
            templateUrl: 'app/modules/authentication/tpls/register-modal.html',
            controller: 'RegisterModalCtrl',
            targetEvent: event
        });
    };
    this.linkedinWarn = function (event) {
        return $mdDialog.show({
            templateUrl: 'app/modules/authentication/tpls/linkedin-warn-modal.html',
            controller: 'LinkedinWarnModalCtrl',
            clickOutsideToClose: true,
            targetEvent: event
        });
    };
    this.recoverPassword = function (event) {
        return $mdDialog.show({
            templateUrl: 'app/modules/authentication/tpls/recover-password-modal.html',
            controller: 'RecoverPasswordModalCtrl',
            targetEvent: event
        });
    };
}).controller('LoginModalCtrl', function (data, $scope, $mdDialog, Authentication, AuthenticationModalService, $mdToast) {
    $scope.data = data;
    $scope.authenticate = function (provider) {
        $scope.loading = true;
        Authentication.authenticate(provider).then(function (response) {
            $mdToast.show($mdToast.simple().content('Welcome back, good to see you again :)'));
            $scope.loading = false;
            Authentication.onboardingRedirect();
            $mdDialog.hide();
        }).catch(function (response) {
            $mdToast.show($mdToast.simple().theme('warn').content('We couldn\'t log you in: ' + (response.error || response.data.message || response.data)));
            $scope.loading = false;
        });
    };
    $scope.openRegister = function (event) {
        AuthenticationModalService.register(event);
    };
    $scope.openLoginLocal = function (event) {
        AuthenticationModalService.loginLocal(event);
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}).controller('LoginRecruitModalCtrl', function ($scope, $http, $mdToast, $mdDialog) {
    $scope.signup = {};
    $scope.points = ['Access thousands of Aerospace Engineers', 'Search users by skills, experience and suitability', 'Browse project portfolios', 'Posts jobs to the job board', 'Use the STEMN Applicants Tracking System'];
    $scope.submitSignup = function () {
        if ($scope.SignupForm.$valid) {
            $http({
                method: 'POST',
                url: 'api/v1/mail/companyInquiry',
                data: $scope.signup
            }).then(function () {
                $mdToast.show($mdToast.simple().content('Application successful. We\'ll be in touch in 24h.'));
                $scope.signupFormSuccess = true;
                $mdDialog.hide();
            });
        } else {
            $mdToast.show($mdToast.simple().theme('warn').content('Signup form invalid'));
        }
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}).controller('RegisterModalCtrl', function ($scope, $mdDialog, Authentication, $mdToast, AuthenticationModalService, ReferralsService) {
    $scope.signupFormSubmit = function () {
        if ($scope.RegisterForm.$valid) {
            Authentication.signup({
                firstname: $scope.data.firstname,
                lastname: $scope.data.lastname,
                email: $scope.data.email,
                password: $scope.data.password,
                ref: ReferralsService.getRefCode()
            }).then(function (response) {
                Authentication.onboardingRedirect();
                $mdDialog.hide();
            }).catch(function (response) {
                $mdToast.show($mdToast.simple().theme('warn').content('That didn\'t work..' + response.data.message || response.data));
            });
        }
    };
    $scope.openLogin = function (event) {
        AuthenticationModalService.login(event);
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.back = function (event) {
        AuthenticationModalService.login(event);
    };
}).controller('LoginLocalModalCtrl', function ($scope, $mdDialog, Authentication, $mdToast, AuthenticationModalService) {
    $scope.loginLocal = function () {
        if ($scope.LoginForm.$valid) {
            $scope.loading = true;
            Authentication.login({
                email: $scope.login.email,
                password: $scope.login.password
            }).then(function (response) {
                Authentication.onboardingRedirect();
                $mdToast.show($mdToast.simple().content('Welcome back, good to see you again :)'));
                $mdDialog.hide();
            }).catch(function (response) {
                $scope.loading = false;
                $mdToast.show($mdToast.simple().theme('warn').content('We couldn\'t log you in: ' + (response.error || response.data.message || response.data)));
            });
        }
    };
    $scope.recoverPassword = function (event) {
        AuthenticationModalService.recoverPassword(event);
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.back = function (event) {
        AuthenticationModalService.login(event);
    };
}).controller('LinkedinWarnModalCtrl', function ($scope, $mdDialog, Authentication, $mdToast, AuthenticationModalService) {
    $scope.finish = function (provider) {
        $scope.loading = true;
        Authentication.authenticate('linkedin').then(function (response) {
            $mdToast.show($mdToast.simple().content('You accounts are linked and info imported'));
            $scope.loading = false;
            $mdDialog.hide();
        }).catch(function (response) {
            $mdToast.show($mdToast.simple().theme('warn').content('Couldn\'t do it... ' + response.data.message || response.data));
            $scope.loading = false;
        });
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}).controller('RecoverPasswordModalCtrl', function ($scope, $mdDialog, AuthenticationModalService, $http, $mdToast) {
    $scope.submit = function () {
        //        confirm('This isn\'t working yet. Please email lostpassword@stemn.com and we\'ll help you.')
        $http.post('/api/v1/auth/reset-password', {
            email: $scope.data.email
        }).success(function () {
            $mdToast.show($mdToast.simple().content('Check your email for the password reset link.').hideDelay(6000));
            $mdDialog.hide();
        });
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.back = function (event) {
        AuthenticationModalService.login(event);
    };
}).config(function ($authProvider, $httpProvider) {
    //    $authProvider.httpInterceptor = false; // Don't auto add headers

    $authProvider.facebook({
        url: '/auth/facebook',
        clientId: '710281375734499'
    });

    $authProvider.google({
        url: '/auth/google',
        clientId: '502305750839-8m9aian8ka9qb6j64t3dtjs2nq96tdae.apps.googleusercontent.com',
        scope: 'openid profile email https://www.googleapis.com/auth/drive',
        optionalUrlParams: ['access_type'],
        accessType: 'offline'
    });

    $authProvider.linkedin({
        url: '/auth/linkedin',
        clientId: '75gm1u1gda1xoe',
        scope: ['r_fullprofile', 'r_emailaddress'],
        optionalUrlParams: ['scope']
    });

    $authProvider.oauth2({
        name: 'dropbox',
        url: 'auth/dropbox',
        clientId: '0wgo11dn573805b',
        redirectUri: window.location.origin + '/auth/dropbox',
        authorizationEndpoint: 'https://www.dropbox.com/oauth2/authorize'
    });

    $authProvider.baseUrl = '/api/v1';
    $authProvider.signupRedirect = '';
    $authProvider.loginRedirect = '';
    $authProvider.loginUrl = '/auth/login';
    $authProvider.signupUrl = '/auth/register';
    $authProvider.unlinkUrl = '/auth/unlink';
}).service('Authentication', function ($http, $q, $auth, $window, $rootScope, ReferralsService, UserSubdomainService, FacebookAnalytics, TwitterAnalytics, SettingsService, $state, OnboardingService) {
    var service = this;

    this.currentUser = {
        isLoggedIn: isLoggedIn, // function()
        logout: logout };

    this.login = login; // function(credentials)
    this.signup = signup; // function(user)
    this.authenticate = authenticate; // function(provider)
    this.onboardingRedirect = onboardingRedirect; // function(provider)

    this.getToken = getToken; // function()
    this.setToken = setToken; // function()
    this.authenticateAsUser = authenticateAsUser; // function(userId)

    this.loadUserData = loadUserData; // function()

    /////////////////////////////////////////////////////////

    function login(credentials) {
        var deferred = $q.defer();
        $auth.login(credentials).then(function (response) {
            loadUserData().then(function () {
                analytics.track('Signed Up/In (local)');
                processLogin();
                deferred.resolve(response);
            });
        }).catch(function (response) {
            deferred.reject(response);
        });
        return deferred.promise;
    }

    function signup(user) {
        var deferred = $q.defer();
        $auth.signup(user).then(function (response) {
            loadUserData().then(function () {
                analytics.track('Signed Up/In (local)');
                FacebookAnalytics.track('CompleteRegistration');
                TwitterAnalytics.trackSignup();
                processLogin();
                deferred.resolve(response);
            });
        }).catch(function (response) {
            deferred.reject(response);
        });
        return deferred.promise;
    }

    function authenticate(provider) {
        var deferred = $q.defer();
        $auth.authenticate(provider, { ref: ReferralsService.getRefCode() }).then(function (response) {
            loadUserData().then(function () {
                analytics.track('Signed Up/In (social)');
                FacebookAnalytics.track('CompleteRegistration');
                TwitterAnalytics.trackSignup();
                processLogin();
                deferred.resolve(response);
            });
        }).catch(function (response) {
            deferred.reject(response);
        });
        return deferred.promise;
    }

    function processLogin() {
        $rootScope.$broadcast('authentication.logIn');
        UserSubdomainService.saveUsername(service.currentUser._id);
        analytics.identify(service.currentUser._id, {
            name: service.currentUser.name,
            username: service.currentUser.stub,
            email: service.currentUser.email,
            description: service.currentUser.blurb,
            avatar: 'https://stemn.com' + service.currentUser.picture
        });
    }

    function getToken() {
        return $auth.getToken();
    }

    function setToken(token, redirect) {
        $auth.setToken(token, redirect);
        return loadUserData();
    }

    function loadUserData() {
        var deferred = $q.defer();
        //        var userDataLookup = deferred.promise;

        // load the user's data
        $http.get('/api/v1/me').then(function (response) {
            _.extend(service.currentUser, response.data);
            // Jacksons Gooba database delete prevention warning
            if (response.data.database === 'production') {
                // Make background pink if we are on production
                document.body.style['background-color'] = 'rgba(255, 0, 0, 0.2)';
            }
            deferred.resolve(service.currentUser);
        }).catch(function (response) {
            $auth.removeToken();
            deferred.resolve();
        });

        // load the user's settings
        //        var settingsLookup = {};
        return deferred.promise;
    }

    function isLoggedIn() {
        return !!service.currentUser.name;
    }

    function logout() {
        $auth.logout();
        $rootScope.$broadcast('authentication.logOut');
        //nullify all properties of the current user
        _.each(_.keys(service.currentUser), function (property) {
            if (typeof service.currentUser[property] !== 'function') {
                service.currentUser[property] = undefined;
            }
        });
        service.currentUser.isAdmin = false;
        // Refresh to clear DOM and all data
        $window.location.reload();
    }

    function onboardingRedirect() {
        SettingsService.getSettings().then(function (settings) {
            // If we should do user onboarding
            if (settings.messages.userOnboarding) {
                settings.messages.userOnboarding = false;
                settings.save();
                OnboardingService.goToOnboarding();
            }
            // Othwise all onboarding is done
            else if ($state.includes('app.landing')) {
                    $state.go('app.home');
                }
        });
    }

    function authenticateAsUser(userId) {
        $http({
            method: 'GET',
            url: 'api/v1/auth/token/' + userId
        }).then(function (response) {
            service.setToken(response.data.token, false);
        });
    }
});
'use strict';

angular.module('modules.authentication.permissions', []);
angular.module('modules.authentication.permissions').service('PermissionsService', function ($q, $timeout, $state) {
    var service = this;

    var permissionLevels = {
        public: 1,
        user: 2,
        viewer: 3,
        collaborator: 4,
        admin: 5,
        superAdmin: 6
    };
    this.permissionRedirect = permissionRedirect;

    /////////////////////////////////////////

    function permissionRedirect(data) {
        /********************************************
        data : {
            userdata
            entity
            level
            secret
        }
        ********************************************/

        // Vars
        var userPermissions = {};
        var userInfo;
        var deferred = $q.defer();

        // Get user type
        if (data.entity.team) {
            userInfo = _.find(data.entity.team, function (member) {
                return data.userdata._id === member._id;
            });
        } else if (data.entity.owner && data.userdata._id == data.entity.owner._id) {
            userInfo = { permissions: { role: 'admin' } };
        }

        // Process role
        if (data.userdata && data.userdata.isAdmin) {
            userPermissions.role = 'superAdmin';
        } else if (userInfo && userInfo.permissions && userInfo.permissions.role) {
            userPermissions.role = userInfo.permissions.role;
        } else if (data.entity && data.entity.permissions && data.entity.permissions.secret && data.entity.permissions.secret == data.secret) {
            userPermissions.role = 'viewer';
        } else if (data.userdata && data.userdata._id) {
            userPermissions.role = 'user';
        } else {
            userPermissions.role = 'public';
        }

        // Create user permissions object
        userPermissions.level = permissionLevels[userPermissions.role];
        userPermissions.is = function (role) {
            return userPermissions.role == role;
        };
        userPermissions.isNot = function (role) {
            return userPermissions.role != role;
        };
        userPermissions.isMin = function (role) {
            return userPermissions.level >= permissionLevels[role];
        };
        userPermissions.isMax = function (role) {
            return userPermissions.level <= permissionLevels[role];
        };

        // Setup promise
        if (userPermissions.isMin(data.level)) {
            deferred.resolve(userPermissions);
        } else {
            $timeout(function () {
                $state.go('app.permissions', null, { location: false });
            });
            deferred.reject();
        }
        return deferred.promise;
    }
});
'use strict';

angular.module('modules.banner-header', []);
angular.module('modules.banner-header').directive('bannerheader', function ($window) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            colour: "=",
            text: "@?",
            image: "@?",
            angle: "=?", // 90deg || 0deg etc
            showClose: '=?', // true || false - Shows or hides the close button
            showBlur: '=?', // true || false - Enables Blur on scroll
            showLightbox: '=?' // true || false - Enables lightbox for Image
        },
        link: function link(scope, element, attrs) {
            // Watch the scroll position. Blur the image as scroll occurs
            if (scope.showBlur) {
                var windowEl = angular.element($window);
                var blurOnScroll = function blurOnScroll() {
                    var scrollPosition = windowEl.scrollTop();
                    var opacityVal = scrollPosition / 400;
                    element.css({
                        'opacity': 1,
                        '-webkit-filter': 'blur(' + 20 * opacityVal + 'px)',
                        'filter': 'blur(' + 20 * opacityVal + 'px)'
                    });
                };
                windowEl.on('scroll', scope.$apply.bind(scope, blurOnScroll));
                blurOnScroll();
            }
        },

        controller: function controller($scope) {
            $scope.angle = $scope.angle || '90deg';

            // If showLightbox is true, set the lightbox image src
            if ($scope.showLightbox) {
                $scope.lightboxImage = $scope.image;
            }
        },
        templateUrl: 'app/modules/banner-header/banner-header.html'
    };
}).directive('blurOnScroll', function ($window) {
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            var coeff;
            if (attrs.blurOnScroll) {
                coeff = parseInt(attrs.blurOnScroll);
            } else {
                coeff = 400;
            }
            // Watch the scroll position. Blur the image as scroll occurs
            var windowEl = angular.element($window);
            var blurOnScroll = function blurOnScroll() {
                // Only if window bigger thatn 600px
                if ($window.innerWidth >= 600) {
                    var scrollPosition = windowEl.scrollTop();
                    var opacityVal = scrollPosition / coeff;
                    element.css({
                        'opacity': 1,
                        '-webkit-filter': 'blur(' + 10 * opacityVal + 'px)',
                        'filter': 'blur(' + 10 * opacityVal + 'px)'
                    });
                }
            };
            windowEl.on('scroll', scope.$apply.bind(scope, blurOnScroll));
            blurOnScroll();
        }
    };
}).directive('parralaxOnScroll', function ($window) {
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            var coeff;
            if (attrs.parralaxOnScroll) {
                coeff = parseInt(attrs.parralaxOnScroll);
            } else {
                coeff = 3;
            }
            // Watch the scroll position. Blur the image as scroll occurs
            var windowEl = angular.element($window);
            var blurOnScroll = function blurOnScroll() {
                // Only if window bigger thatn 600px
                if ($window.innerWidth >= 600) {
                    var scrollPosition = windowEl.scrollTop();
                    var val = scrollPosition / coeff;
                    element.css({
                        'transform': 'translateY(' + val + 'px)'
                    });
                }
            };
            windowEl.on('scroll', scope.$apply.bind(scope, blurOnScroll));
            blurOnScroll();
        }
    };
});
'use strict';

angular.module('modules.browser-info', []);
angular.module('modules.browser-info').run(function ($mdDialog, $timeout) {

    // Get browser info
    var browserInfo = get_browser_info();
    if (browserInfo.name == 'IE' || browserInfo.name == 'Opera') {
        $timeout(showBadBrowserModal, 5000);
    }
    // Hoisted functions -----------------------------------------------------------------------------
    function showBadBrowserModal() {
        $mdDialog.show({
            templateUrl: 'app/modules/browser-info/tpls/bad-browser-modal.html',
            controller: function controller(data, $scope) {
                console.log('open');
                $scope.data = data;
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
                $scope.confirm = function () {
                    $mdDialog.cancel();
                };
            },
            locals: { data: browserInfo },
            targetEvent: null
        });
    }

    function get_browser_info() {
        // From http://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser
        var ua = navigator.userAgent,
            tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

        // suport for prerender phantomjs browser
        if (/prerender/i.test(M.input)) {
            return {
                name: 'Prerender'
            };
        }
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return {
                name: 'IE',
                version: tem[1] || ''
            };
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\bOPR\/(\d+)/);
            if (tem != null) {
                return {
                    name: 'Opera',
                    version: tem[1]
                };
            }
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) {
            M.splice(1, 1, tem[1]);
        }
        return {
            name: M[0],
            version: M[1]
        };
    }
});
'use strict';

angular.module('modules.call-to-action', ['ngMaterial']);
angular.module('modules.call-to-action').directive('callToAction', function (callToActionService, ThreadCreateModalService, ProjectCreateModalService, AuthenticationModalService, UsersModalService, NewCreationsService) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            size: '@' // sm || lg
        },
        templateUrl: 'app/modules/call-to-action/tpls/call-to-action.html',
        controller: function controller($scope) {
            getBanner();
            // Get a new banner when we log in (this will make sure there are not logged-out only banners).
            $scope.$on("authentication.logIn", getBanner);
            $scope.$on("authentication.logOut", getBanner);
            $scope.close = function () {
                $scope.hideCta = true;
            };
            // Hoisted  functions -----------------------------
            function getBanner() {
                $scope.banner = callToActionService.getBanner();
            }
        }
    };
}).service('callToActionService', function (Authentication) {
    var service = this;
    this.bannerDetails = {
        b1: {
            templateUrl: 'app/modules/call-to-action/tpls/cta-referrals.html'
        },
        b2: {
            templateUrl: 'app/modules/call-to-action/tpls/cta-map.html'
        },
        b3: {
            templateUrl: 'app/modules/call-to-action/tpls/cta-project.html'
        }
    };
    // Initialise first random banner
    this.numBanners = Object.keys(service.bannerDetails).length; // Get number of banners
    this.bannerIndex = Math.floor(Math.random() * service.numBanners) + 1; // Get a random banner index

    this.getBanner = function () {
        var banner = 'b' + (service.bannerIndex % service.numBanners + 1);
        service.bannerIndex++;
        // If we are logged in, dont show the noAccount banners
        if (service.bannerDetails[banner].noAccount == Authentication.currentUser.isLoggedIn()) {
            return service.getBanner();
        } else {
            return service.bannerDetails[banner];
        }
    };
});
'use strict';

angular.module('modules.cards', []);
angular.module('modules.cards').directive('card', function () {
    return {
        restrict: 'E',
        scope: {
            cardType: '@',
            cardId: '@'
        },
        template: '<div compile="template"></div>',
        controller: function controller($scope) {
            var templates = {
                project: '<creation-card      entity-type="project" entity-id="' + $scope.cardId + '"></creation-card>',
                organisation: '<organisation-card  size="sm" id="' + $scope.cardId + '"></organisation-card>',
                user: '<personcard         size="sm" id="' + $scope.cardId + '"></personcard>',
                field: '<field-card         size="sm" id="' + $scope.cardId + '"></organisation-card>'
            };
            $scope.template = templates[$scope.cardType];
        }
    };
}).directive('creationCard', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            entityId: '@?',
            entity: '=?',
            entityType: '@?',
            size: '@?' // small
        },
        templateUrl: 'app/modules/cards/tpls/creation-card.html',
        controller: function controller($scope, FeedService, CoreLibrary) {
            if ($scope.entityId && $scope.entityType) {
                // Initiate Loading class
                $scope.loading = true;
                FeedService.getFeedItem({
                    _id: $scope.entityId,
                    type: $scope.entityType
                }).then(function (response) {
                    $scope.entity = response;
                    $scope.loading = false;
                    initialise();
                });
            } else {
                initialise();
            }

            ////////////////////
            function initialise() {
                // Get Team
                $scope.team = $scope.entity.team || [$scope.entity.owner];

                // Get Picture
                $scope.picture = getPicture($scope.entity);

                // Get Url
                $scope.url = CoreLibrary.getHref($scope.entity.type, $scope.entity.stub);
            }

            function getPicture(entity) {
                if (!entity.picture) {
                    var field = _.find(entity.fields, 'picture');
                    if (field) {
                        return field.picture;
                    }
                } else {
                    return entity.picture;
                }
            }
        }
    };
}).directive('organisationCard', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            id: '@?',
            entity: '=?',
            size: '@?'
        },
        templateUrl: 'app/modules/cards/tpls/organisation-card.html',
        controller: function controller($scope, Authentication, OrganisationService) {
            if ($scope.id) {
                // Initiate Loading class
                $scope.loading = true;
                OrganisationService.getOrganisation($scope.id).then(function (organisation) {
                    $scope.entity = organisation;
                    // Set loading to false when user has loaded
                    $scope.loading = false;
                });
            }
        }
    };
});
'use strict';

angular.module('modules.carousel', []);
angular.module('modules.carousel').directive('carousel', function () {
    return {
        restrict: 'E',
        scope: {
            slides: '=?', // [{image:''},{image:''}]
            slide: '@?', // imageUrl
            interval: '@' // Timeout between changes
        },
        replace: true,
        transclude: true,
        templateUrl: 'app/modules/carousel/tpls/carousel.html',
        controller: function controller($scope, $interval) {
            $scope.interval = $scope.interval || 7000;
            $scope.activeSlide = 0;
            var counter = 0;

            // If we pass in slide, we just want to display a banner
            if ($scope.slide) {
                $scope.slides = [{
                    image: $scope.slide
                }];
            } else {
                $interval(function () {
                    counter++;
                    $scope.activeSlide = counter % $scope.slides.length;
                }, $scope.interval);
            }
        }
    };
});
'use strict';

angular.module('modules.checklist', []);
angular.module('modules.checklist').directive('checklistItem', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            itemComplete: '=',
            itemHref: '=',
            itemClick: '='
        },
        templateUrl: 'app/modules/checklist/tpls/checklist-item.html'
    };
});
'use strict';

/**
 * Binds a CodeMirror widget to a <textarea> element.
 */
angular.module('ui.codemirror', []).constant('uiCodemirrorConfig', {}).directive('uiCodemirror', uiCodemirrorDirective);

/**
 * @ngInject
 */
function uiCodemirrorDirective($timeout, uiCodemirrorConfig, CodeMirrorService) {

    return {
        restrict: 'EA',
        require: '?ngModel',
        compile: function compile() {
            return postLink;
        }
    };

    function postLink(scope, iElement, iAttrs, ngModel) {
        var codemirrorOptions = angular.extend({
            value: iElement.text()
        }, uiCodemirrorConfig.codemirror || {}, scope.$eval(iAttrs.uiCodemirror), scope.$eval(iAttrs.uiCodemirrorOpts));

        var codemirror = newCodemirrorEditor(iElement, codemirrorOptions);

        configOptionsWatcher(codemirror, iAttrs.uiCodemirror || iAttrs.uiCodemirrorOpts, scope);

        configNgModelLink(codemirror, ngModel, scope);

        configUiRefreshAttribute(codemirror, iAttrs.uiRefresh, scope);

        // Allow access to the CodeMirror instance through a broadcasted event
        // eg: $broadcast('CodeMirror', function(cm){...});
        scope.$on('CodeMirror', function (event, callback) {
            if (angular.isFunction(callback)) {
                callback(codemirror);
            } else {
                throw new Error('the CodeMirror event requires a callback function');
            }
        });

        // onLoad callback
        if (angular.isFunction(codemirrorOptions.onLoad)) {
            codemirrorOptions.onLoad(codemirror);
        }
    }

    function newCodemirrorEditor(iElement, codemirrorOptions) {
        var codemirrot;

        if (iElement[0].tagName === 'TEXTAREA') {
            // Might bug but still ...
            codemirrot = window.CodeMirror.fromTextArea(iElement[0], codemirrorOptions);
        } else {
            iElement.html('');
            codemirrot = new window.CodeMirror(function (cm_el) {
                iElement.append(cm_el);
            }, codemirrorOptions);
        }
        return codemirrot;
    }

    function configOptionsWatcher(codemirrot, uiCodemirrorAttr, scope) {
        if (!uiCodemirrorAttr) {
            return;
        }

        var codemirrorDefaultsKeys = Object.keys(window.CodeMirror.defaults);
        scope.$watch(uiCodemirrorAttr, updateOptions, true);

        function updateOptions(newValues, oldValue) {
            if (!angular.isObject(newValues)) {
                return;
            }
            codemirrorDefaultsKeys.forEach(function (key) {
                if (newValues.hasOwnProperty(key)) {

                    if (oldValue && newValues[key] === oldValue[key]) {
                        return;
                    }

                    codemirrot.setOption(key, newValues[key]);
                }
            });
        }
    }

    function configNgModelLink(codemirror, ngModel, scope) {
        if (!ngModel) {
            return;
        }
        // CodeMirror expects a string, so make sure it gets one.
        // This does not change the model.
        ngModel.$formatters.push(function (value) {
            if (angular.isUndefined(value) || value === null) {
                return '';
            } else if (angular.isObject(value) || angular.isArray(value)) {
                throw new Error('ui-codemirror cannot use an object or an array as a model');
            }
            return value;
        });

        // Override the ngModelController $render method, which is what gets called when the model is updated.
        // This takes care of the synchronizing the codeMirror element with the underlying model, in the case that it is changed by something else.
        ngModel.$render = function () {
            //Code mirror expects a string so make sure it gets one
            //Although the formatter have already done this, it can be possible that another formatter returns undefined (for example the required directive)
            var safeViewValue = ngModel.$viewValue || '';
            codemirror.setValue(safeViewValue);
            $timeout(function () {
                codemirror.refresh();
            });
        };

        // Keep the ngModel in sync with changes from CodeMirror
        codemirror.on('change', function (instance) {
            var newValue = instance.getValue();
            if (newValue !== ngModel.$viewValue) {
                scope.$evalAsync(function () {
                    ngModel.$setViewValue(newValue);
                });
            }
        });
    }

    function configUiRefreshAttribute(codeMirror, uiRefreshAttr, scope) {
        if (!uiRefreshAttr) {
            return;
        }

        scope.$watch(uiRefreshAttr, function (newVal, oldVal) {
            // Skip the initial watch firing
            if (newVal !== oldVal) {
                $timeout(function () {
                    codeMirror.refresh();
                });
            }
        });
    }
}
uiCodemirrorDirective.$inject = ["$timeout", "uiCodemirrorConfig", "CodeMirrorService"];
'use strict';

angular.module('modules.code-mirror', ['ui.codemirror']);
angular.module('modules.code-mirror').directive('cmCodeMode', function (CodeMirrorService) {
    return {
        restrict: 'E',
        scope: {
            mode: '=',
            editor: '='
        },
        templateUrl: 'app/modules/code-mirror/tpls/code-mode.html',
        link: function link(scope, element, attrs) {
            scope.codeModes = [{
                name: 'C, C#, C++',
                path: 'clike'
            }, {
                name: 'Fortran',
                path: 'fortran'
            }, {
                name: 'CSS',
                path: 'css'
            }, {
                name: 'Erlang',
                path: 'erlang'
            }, {
                name: 'Django',
                path: 'django'
            }, {
                name: 'Go',
                path: 'go'
            }, {
                name: 'Haskell',
                path: 'haskell'
            }, {
                name: 'HTML',
                path: 'htmlembedded'
            }, {
                name: 'Javascript',
                path: 'javascript'
            }, {
                name: 'Mathematica',
                path: 'mathematica'
            }, {
                name: 'LaTeX',
                path: 'stex'
            }, {
                name: 'Matlab',
                path: 'octave'
            }, {
                name: 'Perl',
                path: 'perl'
            }, {
                name: 'PHP',
                path: 'php'
            }, {
                name: 'Python',
                path: 'python'
            }, {
                name: 'R',
                path: 'r'
            }, {
                name: 'Ruby',
                path: 'ruby'
            }, {
                name: 'SQL',
                path: 'sql'
            }, {
                name: 'VB',
                path: 'vb'
            }, {
                name: 'XML',
                path: 'xml'
            }];
            scope.changeMode = function (newMode) {
                scope.mode = newMode;
            };
            scope.$watch('mode', function () {
                CodeMirrorService.changeCodeMode(scope.editor, scope.mode);
            });
        }
    };
}).directive('latexInput', function (CodeMirrorService) {
    return {
        restrict: 'E',
        scope: {
            content: '='
        },
        templateUrl: 'app/modules/code-mirror/tpls/latex-input.html',
        controller: function controller($scope) {
            $scope.options = {
                indentWithTabs: true,
                lineWrapping: true,
                dragDrop: false,
                onLoad: function onLoad(cmEditor) {
                    $scope.cmEditor = cmEditor;
                    //                    window.CodeMirror.modeURL = "asfsaffsfs/%N/%N.js";

                    CodeMirrorService.changeCodeMode(cmEditor, 'stex');
                }
            };
        }
    };
}).service('CodeMirrorService', function (LazyLoadingService) {
    //    this.load = load;
    this.changeCodeMode = changeCodeMode;

    ////////////////////////////////

    //    function load(){
    //        return LazyLoadingService.load([{
    //            global : 'CodeMirror',
    //            src    : 'assets/js/codemirror/codemirror-2.min.js'
    //        },{
    //            src    : 'assets/js/codemirror/codemirror.css'
    //        }]).then(function(modules){
    //            return modules[0]
    //        })
    //    }

    function changeCodeMode(cmEditor, mode) {
        if (mode) {
            window.CodeMirror.modeURL = "/assets/js/codemirror/mode/%N/%N.js";
            window.CodeMirror.autoLoadMode(cmEditor, mode);
            cmEditor.setOption("mode", mode);
        }
    }
});
'use strict';

angular.module('modules.compile', []);
angular.module('modules.compile').directive('compileWatch', ['$compile', function ($compile) {
    // Compiles string (like ng-bing-html but runs directives)
    //
    // We pass in a scope as an attribute, the directive will then compile in this scope.
    //
    // http://stackoverflow.com/questions/
    // 17417607/angular-ng-bind-html-unsafe-and-directive-within-it
    return function (scope, element, attrs) {
        scope.$watch(function (scope) {
            // watch the 'compile' expression for changes
            return scope.$eval(attrs.compileWatch);
        }, function (value) {
            // when the 'compile' expression changes
            // assign it into the current DOM
            element.html(value);

            // compile the new DOM and link it to the current
            // scope.
            // NOTE: we only compile .childNodes so that
            // we don't get into infinite loop compiling ourselves

            // We compile scope or 'scope.$eval(attrs.scope)' which is the scope passed in as an attr.
            $compile(element.contents())(scope.$eval(attrs.scope) || scope);
        });
    };
}]).directive('compile', ['$compile', function ($compile) {
    return function (scope, element, attrs) {
        var ensureCompileRunsOnce = scope.$watch(function (scope) {
            // watch the 'compile' expression for changes
            return scope.$eval(attrs.compile);
        }, function (value) {
            // when the 'compile' expression changes
            // assign it into the current DOM
            element.html(value);

            // compile the new DOM and link it to the current
            // scope.
            // NOTE: we only compile .childNodes so that
            // we don't get into infinite loop compiling ourselves
            $compile(element.contents())(scope);

            // Use un-watch feature to ensure compilation happens only once.
            ensureCompileRunsOnce();
        });
    };
}]);
'use strict';

angular.module('modules.components', ['modules.st-multi-select', 'modules.components.fullscreen', 'modules.layout-options', 'modules.animations']);
angular.module('modules.components').directive('loadingDots', function () {
    return {
        restrict: 'E',
        template: '<span class="dot-one">.</span><span class="dot-two">.</span><span class="dot-three">.</span>'
    };
}).directive('sectionColour', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            colour: "@"
        },
        templateUrl: 'app/modules/components/tpls/section-colour.html'
    };
}).directive('backButton', function () {
    return {
        restrict: 'E',
        scope: {
            backState: "@?",
            backFn: '&?'
        },
        templateUrl: 'app/modules/components/tpls/back-button.html',
        controller: function controller($scope, $state) {
            $scope.back = function () {
                if ($scope.backState) {
                    $state.go($scope.backState);
                }
                if ($scope.backFn) {
                    $scope.backFn();
                }
            };
        }
    };
}).

/********************************************************
This will hide/show and panel based on a value.

<collapse-panel show-panel="true||false">
    <span>Toggle Content</span>
</collapse-panel>

********************************************************/
directive('collapsePanel', function () {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            showPanel: '='
        },
        template: '<div class="collapse-panel" ng-show="showPanel" ng-transclude></div>'
    };
}).directive('userInput', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            placeholder: '@?',
            sectionData: '=?',
            saveFn: '&?',
            saveText: '@?',
            status: '=?', // status.active = true || false
            radioDetails: '=?', // {options: [{val:'opt1', title:'Option 1'}], selected: 'selected option'}
            titleText: '@?' // text to be displayed in the title area when editing
        },
        templateUrl: 'app/modules/components/tpls/user-input.html',
        controller: function controller($scope, Authentication, ProjectCreateModalService, ThreadCreateModalService) {
            var $window = angular.element(window);
            $scope.status = $scope.status || {};

            $scope.activate = activate; // function()
            $scope.submit = submit; // function()

            $scope.user = Authentication.currentUser;
            $scope.editorOptions = {
                realtime: false,
                contained: true,
                minimal: false
            };

            $scope.selectedType = 'project';

            // Binds
            $scope.$on('$destroy', unbindClick);
            bindClick();

            ////////////////////////////////////////
            function submit() {
                $scope.saveFn();
            }

            function activate() {
                $scope.status.active = true;
                $scope.$apply();
            }
            function deactivate() {
                $scope.status.active = false;
                $scope.$apply();
            }
            function processClick(event) {
                var element = event.target;
                if (angular.element(element).hasClass('user-input')) {
                    //                    activate();
                    return;
                } else {
                    var parent = angular.element(element).parents('.user-input')[0];
                    if (!parent) {
                        deactivate();
                    } else {
                        //                        activate();
                        return;
                    }
                }
            }
            function bindClick() {
                $window.on('mousedown', processClick);
            }

            function unbindClick() {
                $window.off('mousedown', processClick);
            }
        }
    };
}).directive('settingsButton', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            above: '=?' // true || false - this makes the button above the corner
        },
        templateUrl: 'app/modules/components/tpls/settings-button.html'
    };
}).directive('teamText', function () {
    return {
        restrict: 'EA',
        scope: {
            team: '=',
            limit: '='
        },
        templateUrl: 'app/modules/components/tpls/team-text.html'
    };
}).directive('teamImages', function () {
    return {
        replace: true,
        restrict: 'E',
        scope: {
            team: '=',
            limit: '=',
            link: '@?', // true(default) || false
            showMore: '&?' // showMore team-members click fin
        },
        templateUrl: 'app/modules/components/tpls/team-images.html'
    };
}).directive('organisationImages', function () {
    return {
        replace: true,
        restrict: 'E',
        scope: {
            organisations: '=',
            limit: '='
        },
        templateUrl: 'app/modules/components/tpls/organisation-images.html'
    };
}).directive('userImage', function () {
    return {
        restrict: 'E',
        scope: {
            src: '=?',
            imageId: '@?',
            imageStub: '@?',
            popupFixedBottom: '=' // Fix popup to bottom
        },
        templateUrl: 'app/modules/components/tpls/user-image.html'
    };
}).directive('organisationImage', function () {
    return {
        restrict: 'E',
        scope: {
            src: '=?',
            imageId: '@?',
            imageStub: '@?',
            popupFixedBottom: '=' // Fix popup to bottom
        },
        templateUrl: 'app/modules/components/tpls/organisation-image.html'
    };
}).directive('projectImage', function () {
    return {
        restrict: 'E',
        scope: {
            src: '=?',
            imageId: '@?',
            imageStub: '@?',
            popupFixedBottom: '=' // Fix popup to bottom
        },
        templateUrl: 'app/modules/components/tpls/project-image.html'
    };
}).directive('fieldImage', function () {
    return {
        restrict: 'E',
        scope: {
            src: '=?',
            imageId: '@?',
            imageStub: '@?'
        },
        templateUrl: 'app/modules/components/tpls/field-image.html'
    };
}).directive('collapsedSection', function ($timeout) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            openStatus: '=?',
            height: '@', // The height in collapsed form
            verb: '@' // See || Read etc
        },
        templateUrl: 'app/modules/components/tpls/collapsed-section.html',
        link: function link(scope, element, attrs) {
            $timeout(function () {
                if (element[0].offsetHeight <= scope.height) {
                    scope.disabled = true;
                }
            }, 1);
            scope.$watch('openStatus', function () {
                if (scope.openStatus) {
                    scope.sectionStyles = { 'max-height': '' };
                } else {
                    scope.sectionStyles = { 'max-height': (scope.height || 0) + 'px' };
                }
            });
        }
    };
}).

/************************************************************
Example:
<fat-tabs>
    <a flex ng-click="">Tab</a>
    <a flex ng-click="">Tab</a>
    <a flex ng-click="">Tab</a>
</fat-tabs>
************************************************************/
directive('fatTabs', function () {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'app/modules/components/tpls/fat-tabs.html'
    };
}).

/************************************************************
Example:
<tabs>
    <a flex ng-click="">Tab</a>
    <a flex ng-click="">Tab</a>
    <a flex ng-click="">Tab</a>
</tabs>
************************************************************/
directive('tabs', function () {
    return {
        restrict: 'E',
        scope: {
            selectedTab: '='
        },
        controller: function controller($scope, $element, $timeout) {
            var tabsElements = $element[0].getElementsByTagName('A');

            $timeout(function () {
                _.forEach(tabsElements, function (element) {
                    angular.element(element).bind('click', function () {
                        removeActive(true);
                        addActiveClick(element);
                    });
                });
                addActive();
            }, 1);

            $scope.$watch('selectedTab', function (ov, nv) {
                if (ov != nv) {
                    $timeout(removeActive, 1);
                    $timeout(addActive, 1);
                }
            });

            ////////////////////////

            function removeActive(force) {
                _.forEach(tabsElements, function (element, index) {
                    if (index != $scope.selectedTab || force) {
                        angular.element(element).removeClass('active');
                    }
                });
            }
            function addActive() {
                angular.element(tabsElements[$scope.selectedTab]).addClass('active');
            }
            function addActiveClick(element) {
                angular.element(element).addClass('active');
            }
        }
    };
}).directive('editButton', function () {
    /*****************************************************************************
    This directive sets up the data copy so we can reset.
    It also makes 3 functions available on the form object:
        form.$edit()
        form.$cancel()
        form.$save()
      Notes on use:
    The edit button element MUST be warpped with an element that has .edit-box class.
    This is used to specify the content that is editable.
    Elements inside the .edit-box can be wrapped in .disable-when-edit. This will hide
    them during the edit process (useful for items that are not editable).
      Example:
    <form unsaved-warning-form novalidate name="formName" class="edit-box">
        <edit-button form="formName" inline="true"></edit-button>
        <div class="hide-when-edit">
            <input ng-model="model" name="name" placholder="this will be hidden">
        </div>
        <input ng-model="model" name="name" placholder="this will be shown">
    </form>
      The form can also be actived with $stateParams.
    If the $stateParams.edit = form.$name. Edit will be acivated.
    If the form name is something like 'forms.formName' the stateParam should be just 'formName'
        ******************************************************************************/
    return {
        restrict: 'E',
        scope: {
            form: '=?', // The form controller (this is the form name).
            inline: '=?', // This will enable the Save/Close after edit is selected - Defaults to False
            editFn: '&?', // Edit Function   - run when edit is pressed
            saveFn: '&?', // Save Function   - run when save is pressed
            cancelFn: '&?', // Cancel Function - run when cancel is pressed
            hideEdit: '=?', // Hide Edit button - this is used when the edit is activated using form.$edit externally
            draft: '=?' },
        templateUrl: 'app/modules/components/tpls/edit-button1.html',
        controller: function controller($scope, $rootScope, $element, $timeout, LayoutOptions, $compile, $stateParams, TopBannerService, $q, $state, $location, $document) {
            // Each form input but have a 'name' and 'ng-mode'.
            // These are required to append ng-model to the form controller.
            // This allows us to get the initial form data so we can cancel.
            $scope.form = $scope.form || {};
            var removeActive;
            // This is where the initial form data will be assigned
            var initial = {};

            // Find the nearest edit-box parent
            var editBoxEl = $element.parents('.edit-box');

            // Set up the buttons and overlay element
            var buttonEle;
            var overlayEle;
            var disableTabOverlayEle;
            createButtons();
            createOverlay();

            // Form functions ---------------------------------------------------------
            $scope.form.$edit = function () {
                beginEdit();
                $scope.editFn();
            };
            $scope.form.$save = function () {
                // Wrap save fn in q.when so it always acts like a pronise
                $q.when($scope.saveFn()).then(function (result) {
                    endEdit();
                });
            };
            $scope.form.$cancel = function () {
                $scope.cancelFn();
                reset($scope.form);
                endEdit();
            };
            // DOM Functions ----------------------------------------------------------
            $scope.edit = function () {
                $scope.form.$edit();
            };
            $scope.save = function () {
                $scope.form.$save();
            };
            $scope.cancel = function () {
                $scope.form.$cancel();
            };

            // Nitty Gritty ------------------------------------------------------------
            var beginEdit = function beginEdit() {
                TopBannerService.hideBanner();
                // If inline is true, we show the Save/Close buttons
                if ($scope.inline) {
                    initial = initialise();
                    $timeout.cancel(removeActive);
                    editBoxEl.addClass('active');
                    createDisableTabOverlay();
                    LayoutOptions.overlay.highlight = true; // This is used in the header
                    // If form exists, show it
                    if ($scope.form) {
                        $scope.form.$visible = true;
                    }
                }
            };

            var endEdit = function endEdit() {
                removeDisableTabOverlay();
                LayoutOptions.overlay.highlight = false; // This is used in the header
                // Delay the removal for 0.5s so it does not flash as overlay fades.
                editBoxEl.addClass('remove-active');
                removeActive = $timeout(function () {
                    editBoxEl.removeClass('active remove-active');
                }, 500);

                // Remove any edit params from location
                $state.current.reloadOnSearch = false;
                $location.search('edit', null);
                $timeout(function () {
                    $state.current.reloadOnSearch = undefined;
                });

                // Change back form variables
                $scope.form.$visible = false;
                $scope.form.$setPristine();
            };

            // Temp Edit Data model ----------------------------------------------------
            var reset = function reset(form) {
                if (form) {
                    // Assign the initial models to the form i.e. reset the form
                    // Repeat for each field in the form (each ng-model)
                    _.each(_.keys(formFields(form)), function (property) {
                        // Extend the form with the initial ng-models
                        _.extend(form[property], initial[property]);
                        // Write model to scope
                        form[property].$$writeModelToScope();
                        // Render the new ng-models
                        form[property].$render();
                    });
                    form.$setPristine();
                }
            };

            // Create an initial copy of all the form data
            var initialise = function initialise() {
                return angular.copy(formFields($scope.form));
            };

            // Get the form fields - these are all the ng-models used in the form
            var formFields = function formFields(form) {
                return _.pick(form, _.filter(_.keys($scope.form), function (key) {
                    return !/^\$/.test(key);
                }));
            };

            // State Params activation ------------------------------------------------
            // This will active the form if the $stateParams.edit is the same as the
            // form name.
            // The form name is split at '.' to get the actual name:
            // 'forms.formgroup.formname' becomes 'formname'
            if ($scope.form.$name) {
                var formNameSplit = $scope.form.$name.split('.');
                var formName = formNameSplit[formNameSplit.length - 1];
                if ($stateParams.edit == formName) {
                    $timeout(function () {
                        $document.scrollToElement(editBoxEl, 0, 500);
                    }, 1000);
                    $timeout($scope.form.$edit, 1);
                }
            }

            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                // Remove disabled tab if we change state (in particular, if we go back)
                removeDisableTabOverlay();
            });

            // Create Overlay and Buttons  -------------------------------------------
            function createOverlay() {
                overlayEle = angular.element('<div class="highlight-overlay" ng-show="form.$visible"></div>');
                // Compile the element
                $compile(overlayEle)($scope);
                // Append element to body
                editBoxEl.after(overlayEle);
            }

            // Create the buttons
            function createButtons() {
                buttonEle = angular.element('<div class="form-save" ng-show="form.$visible" attention-animation animate-toggle="{{shakeAnimation}}">' + '<md-button class="md-lower" ng-click="cancel()" style="background-color: rgba(255, 255, 255, 0.75);">Cancel</md-button>' + '<span tip-throbber="{{draft ? \'saveDraft\' : \'\'}}" tip-position="bottom-right" tip-offset-x="10px" tip-offset-y="-8px">' + '<md-button class="md-raised md-accent md-lower" ng-click="save()" ng-disabled="form.$invalid" >' + '{{draft ? "Save Draft" : "Save"}}' + '</md-button>' + '</span>' + '</div>');
                // Compile the element
                $compile(buttonEle)($scope);
                // Append element to body
                editBoxEl.after(buttonEle);
            }

            // Create the overlay the disables tab view
            $scope.disableTabClick = function () {
                $scope.shakeAnimation = !$scope.shakeAnimation;
            };
            function createDisableTabOverlay() {
                disableTabOverlayEle = angular.element('<div class="disable-tab-view-overlay" ng-click="disableTabClick()"></div>');
                // Compile the element
                $compile(disableTabOverlayEle)($scope);
                // Append element to body
                angular.element(document.body).append(disableTabOverlayEle);
            }
            // Remove the buttons
            function removeDisableTabOverlay() {
                if (disableTabOverlayEle) {
                    disableTabOverlayEle.remove();
                }
            }
        }
    };
}).directive('confirm', function ($mdDialog) {
    /******************************************
      This directive will pop a confirm modal.
    It can be modified with [confirm-title] and
    [confirm-body] attributes.
    confirm="false" will do nothing
      ******************************************/
    return {
        priority: 50,
        restrict: 'A',
        link: {
            pre: function pre(scope, element, attrs) {
                // Set the message data
                var data = {};
                data.confirmTitle = attrs.confirmTitle;
                data.confirmBody = attrs.confirmBody;
                data.confirmYes = attrs.confirmYes;
                data.confirmNo = attrs.confirmNo;

                var clickAction = attrs.ngClick || attrs.href;
                element.bind('click touchstart', function (event) {
                    if (attrs.confirm != 'false') {
                        event.stopImmediatePropagation();
                        event.preventDefault();
                        $mdDialog.show({
                            templateUrl: 'app/modules/components/tpls/confirm-modal.html',
                            controller: function controller(data, $scope) {
                                $scope.data = data;
                                $scope.cancel = function () {
                                    $mdDialog.cancel();
                                };
                                $scope.confirm = function () {
                                    $mdDialog.hide();
                                };
                            },
                            locals: { data: data },
                            targetEvent: event
                        }).then(function () {
                            scope.$eval(clickAction);
                        });
                    }
                });
            }
        }
    };
}).directive('bindClick', function ($parse) {
    // Alternative to ng-click, used in md-menu
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            element.bind('click', function (event) {
                var clickFn = $parse(attrs.bindClick)(scope);
                clickFn();
            });
        }
    };
}).

//directive('loadClick', function ($parse) {
//    // Alternative to ng-click, that adds loading to scope
//    return {
//        restrict: 'A',
//        scope: {},
//        link: function(scope, element, attrs){
//            element.bind('click', function (event) {
//                scope.loading = true;
////                $q.all()
////                $parse(attrs.loadClick)(scope).then(function(response){
////                    scope.loading = false;
////                }).catch(function(){
////                    scope.loading = false;
////                })
//            });
//        }
//    };
//}).


directive('ngEnter', function () {
    // <input ng-enter="functionToRun()">
    // This will run the function when enter key is pressed
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
}).directive('focusMe', function ($timeout, $parse) {
    // This function will focus the element when it comes into view
    // <input type="text" focus-me="{{itemVisible}}">
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            attrs.$observe('focusMe', function (val) {
                if (val == 'true') {
                    $timeout(function () {
                        var focusEl,
                            inputEls = element[0].querySelectorAll("input");
                        if (inputEls.length > 0) {
                            focusEl = inputEls[0];
                        } else {
                            focusEl = element;
                        }
                        focusEl.focus();
                    }, 100); // All in timeout so internal contents can render
                }
            });
        }
    };
}).directive('countTo', function ($timeout) {

    /***********************************************************
    This has been modified to look for the 'animated' class
    This class is added by WOW.js.
      It still works without WOW :) -- MAYBE NOT TODO
      Initial code from:
    https://github.com/sparkalow/angular-count-to
    ***********************************************************/

    return {
        replace: false,
        scope: true,
        link: function link(scope, element, attrs) {

            var e = element[0];
            var num, refreshInterval, duration, steps, step, countTo, value, increment;

            var calculate = function calculate() {
                refreshInterval = 30;
                step = 0;
                scope.timoutId = null;
                countTo = parseInt(attrs.countTo) || 0;
                scope.value = parseInt(attrs.value, 10) || 0;
                duration = parseFloat(attrs.duration) * 1000 || 0;

                steps = Math.ceil(duration / refreshInterval);
                increment = (countTo - scope.value) / steps;
                num = scope.value;
            };

            var tick = function tick() {
                scope.timoutId = $timeout(function () {
                    num += increment;
                    step++;
                    if (step >= steps) {
                        $timeout.cancel(scope.timoutId);
                        num = countTo;
                        e.textContent = countTo;
                    } else {
                        e.textContent = Math.round(num);
                        tick();
                    }
                }, refreshInterval);
            };

            var start = function start() {
                if (scope.timoutId) {
                    $timeout.cancel(scope.timoutId);
                }
                calculate();
                tick();
            };

            attrs.$observe('countTo', function (val) {
                if (val) {
                    start();
                }
            });

            //            var classes;
            //            scope.$watch(function () {
            //                classes = attrs.class.split(" ");
            //                console.log(classes)
            //                if (classes.indexOf('wow') != -1) {
            //                    if(classes.indexOf('animated') != -1){
            //                        // If wow has activated
            //                        start();
            //                    }
            //                }else{
            //                    // If we are not using wow
            //                    start();
            //                }
            //            });

            attrs.$observe('value', function (val) {
                start();
            });

            return true;
        }
    };
}).directive('pluralise', function () {
    return {
        restrict: 'A',
        transclude: true,
        scope: {
            number: "@",
            lower: "@?" // Should the S be lower case? True or False
        },
        template: '<span>{{number || \'0\'}} </span><span class="ng-transclude"></span><span ng-if="number!=1 && lower != \'true\'">S</span><span ng-if="number!=1 && lower == \'true\'">s</span>'
    };
}).directive('selectOnClick', function ($window) {
    return {
        restrict: 'A',
        link: function link(scope, element) {
            element.on('click', function () {
                var selection = $window.getSelection();
                var range = document.createRange();
                range.selectNodeContents(element[0]);
                selection.removeAllRanges();
                selection.addRange(range);
            });
        }
    };
}).directive('loadingOverlay', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            determinate: '=?' },
        template: '<div class="loading-overlay" layout="column" layout-align="center center">' + '<md-progress-circular style="margin: 5px 0;" ng-if="!determinate" class="md-accent" md-mode="indeterminate"></md-progress-circular>' + '<md-progress-circular style="margin: 5px 0;" ng-if="determinate"  class="md-accent" md-mode="determinate" value="{{determinate}}"></md-progress-circular>' + '<div class="text-lightgrey" ng-transclude></div>' + '</div>'
    };
}).directive('previewGallery', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            gallery: '=?', // value || if no value we assume indeterminate
            showEdit: '=?',
            saveFn: '&'
        },
        templateUrl: 'app/modules/components/tpls/preview-gallery.html',
        controller: function controller($scope, $timeout, UploadsModalService) {
            $scope.previewIndex = 0;
            $scope.editGallery = function ($event, data) {
                UploadsModalService.uploadImagesNewModal($event, data).then(function (results) {
                    $scope.gallery = results;
                    $timeout($scope.saveFn, 1);
                });
            };
        }
    };
});
'use strict';

angular.module('modules.components.fullscreen', []);
angular.module('modules.components').factory('Fullscreen', function ($document, $rootScope) {
    var document = $document[0];

    // ensure ALLOW_KEYBOARD_INPUT is available and enabled
    var isKeyboardAvailbleOnFullScreen = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element && Element.ALLOW_KEYBOARD_INPUT;

    var emitter = $rootScope.$new();

    // listen event on document instead of element to avoid firefox limitation
    // see https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
    $document.on('fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange', function () {
        emitter.$emit('FBFullscreen.change', serviceInstance.isEnabled());
    });

    var serviceInstance = {
        $on: angular.bind(emitter, emitter.$on),
        all: function all() {
            serviceInstance.enable(document.documentElement);
        },
        enable: function enable(element) {
            if (element.requestFullScreen) {
                element.requestFullScreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                // Safari temporary fix
                if (/Version\/[\d]{1,2}(\.[\d]{1,2}){1}(\.(\d){1,2}){0,1} Safari/.test(navigator.userAgent)) {
                    element.webkitRequestFullscreen();
                } else {
                    element.webkitRequestFullscreen(isKeyboardAvailbleOnFullScreen);
                }
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        },
        cancel: function cancel() {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        },
        isEnabled: function isEnabled() {
            var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
            return fullscreenElement ? true : false;
        },
        toggleAll: function toggleAll() {
            serviceInstance.isEnabled() ? serviceInstance.cancel() : serviceInstance.all();
        },
        isSupported: function isSupported() {
            var docElm = document.documentElement;
            var requestFullscreen = docElm.requestFullScreen || docElm.mozRequestFullScreen || docElm.webkitRequestFullscreen || docElm.msRequestFullscreen;
            return requestFullscreen ? true : false;
        }
    };

    return serviceInstance;
}).directive('fullscreen', function (Fullscreen) {
    return {
        link: function link($scope, $element, $attrs) {
            // Watch for changes on scope if model is provided
            if ($attrs.fullscreen) {
                $scope.$watch($attrs.fullscreen, function (value) {
                    var isEnabled = Fullscreen.isEnabled();
                    if (value && !isEnabled) {
                        Fullscreen.enable($element[0]);
                        $element.addClass('isInFullScreen');
                    } else if (!value && isEnabled) {
                        Fullscreen.cancel();
                        $element.removeClass('isInFullScreen');
                    }
                });

                // Listen on the `FBFullscreen.change`
                // the event will fire when anything changes the fullscreen mode
                var removeFullscreenHandler = Fullscreen.$on('FBFullscreen.change', function (evt, isFullscreenEnabled) {
                    if (!isFullscreenEnabled) {
                        $scope.$evalAsync(function () {
                            $scope.$eval($attrs.fullscreen + '= false');
                            $element.removeClass('isInFullScreen');
                        });
                    }
                });

                $scope.$on('$destroy', function () {
                    removeFullscreenHandler();
                });
            } else {
                if ($attrs.onlyWatchedProperty !== undefined) {
                    return;
                }

                $element.on('click', function (ev) {
                    Fullscreen.enable($element[0]);
                });
            }
        }
    };
});
'use strict';

angular.module('modules.st-multi-select', []);
angular.module('modules.st-multi-select').directive('stSelectOption', function () {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            active: '=',
            ngModel: '=',
            value: '@?'
        },
        templateUrl: 'app/modules/components/st-multi-select/tpls/st-select-option.html',
        controller: function controller($scope) {
            $scope.ngModel = $scope.ngModel || [];
            $scope.active = $scope.ngModel.indexOf($scope.value) != -1;

            $scope.select = function () {
                var index = $scope.ngModel.indexOf($scope.value);
                $scope.active = !$scope.active;
                if (index == -1 && $scope.active) {
                    // If it doesnt exist and it should, add it.
                    $scope.ngModel.push($scope.value);
                } else if (index != -1 && !$scope.active) {
                    // If it shouldnt exist, remove it
                    $scope.ngModel.splice(index, 1);
                }
            };
        }
    };
});
'use strict';

angular.module('modules.contenteditable', []);
angular.module('modules.contenteditable');
//directive('contenteditable', function () {
//    return {
//        restrict: 'A', // only activate on element attribute
//        require: '?ngModel', // get a hold of NgModelController
//        link: function (scope, element, attrs, ngModel) {
//            if (!ngModel) return; // do nothing if no ng-model
//
//            // Specify how UI should be updated
//            ngModel.$render = function () {
//                element.html(ngModel.$viewValue || '');
//            };
//
//            // Listen for change events to enable binding
//            element.on('blur keyup change', function () {
//                scope.$apply(readViewText);
//            });
//
//            // No need to initialize, AngularJS will initialize the text based on ng-model attribute
//
//            // Write data to the model
//            function readViewText() {
//                if(attrs.stripHtml){
//                    console.log(element[0].innerText)
//                    element[0].innerHTML = element[0].innerText;
//                }
//
//                var html = element.html();
//                // When we clear the content editable the browser leaves a <br> behind
//                // If strip-br attribute is provided then we strip this out
//                if (attrs.stripBr && html == '<br>') {
//                    html = '';
//                }
//                ngModel.$setViewValue(html);
//            }
//
//
//            function htmlToPlaintext(text) {
//                return String(text).replace(/<[^>]+>/gm, '');
//            }
//
//        }
//    }
//});
'use strict';

angular.module('modules.contributors', []);
angular.module('modules.contributors').directive('contributors', function () {
    return {
        restrict: 'E',
        scope: {
            parentType: '@', // organisation
            parentId: '@'
        },
        controller: function controller($scope, ContributorsService) {
            $scope.more = more; //function()
            $scope.results = [];

            //////////////////////////////////////

            var page = 1,
                size = 15;
            function more() {
                ContributorsService.getContributors({
                    parentType: $scope.parentType,
                    parentId: $scope.parentId,
                    page: page,
                    size: size
                }).then(function (results) {
                    $scope.results = _.uniq($scope.results.concat(results.data));
                    if (results.data < size) {
                        $scope.loading = true;
                        $scope.noMoreResults = true;
                    } else {
                        page++;
                        $scope.loading = false;
                    }
                });
            }
        },
        templateUrl: 'app/modules/contributors/tpls/contributors.html'
    };
}).service('ContributorsService', function ($http) {
    this.getContributors = getContributors;

    //////////////////////////////////////

    function getContributors(data) {
        return $http({
            url: 'api/v1/contributors',
            method: "GET",
            params: {
                parentType: data.parentType,
                parentId: data.parentId,
                page: data.page,
                size: data.size
            }
        });
    }
});
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

angular.module('modules.core', []);
angular.module('modules.core').service('FunctionLibrary', function () {
    this.isCrawler = function () {
        return (/bot|googlebot|crawler|spider|robot|prerender|crawling/i.test(navigator.userAgent)
        );
    };
}).service('CoreLibrary', function ($state) {
    var service = this;

    // This will return the sref based on an item type and stub
    this.getSref = function (type, stub) {
        if (type == 'project') {
            return 'app.project.overview({"stub" : "' + stub + '"})';
        } else if (type == 'thread' || type == 'discussion' || type == 'question' || type == 'general' || type == 'blog') {
            return 'app.thread({"stub" : "' + stub + '"})';
        } else if (type == 'user') {
            return 'app.user.profile({"stub" : "' + stub + '"})';
        } else if (type == 'organisation') {
            return 'app.organisation.overview({"stub" : "' + stub + '"})';
        } else if (type == 'field') {
            return 'app.field.top({"stub" : "' + stub + '"})';
        } else if (type == 'job') {
            return 'app.job({"stub" : "' + stub + '"})';
        }
    };
    // This will return the base sref based on an item type
    this.getSrefBase = function (type) {
        if (type == 'project') {
            return 'app.project.overview';
        } else if (type == 'thread' || type == 'discussion' || type == 'question' || type == 'general' || type == 'blog') {
            return 'app.thread';
        } else if (type == 'user') {
            return 'app.user.profile';
        } else if (type == 'organisation') {
            return 'app.organisation.overview';
        } else if (type == 'field') {
            return 'app.field.top';
        } else if (type == 'job') {
            return 'app.job';
        }
    };
    // This will return the base sref based on an item type
    this.getHref = function (type, stub) {
        if (type == 'project') {
            return 'projects/' + stub;
        } else if (type == 'thread' || type == 'discussion' || type == 'question' || type == 'general') {
            return 'threads/' + stub;
        } else if (type == 'blog') {
            return 'blogs/' + stub;
        } else if (type == 'user') {
            return 'users/' + stub;
        } else if (type == 'organisation') {
            return 'org/' + stub;
        } else if (type == 'field') {
            return 'fields/' + stub;
        } else if (type == 'job') {
            return 'jobs/' + stub;
        } else if (type == 'application') {
            return 'applications/' + stub;
        }
    };
    this.getAltType = function (type) {
        if (type == 'project') {
            return 'project';
        } else if (type == 'thread') {
            return 'thread';
        } else if (type == 'blog') {
            return 'blog';
        } else if (type == 'question') {
            return 'question';
        } else if (type == 'general') {
            return 'discussion';
        }
    };

    this.getUuid = function () {
        var possible = 'abcdef0123456789abcdef0123456789';
        return _.sample(possible, 24).join('');
    };

    this.getRandomString = function (num) {
        var possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
        return _.sample(possible, num || 30).join('');
    };

    this.keyCodes = {
        BACKSPACE: 8,
        TABKEY: 9,
        RETURNKEY: 13,
        ESCAPE: 27,
        SPACEBAR: 32,
        LEFTARROW: 37,
        UPARROW: 38,
        RIGHTARROW: 39,
        DOWNARROW: 40
    };

    this.stubify = function (name) {
        return name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9\-]+/g, '');
    };

    this.stringTruncate = function (string, limit) {
        var bits, i;
        bits = string.split('');
        if (bits.length > limit) {
            for (i = bits.length - 1; i > -1; --i) {
                if (i > limit) {
                    bits.length = i;
                } else if (' ' === bits[i]) {
                    bits.length = i;
                    break;
                }
            }
            bits.push('...');
        }
        return bits.join('');
    };

    this.pluralise = function (number, thing) {
        // takes in thing(singular)
        // adds an 's' if 0 || > 1, adds 'ies' if ends in 'y'

        // Special Cases
        if (thing == 'People') {
            if (number == 1) {
                return number + ' Person';
            } else {
                return number + ' People';
            }
        }
        // Normal cases
        var lastLetter = thing[thing.length];
        if (number == 1) {
            return number + ' ' + thing;
        } else {
            if (lastLetter == 'y') {
                return number + ' ' + thing.substring(0, thing.length - 1) + 'ies';
            } else {
                return number + ' ' + thing + 's';
            }
        }
    };

    this.capitalizeFirstLetter = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    this.getCurrentTab = function (tabs) {
        var tabSrefArray = _.map(tabs, 'sref');
        var currentState = $state.current.name.replace("app.", "");

        var currentTab;
        // check if the current state exists in the tab array
        _.forEach(tabSrefArray, function (tab, index) {
            var tabIndex = tab.indexOf(currentState);
            if (tabIndex !== -1) {
                currentTab = index;
            }
        });
        // if it doesn't exist, check to see if a substate exists
        if (!(currentTab >= 0)) {
            _.forEach(tabSrefArray, function (tab, index) {
                var tabIndex = tab.indexOf(currentState.substring(0, currentState.lastIndexOf('.')));
                if (tabIndex !== -1) {
                    currentTab = index;
                }
            });
        }
        return currentTab;
    };

    this.isObjectId = function (objectId) {
        return (/^[a-f0-9]{24}$/.test(objectId)
        );
    };

    this.compactObject = function (object) {
        _.each(object, function (value, key) {
            if (!value) {
                delete object[key];
            }
        });
        return object;
    };

    this.assignArray = function (assignArray, resultsArray, uniqueKey) {
        // This function will overwrite the 'assignArray' with the 'resultsArray'
        // This is done my mapping the array of objects using the 'uniqueKey'
        var oldUniqueArray = _.map(assignArray, uniqueKey);
        var newUniqueArray = _.map(resultsArray, uniqueKey);
        // Add the new items
        resultsArray.forEach(function (result) {
            var oldIndex = oldUniqueArray.indexOf(result[uniqueKey]);
            // If the does not exist in the assignArray, add it
            if (oldIndex == -1) {
                assignArray.splice(oldIndex, 0, result);
            }
        });
        // Find and Remove the old items
        var itemsToRemove = [];
        assignArray.forEach(function (result, index) {
            var newIndex = newUniqueArray.indexOf(result[uniqueKey]);
            // If the old result does not exist in the resultsArray, remove it
            if (newIndex == -1) {
                itemsToRemove.push(index);
            }
        });
        // Remove them
        _.forEachRight(itemsToRemove, function (index) {
            assignArray.splice(index, 1);
        });
    };

    this.groupByKey = function (initialArray, key) {
        // This will turn an array into an object of arrays, grouped by a key
        return _.reduce(initialArray, function (resultHash, result) {
            var resultType = result[key];
            if (resultHash[resultType]) {
                resultHash[resultType].push(result);
            } else {
                resultHash[resultType] = [result];
            }
            return resultHash;
        }, {});
    };

    this.uniqueArray = function (array, key) {
        var existingIds = [];
        // If the key's value is non-unique, remove it
        _.forEachRight(array, function (item, index) {
            if (existingIds.indexOf(item[key]) != -1) {
                array.splice(index, 1);
            }
            existingIds.push(item[key]);
        });
    };

    this.checkStateParents = function (stateDetailed, checkParam) {
        // This will recursively inspect the $state to find the first state/parent with the check param.
        // It will also get the properties on the parent state if they do not exist on the child
        var params = {};
        getParamFromParents(stateDetailed, checkParam);
        return params;

        ///////////////////////

        function getParamFromParents(stateDetailed, checkParam) {
            // If the Param exists
            if (stateDetailed.self[checkParam]) {
                if (stateDetailed.self[checkParam] !== null && _typeof(stateDetailed.self[checkParam]) === 'object') {
                    // If isObject
                    _.forEach(stateDetailed.self[checkParam], function (value, key) {
                        if (params[key] === undefined) {
                            params[key] = value;
                        } // If the key does not exist, assign it
                    });
                    getParamFromParents(stateDetailed.parent, checkParam);
                }
                // If it is not an object, we assign
                else {
                        params = stateDetailed.self[checkParam];
                    }
            }
            // Else, we check the parent
            else if (stateDetailed.parent) {
                    getParamFromParents(stateDetailed.parent, checkParam);
                }
        }
    };

    this.getDateFromId = function (id) {
        return new Date(parseInt(id.toString().substring(0, 8), 16) * 1000);
    };

    this.checkStateParentsSeo = function (stateDetailed, checkParam, checkSubParam, resolve) {
        // This will recursively inspect the $state to find the first state/parent with the check param
        if (!stateDetailed) {
            // Give up
            return;
        } else if (stateDetailed.self[checkParam]) {
            return seoList(stateDetailed.self[checkParam](resolve), checkSubParam);
        } else {
            return service.checkStateParentsSeo(stateDetailed.parent, checkParam, checkSubParam, resolve);
        }

        function seoList(params, checkSubParam) {
            if (params[checkSubParam]) {
                return params[checkSubParam];
            } else {
                return service.checkStateParentsSeo(stateDetailed.parent, checkParam, checkSubParam, resolve);
            }
        }
    };

    this.getCurrencies = function () {
        var currencies = {
            USD: {
                code: 'USD',
                symbol: '$',
                name: 'USD - $',
                rate: 1
            },
            EUR: {
                code: 'EUR',
                symbol: '€',
                name: 'EUR - €',
                rate: 1.09
            },
            JPY: {
                code: 'JPY',
                symbol: '¥',
                name: 'JPY - ¥',
                rate: 0.0084
            },
            GBP: {
                code: 'GBP',
                symbol: '£',
                name: 'GBP - £',
                rate: 1.42
            },
            AUD: {
                code: 'AUD',
                symbol: 'AUD$',
                name: 'AUD - $',
                rate: 0.7
            },
            CHF: {
                code: 'CHF',
                symbol: 'CHF',
                name: 'CHF',
                rate: 0.98
            },
            CAD: {
                code: 'CAD',
                symbol: 'CAD$',
                name: 'CAD - $',
                rate: 0.71
            },
            MXN: {
                code: 'MXN',
                symbol: 'MXN$',
                name: 'MXN - $',
                rate: 0.054
            },
            CNY: {
                code: 'CNY',
                symbol: 'CNY¥',
                name: 'CNY - ¥',
                rate: 0.15
            },
            NZD: {
                code: 'NZD',
                symbol: 'NZD$',
                name: 'NZD - $',
                rate: 0.64
            },
            INR: {
                code: 'INR',
                symbol: '₹',
                name: 'INR - ₹',
                rate: 0.015
            }
        };
        return currencies;
    };
}).service('CoreModalService', function ($mdDialog) {
    this.showEntity = showEntity;

    ///////////////////////////////////////////

    function showEntity(event, data, options) {
        /****************************************************
        options: {
            title : 'modal title'
        }
        ****************************************************/
        if (data.length > 0) {
            $mdDialog.show({
                templateUrl: 'app/modules/core/tpls/core-entity-modal.html',
                controller: function controller($scope) {
                    $scope.enitities = data;
                    $scope.options = options;
                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };
                },
                targetEvent: event,
                clickOutsideToClose: true
            });
        }
    }
}).directive('setEntityHref', function ($parse, CoreLibrary) {
    /****************************************************
    This will add the entity href based on the type and stub
      Example:
    <a set-entity-href="data.type" entity-stub="data.stub"></a>
      Inputs:
    set-entity-href: var - parses this in scope
    entity-stub:     var - parses this in scope (use 'type' if string is needed)
    ****************************************************/
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            var entityType = $parse(attrs.setEntityHref)(scope);
            var entityStub = $parse(attrs.entityStub)(scope);
            var href = CoreLibrary.getHref(entityType, entityStub);
            element.attr('href', href);
        }
    };
}).service('EntityService', function (LocalCache, HttpService, $mdToast, ModularEditorService) {
    this.get = get; // function(jobId)
    this.create = create; // function(job)
    this.update = update; // function(job)
    this.remove = remove; // function(jobId)

    this.updateSuccess = updateSuccess; // function()

    //////////////////////////////////////////


    function get(entityType, stubOrId, select) {
        var endpoint = parseEntityType(entityType);
        var selectSm = ['stub', 'name', 'picture', 'blurb', 'permissions', 'team'];
        var selectSmPost = ['stub', 'name', 'picture', 'owner'];
        var selectSmJob = ['stub', 'name', 'organisations'];
        var selectMd = ['stub', 'name', 'picture', 'blurb', 'created', 'updated', 'fields', 'organisations', 'team', 'likes', 'numComments', 'location'];
        var selectLg = ['*'];

        // Default the selectFields
        var selectFields;
        if (select == 'sm') {
            if (endpoint == 'posts') {
                selectFields = selectSmPost;
            } else if (endpoint == 'jobs') {
                selectFields = selectSmJob;
            } else {
                selectFields = selectSm;
            }
        } else if (select == 'md') {
            selectFields = selectMd;
        } else {
            selectFields = selectLg;
            select = 'lg';
        }

        var getPromise = function getPromise(data) {
            // data - [XXXXXXXXXXXXXXXXXXXXXXX, XXXXXXXXXXXXXXXXXXXXXXX] - Array of entity ids
            return HttpService({
                url: '/api/v1/' + endpoint,
                method: "GET",
                params: {
                    'select[]': selectFields,
                    'ids[]': data
                }
            });
        };
        return LocalCache.getPackaged(endpoint + select, stubOrId, getPromise);
    }

    function create(entityType, entity) {
        var endpoint = parseEntityType(entityType);
        return HttpService({
            method: 'POST',
            url: 'api/v1/' + endpoint,
            data: entity
        });
    }

    function update(entityType, entity) {
        var endpoint = parseEntityType(entityType);
        LocalCache.save(endpoint + 'lg', entity);

        // Clone the entity
        var cloneEntity = _.clone(entity, true);

        // Remove the section elements
        if (cloneEntity.sectionData && cloneEntity.sectionData.sections) {
            ModularEditorService.stripSectionsDomElements(cloneEntity.sectionData.sections);
        }

        // Remove the posts
        if (cloneEntity.posts) {
            cloneEntity.posts = undefined;
        }

        // Send it
        return HttpService({
            method: 'PUT',
            url: 'api/v1/' + endpoint + '/' + entity._id,
            data: cloneEntity
        });
    }

    function remove(entityType, entityId) {
        var endpoint = parseEntityType(entityType);
        return HttpService({
            url: '/api/v1/' + endpoint + '/' + entityId,
            method: "DELETE"
        });
    }

    function parseEntityType(entityType) {
        var endpoint;
        if (entityType == 'jobs' || entityType == 'job') {
            endpoint = 'jobs';
        } else if (entityType == 'applications' || entityType == 'application') {
            endpoint = 'applications';
        } else if (entityType == 'users' || entityType == 'user') {
            endpoint = 'users';
        } else if (entityType == 'organisations' || entityType == 'organisation') {
            endpoint = 'organisations';
        } else if (entityType == 'projects' || entityType == 'project') {
            endpoint = 'projects';
        } else if (entityType == 'threads' || entityType == 'thread') {
            endpoint = 'threads';
        } else if (entityType == 'fields' || entityType == 'field') {
            endpoint = 'fields';
        } else if (entityType == 'posts' || entityType == 'post') {
            endpoint = 'posts';
        } else {
            console.error('Invalid Entity Type');
        }
        return endpoint;
    }

    function updateSuccess() {
        $mdToast.show($mdToast.simple().content('Save Successful'));
    }
});
'use strict';

angular.module('modules.development.digest-hud', ['digestHud']);

angular.module('modules.development.digest-hud').config(function (digestHudProvider) {
    digestHudProvider.enable();
    // Optional configuration settings:
    digestHudProvider.setHudPosition('top right'); // setup hud position on the page: top right, bottom left, etc. corner
    digestHudProvider.numTopWatches = 20; // number of items to display in detailed table
    digestHudProvider.numDigestStats = 25; // number of most recent digests to use for min/med/max stats
});
'use strict';

angular.module('modules.scroll.vertical-nav', []);
angular.module('modules.scroll.vertical-nav').directive('verticalNav', function () {
    return {
        restrict: 'E',
        scope: {
            menu: '='
        },

        /****************************
          $scope.menu = [
            {
                id    : 'stemn',
                name  : 'Welcome',
                color : 'light'
            },{
                id    : 'editor',
                name  : 'Workspace',
                color : 'dark'
            },{
                id    : 'portfolio',
                name  : 'Scientific Identity',
                color : 'light'
            },{
                id    : 'network',
                name  : 'Network',
                color : 'light'
            },        {
                id    : 'maps',
                name  : 'Map',
                color : 'light'
            },{
                id    : 'story',
                name  : 'Ready?',
                color : 'light'
            }
        ]
          ****************************/
        templateUrl: 'app/modules/scroll/vertical-nav/vertical-nav.html',
        controller: function controller($scope, $rootScope, $window) {
            $rootScope.$on('duScrollspy:becameActive', function ($event, $element, $target) {
                var menuId = $element[0].getAttribute('du-scrollspy');
                $scope.activeIndex = _.findIndex($scope.menu, 'id', menuId);
                $scope.halfWindowHeight = $window.innerHeight / 2;
                $scope.$apply();
            });
        }
    };
});
'use strict';

angular.module('modules.dynamic-footer', ['modules.compile']);
angular.module('modules.dynamic-footer').run(function ($rootScope, $dynamicFooter, $timeout) {
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        // Split the state.name to find substates, for example: app.user.projects
        var toStates = toState.name.split(".");
        var fromStates = fromState.name.split(".");
        // Compare the first substate, if it has changed, we close the footer
        if (toStates[1] != fromStates[1]) {
            $dynamicFooter.open = false;
        }
    });
}).directive('dynamicFooter', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {},
        templateUrl: 'app/modules/dynamic-footer/tpls/dynamic-footer.html',
        controller: function controller($scope, $dynamicFooter) {
            $scope.$dynamicFooter = $dynamicFooter;
            $scope.$dynamicFooter.open = true;
        }
        // Content is passed into the dynamic footer with all formatting.
        // This should be done with a directive that has replace = true.
    };
}).directive('entityFooter', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            showEdit: '=',
            userCanEdit: '=',
            entity: '=',
            publishFn: '&',
            editFn: '&'
        },
        templateUrl: 'app/modules/dynamic-footer/tpls/entity-footer.html',
        controller: function controller($scope, CoreLibrary) {
            if ($scope.entity.type == 'project') {
                $scope.confirmBody = 'You should add as many relevant tags as possible. If you dont, your project will be difficult to find and will not reach an appropriate audience. <br><a class="text-green" href="/projects/' + $scope.entity.stub + '?edit=ProjectMainForm#tagsEdit">Add tags now.</a>';
            } else if ($scope.entity.type == 'blog') {
                $scope.confirmBody = 'You should add as many relevant tags as possible. If you dont, your update will be difficult to find and will not reach an appropriate audience. <br><a class="text-green" href="/blogs/' + $scope.entity.stub + '?edit=BlogForm#tagsEdit">Add tags now.</a>';
            } else {
                $scope.confirmBody = 'You should add as many relevant tags as possible. If you dont, your thread will be difficult to find and will not reach an appropriate audience. <br><a class="text-green" href="/threads/' + $scope.entity.stub + '?edit=ThreadForm#tagsEdit">Add tags now.</a>';
            }
            $scope.altType = CoreLibrary.getAltType($scope.entity.type);
            $scope.togglePublicView = togglePublicView; // function()

            //////////////////////////////////////////////

            function togglePublicView() {
                $scope.showEdit = !$scope.showEdit;
            }
        }
    };
}).directive('hideFooterWhenVisible', function ($window, $dynamicFooter) {
    /******************************************************************
    This directive will hide the footer when you scroll past an element
    with [hide-footer-when-visible]
    
    [hide-footer-when-visible] = false - This will prevent any action
    
    ******************************************************************/
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            var windowEl = angular.element($window);

            var handler = function handler() {
                if (attrs.hideFooterWhenVisible != 'false') {
                    var eleOffsetTop = element.offset().top;
                    // If the element is in ng-hide then eleOffsetTop will equal $window.scrollY;
                    if (eleOffsetTop !== 0 && eleOffsetTop !== $window.scrollY) {
                        if ($window.scrollY <= eleOffsetTop - $window.innerHeight) {
                            $dynamicFooter.open = true;
                        }
                        // If the window is small, the element will always be visible. Show in this case
                        else if (eleOffsetTop <= $window.innerHeight) {
                                $dynamicFooter.open = true;
                            } else {
                                $dynamicFooter.open = false;
                            }
                    } else {
                        // Else the element is hidden
                        $dynamicFooter.open = true;
                    }
                }
            };
            //			windowEl.on('scroll', scope.$apply.bind(scope, handler));
            handler();
            windowEl.on('scroll', handler);

            // Unbind on destroy
            scope.$on('$destroy', function () {
                windowEl.off('scroll', handler);
            });
        }
    };
}).service('$dynamicFooter', function () {
    return {
        open: true,
        enabled: true,
        content: '', // Content
        scope: '' // Scope to compile the content in
    };
});
'use strict';

angular.module('modules.easter-eggs', []);
angular.module('modules.easter-eggs').run(function ($compile, $rootScope) {
    /*
     * Konami-JS ~
     * :: Now with support for touch events and multiple instances for
     * :: those situations that call for multiple easter eggs!
     * Code: http://konami-js.googlecode.com/
     * Examples: http://www.snaptortoise.com/konami-js
     * Copyright (c) 2009 George Mandis (georgemandis.com, snaptortoise.com)
     * Version: 1.4.2 (9/2/2013)
     * Licensed under the MIT License (http://opensource.org/licenses/MIT)
     * Tested in: Safari 4+, Google Chrome 4+, Firefox 3+, IE7+, Mobile Safari 2.2.1 and Dolphin Browser
     */

    var Konami = function Konami(callback) {
        var konami = {
            addEvent: function addEvent(obj, type, fn, ref_obj) {
                if (obj.addEventListener) obj.addEventListener(type, fn, false);else if (obj.attachEvent) {
                    // IE
                    obj["e" + type + fn] = fn;
                    obj[type + fn] = function () {
                        obj["e" + type + fn](window.event, ref_obj);
                    };
                    obj.attachEvent("on" + type, obj[type + fn]);
                }
            },
            input: "",
            pattern: "38384040373937396665",
            load: function load(link) {
                this.addEvent(document, "keydown", function (e, ref_obj) {
                    if (ref_obj) konami = ref_obj; // IE
                    //                    konami.input += e ? e.keyCode : event.keyCode;
                    konami.input += e ? e.keyCode : ''; // Removed event.keyCode (hopefully this fixes mobile)
                    if (konami.input.length > konami.pattern.length) konami.input = konami.input.substr(konami.input.length - konami.pattern.length);
                    if (konami.input == konami.pattern) {
                        konami.code(link);
                        konami.input = "";
                        e.preventDefault();
                        return false;
                    }
                }, this);
            },
            code: function code(link) {
                window.location = link;
            }
        };

        typeof callback === "string" && konami.load(callback);
        if (typeof callback === "function") {
            konami.code = callback;
            konami.load();
        }

        return konami;
    };

    // Run the code -------------------------------------------------------------
    var easter_egg = new Konami(function () {
        alert('You know your Konami well...');

        var eggTpl = angular.element('<egg id="egg"></egg>');
        // Compile the popup element
        $compile(eggTpl)($rootScope);
        // Add to body
        angular.element(document.body).append(eggTpl);
    });
}).directive('egg', function ($window, $timeout) {
    /*****************************************
    Make sure to pass in an id on the element
    <particles id="stars-1"></particles>
    /****************************************/
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="egg">' + '<md-button class="md-icon-button close-btn" ng-click="closeEgg()"><md-icon md-svg-icon="navigation:close"></md-icon></md-button>' + '<audio autoplay><source src="/assets/images/eggs/sagan.mp3" type="audio/mpeg"></audio>' + '<p class="message">Nice work! You\'ve found Tiffany\'s secret.</p>' + '</div>',
        link: function link(scope, element, attrs, fn) {
            $timeout(function () {
                $window.particlesJS(attrs.id, options);
            }, 100);
            scope.closeEgg = function () {
                element.remove();
            };

            var options = {
                "particles": {
                    "number": {
                        "value": 150,
                        "density": {
                            "enable": false,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": "#ffffff"
                    },
                    "shape": {
                        "type": "star",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 5
                        }
                    },
                    "opacity": {
                        "value": 0.5,
                        "random": false,
                        "anim": {
                            "enable": false,
                            "speed": 1,
                            "opacity_min": 0.1,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": 4,
                        "random": true,
                        "anim": {
                            "enable": false,
                            "speed": 40,
                            "size_min": 0.1,
                            "sync": false
                        }
                    },
                    "line_linked": {
                        "enable": false,
                        "distance": 150,
                        "color": "#ffffff",
                        "opacity": 0.4,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 14,
                        "direction": "left",
                        "random": false,
                        "straight": true,
                        "out_mode": "out",
                        "bounce": false,
                        "attract": {
                            "enable": false,
                            "rotateX": 600,
                            "rotateY": 1200
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "bubble"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "repulse"
                        },
                        "resize": true
                    },
                    "modes": {
                        "grab": {
                            "distance": 200,
                            "line_linked": {
                                "opacity": 1
                            }
                        },
                        "bubble": {
                            "distance": 200,
                            "size": 5,
                            "duration": 2,
                            "opacity": 8,
                            "speed": 3
                        },
                        "repulse": {
                            "distance": 200,
                            "duration": 0.4
                        }
                    }
                },
                "retina_detect": true
            };
        }
    };
});
'use strict';

angular.module('modules.edit-toolbar', []);
angular.module('modules.edit-toolbar').directive('editToolbar', function () {
    // This will run the function when Ctrl+Enter is pressed on the element
    return {
        restrict: 'A',
        scope: {
            saveFn: '&?',
            editFn: '&?',
            endEditFn: '&?',
            data: '=?' },
        controller: function controller($scope, $element, $compile, $dynamicFooter, $q, $stateParams, $timeout, $state, $location, TopBannerService, LayoutOptions) {
            $scope.form = $element.inheritedData('$formController');
            $scope.form.$edit = edit;
            $scope.form.$cancel = cancel;
            $scope.form.$save = save;
            $scope.form.$endEdit = endEdit; // like cancel but no data revert
            //			$scope.$on('$destroy', onDestroy);

            ////////////////////////////////////////////////

            var initialFormData, loadingOverlayEl; // Copy of the data inital data fields

            function edit() {
                LayoutOptions.overlay.loading = true;
                // Run the edit function (this often a $state.go function for multi-tab pages)
                $scope.editFn();
                // This is in a timeout so the loading overlay show before the laggy display re-render
                $timeout(function () {
                    $scope.form.$visible = true;
                    $dynamicFooter.enabled = false;
                    initialFormData = _.clone($scope.data, true);
                    $element.addClass('edit-active');
                    TopBannerService.hideBanner();
                    // Timeout remove overlay so it happens after re-render
                    $timeout(function () {
                        LayoutOptions.overlay.loading = false;
                    }, 0);
                }, 0);
            }

            function cancel() {
                formReset();
                endEdit();
            }

            function save() {
                $q.when($scope.saveFn()).then(function (result) {
                    endEdit();
                });
            }

            function endEdit() {
                LayoutOptions.overlay.loading = true;
                $timeout(function () {
                    $scope.form.$visible = false;
                    $dynamicFooter.enabled = true;
                    $element.removeClass('edit-active');
                    $scope.form.$setPristine();
                    // Remove any edit params from location
                    $state.current.reloadOnSearch = false;
                    $location.search('edit', null);
                    $scope.endEditFn();
                    $timeout(function () {
                        $state.current.reloadOnSearch = undefined;
                    });
                    $timeout(function () {
                        LayoutOptions.overlay.loading = false;
                    }, 0);
                }, 0);
            }

            function onDestroy() {
                endEdit();
            }

            function formReset() {
                $scope.data = initialFormData;
            }

            // State Params activation ------------------------------------------------
            // This will active the form if the $stateParams.edit is the same as the
            // form name.
            // The form name is split at '.' to get the actual name:
            // 'forms.formgroup.formname' becomes 'formname'
            $timeout(function () {
                var formNameSplit = $scope.form.$name.split('.');
                var formName = formNameSplit[formNameSplit.length - 1];
                if ($stateParams.edit == formName) {
                    $scope.form.$edit();
                }
            });
        }
    };
}).directive('saveButton', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            entity: '=',
            saveFn: '&',
            buttonClass: '@'
        },
        templateUrl: 'app/modules/edit-toolbar/tpls/save-button.html',
        controller: function controller($scope, $interval, XxhashService) {

            var currentHash, previousHash;
            $scope.save = save; //function()
            $scope.status = 'unsaved';

            $interval(checkForChange, 1000);

            function checkForChange() {
                var entity = _.clone($scope.entity, true);
                if (entity.sectionData) {
                    entity.sectionData.sections = _.map(entity.sectionData.sections, function (section) {
                        return { content: section.content };
                    });
                }
                currentHash = XxhashService(JSON.stringify(entity), 0xABCD).toString();
                if (currentHash != previousHash) {
                    $scope.status = 'unsaved';
                } else {
                    $scope.status = 'saved';
                }
            }

            function save() {
                previousHash = currentHash;
                $scope.status = 'saving';
                $scope.saveFn().then(function (response) {
                    $scope.status = 'saved';
                });
            }
        }
    };
}).directive('editToolbar', function () {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'app/modules/edit-toolbar/tpls/edit-toolbar.html'
    };
});
'use strict';

angular.module('modules.editor', ['modules.uploads', 'modules.edit-toolbar']);
angular.module('modules.editor').service('EditorModalService', function ($mdDialog) {
    this.insertLink = function (event, link) {
        return $mdDialog.show({
            templateUrl: 'app/modules/editor/tpls/insert-link-modal.html',
            controller: function controller(link, $scope) {
                $scope.link = angular.copy(link);
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
                $scope.save = function () {
                    if ($scope.LinkForm.$valid) {
                        $mdDialog.hide($scope.link);
                    }
                };
            },
            locals: {
                link: link
            },
            targetEvent: event
        });
    };
    //    this.insertVideo = function (event, data) {
    //        return $mdDialog.show({
    //            templateUrl: 'app/modules/editor/tpls/insert-video-modal.html',
    //            controller: function($scope){
    //                $scope.cancel = function () {
    //                    $mdDialog.cancel();
    //                };
    //                $scope.save = function () {
    //                    if($scope.LinkForm.$valid){
    //                        $mdDialog.hide($scope.link);
    //                    }
    //                };
    //            },
    //            targetEvent: event,
    //        })
    //    }
}).directive('ctrlEnterSubmit', function () {
    // This will run the function when Ctrl+Enter is pressed on the element
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            element.bind('keydown', function (event) {
                var code = event.keyCode || event.which;
                if (code === 13) {
                    if (event.ctrlKey) {
                        scope.$apply(attrs.ctrlEnterSubmit);
                    }
                }
            });
        }
    };
}).directive('replyEditor', function () {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'app/modules/editor/tpls/reply-editor.html',
        controller: function controller($scope, $rootScope, EditorService, Authentication, $element) {

            $scope.editorOptions = {
                realtime: false,
                contained: true,
                minimal: true
            };

            // This editor is activated through the EditorService.
            $scope.editor = EditorService.replyEditor;
            $scope.currentUser = Authentication.currentUser;

            $scope.submit = function () {
                $scope.editor.submit();
            };

            EditorService.replyEditor.element = $element;

            $scope.$watch('editor.model', function () {
                // If the model exists, lock the editor
                if ($scope.editor.model) {
                    EditorService.replyEditor.locked = true;
                }
            });

            // Minimise and Close functions
            $scope.closeFn = function () {
                $scope.editor.visible = false;
                $scope.editor.locked = false;
            };

            // Watch the toggle - This will change when reply is denied due to lock
            $scope.$watch('editor.toggle', function (oldValue, newValue) {
                // If minimised, maximise
                if ($scope.editor.minimised === true) {
                    $scope.maximise();
                }
                // Else, run the shake animation
                else {
                        $scope.animate = !$scope.animate;
                    }
            });
        }
    };
}).service('EditorService', function ($timeout) {
    var lib = {
        zenMode: {
            visible: false, // Show or hide zen mode (activates ng-if)
            model: '', // The model the assigns data to and from zenmode
            save: function save() {
                // The function that assigns zen-mode back to standard editor
                console.error('No save function configured');
            }
        },
        replyEditor: {
            element: '', // The element is assigned here when inititated
            visible: false, // Show or hide the editor
            model: '', // The model
            locked: false, // Is the edit locked?
            toggle: false,
            minimised: false, // Minimises the reply editor
            submitText: '', // Text displayed on the submit button
            show: function show() {
                lib.replyEditor.visible = true;
                lib.replyEditor.minimised = false;
                lib.replyEditor.tooltip = 'bottom';
                // Focus the editor
                $timeout(focusEditor, 500);
            },
            minimise: function minimise() {
                lib.replyEditor.visible = true;
                lib.replyEditor.minimised = true;
            },
            reset: function reset() {
                lib.replyEditor.visible = false;
                lib.replyEditor.locked = false;
                lib.replyEditor.model = '';
            },
            submit: function submit() {
                // The function that submits the editor
                console.error('No submit function configured');
            }
        }
    };
    return lib;

    function focusEditor() {
        lib.replyEditor.element[0].querySelector('[contenteditable]').focus();
    }
});
'use strict';

angular.module('modules.error-handling', []);
angular.module('modules.error-handling').config(function ($httpProvider) {
    // Http Intercetprs - https://docs.angularjs.org/api/ng/service/$http
    $httpProvider.interceptors.push(function ($q, $window, $injector) {
        return {
            response: function response(_response) {
                return _response;
            },
            responseError: function responseError(response) {
                var $mdToast = $injector.get("$mdToast"); // Avoid circulr reference (%mdToast cannot be injected into config)
                var errorMessage;

                // If we get a response (4XX) and we have an error property - set the message
                if (response.data && response.data.error) {
                    errorMessage = response.data.error;
                }

                // If 50X error - Send a message to the server
                if (/50\d/.test(response.status)) {
                    // If we are posting and we 50X - Set the important message
                    if (response.config.method == 'POST') {
                        errorMessage = 'Something went wrong - we have been notified.';
                    }
                    $.ajax({
                        type: 'POST',
                        url: '/api/v1/logging/clienterrors',
                        contentType: 'application/json',
                        data: angular.toJson({
                            errorUrl: response.config.url,
                            errorParams: response.config.params,
                            errorStatus: response.status,
                            errorResponse: response.data
                        })
                    });
                }

                // Pop the error message
                if (errorMessage) {
                    $mdToast.show($mdToast.simple().theme('warn').content(errorMessage));
                }
                return $q.reject(response);
            }
        };
    });
}).run(function ($rootScope, $state, $timeout) {

    //    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    //        // Log out the number of watchers
    //        $timeout(function () {
    //            console.log('Lag coefficient ' + watchers())
    //        }, 3000);
    //    });

    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        //        console.log('Error');
        //        console.error('errored changing to ' + toState.name);
        //        console.error('stateChangeError:');
        //        if (error.getStack)
        //            console.error(error.getStack());
        //        console.error(error);
        $state.go('app.404', null, { location: false });
    });

    ///////////////////////////////////

    //    function watchers() {
    //        var root = $(document.getElementsByTagName('body'));
    //        var watchersList = [];
    //        var f = function (element) {
    //            if (element.data() && element.data().hasOwnProperty('$scope')) {
    //                angular.forEach(element.data().$scope.$$watchers, function (watcher) {
    //                    watchersList.push(watcher);
    //                });
    //            }
    //            angular.forEach(element.children(), function (childElement) {
    //                f($(childElement));
    //            });
    //        };
    //        f(root);
    //        return watchersList.length;
    //    }
}).service('ErrorModalService', function ($mdDialog) {
    this.error = function (event, data) {
        /************************************************
        data : {
        	title               : 'the modal title',
        	body                : 'the modal body (html)',
        	clickOutsideToClose : true || false
        	confirmText         : 'The confirm button text (then block)'
        	cancelText          : 'The close button text (catch block)'
        }
        ************************************************/
        return $mdDialog.show({
            templateUrl: 'app/modules/error-handling/tpls/error-modal.html',
            controller: function controller(data, $scope) {
                $scope.data = data;
                $scope.confirm = function () {
                    $mdDialog.hide();
                };
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
            },
            locals: { data: data },
            clickOutsideToClose: data.clickOutsideToClose || false,
            targetEvent: event
        });
    };
}).

// By default, AngularJS will catch errors and log them to
// the Console. We want to keep that behavior; however, we
// want to intercept it so that we can also log the errors
// to the server for later analysis.
provider('$exceptionHandler', {
    $get: function $get(errorLogService) {
        return errorLogService;
    }
}).

// The "stacktrace" library that we included in the Scripts
// is now in the Global scope; but, we don't want to reference
// global objects inside the AngularJS components - that's
// not how AngularJS rolls; as such, we want to wrap the
// stacktrace feature in a proper AngularJS service that
// formally exposes the print method.
factory('stacktraceService', function () {
    // "printStackTrace" is a global object.
    return {
        //        print: printStackTrace
    };
}).

// The error log service is our wrapper around the core error
// handling ability of AngularJS. Notice that we pass off to
// the native "$log" method and then handle our additional
// server-side logging.
factory('errorLogService', function ($log, $window, stacktraceService, FunctionLibrary) {

    // a record of the last error so that we don't repeatedly send
    // the same error to the server
    var lastErrorMessage = null;

    // I log the given error to the remote server.
    function log(exception, cause) {

        // Pass off the error to the default error handler
        // on the AngualrJS logger. This will output the
        // error to the console (and let the application
        // keep running normally for the user).
        $log.error.apply($log, arguments);

        // Now, we need to try and log the error the server.
        // --
        // NOTE: In production, I have some debouncing
        // logic here to prevent the same client from
        // logging the same error over and over again! All
        // that would do is add noise to the log.
        try {
            // If error is a result of a crawler - do nothing.
            if (!FunctionLibrary.isCrawler()) {

                var errorMessage = exception.toString();
                //                var stackTrace   = stacktraceService.print({ e: exception });

                if (errorMessage !== lastErrorMessage) {
                    // Log the JavaScript error to the server.
                    $.ajax({
                        type: 'POST',
                        url: '/api/v1/logging/clienterrors',
                        contentType: 'application/json',
                        data: angular.toJson({
                            errorUrl: $window.location.href,
                            errorMessage: errorMessage,
                            //                            stackTrace   : stackTrace,
                            cause: cause || ''
                        })
                    });
                }
            }
            lastErrorMessage = errorMessage;
        } catch (loggingError) {
            // For Developers - log the log-failure.
            $log.warn('Error logging failed');
            $log.log(loggingError);
        }
    }

    // Return the logging function.
    return log;
}).directive('fallbackSrc', function () {
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            if (_.isEmpty(attrs.ngSrc)) {
                element.attr('src', attrs.fallbackSrc);
            }
            element.bind('error', function () {
                element.attr('src', attrs.fallbackSrc);
            });
        }
    };
}).directive('errSrc', function () {
    return {
        link: function link(scope, element, attrs) {
            element.bind('error', function () {
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    };
});
'use strict';

angular.module('modules.explanation-modals', []);
angular.module('modules.explanation-modals').directive('showExplanationModal', function ($mdDialog) {
    return {
        restrict: 'A',
        // attrs
        // showExplanationModal = 'modal path'
        link: function link(scope, element, attrs) {
            element.bind('click', function (event) {
                var validModals = ['project', 'field', 'thread', 'ambassador', 'job'];
                if (validModals.indexOf(attrs.showExplanationModal) != -1) {
                    $mdDialog.show({
                        templateUrl: 'app/modules/explanation-modals/tpls/explanation-modal.html',
                        controller: function controller($scope, $mdDialog) {
                            $scope.modal = modalInfo[attrs.showExplanationModal];
                            $scope.cancel = $mdDialog.cancel; // function()
                        },
                        clickOutsideToClose: true,
                        targetEvent: event
                    });
                } else {
                    console.error('Modal not found');
                }
            });

            var modalInfo = {
                project: {
                    title: 'What is a project?',
                    body: '<p>If it follows the scientific method, it can be a project on STEMN. Projects here are often experiments, research, and theses. If your idea helps unlock new knowledge, then we can help.</p>',
                    image: 'assets/images/explanation-modals/droid.svg',
                    buttonText: 'Back to projects'
                },
                field: {
                    title: 'What is a field?',
                    body: '<p>Fields are short for “scientific fields”, “scientific disciplines”, or “sciences”.</p>' + '<p>Be sure to tag your projects and questions with appropriate fields so it is easy to find.</p>',
                    image: 'assets/images/explanation-modals/rover.svg',
                    buttonText: 'Great, thanks!'
                },
                thread: {
                    title: 'What is a thread?',
                    body: '<p>Threads can be anything you want to discuss:</p>' + '<ul>' + '<li>Technical questions</li>' + '<li>Asking for feedback</li>' + '<li>Recruiting new members to your team. </li>' + '</ul>' + '<p>How can the STEMN community help? Science is more fun with friends.</p>',
                    image: 'assets/images/explanation-modals/telescope.svg',
                    buttonText: 'Back to threads'
                },
                ambassador: {
                    title: 'Become an ambassador',
                    body: '<p>STEMN ambassadors get paid real $$$$ for everyone they signup at their company or university.</p>' + '<p>Interested? Email <a class="text-green" href="mailto:ambassador@stemn.com">ambassador@stemn.com</a> to find out more.</p>',
                    image: 'assets/images/explanation-modals/deal.svg',
                    buttonText: 'Back to referrals'
                },
                job: {
                    title: 'How do STEMN jobs work?',
                    body: '<p>Once you have created a profile and added some projects to your portfolio you can apply for jobs.</p>' + '<p>When you apply for a position, we\'ll pair you with a member of our Talent Team. They\'ll polish your application and prepare you for each company.</p>' + '<p>You\'ll be introduced to our partner companies. Over <b>64% of applicants</b> via STEMN land interviews!</p>',
                    image: 'assets/images/explanation-modals/moon-landing.svg',
                    buttonText: 'Back to jobs'
                }
            };
        }
    };
});
'use strict';

/**
 * Simple favicon service
 */
angular.module('modules.favico', []).factory('favicoService', [function () {
    var favico = new Favico({
        animation: 'popFade',
        bgColor: '#5CB85C',
        textColor: '#fff'
    });

    var badge = function badge(num) {
        favico.badge(num);
    };
    var reset = function reset() {
        favico.reset();
    };

    return {
        badge: badge,
        reset: reset
    };
}]);
'use strict';

(function () {
    'use strict';

    angular.module('modules.feed', ['modules.call-to-action']);

    angular.module('modules.feed').directive('feedItem', feedItemDirective).directive('cardFeed', cardFeedDirective).directive('loadingFeed', loadingFeedDirective).directive('itemFields', itemFieldsDirective).directive('itemOwner', itemOwnerDirective).directive('itemImage', itemImageDirective).directive('feed', feedDirective).directive('feedRecommend', feedRecommendDirective).service('FeedService', feedService);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function feedItemDirective(CoreLibrary, FeedService) {
        return {
            restrict: 'E',
            scope: {
                data: '=?',
                itemType: '@?',
                size: '@?' },
            templateUrl: 'app/modules/feed/tpls/feed-item.html',
            controller: function controller($scope) {
                // This directive accepts 2 forms of data
                // 1. Data can be passed in on the data object with form:
                //    $scope.data = { data : 'ITEM DATA', itemType : 'ITEM TYPE'}
                // 2. Data can also come in on the $scope.data object and $scope.itemType:
                //    $scope.data = 'ITEM DATA'  and   $scope.itemType : 'ITEM TYPE'

                var data = $scope.data.data || $scope.data;
                // If there is no name, we must fetch the item
                if (!data.name) {
                    $scope.loading = true;
                    FeedService.getFeedItem({
                        _id: data._id,
                        type: data.type
                    }).then(function (result) {
                        data = result;
                        initialise();
                    });
                } else {
                    initialise();
                }

                // Watch loading - if it changes we re-initialise
                $scope.$watch('data.loading', function () {
                    initialise();
                });

                // Functions -----------------------------------------------------
                function initialise() {
                    if ($scope.data.loading !== true) {
                        var data = $scope.data.data || $scope.data;
                        $scope.type = data.entityType;
                        $scope.altType = CoreLibrary.getAltType($scope.type);
                        // Map general properties
                        $scope.id = data._id;
                        $scope.title = data.name;
                        $scope.blurb = data.blurb;
                        $scope.fields = data.fields;
                        $scope.wordCount = data.wordCount;
                        $scope.sref = CoreLibrary.getSref(data.entityType, data.stub);
                        $scope.image = data.picture;
                        $scope.srefComments = CoreLibrary.getSrefBase(data.entityType) + '({"stub":"' + data.stub + '","#":"responses"})';
                        $scope.srefCommentsReply = CoreLibrary.getSrefBase(data.entityType) + '({"stub":"' + data.stub + '", "reply" : "true", "#":"reply"})';
                        $scope.numPosts = data.numPosts || data.numComments;
                        $scope.likes = {
                            num: data.likes
                        };

                        // Time block -----------------------------------------------------
                        // This is used to set how long ago something was added/updated etc
                        if (data.updated) {
                            $scope.timeDesc = 'Updated';
                            $scope.time = data.updated;
                        }
                        if (data.submitted) {
                            $scope.timeDesc = 'Submitted';
                            $scope.time = data.submitted;
                        }

                        // Map variable properties
                        if (data.entityType == 'project') {
                            setOwner(data.organisations, data.team);
                        } else {
                            setOwner(data.organisations, data.owner, data.projects);
                        }

                        $scope.loading = false;
                    } else {
                        $scope.loading = true;
                    }
                }

                function setOwner(organisations, users, projects) {
                    // Set the organisation and user
                    var organisation;
                    if (organisations && organisations[0]) {
                        organisation = organisations[0];
                    }
                    var project;
                    if (projects && projects[0]) {
                        project = projects[0];
                    }
                    var user = users[0] || users;

                    // Set the owner data on $scope
                    if (organisation) {
                        $scope.avatar = organisation.picture;
                        $scope.owner = organisation.name;
                        $scope.ownerId = organisation._id;
                        $scope.ownerStub = organisation.stub;
                        $scope.ownerSref = CoreLibrary.getSref('organisation', organisation.stub);
                        // There is also a sub-owner (the user)
                        $scope.subOwner = user.name;
                        $scope.subOwnerSref = CoreLibrary.getSref('user', user.stub);
                        $scope.ownerType = 'organisation';
                    } else if (project) {
                        $scope.avatar = project.picture;
                        $scope.owner = project.name;
                        $scope.ownerId = project._id;
                        $scope.ownerStub = project.stub;
                        $scope.ownerSref = CoreLibrary.getSref('project', project.stub);
                        // There is also a sub-owner (the user)
                        $scope.subOwner = user.name;
                        $scope.subOwnerSref = CoreLibrary.getSref('user', user.stub);
                        $scope.ownerType = 'project';
                    } else {
                        $scope.avatar = user.picture;
                        $scope.owner = user.name;
                        $scope.ownerId = user._id;
                        $scope.ownerStub = user.stub;
                        $scope.ownerSref = CoreLibrary.getSref('user', user.stub);
                        $scope.ownerType = 'user';
                    }
                }
            }
        };
    }

    function loadingFeedDirective() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/modules/feed/tpls/feed-loading.html'
        };
    }

    function itemFieldsDirective() {
        return {
            restrict: 'E',
            scope: {
                fields: '=',
                limit: '=' // The number to display
            },
            templateUrl: 'app/modules/feed/tpls/item-fields.html',
            controller: function controller($scope, CoreLibrary) {
                _.forEach($scope.fields, function (field) {
                    field.sref = CoreLibrary.getSref('field', field.stub);
                });
            }
        };
    }

    function itemOwnerDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                avatar: '@', // url of avatar image
                type: '@', // organisation || user
                ownerId: '@',
                ownerStub: '@'
            },
            templateUrl: 'app/modules/feed/tpls/item-owner.html'
        };
    }

    function itemImageDirective() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: 'app/modules/feed/tpls/item-image.html'
        };
    }

    function feedDirective() {
        return {
            restrict: 'E',
            scope: {
                parentId: '@', // The id of the parent
                parentType: '@', // organisation || project || user || field
                parent: '=?', // The parent object - This is used to create a more detailed empty message
                type: '@', // all // projects || blogs || discussions
                size: '@?', // lg || sm  - lg defaults
                contained: '@?', // true || false - false defaults if true, banners are hidden an no md-containers
                data: '=?', // Feed data from resolve
                resolved: '=?', // true if data comes in from a resolve
                published: '=?', // true || false || 'both' - true behavior defaults
                showEdit: '=?', // true || false - will enabled edit features
                hideInput: '=' // hides the input box
            },
            templateUrl: 'app/modules/feed/tpls/feed.html',
            controller: function controller($scope, ThreadCreateModalService, NewCreationsService, HttpQuery) {
                var page,
                    size = 10,
                    typeInfos = getTypeInfos();
                // Initiate
                $scope.$watch('parentId', initialise);

                ////////////////////////////////////////////////////////////////////////////

                function initialise() {
                    $scope.query = HttpQuery({
                        url: 'api/v1/feed',
                        params: {
                            parentType: $scope.parentType,
                            parentId: $scope.parentId,
                            type: $scope.type,
                            sort: 'updated',
                            size: size,
                            published: $scope.published,
                            populate: true
                        }
                    });

                    $scope.typeInfo = typeInfos[$scope.type];
                    newEntity();
                    $scope.newEntitySubmit = newEntitySubmit; // function()

                    $scope.query.results = [{ loading: true, name: 'loading' }, { loading: true, name: 'loading' }, { loading: true, name: 'loading' }];
                    $scope.query.more();
                }

                function newEntity() {
                    $scope.newEntity = {};
                    $scope.sectionData = {};
                    $scope.radioDetails = {
                        options: $scope.typeInfo.inputRadioOptions,
                        selected: $scope.typeInfo.inputRadioOptions[0].val
                    };

                    // Add the fields/organisations tags
                    if ($scope.parent && ($scope.parentType == 'organisation' || $scope.parentType == 'project' || $scope.parentType == 'field')) {
                        $scope.newEntity[$scope.parentType + 's'] = [{
                            _id: $scope.parent._id,
                            stub: $scope.parent.stub,
                            name: $scope.parent.name,
                            picture: $scope.parent.picture
                        }];
                        // Add the additional organisation tags if it is a project
                        if ($scope.parentType == 'project') {
                            $scope.newEntity.organisations = $scope.parent.organisations;
                        }
                    }
                }

                function newEntitySubmit() {
                    var entityType;
                    $scope.newEntity.sectionData = $scope.sectionData.model;
                    $scope.newEntity.type = $scope.radioDetails.selected;
                    // Get the entity type
                    if ($scope.radioDetails.selected == 'project') {
                        entityType = 'project';
                    } else {
                        entityType = 'thread';
                    }
                    NewCreationsService.create(entityType, $scope.newEntity);
                }

                function getTypeInfos() {
                    // The first radio button will be selected automatically.
                    return {
                        all: {
                            noMoreSingular: 'Nothing here yet.',
                            noMoreMulti: 'No more results.',
                            inputPlaceholder: 'Post a project, blog or question.',
                            inputRadioOptions: [{
                                val: 'project',
                                title: 'Project'
                            }, {
                                val: 'blog',
                                title: 'Blog / Update'
                            }, {
                                val: 'question',
                                title: 'Question'
                            }]
                        },
                        projects: {
                            noMoreSingular: 'No projects yet.',
                            noMoreMulti: 'No more projects.',
                            inputPlaceholder: 'Post a project or Research paper',
                            inputRadioOptions: [{
                                val: 'project'
                            }]
                        },
                        blogs: {
                            noMoreSingular: 'No blogs here yet',
                            noMoreMulti: 'No more blogs.',
                            inputPlaceholder: 'Start a project blog or post something interesting...',
                            inputRadioOptions: [{
                                val: 'blog'
                            }]
                        },
                        discussions: {
                            noMoreSingular: 'No questions yet.',
                            noMoreMulti: 'No more questions.',
                            inputPlaceholder: 'Ask a question or request some help.',
                            inputRadioOptions: [{
                                val: 'question'
                            }]
                        },
                        questions: {
                            noMoreSingular: 'No questions yet.',
                            noMoreMulti: 'No more questions.',
                            inputPlaceholder: 'Ask a question or request some help.',
                            inputRadioOptions: [{
                                val: 'question'
                            }]
                        }
                    };
                }
            }
        };
    }
    function cardFeedDirective() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                parentId: '@', // The id of the parent
                parentType: '@', // organisation || project || user || field
                sort: '@', // sort type
                type: '@', // all || projects || blogs || discussions
                size: '@', // the number of cards
                hideMore: '=?', // true || false - if true, the 'see more' button will be hidden
                query: '=?' // Query(to be used in the parent scope)
            },
            templateUrl: 'app/modules/feed/tpls/card-feed.html',
            controller: function controller($scope, $timeout, HttpQuery) {
                var page;
                var initDebounce,
                    initDebounceTime = 10;

                // Initiate
                $scope.$watch('parentId', debounceInit, true);
                $scope.$watch('sort', debounceInit, true);

                ////////////////////////////////////////////////////////////////////////////

                function debounceInit() {
                    $timeout.cancel(initDebounce);
                    initDebounce = $timeout(initialise, initDebounceTime);
                }

                function initialise() {
                    // Defaults
                    $scope.size = $scope.size || 3;
                    $scope.sort = $scope.sort || 'updated';

                    $scope.query = HttpQuery({
                        url: 'api/v1/feed',
                        params: {
                            parentType: $scope.parentId ? $scope.parentType : '',
                            parentId: $scope.parentId,
                            type: $scope.type,
                            sort: $scope.sort,
                            size: $scope.size,
                            published: $scope.published,
                            populate: true
                        },
                        requerySize: 12
                    });
                    $scope.query.more();

                    if ($scope.type == 'projects') {
                        $scope.messageMore = 'See more projects';
                        $scope.messageNoMore = 'No more projects';
                    } else if ($scope.type == 'blogs') {
                        $scope.messageMore = 'See more updates';
                        $scope.messageNoMore = 'No more updates';
                    } else if ($scope.type == 'discussions') {
                        $scope.messageMore = 'See more questions';
                        $scope.messageNoMore = 'No more questions';
                    } else {
                        $scope.messageMore = 'See more';
                        $scope.messageNoMore = 'No more results';
                    }
                }
            }
        };
    }

    function feedRecommendDirective($http, $mdToast) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                entityType: '@',
                entityId: '@'
            },
            templateUrl: 'app/modules/feed/tpls/feed-recommend.html',
            link: function link(scope, element) {
                element.bind('click', function (event) {
                    $http.post('/api/v1/feed/recommend', {
                        entityType: scope.entityType,
                        entityId: scope.entityId
                    }).then(function (response) {
                        $mdToast.show($mdToast.simple().content('Recommended to everybody!'));
                    });
                });
            }
        };
    }

    function feedService(Restangular, ThreadService, ProjectService, HttpService) {

        this.getFeed = function (options) {
            /*********************************************************************************************************************
                API:
                  parentType : 'user || project || field || organisation',         the parent to provide a feed for
                parentId : 'id',                                                 the id parent of the parent to provide a feed for
                type : 'all || projects || question || discussions || blogs',    the type of items to request
                page : 1,
                size : 10,
                sort : 'recent || top || views',                                 the way to sort the results
                location : {                                                     location filter object
                    northeast:{latitude,longitude},
                    southwest:{latitude,longitude}
                }
                published : true || false || undefined                           pubished || unpublished || both (true default)
                populate  : true || false(default)                               if true, { type: '', _id: ''}
              *********************************************************************************************************************/
            return HttpService({
                method: 'GET',
                url: 'api/v1/feed',
                params: options
            });
        };
        this.getFeedItem = function (data) {
            /**************************************************************************
                API:
                  _id : 'id',
                type : 'user || project || field || organisation'
              **************************************************************************/
            if (data.type == 'project') {
                return ProjectService.getProject(data._id, 'md');
            } else {
                return ThreadService.getThread(data._id, 'md');
            }
        };
    }
})();
'use strict';

angular.module('modules.feed').directive('feedWidget', function () {
    return {
        restrict: 'E',
        scope: {
            parentId: '@', // The id of the parent
            parentType: '@', // project || organisation
            parent: '=?', // The parent object - This is used to create a more detailed empty message
            type: '@', // blogs || discussions || all
            data: '=?', // Feed data from resolve
            published: '=?', // true || false || 'both' - true behavior defaults
            showEdit: '=?' // true || false - will enabled edit features

        },
        templateUrl: 'app/modules/feed/tpls/feed-widget.html',
        controller: 'feedWidgetCtrl'
    };
}).directive('feedWidgetTimeline', function () {
    return {
        restrict: 'E',
        scope: {
            parentId: '@', // The id of the parent
            parentType: '@', // project || organisation
            parent: '=?', // The parent object - This is used to create a more detailed empty message
            type: '@', // blogs || discussions || all
            data: '=?', // Feed data from resolve
            published: '=?', // true || false || 'both' - true behavior defaults
            showEdit: '=?' // true || false - will enabled edit features

        },
        templateUrl: 'app/modules/feed/widget-timeline/tpls/feed-widget-timeline.html',
        controller: 'feedWidgetCtrl'
    };
}).controller('feedWidgetCtrl', function ($scope, ThreadCreateModalService, ProjectCreateModalService, CoreLibrary, HttpQuery) {

    // Initiate
    var typeInfos = {
        blogs: {
            moreSref: $scope.parentType == 'project' ? 'app.' + $scope.parentType + '.blogs' : 'app.' + $scope.parentType + '.blogs',
            inputPlaceholder: 'Add a Blog',
            inputFn: ThreadCreateModalService.newThread,
            inputFnType: 'blog',
            empty: 'No updates yet.'
        },
        discussions: {
            moreSref: $scope.parentType == 'project' ? 'app.' + $scope.parentType + '.threads' : 'app.' + $scope.parentType + '.forum',
            inputPlaceholder: 'Add a question',
            inputFn: ThreadCreateModalService.newThread,
            inputFnType: 'general', // This could also be question
            empty: 'No questions yet.'
        },
        all: {
            moreSref: $scope.parentType == 'project' ? 'app.' + $scope.parentType + '.threads' : 'app.' + $scope.parentType + '.forum',
            inputPlaceholder: 'Add a Discussion',
            inputFn: ThreadCreateModalService.newThread,
            inputFnType: 'general', // This could also be question
            empty: 'Nothing yet.'
        }
    };

    $scope.query = HttpQuery({
        url: 'api/v1/feed',
        params: {
            parentType: $scope.parentType,
            parentId: $scope.parentId,
            type: $scope.type,
            sort: 'submitted',
            size: 4,
            published: $scope.published
        },
        onSuccess: function onSuccess(response) {
            _.forEach(response, function (item) {
                item.data.sref = CoreLibrary.getSref(item.data.type, item.data.stub);
            });
            return response;
        }
    });
    $scope.query.more();

    $scope.typeInfo = typeInfos[$scope.type];

    // Set the input function data object
    // This is used to create a thread/project that already has some tags
    $scope.inputFnData = {}; // Set the fields || organisations || projects array
    if ($scope.parentType == 'organisation') {
        $scope.inputFnData.organisations = [{
            _id: $scope.parent._id,
            stub: $scope.parent.stub,
            name: $scope.parent.name,
            picture: $scope.parent.picture
        }];
        $scope.inputFnData.fields = $scope.parent.fields;
    } else if ($scope.parentType == 'project') {
        $scope.inputFnData.projects = [{
            _id: $scope.parent._id,
            stub: $scope.parent.stub,
            name: $scope.parent.name,
            picture: $scope.parent.picture
        }];
        $scope.inputFnData.organisations = $scope.parent.organisations;
    } else if ($scope.parentType == 'field') {
        $scope.inputFnData.fields = [{
            _id: $scope.parent._id,
            stub: $scope.parent.stub,
            name: $scope.parent.name,
            picture: $scope.parent.picture
        }];
    }

    $scope.inputFnData.type = $scope.typeInfo.inputFnType;
});
'use strict';

angular.module('modules.fields', ['modules.authentication', 'modules.restangular', 'modules.uploads']);
angular.module('modules.fields').directive('fieldCard', function () {
    return {
        restrict: 'E',
        scope: {
            id: '@?',
            data: '=?',
            size: '@?'
        },
        templateUrl: 'app/modules/fields/tpls/field-card.html',
        controller: function controller($scope, Authentication, FieldService) {
            if ($scope.id) {
                // Initiate Loading class
                $scope.loading = true;
                FieldService.getField($scope.id).then(function (field) {
                    $scope.data = field;
                    // Set loading to false when data has loaded
                    $scope.loading = false;
                });
            }
        }
    };
}).service('FieldModalService', function ($mdDialog) {
    this.fieldNewModal = function (event, data) {
        return $mdDialog.show({
            templateUrl: 'app/modules/fields/tpls/field-new-modal.html',
            controller: 'FieldNewModalCtrl',
            clickOutsideToClose: true,
            targetEvent: event,
            locals: {
                data: data
            }
        });
    };
}).controller('FieldNewModalCtrl', function (data, $scope, $mdDialog, FieldService, SearchService, CoreLibrary) {
    $scope.data = angular.copy(data);

    $scope.checkFieldExists = function (name) {
        if (name) {
            $scope.stub = CoreLibrary.stubify(name);
            SearchService.search({ type: 'field', key: 'stub', value: $scope.stub, match: 'insensitive' }).then(function (response) {
                if (response.data.length === 0) {
                    $scope.NewFieldForm.name.$setValidity('fieldexists', true);
                } else {
                    $scope.NewFieldForm.name.$setValidity('fieldexists', false);
                }
            });
        }
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.save = function () {
        FieldService.updateField($scope.data).then(function (field) {
            $mdDialog.hide(field);
        });
    };
}).service('FieldService', function (Restangular, Authentication, HttpService) {

    this.createField = function (field) {
        analytics.track('Field Create', {
            field: field.name
        });
        return Restangular.all('fields').post(field).then(function (field) {
            return field;
        });
    };

    this.getField = function (field) {
        return Restangular.one('fields', field).get();
    };

    this.getFields = function (data) {
        return Restangular.all('fields').getList(data);
    };

    this.updateField = function (field) {
        analytics.track('Field Update', {
            updater: Authentication.currentUser.name,
            field: field.name
        });

        if (!field._id) {
            return this.createField(field);
        } else {
            return Restangular.one('fields', field._id).customPUT(field);
        }
    };

    this.deleteField = function (fieldId) {
        return HttpService({
            method: 'delete',
            url: '/api/v1/fields/' + fieldId
        });
    };
});
'use strict';

angular.module('modules.filters', []);
angular.module('modules.filters').filter('capitaliseFirst', function () {
    return function (str) {
        str = str || '';
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    };
}).filter('nospace', function () {
    return function (value) {
        return !value ? '' : value.replace(/ /g, '');
    };
}).filter('trustAsResourceUrl', function ($sce) {
    return function (val) {
        return $sce.trustAsResourceUrl(val);
    };
}).filter('reverse', function () {
    return function (items) {
        if (items) {
            return items.slice().reverse();
        }
    };
}).filter('money', function (CoreLibrary) {
    return function (value, currency) {
        var result, string, dollars;
        var currencyString = '';

        // Get currency string
        var currencies = CoreLibrary.getCurrencies();
        if (currencies[currency]) {
            currencyString = currencies[currency].symbol;
        }

        // Convert the value
        if (value) {
            string = value.toString();
            dollars = string.split('.')[0];
            // Add k (100k) if we have a 4 digit number
            if (dollars.length >= 4) {
                var decimalPlaces = 0;
                result = parseInt(string) / 1000;
                // If it is 4 digit (such as 1,500), round to 1 DP  to get 1.5k
                if (dollars.length == 4) {
                    decimalPlaces = 1;
                }
                result = result.toFixed(decimalPlaces) + 'k';
            } else {
                result = string;
            }
        }

        return currencyString + result;
    };
}).filter('bytes', function () {
    return function (bytes, precision) {
        if (bytes === '0' || bytes === 0 || isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
        if (typeof precision === 'undefined') precision = 1;
        var units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
    };
}).filter('words', function () {
    // From the Ment.io Package
    return function (input, words) {
        if (isNaN(words)) {
            return input;
        }
        if (words <= 0) {
            return '';
        }
        if (input) {
            var inputWords = input.split(/\s+/);
            if (inputWords.length > words) {
                input = inputWords.slice(0, words).join(' ') + '\u2026';
            }
        }
        return input;
    };
}).filter('trustAsHtml', function ($sce) {
    return $sce.trustAsHtml;
}).filter('letters', function () {
    // From the Ment.io Package
    return function (input, letters) {
        if (isNaN(letters)) {
            return input;
        }
        if (letters <= 0) {
            return '';
        }
        if (input) {
            if (input.length > letters) {
                input = input.slice(0, letters) + '\u2026';
            }
        }
        return input;
    };
}).filter('orderObjectBy', function () {
    // http://stackoverflow.com/questions/
    // 14478106/angularjs-sorting-by-property
    return function (input, attribute) {
        if (!angular.isObject(input)) return input;

        var array = [];
        for (var objectKey in input) {
            array.push(input[objectKey]);
        }

        array.sort(function (a, b) {
            a = parseInt(a[attribute]);
            b = parseInt(b[attribute]);
            return a - b;
        });
        return array;
    };
}).filter('hasValue', function () {
    return function (str) {
        if (str === null) {
            return false;
        } else if (str === "") {
            return false;
        } else {
            return true;
        }
    };
}).filter('firstWord', function () {
    return function (str) {
        str = str.split(' ')[0];
        return str;
    };
}).filter('lastWord', function () {
    return function (str) {
        str = str.split(' ').pop();
        return str;
    };
}).

// deep inspection via recursion
filter('isEmptyObject', function ($filter) {
    return function (object) {
        return _.every(object, function (value, key) {
            if (_.isArray(value)) {
                return _.every(value, $filter('isEmptyObject'));
            } else {
                if (key === '$$hashKey') {
                    // fix for angular adding trackby internal reference
                    return true;
                } else {
                    return _.isEmpty(value);
                }
            }
        });
    };
}).filter('consolelog', function () {
    return function (message) {
        console.log(message);
    };
}).filter('trueValues', function () {
    return function (object) {
        var result = [];
        _.each(object, function (value, key) {
            if (value === true) {
                var obj = {};
                obj[key] = value;
                result.push(obj);
            }
        });
        return result;
    };
}).filter('values', function () {
    return function (object) {
        var result = [];
        _.each(object, function (value, key) {
            var obj = {};
            obj[key] = value;
            result.push(obj);
        });
        return result;
    };
}).filter('toJSON', function () {
    return function (object) {
        return JSON.stringify(object, null, 4);
    };
}).filter('stripHttp', function () {
    return function (object) {
        return object.toString().replace('http://', '').replace('https://', '').replace('www.', '').replace('http://www.', '').replace('https://www.', '');
    };
}).filter('typeaheadHighlightMatch', function () {

    function escapeRegexp(queryToEscape) {
        return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    }

    return function (matchItem, query) {
        return query ? ('' + matchItem).replace(new RegExp('\\b' + escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem;
    };
});
'use strict';

angular.module('modules.following', []);
angular.module('modules.following').directive('followingDetailed', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/following/tpls/following-detailed.html',
        scope: {
            type: '@', // field || organisation || project || user || thread
            userId: '@',
            size: '@',
            hideMore: '@', // true || false
            moreFn: '=?', // more function that can be called from the parent
            showDivider: '=?' // true || false (default) - when true, the title divider will be shown
        },
        controller: function controller(FollowService, Authentication, $scope, HttpQuery) {
            $scope.page = 0;
            $scope.size = $scope.size || 20;
            $scope.userId = $scope.userId || Authentication.currentUser._id;
            $scope.showEdit = $scope.userId == Authentication.currentUser._id;
            $scope.typeInfo = getTypeDetails($scope.type);

            $scope.query = HttpQuery({
                url: 'api/v1/users/' + $scope.userId + '/following',
                params: {
                    type: $scope.type,
                    page: $scope.page,
                    size: $scope.size
                },
                requerySize: 20
            });
            $scope.query.results = [{ loading: true }, { loading: true }, { loading: true }];
            $scope.query.more();

            //////////////////////////////////////////

            function getTypeDetails(type) {
                var details = {
                    field: {
                        typeTitle: 'Fields',
                        followSome: 'app.browse.fields'
                    },
                    organisation: {
                        typeTitle: 'Organisations',
                        followSome: 'app.browse.organisations'
                    },
                    project: {
                        typeTitle: 'Projects',
                        followSome: 'app.browse.projects'
                    },
                    user: {
                        typeTitle: 'Users',
                        followSome: 'app.browse.users'
                    },
                    thread: {
                        typeTitle: 'Threads',
                        followSome: 'app.browse.threads'
                    }
                };
                return details[type];
            }
        }
    };
});
'use strict';

angular.module('modules.footer', []);
angular.module('modules.footer').directive('footer', function (FooterService) {
	return {
		restrict: 'E',
		scope: {},
		replace: true,
		templateUrl: 'app/modules/footer/tpls/footer.html',
		controller: function controller($scope, LayoutOptions) {
			$scope.LayoutOptions = LayoutOptions;
			$scope.items = FooterService.items;
		}
	};
}).service('FooterService', function (Restangular) {
	this.items = [
	// {
	//			text: 'Help',
	//			sref: "app.field.top({'stub':'stemn-how-to'})"
	//		},{
	//			text: 'About',
	//			sref: "app.project.overview({'stub':'stemn'})"
	//		},{
	//			text: 'Faq',
	//			sref: "app.faq"
	//		},{
	//			text: 'Partners',
	//			sref: "app.partners"
	//		},{
	//			text: 'Terms',
	//			sref: "app.terms"
	//		},
	{
		text: 'About',
		sref: "app.project.overview({'stub':'stemn'})"
	}, {
		text: 'Careers',
		sref: "app.thread({'stub':'join-our-rocketship'})"
	}, {
		text: 'Terms & Privacy',
		sref: "app.terms"
	}, {
		text: 'Partners',
		sref: "app.partners"
	}, {
		text: 'Say Hello',
		sref: "app.project.overview({'stub':'stemn'})"
	}];
});
'use strict';

angular.module('modules.forum', ['modules.thread.thread-create-modal', 'modules.thread.timeline', 'modules.thread.labels', 'modules.editor', 'modules.tags', 'modules.social-media']);
angular.module('modules.forum').directive('forum', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/forum/tpls/forum.html',
        scope: {
            parentId: '@?',
            parentType: '@?',
            size: '@?',
            query: '=?',
            type: '@'
        },
        controller: function controller($scope, HttpQuery) {
            $scope.size = $scope.size || 20;

            $scope.query = HttpQuery({
                url: 'api/v1/search',
                params: {
                    parentType: $scope.parentId ? $scope.parentType : '',
                    parentId: $scope.parentId,
                    sort: 'updated',
                    type: 'thread',
                    size: $scope.size,
                    select: ['picture', 'name', 'stub', 'blurb', 'owner', 'projects', 'numPosts', 'fields', 'labels'],
                    populate: true,
                    criteria: $scope.type == 'threads' ? {} : { type: ['question', 'general'] }
                },
                onSuccess: function onSuccess(response) {
                    _.forEach(response, function (item) {
                        item.picture = getPicture(item);
                        item.project = getProject(item);
                    });
                    return response;
                },
                requestSize: 20
            });
            $scope.query.more();

            //////////////////////////////


            function getPicture(entity) {
                if (!entity.picture) {
                    var field = _.find(entity.fields, 'picture');
                    if (field) {
                        return field.picture;
                    }
                } else {
                    return entity.picture;
                }
            }
            function getProject(entity) {
                if (entity.projects.length > 0) {
                    return _.find(entity.projects, 'picture');
                }
            }
        }
    };
}).directive('threadMetaRelations', function () {
    return {
        restrict: 'E',
        template: '<h2 ng-if="relations" ng-bind-html="relations"><h2>',
        scope: {
            projects: '=?',
            organisations: '=?'
        },
        controller: function controller($scope) {
            var entity = [];
            var num = 0;
            function setEntity(data, type) {
                entity[num] = type + ' <a class="bold" href=' + data.href + '>' + data.name + '</a>';
                num++;
            }

            // Set the entities
            if ($scope.projects[0]) {
                $scope.projects[0].href = "projects/" + $scope.projects[0].stub;
                setEntity($scope.projects[0], 'project');
            }
            if ($scope.organisations[0]) {
                $scope.organisations[0].href = "org/" + $scope.organisations[0].stub + "/top";
                setEntity($scope.organisations[0], 'organisation');
            }

            // Construct the string
            if (entity.length === 2) {
                $scope.relations = 'In reference to the ' + entity[0] + ' and the ' + entity[1] + '.';
            } else if (entity.length === 1) {
                $scope.relations = 'In reference to the ' + entity[0] + '.';
            } else {
                $scope.relations = false;
            }
        }
    };
}).directive('clickCreateThread', function (ThreadCreateModalService) {
    return {
        restrict: 'A',
        scope: {
            thread: '=?'
        },
        link: function link(scope, element, attrs) {
            element.bind('click', function (event) {
                ThreadCreateModalService.newThread(event, scope.thread);
            });
        }
    };
}).service('ThreadService', function ($http, HttpService, LocalCache, Restangular, Authentication, $q, ModularEditorService) {

    this.getThread = getThread; // function(filter)
    //    this.saveThread   = saveThread;   // function(thread)
    this.deleteThread = deleteThread; // function(threadId)

    var endpoint = 'thread';

    //////////////////////////////////

    function getThread(stubOrId, select) {

        // Default the selectFields
        var selectFields, populate;
        if (select == 'sm') {
            selectFields = ['stub', 'name', 'picture', 'blurb'];
            populate = false;
        } else if (select == 'md') {
            selectFields = ['stub', 'name', 'picture', 'blurb', 'followers'];
            populate = false;
        } else {
            selectFields = ['*'];
            select = 'lg';
            populate = true;
        }

        return HttpService({
            url: '/api/v1/threads/' + stubOrId,
            method: "GET"
        });
    }

    //    function saveThread(thread) {
    ////        LocalCache.save(endpoint+'lg', thread);
    //        if (!thread._id) {
    //            analytics.track('Thread New', {
    //                projects : thread.projects,
    //                fields : thread.fields,
    //                organisations : thread.organisations,
    //                threadLength : thread.body.length
    //            });
    //            // if the thread hasn't been saved for the first time, post it to the server
    //            return Restangular.all('threads').post(thread);
    //        } else {
    //            // if the thread already exists, put an update to the server
    //            analytics.track('Thread Update', {
    //                projects : thread.projects,
    //                fields : thread.fields,
    //                organisations : thread.organisations,
    //                threadLength : thread.body.length
    //            });
    //
    //            // do not send the posts to the server as a request body to avoid exceeding
    //            // the server's maximum request size
    //            var cleanThread = _.clone(thread, true)
    //            cleanThread.posts = undefined;
    //			// Remove the section elements
    //			ModularEditorService.stripSectionsDomElements(cleanThread.sectionData.sections);
    //            return Restangular.one('threads', thread._id).customPUT(cleanThread);
    //        }
    //    }


    function deleteThread(thread) {
        analytics.track('Thread Delete', {
            thread: thread
        });
        return Restangular.all('threads').one(thread).remove();
    }
});
'use strict';

angular.module('modules.thread.thread-create-modal', []);
angular.module('modules.thread.thread-create-modal').service('ThreadCreateModalService', function ($mdDialog) {
    this.newThread = function (event, data) {
        /********************************************************************
        We pass data into the modal to tell it which fields, orgs and project
        that it should automaticaly tag.
        We MUST include the thread type
            data = {
                fields        : [],
                organisations : [],
                projects      : [],
                type          : 'general' || 'question' || 'blog'
            }
        ********************************************************************/
        return $mdDialog.show({
            templateUrl: 'app/modules/forum/thread-create-modal/tpls/thread-create-modal.html',
            controller: 'ThreadCreateModalCtrl',
            targetEvent: event,
            locals: {
                data: data
            }
        });
    };
}).controller('ThreadCreateModalCtrl', function (data, $scope, $state, $mdDialog, ProjectCreateModalService, LicenseData, NewCreationsService, CoreLibrary) {
    $scope.forms = {};
    $scope.activeTab = {};
    $scope.thread = data || {};
    $scope.thread.stub = CoreLibrary.getRandomString(30);
    $scope.thread.type = $scope.thread.type || 'general';

    $scope.tabs = ['Overview', 'Create Thread'];

    $scope.steps = {
        'Overview': {
            label: 'Overview',
            path: 'app/modules/forum/thread-create-modal/tpls/thread-create-modal.overview.html',
            nextText: 'Create Thread',
            clickFn: function clickFn() {
                $scope.activeTab.label = this.label;
                $scope.activeTab.path = this.path;
            },
            nextFn: function nextFn() {
                NewCreationsService.create('thread', $scope.thread);
            },
            isDisabled: function isDisabled() {
                return $scope.forms.nameForm && $scope.forms.nameForm.$invalid;
            }
        },
        'Create Thread': {
            label: 'Create Thread',
            isDisabled: function isDisabled() {
                return true;
            }
        }
    };
    $scope.steps.Overview.clickFn();

    $scope.cancel = function () {
        $mdDialog.cancel();
    };
});
'use strict';

angular.module('modules.thread.labels', []);
angular.module('modules.thread.labels').service('ThreadLabelService', function () {
    var service = this;

    this.labels = [{
        model: 'question',
        label: 'Question',
        color: 'rgb(255, 65, 54)',
        textColor: 'white',
        bgColor: 'rgba(255, 65, 54, 0.1)'
    }, {
        model: 'discussion',
        label: 'Discussion',
        color: 'rgb(0, 116, 217)',
        textColor: 'white',
        bgColor: 'rgba(0, 116, 217, 0.1)'
    }, {
        model: 'help',
        label: 'Help Wanted',
        color: 'rgb(57, 204, 204)',
        textColor: 'white',
        bgColor: 'rgba(57, 204, 204, 0.1)'
    }, {
        model: 'blog',
        label: 'Blog/Update',
        color: 'rgb(255, 133, 27)',
        textColor: 'white',
        bgColor: 'rgba(255, 133, 27, 0.1)'
    }, {
        model: 'bug',
        label: 'Bug',
        color: 'rgb(141, 198, 63)',
        textColor: 'white',
        bgColor: 'rgba(141, 198, 63, 0.1)'
    }];

    this.getInfo = getInfo;

    //////////////////////////////////////

    function getInfo(type) {
        return _.find(service.labels, 'model', type);
    }
}).directive('labelStyle', function (ThreadLabelService) {
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            var labelInfo = ThreadLabelService.getInfo(attrs.labelStyle);
            if (labelInfo) {
                element.css({
                    'background-color': labelInfo.color,
                    'color': labelInfo.textColor
                });
            }
        }
    };
});
'use strict';

angular.module('modules.thread.timeline', []);
angular.module('modules.thread.timeline').directive('threadTimelineItem', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/forum/thread-timeline/tpls/thread-timeline-item.html',
        scope: {
            item: '=',
            parent: '=',
            timeline: '='
        },
        controller: function controller($scope) {
            $scope.iconMap = {
                label: 'label',
                update: 'person',
                closed: 'close',
                open: 'done'
            };
        }
    };
}).directive('threadTimeline', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/forum/thread-timeline/tpls/thread-timeline.html',
        scope: {
            parent: '=',
            timeline: '=',
            saveFn: '&',
            userPermissions: '='
        },
        controller: function controller($scope, PostService, $timeout) {
            $scope.loading = true;
            PostService.getPosts($scope.parent).then(function (response) {
                $scope.loading = false;
                _.forEach(response.data, function (item) {
                    item.event = 'post';
                });
                $scope.timeline = $scope.timeline.concat(response.data);
            });

            $scope.deleteItem = deleteItem; //function(index)

            ////////////////////////////

            function deleteItem(index) {
                $scope.timeline.splice(index, 0);
                $timeout($scope.saveFn, 1);
            }
        }
    };
}).service('ThreadTimelineService', function (Authentication, XxhashService) {
    this.processSave = processSave;

    //////////////////////////////////////////

    function processSave(intialData, newData) {
        var eventObject = {
            timestamp: moment().format(),
            user: {
                _id: Authentication.currentUser._id,
                name: Authentication.currentUser.name,
                stub: Authentication.currentUser.stub
            }
        };

        if (intialData.published && newData.published) {
            // Changes -----------------------------------------
            if (getHash(intialData) != getHash(newData)) {
                newData.timeline.push(_.extend({}, eventObject, {
                    event: 'update'
                }));
            }

            // Process Tags ------------------------------------
            var removedLabels = _.difference(intialData.labels, newData.labels);
            var addedLabels = _.difference(newData.labels, intialData.labels);
            if (removedLabels.length > 0 || addedLabels.length > 0) {
                newData.timeline.push(_.extend({}, eventObject, {
                    added: addedLabels,
                    removed: removedLabels,
                    event: 'label'
                }));
            }

            // Process Closed/Open -----------------------------
            if (intialData.closed != newData.closed) {
                newData.timeline.push(_.extend({}, eventObject, {
                    event: newData.closed ? 'closed' : 'open'
                }));
            }
        }

        // Remove posts
        var newDataCopy = _.cloneDeep(newData);
        var goodTimeline = [];
        _.forEach(newDataCopy.timeline, function (item) {
            if (item.event != 'post') {
                goodTimeline.push(item);
            }
        });
        newDataCopy.timeline = goodTimeline;

        return newDataCopy;

        //////////////////////


        function getHash(entity) {
            var sectionClone = _.cloneDeep(entity.sectionData);
            sectionClone.sections = _.map(sectionClone.sections, function (section) {
                return { content: section.content };
            });
            return XxhashService(JSON.stringify(sectionClone), 0xABCD).toString();
        }
    }
});
'use strict';

angular.module('modules.horizontal-menu', ['modules.search', 'modules.authentication', 'modules.notifications', 'modules.layout-options', 'modules.project', 'modules.site-search', 'modules.top-banner']);
// modules.search - Used for the search box in template
angular.module('modules.horizontal-menu').directive('mainHorizontalMenu', function ($window, $mdSidenav) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'app/modules/horizontal-menu/tpls/main-horizontal-menu.html',
        controller: function controller($rootScope, $scope, $window, Authentication, LayoutOptions, AuthenticationModalService, ProjectCreateModalService, MenuItems, $mdMedia, $timeout, $state, HorizontalMenuService, NewCreationsService) {
            $scope.user = Authentication.currentUser;
            $scope.LayoutOptions = LayoutOptions;
            $scope.HorizontalMenuService = HorizontalMenuService;
            $scope.$mdMedia = $mdMedia;
            $scope.$state = $state;

            // Set the tab using the current state
            $scope.MenuItems = MenuItems;

            // Set functions to scope -----------------------------------------
            $scope.openLoginModal = function (event) {
                AuthenticationModalService.login(event);
            };
            $scope.newSomething = function (event) {
                NewCreationsService.createModal(event);
            };
            $scope.toggleMenu = toggleMenu; // function()


            // Watch the menu, if it is open, remove the disabled scroll
            $scope.$watch(function () {
                if ($mdSidenav('left').isOpen()) {
                    LayoutOptions.body.disableScroll = true;
                } else {
                    LayoutOptions.body.disableScroll = false;
                }
            });

            // Hoisted functions ----------------------------------------------
            function toggleMenu() {
                $mdSidenav('left').toggle().then(function () {
                    console.log('toggle');
                });
            }
        }
    };
}).service('HorizontalMenuService', function ($rootScope) {
    var service = this;

    this.enabled = '';
    this.enable = enable; //function(true||false)

    enable(true);

    ////////////////////////////////////////////////////////////

    function enable(status) {
        service.enabled = status === false ? false : true;
        if (service.enabled) {
            angular.element(document.body).addClass('fixed-menu');
        } else {
            angular.element(document.body).removeClass('fixed-menu');
        }
    }
}).directive('userSettingsDropdown', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/horizontal-menu/tpls/user-settings-dropdown.html',
        controller: 'userSettingsCtrl'
    };
}).directive('userSettingsSidebar', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/horizontal-menu/tpls/user-settings-sidebar.html',
        controller: 'userSettingsCtrl'
    };
}).controller('userSettingsCtrl', function ($scope, Authentication, MenuItems, LayoutOptions, ProjectCreateModalService, OrganisationModalService, $state, $mdToast, AuthenticationModalService, $mdSidenav, NewCreationsService) {
    $scope.user = Authentication.currentUser;
    $scope.MenuItems = MenuItems;

    $scope.newSomething = function (event) {
        NewCreationsService.createModal(event);
    };
    $scope.newOrganisation = function (event) {
        OrganisationModalService.organisationNewModal(event).then(function (result) {
            $state.go('app.organisation.settings.overview', {
                stub: result.stub
            });
        });
    };
    $scope.login = AuthenticationModalService.login; // function($event)
    $scope.close = function () {
        $mdSidenav('left').close();
    };

    $scope.popLogout = function () {
        $mdToast.show($mdToast.simple().theme('warn').content('Goodbye. Hope to see you again soon :)'));
    };

    $scope.menu = [{
        label: 'My profile',
        href: '/users/' + $scope.user.stub
    }, {
        label: 'My Creations',
        href: "/creations"
    }, {
        label: 'My Job Applications',
        href: "/applications"
    }, {
        label: 'Create something',
        click: function click(event) {
            NewCreationsService.createModal(event);
        },
        divider: true
    }, {}, {
        label: 'Settings',
        href: '/settings/account'
    }, {
        label: 'Sign out',
        click: function click(event) {
            $scope.user.logout();
            $scope.popLogout();
        }
    }];
}).directive('stickOnScrollUp', function ($window) {
    return {
        restrict: 'A',
        link: function link(scope, element, attr) {
            // Hide Header on on scroll down
            var didScroll;
            var lastScrollTop = 0;
            var delta = 5;

            var windowEl = angular.element($window);
            var navbarHeight = element[0].offsetHeight;

            windowEl.on('scroll', function (event) {
                didScroll = true;
            });

            setInterval(function () {
                if (didScroll) {
                    hasScrolled();
                    didScroll = false;
                }
            }, 250);

            ////////////////////////////////////////

            function hasScrolled() {
                var st = windowEl.scrollTop();

                // Make sure they scroll more than delta
                if (Math.abs(lastScrollTop - st) <= delta) return;

                if (st > lastScrollTop && st > navbarHeight) {
                    // Scroll Down
                    hide();
                } else {
                    // Scroll Up
                    show();
                }

                lastScrollTop = st;
            }

            function hide() {
                element.css({ transform: 'translateY(-' + navbarHeight + 'px)' });
            }
            function show() {
                element.css({ transform: 'translateY(0px)' });
            }
        }
    };
}).directive('dockToMenu', function ($window) {
    return {
        restrict: 'A',
        link: function link(scope, element, attr) {
            // This will dock the element with the horizontal menu
            // This is done by adding padding-top to the element if we
            // are at the top of the page
            var windowEl = angular.element($window);

            if (attr.dockToMenu != 'false') {
                dockToMenu();
                windowEl.on('scroll', scope.$apply.bind(scope, dockToMenu));
            }

            // Hoisted functions --------------------------------------------
            function dockToMenu() {
                var scrollPosition = windowEl.scrollTop();
                if (scrollPosition < 64) {
                    element.css({ 'padding-top': 64 - scrollPosition + 'px' });
                } else {
                    element.css({ 'padding-top': '0px' });
                }
            }
        }
    };
}).run(function ($rootScope, CoreLibrary, MenuItems) {
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        var toStateDetailed = toState.$$state();
        // Set menu items
        var menu = CoreLibrary.checkStateParents(toStateDetailed, 'menu');
        MenuItems.main = menu.main;
        MenuItems.more = menu.more;
        MenuItems.setBodyClasses();
    });
}).service('MenuItems', function () {
    var service = this;
    this.setBodyClasses = setBodyClasses; // function()
    this.main = [];
    this.more = [];

    //////////////////////

    function setBodyClasses() {
        // Add the no-tabs class to body if there are no tabs
        if (service.main && service.main.length === 0) {
            angular.element(document.body).addClass('no-tabs');
        } else {
            angular.element(document.body).removeClass('no-tabs');
        }
    }
});
'use strict';

(function () {
    'use strict';

    angular.module('modules.http', []);

    angular.module('modules.http').service('HttpService', HttpService).service('HttpQuery', HttpQuery).service('QueryParamsService', QueryParamsService);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function QueryParamsService($state, $location, $timeout) {
        this.set = set; // function(paramName, paramVal)

        //////////////////

        function set(paramName, paramVal) {
            $state.current.reloadOnSearch = false;
            $location.search(paramName, paramVal);
            $timeout(function () {
                $state.current.reloadOnSearch = undefined;
            });
        }
    }

    function HttpService($http, $q, $mdToast) {
        return function (query) {
            return $http(query).then(function (response) {
                return response.data;
            }).catch(function (response) {
                return $q.reject(response);
            });
        };
    }

    function HttpQuery(HttpService, QueryParamsService, $timeout, $stateParams, $rootScope) {
        var lib = function lib(configObject) {
            /*******************************************
              configObject = {
                url: 'request url',
                urlParams: ['sort', 'order'] - These are the query params to appear in the url when they change
                params: {
                    size
                    page
                    etc
                }
                onSuccess: function(results){
                    do some stuff then:
                    return results
                },
                requerySize: 20 - If there is a value here, we requery page 1 and subsequent pages with this larger size;
            }
            *******************************************/

            var updateUrlQueryParamsTimeout;
            var updateUrlQueryParamsTime = 1000;
            var defaultParams = angular.copy(configObject.params);
            var queryObject = { params: {} };

            // Query Parameters
            queryObject.params.page = 0;
            queryObject.params.size = 10;

            // Extend by the config object
            queryObject.params = _.merge(queryObject.params, configObject.params);

            // Extend the params by anything in the $stateParams that match the urlParams array
            queryObject.params = extendParamsByStateParams(queryObject.params);

            // Cancel the updateQueryParams promise if state changes
            $rootScope.$on('$stateChangeStart', function () {
                $timeout.cancel(updateUrlQueryParamsTimeout);
            });

            // Other setup
            queryObject.loading = false;

            // Functions
            queryObject.get = get;
            queryObject.setGet = setGet;
            queryObject.more = more;
            queryObject.refresh = refresh;
            queryObject.success = success;
            queryObject.updateQueryParams = updateQueryParams;

            // Add the get function if appropriate
            if (configObject.url) {
                queryObject.setGet(configObject.url);
            }

            return queryObject;

            //////////////////////////////////////////////////////////////////

            function get() {
                console.log('You must assign get function');
            }

            function setGet(getUrl) {
                // This will setup the standard get function
                queryObject.get = function () {
                    queryObject.loading = true;
                    HttpService({
                        url: getUrl,
                        method: 'GET',
                        params: queryObject.params
                    }).then(queryObject.success);
                };
            }
            function more() {
                // If we have a requery size, we requery the first page with a larger size
                if (configObject.requerySize && queryObject.params.page == 1 && queryObject.params.size != configObject.requerySize) {
                    queryObject.params.size = configObject.requerySize;
                } else {
                    queryObject.params.page++;
                }
                queryObject.get();
            }

            function refresh() {
                queryObject.params.page = 1;
                queryObject.get();
            }

            function success(response) {
                // If there is an onSuccess function, run it
                if (configObject.onSuccess) {
                    response = configObject.onSuccess(response);
                }
                if (queryObject.params.page == 1) {
                    queryObject.notEnoughResults = response.length < queryObject.params.size;
                    queryObject.results = [];
                }
                queryObject.loading = false;
                queryObject.results = queryObject.results.concat(response);
                queryObject.noMoreResults = response.length < queryObject.params.size;
            }

            function extendParamsByStateParams(params) {
                var paramsExtended = angular.copy(params);
                _.forEach(configObject.urlParams, function (urlParam) {
                    if ($stateParams[urlParam]) {
                        paramsExtended[urlParam] = $stateParams[urlParam];
                    }
                });
                return paramsExtended;
            }

            function updateQueryParams() {
                $timeout.cancel(updateUrlQueryParamsTimeout);
                updateUrlQueryParamsTimeout = $timeout(function () {
                    // Update the url query params if they are in the 'urlParams' list
                    _.forEach(configObject.urlParams, function (urlParam) {
                        // If the query param exists and it is not equal to the default
                        if (queryObject.params[urlParam] && queryObject.params[urlParam] != defaultParams[urlParam]) {
                            QueryParamsService.set(urlParam, queryObject.params[urlParam]);
                        } else {
                            QueryParamsService.set(urlParam, null);
                        }
                    });
                }, updateUrlQueryParamsTime);
            }
        };

        return lib;
    }
})();
'use strict';

angular.module('modules.idle', []);
angular.module('modules.idle').

/*****************************************************************
This module will emmit events when the app becomes active/inactive

$rootScope.$on('Idle.active', function() {
    console.log('active');
});

$rootScope.$on('Idle.active', function() {
    console.log('inactive');
});

*****************************************************************/
run(function (IdleService) {
    IdleService.watch();
}).service('IdleService', function ($timeout, $interval, $rootScope) {
    var service = this;
    var inactiveTime = 30 * 1000; // The number of seconds before the app is deemed inactive

    this.watch = watch;
    this.idleTimeout = '';
    this.status = 'active'; // active || inactive;
    this.newIdleTimeout = newIdleTimeout;

    service.newIdleTimeout(); // Initialise timeout
    ///////////////////////////////////////

    function newIdleTimeout() {
        service.idleTimeout = $timeout(function () {
            $rootScope.$broadcast('Idle.inactive');
            service.status = 'inactive';
        }, inactiveTime);
    }

    function watch() {
        var interrupt = 'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll';
        angular.element(document.body).on(interrupt, function () {
            if (service.status == 'inactive') {
                $rootScope.$broadcast('Idle.active');
            }
            service.status = 'active';
            $timeout.cancel(service.idleTimeout);
            service.newIdleTimeout();
        });
    }
});
'use strict';

angular.module('modules.intercom', []);
angular.module('modules.intercom').run(function ($timeout, $rootScope, Authentication, CoreLibrary) {

    window.Intercom("boot", {
        app_id: "k5sc7t8b"
    });

    ////////////////////////////////////////////

    $timeout(function () {
        if (Authentication.currentUser.isLoggedIn()) {
            window.Intercom("boot", {
                app_id: "k5sc7t8b",
                name: Authentication.currentUser.name,
                user_id: Authentication.currentUser._id,
                email: Authentication.currentUser.email,
                created_at: CoreLibrary.getDateFromId(Authentication.currentUser._id).getTime() / 1000
            });
        } else {
            window.Intercom("boot", {
                app_id: "k5sc7t8b"
            });
        }
    }, 1000);

    $rootScope.$on('authentication.logIn', function () {
        window.Intercom("update", {
            name: Authentication.currentUser.name,
            user_id: Authentication.currentUser._id,
            email: Authentication.currentUser.email,
            created_at: CoreLibrary.getDateFromId(Authentication.currentUser._id).getTime() / 1000
        });
    });

    $rootScope.$on('authentication.logOut', function () {
        if (window.Intercom) {
            window.Intercom("shutdown");
        }
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        window.Intercom("update");
    });
});
'use strict';

angular.module('modules.invite', []);
angular.module('modules.invite').directive('showInviteLinkModal', function ($mdDialog) {
    return {
        restrict: 'A',
        scope: {
            parent: '=',
            group: '@?',
            role: '@?',
            modalCallback: '&?'
        },
        link: function link(scope, element, attrs) {
            element.bind('click', function (event) {
                var data = {
                    parentId: scope.parent._id,
                    parentType: scope.parent.type,
                    group: scope.group,
                    role: scope.role
                };
                return $mdDialog.show({
                    templateUrl: 'app/modules/invite/tpls/invite-link-modal.html',
                    controller: function controller(data, $scope, InviteService, Authentication) {
                        $scope.type = data.parentType;
                        InviteService.generateInviteCode({
                            parentId: data.parentId,
                            parentType: data.parentType
                        }).then(function (result) {
                            $scope.url = 'https://stemn.com?invitecode=' + result.data._id;
                            if (data.group) {
                                $scope.url = $scope.url + '&invitegroup=' + data.group;
                            }
                            if (data.role) {
                                $scope.url = $scope.url + '&inviterole=' + data.role;
                            }
                            if (Authentication.currentUser.ref) {
                                $scope.url = $scope.url + '&ref=' + Authentication.currentUser.ref;
                            }
                        });
                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };
                    },
                    locals: { data: data },
                    clickOutsideToClose: true,
                    targetEvent: event
                }).then(scope.modalCallback).catch(scope.modalCallback);
            });
        }
    };
}).service('InviteService', function ($rootScope, $stateParams, $state, $location, $localStorage, $http, $mdToast, Authentication, AuthenticationModalService) {
    var service = this;
    this.setInviteCode = setInviteCode; //function()
    this.getInviteCode = getInviteCode; //function()
    this.sendInviteCode = sendInviteCode; //function()
    this.generateInviteCode = generateInviteCode; //function({parentId, parentType})

    $rootScope.$on('authentication.logIn', function () {
        // Send invite code on login.
        service.sendInviteCode();
    });

    ////////////////////////////////////////////////

    function setInviteCode() {
        $state.current.reloadOnSearch = false;
        $location.search('invitecode', null);
        $location.search('inviterole', null);
        $location.search('invitegroup', null);
        if ($stateParams.invitecode) {
            // TODO - remove this when toy is done
            $stateParams.invitecode = removeRef($stateParams.invitecode);
            // Set to memory
            $localStorage.inviteCode = $stateParams.invitecode;
            $localStorage.inviteRole = decodeURIComponent($stateParams.inviterole);
            $localStorage.inviteGroup = decodeURIComponent($stateParams.invitegroup);
            if (Authentication.currentUser.isLoggedIn()) {
                service.sendInviteCode();
            } else {
                $mdToast.show({
                    controller: function controller($scope, $mdToast) {
                        $scope.closeToast = function () {
                            $mdToast.hide();
                            AuthenticationModalService.login(event);
                        };
                    },
                    template: '<md-toast>' + '<span flex>You\'ve been invited to a project. <b>{{result.name}}</b></span>' + '<md-button ng-click="closeToast()">' + 'Click here to join' + '</md-button>' + '</md-toast>',
                    hideDelay: 15000
                });
            }
        }
    }

    function getInviteCode() {
        var invite = {
            inviteCode: $localStorage.inviteCode,
            inviteRole: $localStorage.inviteRole,
            inviteGroup: $localStorage.inviteGroup
        };
        return invite;
    }

    function sendInviteCode() {
        if (service.getInviteCode()) {
            $http({
                url: '/api/v1/invite/accept',
                method: "GET",
                params: {
                    inviteId: service.getInviteCode().inviteCode,
                    role: service.getInviteCode().inviteRole,
                    group: service.getInviteCode().inviteGroup
                }
            }).success(function (result) {
                $mdToast.show({
                    controller: function controller($scope, $mdToast, CoreLibrary) {
                        $scope.sref = CoreLibrary.getSref(result.type, result.stub);
                        $scope.closeToast = function () {
                            $mdToast.hide();
                        };
                        $scope.result = result;
                    },
                    template: '<md-toast>' + '<span flex>You\'ve been invited to the {{result.type}}: <b>{{result.name}}</b></span>' + '<md-button ui-sref="{{sref}}" ng-click="closeToast()">' + 'View {{result.type}}' + '</md-button>' + '</md-toast>',
                    hideDelay: 15000
                });
                delete $localStorage.inviteCode; // remove code from localstorage
                delete $localStorage.inviteRole; // remove code from localstorage
                delete $localStorage.inviteGroup; // remove code from localstorage
            }).catch(function () {
                delete $localStorage.inviteCode; // remove code from localstorage
                delete $localStorage.inviteRole; // remove code from localstorage
                delete $localStorage.inviteGroup; // remove code from localstorage
            });
        }
    }

    function generateInviteCode(data) {
        if (data.parentId && data.parentType) {
            return $http({
                url: '/api/v1/invite',
                method: "GET",
                params: {
                    parentType: data.parentType,
                    parentId: data.parentId
                }
            });
        }
    }

    function removeRef(param) {
        // TODO - remove this when toy is done
        return param.split('?ref')[0];
    }
});
"use strict";
;'use strict';

angular.module('modules.jobs', []);
angular.module('modules.jobs').directive('jobRows', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            parentType: '@',
            parentId: '@',
            size: '@',
            currentJobId: '@', // Hide the current job from the list
            hideMore: '=?', // Hides the more button
            query: '=?', // Query object to be passed up to the parent
            near: '=?' // Near location
        },
        templateUrl: 'app/modules/jobs/tpls/job-rows.html',
        controller: function controller($scope, HttpQuery, SearchService) {
            $scope.size = $scope.size || 6;

            $scope.query = HttpQuery({
                url: '/api/v1/search',
                params: {
                    type: 'job',
                    size: $scope.size,
                    key: 'name',
                    select: ['name', 'organisation', 'location.name', 'pay', 'jobType', 'level', 'stub', 'organisations'],
                    parentType: $scope.parentType,
                    parentId: $scope.parentId,
                    near: $scope.near,
                    radius: 0
                }
            });
            $scope.query.more();
            //            if($scope.parentId){
            //            }
        }
    };
}).directive('jobTile', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            entityId: '@?'
        },
        templateUrl: 'app/modules/jobs/tpls/job-tile.html',
        controller: function controller($scope, EntityService, CoreLibrary) {
            $scope.loading = true;
            EntityService.get('job', $scope.entityId, 'sm').then(function (response) {
                $scope.item = response;
                $scope.item.url = CoreLibrary.getHref('job', response.stub);
                $scope.loading = false;
            });
        }
    };
}).directive('resubmitApplicationButton', function () {
    return {
        restrict: 'EA',
        scope: {
            application: '=',
            resubmitted: '=?'
        },
        templateUrl: 'app/modules/jobs/tpls/resubmit-application-button.html',
        controller: function controller($scope, EntityService, $mdToast) {
            $scope.resubmitApplication = function () {
                $scope.application.status.state = 'pendingReview';
                $scope.resubmitted = true;
                EntityService.update('application', $scope.application).then(function () {
                    $mdToast.show($mdToast.simple().content('Application successfully resubmitted.'));
                });
            };
        }
    };
}).directive('applicationRows', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            parentType: '@',
            parentId: '@',
            job: '=?'
        },
        templateUrl: 'app/modules/jobs/tpls/application-rows.html',
        controller: function controller($scope, HttpQuery, SearchService) {
            $scope.query = HttpQuery({
                url: '/api/v1/search',
                params: {
                    type: 'application',
                    size: 6,
                    parentType: $scope.parentType,
                    parentId: $scope.parentId
                },
                onSuccess: function onSuccess(response) {
                    return response;
                }
            });
            $scope.query.more();
        }
    };
}).directive('applyButton', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            job: '=?', // Users to pass job.organisations[0].name to apply modal
            jobId: '@',
            jobStub: '@',
            changeState: '@', // true || false - will go to the job state when true
            textApplied: '@?',
            textApply: '@?',
            buttonStatus: '=?' // Status to be used in parent scope
        },
        templateUrl: 'app/modules/jobs/tpls/apply-button.html',
        controller: function controller($scope, $state, $timeout, ApplicationService, JobModalService, Authentication) {
            if (Authentication.currentUser.isLoggedIn()) {
                ApplicationService.getStatus($scope.jobId).then(function (response) {
                    $scope.buttonStatus = response;
                });
            }

            $scope.jobApply = function (event) {

                // If we have applied - go to the application
                if ($scope.buttonStatus.status) {
                    $state.go('app.application', { stub: $scope.buttonStatus.status });
                } else if ($scope.changeState) {
                    $state.go('app.job', { stub: $scope.jobStub || $scope.jobId }).then(function (response) {
                        $timeout(function () {
                            popApplyModal(event);
                        }, 200);
                    });
                } else {
                    popApplyModal(event);
                }
            };

            function popApplyModal(event) {
                JobModalService.applyForJob(event, $scope.job).then(function (application) {
                    ApplicationService.sendApplication($scope.jobId, application).then(function (response) {
                        JobModalService.applicationSuccess(event, response);
                        $scope.buttonStatus.status = response._id;
                    });
                });
            }
        }
    };
}).service('JobModalService', function ($mdDialog) {
    this.applyForJob = applyForJob;
    this.createJob = createJob;
    this.applicationSuccess = applicationSuccess; // function(event, application)

    ///////////////////////////

    function createJob(event, data) {
        return $mdDialog.show({
            templateUrl: 'app/modules/jobs/tpls/create-job-modal.html',
            controller: function controller(data, $scope, $state, Authentication, $mdToast, UserService, OrganisationService, NewCreationsService, OrganisationModalService, HttpQuery) {

                $scope.entity = {
                    organisations: []
                };

                $scope.queryOrganisations = HttpQuery({
                    url: '/api/v1/search',
                    params: {
                        type: 'organisation',
                        size: 3,
                        sort: 'submitted',
                        'select[]': ['name'],
                        parentType: 'user',
                        parentId: Authentication.currentUser._id
                    }
                });
                $scope.queryOrganisations.more();

                $scope.createOrganisation = function (event) {
                    OrganisationModalService.organisationNewModal(event).then(function (result) {
                        $state.go('app.organisation.settings.overview', {
                            stub: result.stub
                        });
                    });
                };

                $scope.confirm = function () {
                    if ($scope.form.$valid) {
                        NewCreationsService.create('job', $scope.entity);
                        $mdDialog.hide();
                    } else {
                        $mdToast.show($mdToast.simple().theme('warn').content('Organisation or name is missing'));
                    }
                };

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
            },
            locals: { data: data },
            targetEvent: event,
            clickOutsideToClose: true
        });
    }

    function applicationSuccess(event, data) {
        return $mdDialog.show({
            templateUrl: 'app/modules/jobs/tpls/application-success-modal.html',
            controller: function controller($scope, $state) {
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
                $scope.confirm = function () {
                    $state.go('app.applications');
                };
            },
            targetEvent: event,
            clickOutsideToClose: true
        });
    }

    function applyForJob(event, job) {
        return $mdDialog.show({
            templateUrl: 'app/modules/jobs/tpls/job-application-modal.html',
            controller: function controller(job, $scope, $state, Authentication, $mdToast, HttpQuery, LocationService, $http, EntityService) {
                $scope.job = job;
                $scope.forms = {};

                // Get User, Job and Projects
                EntityService.get('user', Authentication.currentUser._id, 'lg').then(function (response) {
                    $scope.user = response;
                });
                EntityService.get('job', job._id, 'lg').then(function (response) {
                    $scope.job = response;
                });

                $scope.application = {
                    email: Authentication.currentUser.email,
                    coverLetter: ''
                };

                $http({
                    method: 'GET',
                    url: '/api/v1/jobs/matchRating',
                    params: {
                        jobId: job._id,
                        userId: Authentication.currentUser._id
                    }
                }).then(function (response) {
                    $scope.matchRating = response.data.matchRating;
                });

                // Get the user's projects
                $scope.projectsQuery = HttpQuery({
                    url: '/api/v1/search',
                    params: {
                        type: 'project',
                        size: 3,
                        sort: 'submitted',
                        select: ['name', 'stub', 'picture', 'blurb'],
                        parentType: 'user',
                        parentId: Authentication.currentUser._id
                    }
                });
                $scope.projectsQuery.more();

                $scope.activeTab = 'Requirements';
                $scope.tabs = [{
                    label: 'Requirements',
                    click: function click() {
                        $scope.activeTab = 'Requirements';
                    }
                }, {
                    label: 'Cover Letter',
                    click: function click() {
                        $scope.activeTab = 'Cover Letter';
                    }
                }, {
                    label: 'Other Info',
                    click: function click() {
                        $scope.activeTab = 'Other Info';
                    }
                }];
                $scope.isFailedRequiredFields = function () {
                    return _.find($scope.job.requiredFields, 'active', false);
                };

                $scope.isFailedRequiredProjects = function () {
                    return !$scope.projectsQuery.results || $scope.projectsQuery.results.length < 2;
                };

                $scope.isFailedRequirements = function () {
                    return $scope.isFailedRequiredProjects() || $scope.isFailedRequiredFields();
                };

                $scope.steps = {
                    'Requirements': {
                        nextText: 'Next',
                        nextFn: function nextFn() {
                            $scope.activeTab = 'Cover Letter';
                        },
                        isDisabled: $scope.isFailedRequirements //function()
                    },
                    'Cover Letter': {
                        nextText: 'Next',
                        nextFn: function nextFn() {
                            $scope.activeTab = 'Other Info';
                        }
                    },
                    'Other Info': {
                        nextText: 'Submit',
                        nextFn: function nextFn() {
                            EntityService.update('user', $scope.user);
                            $mdDialog.hide($scope.application);
                        },
                        isDisabled: function isDisabled() {
                            return $scope.forms.infoForm && $scope.forms.infoForm.$invalid;
                        }
                    }
                };

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
            },
            locals: { job: job },
            targetEvent: event
        });
    }
}).service('ApplicationService', function (HttpService, LocalCache, Authentication) {
    var service = this;
    this.getStatus = getStatus; // function(jobId)
    this.sendApplication = sendApplication; // function(jobId, application)

    ///////////////////////////////////

    function getStatus(jobId) {
        var getPromise = function getPromise(jobId) {
            return HttpService({
                url: '/api/v1/social',
                method: "GET",
                params: {
                    socialType: 'application',
                    'parentIds[]': jobId,
                    childId: Authentication.currentUser._id
                }
            });
        };
        return LocalCache.getPackaged('application-status', jobId, getPromise);
    }

    function sendApplication(jobId, application) {
        return HttpService({
            method: 'POST',
            url: 'api/v1/jobs/' + jobId + '/apply',
            data: application
        }).then(function (response) {
            LocalCache.save('application-status', {
                _id: jobId,
                status: response._id
            });
            return response;
        });
    }
}).service('JobService', function (HttpService, LocalCache, CoreLibrary) {
    this.getJob = getJob; // function(jobId)
    this.createJob = createJob; // function(job)
    this.updateJob = updateJob; // function(job)
    this.deleteJob = deleteJob; // function(jobId)


    var endpoint = 'job';
    var selectSm = ['stub', 'name', 'picture', 'blurb'];
    var selectMd = ['stub', 'name', 'picture', 'blurb', 'created', 'updated', 'fields', 'organisations', 'team', 'likes', 'numComments', 'location'];
    var selectLg = ['*'];

    //////////////////////////////////////////


    function getJob(stubOrId, select) {

        // Default the selectFields
        var selectFields;
        if (select == 'sm') {
            selectFields = selectSm;
        } else if (select == 'md') {
            selectFields = selectMd;
        } else {
            selectFields = selectLg;
            select = 'lg';
        }

        var getPromise = function getPromise(data) {
            // data - [asfasffsa, asfafsasfasf] - Array of user ids
            return HttpService({
                url: '/api/v1/jobs',
                method: "GET",
                params: {
                    'select[]': selectFields,
                    'ids[]': data
                }
            });
        };
        return LocalCache.getPackaged(endpoint + select, stubOrId, getPromise);
    }

    function createJob(entity) {
        return HttpService({
            method: 'POST',
            url: 'api/v1/jobs',
            data: entity
        });
    }

    function updateJob(entity) {
        LocalCache.save(endpoint + 'lg', entity);
        return HttpService({
            method: 'PUT',
            url: 'api/v1/jobs/' + entity._id,
            data: entity
        });
    }

    function deleteJob(entityId) {
        return HttpService({
            url: '/api/v1/jobs/' + entityId,
            method: "DELETE"
        });
    }
});
'use strict';

angular.module('modules.keyboard-navigation', []);
angular.module('modules.keyboard-navigation').directive('listKeyboardNavigation', function (SearchService) {
    // This must be used with ng-class to apply the selector
    return {
        restrict: 'A',
        scope: {
            enable: '=',
            list: '=', // list items array
            activeIndex: '=', // index of the active item
            selector: '@', // css selector
            escFn: '&?' // function to be run when escape is pressed
        },
        controller: function controller($scope, $timeout, $document, CoreLibrary) {
            var rawSelected;

            $scope.activeIndex = 0;
            $scope.$watch('enable', function () {
                if ($scope.enable) {
                    rawSelected = 0;
                    $scope.activeIndex = 0;
                    $document.on('keydown', onKeydown);
                } else {
                    rawSelected = 0;
                    $scope.activeIndex = 0;
                    $document.off('keydown', onKeydown);
                }
            });
            $scope.$on('$destroy', onDestroy);

            //////////////////////////////////
            function onKeydown(event) {
                if (event.keyCode == CoreLibrary.keyCodes.ESCAPE) {
                    event.preventDefault();
                    $scope.escFn();
                    $scope.$apply();
                } else if (event.keyCode == CoreLibrary.keyCodes.UPARROW) {
                    event.preventDefault();
                    rawSelected--;
                    if (rawSelected == -1) {
                        rawSelected = $scope.list.length - 1;
                    }
                    $scope.activeIndex = rawSelected % $scope.list.length;
                    $scope.$apply();
                } else if (event.keyCode == CoreLibrary.keyCodes.DOWNARROW) {
                    event.preventDefault();
                    rawSelected++;
                    $scope.activeIndex = rawSelected % $scope.list.length;
                    $scope.$apply();
                } else if (event.keyCode == CoreLibrary.keyCodes.RETURNKEY) {
                    event.preventDefault();
                    event.stopPropagation();
                    // We evaluate the ng-click
                    angular.element('.' + $scope.selector).trigger('click');
                }
            };

            function onDestroy() {
                $document.off('keydown', onKeydown);
            }
        }
    };
});
'use strict';

angular.module('modules.layout-options', []);
angular.module('modules.layout-options').run(function ($timeout, $rootScope, LayoutOptions, HorizontalMenuService, TopBannerService, CoreLibrary) {
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        // Reset all the layout options to false.
        LayoutOptions.default();

        var toStateDetailed = toState.$$state();

        // Set layout
        var layout = CoreLibrary.checkStateParents(toStateDetailed, 'layout');
        if (layout) {
            if (layout.size == 'lg') {
                LayoutOptions.body.size = 'lg';
            }
            if (layout.size == 'md') {
                LayoutOptions.body.size = 'md';
            }
            if (layout.topBanner === false) {
                TopBannerService.hideBanner();
            }
            if (layout.footer === true) {
                LayoutOptions.footer.hideFooter = false;
            }
            if (layout.chat === false) {
                LayoutOptions.chat.hideButton = true;
            }
            if (layout.hideOverflow === true) {
                LayoutOptions.body.hideOverflow = true;
            }
            if (layout.bgColor) {
                LayoutOptions.body.color = layout.bgColor;
            }
        }
        layout = layout || {};
        HorizontalMenuService.enable(layout.horizontalMenu);
    });
}).service('LayoutOptions', function ($timeout, TopBannerService, Authentication) {
    var lib = {
        header: {},
        body: {},
        footer: {},
        overlay: {},
        settings: {},
        back: {},
        chat: {},
        // Default function is run on StateChange
        // Special layout are set from within sub-controllers
        default: function _default() {
            lib.header.landing = false;
            lib.body.hideOverflow = false;
            lib.body.disableScroll = false;
            lib.body.size = 'sm'; // sm || md || lg - This adjusts the content container size
            lib.body.color = '#fff';
            lib.footer.hideFooter = true;
            lib.footer.hideSubFooter = false;
            lib.footer.hideMainFooter = false;
            lib.overlay.highlight = false;
            lib.overlay.loading = false;
            lib.settings.showSettings = false;
            lib.chat.hideButton = false;

            if (!Authentication.currentUser.isLoggedIn() || !Authentication.currentUser.verified) {
                if (!TopBannerService.banner.closed) {
                    TopBannerService.showBanner();
                }
            }
        }
    };
    return lib;
});
'use strict';

angular.module('modules.lazy-loading', []);
angular.module('modules.lazy-loading').directive('blurLoad', function ($timeout, $window, LazyLoadingService) {
    return {
        restrict: 'E',
        link: function link(scope, element, attrs) {
            var $body = angular.element(document.body);
            var windowEl = angular.element($window);
            var scaleParam = attrs.bgSrc.split('?').length == 1 ? '?scale=auto' : '&scale=auto';

            var imgSmall = new Image();
            imgSmall.className = "placeholder";
            imgSmall.src = attrs.bgSrc + scaleParam;
            element.append(imgSmall);
            setWidth();

            var imgLarge;
            windowEl.on('scroll', onScroll);
            scope.$on('$destroy', onDestroy);
            onScroll();

            //////////////////////////////////////////////////

            function onScroll() {
                if (LazyLoadingService.isElementInViewport(element[0])) {
                    if (!imgLarge) {
                        imgLarge = new Image();
                        imgLarge.className = "large";
                        imgLarge.src = attrs.bgSrc;
                        element.append(imgLarge);
                        imgLarge.onload = function () {
                            imgLarge.className = "large show";
                            windowEl.off('scroll', onScroll);
                        };
                    }
                }
            }

            function onDestroy() {
                windowEl.off('scroll', onScroll);
            }

            function setWidth() {
                if (attrs.bgWidth) {
                    if (parseInt(attrs.bgWidth) <= parseInt(attrs.bgMaxWidth)) {
                        angular.element(element).css({ width: attrs.bgWidth + 'px' });
                    } else {
                        angular.element(element).css({ 'width': attrs.bgMaxWidth + 'px' });
                    }
                } else if (attrs.bgWidth) {
                    angular.element(element).css({ width: attrs.bgMaxWidth + 'px' });
                }
            }
        }
    };
}).directive('blurLoadBg', function ($timeout, $window, LazyLoadingService) {
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            var windowEl = angular.element($window);

            var scaleParam = attrs.bgSrc.split('?').length == 1 ? '?scale=auto' : '&scale=auto';
            element.addClass('blur-load-bg');
            var placeholder = element.clone();
            placeholder.css({ 'background-image': 'url(' + attrs.bgSrc + scaleParam });
            placeholder.addClass('placeholder');
            element.append(placeholder);

            var imgLarge;
            windowEl.on('scroll', onScroll);
            scope.$on('$destroy', onDestroy);
            onScroll();

            //////////////////////////////////////////////////

            function onScroll() {
                if (LazyLoadingService.isElementInViewport(element[0])) {
                    if (!imgLarge) {
                        imgLarge = new Image();
                        imgLarge.src = attrs.bgSrc;
                        imgLarge.onload = function () {
                            placeholder.css({ 'opacity': '0' });
                            element.css({ 'background-image': 'url(' + attrs.bgSrc + ')' });
                            windowEl.off('scroll', onScroll);
                            $timeout(function () {
                                placeholder.remove();
                            }, 3000);
                        };
                    }
                }
            }

            function onDestroy() {
                windowEl.off('scroll', onScroll);
            }
        }
    };
}).directive('imageOnLoad', function () {
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            element.bind('load', function () {
                scope.$apply(attrs.imageOnLoad);
            });
            element.bind('error', function () {});
        }
    };
}).service('LazyLoadingService', function ($document, $q, $window) {
    var service = this;

    this.isElementInViewport = isElementInViewport; // function(element[0])
    this.load = load;
    this.registeredResources = {};

    ////////////////////////////

    function load(items) {
        var promiseArray = [];
        _.forEach(items, function (item) {
            // If the src is not yet registered, register it
            if (!service.registeredResources[item.src]) {
                var queryParamsIndex = item.src.indexOf('?');
                var srcSplit;
                if (queryParamsIndex > 0) {
                    srcSplit = item.src.substring(0, item.src.indexOf('?')).split('.');
                } else {
                    srcSplit = item.src.split('.');
                }
                var fileType = item.type || srcSplit[srcSplit.length - 1];
                if (fileType == 'js') {
                    promiseArray.push(loadScript(item.src, item.global));
                } else if (fileType == 'css') {
                    promiseArray.push(loadStyles(item.src));
                } else {
                    console.error('Unsupported file type');
                }
            }
            // Else, if it is not true, it is loading and the promise is assigned
            else if (service.registeredResources[item.src] !== true) {
                    promiseArray.push(service.registeredResources[item.src]);
                }
        });
        return $q.all(promiseArray);
    }

    function loadStyles(srcUrl) {
        var deferred = $q.defer();
        service.registeredResources[srcUrl] = deferred.promise;

        var callback = function callback() {
            service.registeredResources[srcUrl] = true;
            deferred.resolve('Styles Loaded');
        };
        var linkTag = $document[0].createElement('link');
        linkTag.href = srcUrl;
        linkTag.rel = 'stylesheet';
        linkTag.type = 'text/css';
        linkTag.onreadystatechange = function () {
            if (this.readyState == 'complete') {
                callback();
            }
        };
        linkTag.onload = callback;
        $document[0].getElementsByTagName('head')[0].appendChild(linkTag);
        return deferred.promise;
    }

    function loadScript(srcUrl, globalName) {
        var deferred = $q.defer();
        service.registeredResources[srcUrl] = deferred.promise;

        var callback = function callback() {
            service.registeredResources[srcUrl] = true;
            if ($window[globalName]) {
                deferred.resolve($window[globalName]);
            } else {
                deferred.resolve('Js Loaded');
            }
        };
        var scriptTag = $document[0].createElement('script');
        scriptTag.type = "text/javascript";
        scriptTag.async = true;
        scriptTag.src = srcUrl;
        scriptTag.onreadystatechange = function () {
            if (this.readyState == 'complete') {
                callback();
            }
        };
        scriptTag.onload = callback;
        $document[0].getElementsByTagName('body')[0].appendChild(scriptTag);
        return deferred.promise;
    }

    function isElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.left >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight);
    }
});
;'use strict';

angular.module('modules.lightbox', []);
angular.module('modules.lightbox').directive('lightbox', function ($mdDialog, $parse) {
	return {
		restrict: 'A',
		/**************************************************************
  		[lightbox] = true || false - This enables/disables the lightbox
  		[lightbox-image] = image - This is evaluated scope
  [lightbox-images] = [image1, image] - Array of images used for carosel
  		The Lightbox images can come in 2 forms:
  1. Image Url
  2. Image object: {
        image   : {
                url   : 'imageUrl'
              },
        caption : '',
     }
  		**************************************************************/
		link: function link(scope, element, attrs) {
			element.bind('click', function (event) {
				if (attrs.lightbox != 'false') {
					var lightboxImage = $parse(attrs.lightboxImage)(scope);
					var lightboxImages = $parse(attrs.lightboxImages)(scope);

					var data = {
						lightboxImage: lightboxImage,
						lightboxImages: lightboxImages
					};

					if (lightboxImage || lightboxImages) {
						return $mdDialog.show({
							templateUrl: 'app/modules/lightbox/tpls/lightbox-modal.html',
							targetEvent: event,
							locals: {
								data: data
							},
							controller: function controller(data, $scope) {
								$scope.lightboxImages = data.lightboxImages;
								$scope.lightboxImage = data.lightboxImage;
								$scope.loading = true;
								// If the is an Images Array
								if ($scope.lightboxImages) {
									// Set the Current Image
									var Current;
									if ($scope.lightboxImages.indexOf($scope.lightboxImage) != -1) {
										Current = $scope.lightboxImages.indexOf($scope.lightboxImage);
									} else {
										Current = 0;
									}
									var NumImages = $scope.lightboxImages.length;
									setCurrentImage($scope.lightboxImages[Current]);

									$scope.next = function () {
										if (Current == NumImages - 1) {
											Current = 0;
										} else {
											Current = Current + 1;
										}
										$scope.setImage(Current);
										$scope.current = Current;
										$scope.loading = true;
									};
									$scope.prev = function () {
										if (Current === 0) {
											Current = NumImages - 1;
										} else {
											Current = Current - 1;
										}
										$scope.setImage(Current);
										$scope.current = Current;
										$scope.loading = true;
									};
									$scope.setImage = function (Current) {
										setCurrentImage($scope.lightboxImages[Current]);
									};
									$scope.current = Current;
								}
								// Otherwise, Single Image...
								if (!$scope.lightboxImages) {
									setCurrentImage(lightboxImage);
								}

								$scope.cancel = function () {
									$mdDialog.cancel();
								};

								//////////////////////////////////////////////////////

								function setCurrentImage(image) {
									// If the image is an object (with caption)
									if (image.image) {
										$scope.currentImage = image;
									}
									// If it is a plain Url (no caption)
									else {
											$scope.currentImage = {
												image: {
													url: image
												},
												caption: ''
											};
										}
								}
							}

						});
					}
				}
			});
		}
	};
});
'use strict';

(function () {
  angular.module('modules.line-clamp', []).directive('clamp', clampDirective);

  clampDirective.$inject = ['$timeout'];
  function clampDirective($timeout) {
    var directive = {
      restrict: 'A',
      link: linkDirective
    };

    return directive;

    function linkDirective(scope, element, attrs) {
      $timeout(function () {
        var lineCount = 1,
            lineMax = +attrs.clamp;
        var lineStart = 0,
            lineEnd = 0;
        var text = element.html().replace(/\n/g, ' ');
        var maxWidth = element[0].offsetWidth;
        var estimateTag = createElement();

        element.empty();
        element.append(estimateTag);

        text.replace(/ /g, function (m, pos) {
          if (lineCount >= lineMax) {
            return;
          } else {
            estimateTag.html(text.slice(lineStart, pos));
            if (estimateTag[0].offsetWidth > maxWidth) {
              estimateTag.html(text.slice(lineStart, lineEnd));
              resetElement(estimateTag);
              lineCount++;
              lineStart = lineEnd + 1;
              estimateTag = createElement();
              element.append(estimateTag);
            }
            lineEnd = pos;
          }
        });
        estimateTag.html(text.slice(lineStart));
        resetElement(estimateTag, true);

        scope.$emit('clampCallback', element, attrs);
      });
    }
  }

  return;

  function createElement() {
    var tagDiv = document.createElement('div');
    (function (s) {
      s.position = 'absolute';
      s.whiteSpace = 'pre';
      s.visibility = 'hidden';
      s.display = 'inline-block';
    })(tagDiv.style);

    return angular.element(tagDiv);
  }

  function resetElement(element, type) {
    element.css({
      position: 'inherit',
      overflow: 'hidden',
      display: 'block',
      textOverflow: type ? 'ellipsis' : 'clip',
      visibility: 'inherit',
      whiteSpace: 'nowrap',
      width: '100%'
    });
  }
})();
'use strict';

angular.module('modules.loadbar', ['angular-loading-bar']);
angular.module('modules.loadbar').config(function ($httpProvider, cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
    $httpProvider.interceptors.unshift(function () {
        return {
            request: function request(config) {
                // disable the angular loading bar for certain urls
                if (config.url.indexOf('api/v1/notifications') > -1 || config.url.indexOf('api/v1/search') > -1 || config.url.indexOf('api/v1/events') > -1 || config.url.indexOf('maps.googleapis.com') > -1 || config.url.indexOf('autodesk.com') > -1 || config.url.indexOf('api/v1/geolocate') > -1) {
                    config.ignoreLoadingBar = true;
                }
                return config;
            }
        };
    });
});
'use strict';

angular.module('modules.local-cache', []);
angular.module('modules.local-cache').service('LocalCache', function ($timeout, $q, CoreLibrary) {
    var service = this;
    this.getPackaged = getPackaged; //function(endpoint, request, requestData, fresh)
    this.save = save; //function(endpoint, item)

    // Internal
    this.requestCache = {
        /*****************
        endpoint : {
            index          : {}            - stub to id index,
            cache          : {}            - id cache
            stubCache      : {}            - stub cache
            packagePromise : promise       - Timeout that runs the request function
            request        : fn(package)   - promise function - this takes in package
            package        : []            - Array of query ids []
        }
        *****************/
    };

    //////////////////////////////////////////////////////


    function getPackaged(endpoint, stubOrId, request, fresh) {
        /**********************************************
          endpoint: string - unique string endpoint
        stubOrId: stub || id
        request:  request function
        fresh:    true || false - if true, we do a fresh request (even if it is in the cache)
          **********************************************/
        // Create empty object for endpoint if undefined
        createEndpointObject(endpoint);

        var deferred = $q.defer();
        var item = getFromCache(endpoint, stubOrId);
        // If item is in the cache (and we are not asking for fresh):
        if (item && !fresh) {
            return item.promise || $q.when(item); // Return the promise (if defined) or wrap the item in a promise.
        } else {
            // If the package exists, append request data to package
            if (service.requestCache[endpoint].packagePromise) {
                addPackage(endpoint, stubOrId);
            }
            // If there is no package promise, create one.
            else {
                    newPackage(endpoint, request, stubOrId);
                    service.requestCache[endpoint].packagePromise = $timeout(function () {
                        // Set the package promise to undefined so we can create a new package
                        service.requestCache[endpoint].packagePromise = undefined;
                        return sendPackage(endpoint);
                    }, 10);
                }
            // Set the promise to the id-cache or stub-cache
            if (CoreLibrary.isObjectId(stubOrId)) {
                service.requestCache[endpoint].cache[stubOrId] = deferred;
            } else {
                service.requestCache[endpoint].stubCache[stubOrId] = deferred;
            }
        }
        return deferred.promise;
    }

    function save(endpoint, item) {
        createEndpointObject(endpoint);
        // Endpoint does not exist in cache if we have not get used the get method
        if (service.requestCache[endpoint]) {
            if (item.stub) {
                service.requestCache[endpoint].index[item.stub] = item._id; // Add to the stub-id index
            }
            if (item._id) {
                service.requestCache[endpoint].cache[item._id] = item; // Save to the cache
            }
        }
    }

    function createEndpointObject(endpoint) {
        service.requestCache[endpoint] = service.requestCache[endpoint] || {};
        service.requestCache[endpoint].cache = service.requestCache[endpoint].cache || {};
        service.requestCache[endpoint].index = service.requestCache[endpoint].index || {};
        service.requestCache[endpoint].stubCache = service.requestCache[endpoint].stubCache || {};
    }

    // -------------------------------------------------------------------------------------------------------------------- //

    function getFromCache(endpoint, stubOrId) {
        var cachedItem;
        // If the cache and stubcache is empty, return false
        // Return false if the cached item contains the error property
        if (!service.requestCache[endpoint] || !service.requestCache[endpoint].cache && !service.requestCache[endpoint].stubCache) {
            return false;
        }
        // Check the id-cache
        if (service.requestCache[endpoint].cache[stubOrId]) {
            cachedItem = service.requestCache[endpoint].cache[stubOrId];
            return cachedItem.error ? false : cachedItem;
        }
        // Else, use the stub-id index and check cache again
        else if (service.requestCache[endpoint].cache[service.requestCache[endpoint].index[stubOrId]]) {
                cachedItem = service.requestCache[endpoint].cache[service.requestCache[endpoint].index[stubOrId]];
                return cachedItem.error ? false : cachedItem;
            }
            // Check the stub cache
            else if (service.requestCache[endpoint].stubCache[stubOrId]) {
                    cachedItem = service.requestCache[endpoint].stubCache[stubOrId];
                    return cachedItem.error ? false : cachedItem;
                } else {
                    return false;
                }
    }

    function sendPackage(endpoint) {
        return service.requestCache[endpoint].request(service.requestCache[endpoint].package).then(function (results) {
            _.forEach(results, function (result) {
                // If the result has an error, we reject the promise
                if (result.error) {
                    // Resolve any matching promises in the cache and stubcache
                    if (service.requestCache[endpoint].cache[result._id] && service.requestCache[endpoint].cache[result._id].reject) {
                        service.requestCache[endpoint].cache[result._id].reject(result);
                    }
                    if (service.requestCache[endpoint].stubCache[result.stub] && service.requestCache[endpoint].stubCache[result.stub].reject) {
                        service.requestCache[endpoint].stubCache[result.stub].reject(result);
                    }
                }
                // Else the result is valid, we resolve the promise
                else {
                        // Resolve any matching promises in the id-cache and stub-cache
                        if (service.requestCache[endpoint].cache[result._id] && service.requestCache[endpoint].cache[result._id].resolve) {
                            service.requestCache[endpoint].cache[result._id].resolve(result);
                        }
                        if (service.requestCache[endpoint].stubCache[result.stub] && service.requestCache[endpoint].stubCache[result.stub].resolve) {
                            service.requestCache[endpoint].stubCache[result.stub].resolve(result);
                        }
                    }
                // Save the data to the cache and index
                save(endpoint, result);
            });
        }).catch(function (response) {
            _.forEach(service.requestCache[endpoint].package, function (stubOrId) {
                // Resolve any matching promises in the cache and stubcache
                if (service.requestCache[endpoint].cache[stubOrId] && service.requestCache[endpoint].cache[stubOrId].reject) {
                    service.requestCache[endpoint].cache[stubOrId].reject(response);
                }
                if (service.requestCache[endpoint].stubCache[stubOrId] && service.requestCache[endpoint].stubCache[stubOrId].reject) {
                    service.requestCache[endpoint].stubCache[stubOrId].reject(response);
                }
            });
        });
    }
    function newPackage(endpoint, request, requestData) {
        service.requestCache[endpoint].package = [requestData];
        service.requestCache[endpoint].request = request;
    }
    function addPackage(endpoint, requestData) {
        service.requestCache[endpoint].package.push(requestData);
    }
});
'use strict';

angular.module('modules.location', []);
angular.module('modules.location').config(function ($httpProvider) {
    $httpProvider.interceptors.push(function () {
        return {
            request: function request(config) {
                // remove Authorization header from any request to the google
                // maps api because they reject the request if it is included
                if (config.url.indexOf('maps.googleapis.com') > -1) {
                    config.headers.Authorization = undefined;
                }
                return config;
            }
        };
    });
}).run(function (LocationService) {
    LocationService.getLocation();
}).directive('countrySelect', function ($http) {
    return {
        restrict: 'E',
        scope: {
            ngModel: '=',
            placeholder: '@'
        },
        templateUrl: 'app/modules/location/tpls/country-select.html',
        controller: function controller($scope, LocationService) {
            if ($scope.ngModel.length < 1) {
                $scope.ngModel = [''];
            }
            $scope.locations = LocationService.getCountries();

            $scope.remove = function (index) {
                $scope.ngModel.splice(index, 1);
            };

            $scope.addAnother = function () {
                $scope.ngModel.push('');
            };
        }
    };
}).service('LocationService', function ($http, $q, FunctionLibrary) {
    var service = this;
    this.location = undefined; // Object to assign location to
    this.getLocation = getLocation; // function()
    this.geoCode = geoCode; // function(name)
    this.getCountries = getCountries;

    /////////////////////////////////////////////////////////////

    function getCountries() {
        return [{ name: 'Afghanistan', code: 'AF' }, { name: 'Åland Islands', code: 'AX' }, { name: 'Albania', code: 'AL' }, { name: 'Algeria', code: 'DZ' }, { name: 'American Samoa', code: 'AS' }, { name: 'AndorrA', code: 'AD' }, { name: 'Angola', code: 'AO' }, { name: 'Anguilla', code: 'AI' }, { name: 'Antarctica', code: 'AQ' }, { name: 'Antigua and Barbuda', code: 'AG' }, { name: 'Argentina', code: 'AR' }, { name: 'Armenia', code: 'AM' }, { name: 'Aruba', code: 'AW' }, { name: 'Australia', code: 'AU' }, { name: 'Austria', code: 'AT' }, { name: 'Azerbaijan', code: 'AZ' }, { name: 'Bahamas', code: 'BS' }, { name: 'Bahrain', code: 'BH' }, { name: 'Bangladesh', code: 'BD' }, { name: 'Barbados', code: 'BB' }, { name: 'Belarus', code: 'BY' }, { name: 'Belgium', code: 'BE' }, { name: 'Belize', code: 'BZ' }, { name: 'Benin', code: 'BJ' }, { name: 'Bermuda', code: 'BM' }, { name: 'Bhutan', code: 'BT' }, { name: 'Bolivia', code: 'BO' }, { name: 'Bosnia and Herzegovina', code: 'BA' }, { name: 'Botswana', code: 'BW' }, { name: 'Bouvet Island', code: 'BV' }, { name: 'Brazil', code: 'BR' }, { name: 'British Indian Ocean Territory', code: 'IO' }, { name: 'Brunei Darussalam', code: 'BN' }, { name: 'Bulgaria', code: 'BG' }, { name: 'Burkina Faso', code: 'BF' }, { name: 'Burundi', code: 'BI' }, { name: 'Cambodia', code: 'KH' }, { name: 'Cameroon', code: 'CM' }, { name: 'Canada', code: 'CA' }, { name: 'Cape Verde', code: 'CV' }, { name: 'Cayman Islands', code: 'KY' }, { name: 'Central African Republic', code: 'CF' }, { name: 'Chad', code: 'TD' }, { name: 'Chile', code: 'CL' }, { name: 'China', code: 'CN' }, { name: 'Christmas Island', code: 'CX' }, { name: 'Cocos (Keeling) Islands', code: 'CC' }, { name: 'Colombia', code: 'CO' }, { name: 'Comoros', code: 'KM' }, { name: 'Congo', code: 'CG' }, { name: 'Congo, The Democratic Republic of the', code: 'CD' }, { name: 'Cook Islands', code: 'CK' }, { name: 'Costa Rica', code: 'CR' }, { name: 'Cote D\'Ivoire', code: 'CI' }, { name: 'Croatia', code: 'HR' }, { name: 'Cuba', code: 'CU' }, { name: 'Cyprus', code: 'CY' }, { name: 'Czech Republic', code: 'CZ' }, { name: 'Denmark', code: 'DK' }, { name: 'Djibouti', code: 'DJ' }, { name: 'Dominica', code: 'DM' }, { name: 'Dominican Republic', code: 'DO' }, { name: 'Ecuador', code: 'EC' }, { name: 'Egypt', code: 'EG' }, { name: 'El Salvador', code: 'SV' }, { name: 'Equatorial Guinea', code: 'GQ' }, { name: 'Eritrea', code: 'ER' }, { name: 'Estonia', code: 'EE' }, { name: 'Ethiopia', code: 'ET' }, { name: 'Falkland Islands (Malvinas)', code: 'FK' }, { name: 'Faroe Islands', code: 'FO' }, { name: 'Fiji', code: 'FJ' }, { name: 'Finland', code: 'FI' }, { name: 'France', code: 'FR' }, { name: 'French Guiana', code: 'GF' }, { name: 'French Polynesia', code: 'PF' }, { name: 'French Southern Territories', code: 'TF' }, { name: 'Gabon', code: 'GA' }, { name: 'Gambia', code: 'GM' }, { name: 'Georgia', code: 'GE' }, { name: 'Germany', code: 'DE' }, { name: 'Ghana', code: 'GH' }, { name: 'Gibraltar', code: 'GI' }, { name: 'Greece', code: 'GR' }, { name: 'Greenland', code: 'GL' }, { name: 'Grenada', code: 'GD' }, { name: 'Guadeloupe', code: 'GP' }, { name: 'Guam', code: 'GU' }, { name: 'Guatemala', code: 'GT' }, { name: 'Guernsey', code: 'GG' }, { name: 'Guinea', code: 'GN' }, { name: 'Guinea-Bissau', code: 'GW' }, { name: 'Guyana', code: 'GY' }, { name: 'Haiti', code: 'HT' }, { name: 'Heard Island and Mcdonald Islands', code: 'HM' }, { name: 'Holy See (Vatican City State)', code: 'VA' }, { name: 'Honduras', code: 'HN' }, { name: 'Hong Kong', code: 'HK' }, { name: 'Hungary', code: 'HU' }, { name: 'Iceland', code: 'IS' }, { name: 'India', code: 'IN' }, { name: 'Indonesia', code: 'ID' }, { name: 'Iran, Islamic Republic Of', code: 'IR' }, { name: 'Iraq', code: 'IQ' }, { name: 'Ireland', code: 'IE' }, { name: 'Isle of Man', code: 'IM' }, { name: 'Israel', code: 'IL' }, { name: 'Italy', code: 'IT' }, { name: 'Jamaica', code: 'JM' }, { name: 'Japan', code: 'JP' }, { name: 'Jersey', code: 'JE' }, { name: 'Jordan', code: 'JO' }, { name: 'Kazakhstan', code: 'KZ' }, { name: 'Kenya', code: 'KE' }, { name: 'Kiribati', code: 'KI' }, { name: 'Korea, Democratic People\'S Republic of', code: 'KP' }, { name: 'Korea, Republic of', code: 'KR' }, { name: 'Kuwait', code: 'KW' }, { name: 'Kyrgyzstan', code: 'KG' }, { name: 'Lao People\'S Democratic Republic', code: 'LA' }, { name: 'Latvia', code: 'LV' }, { name: 'Lebanon', code: 'LB' }, { name: 'Lesotho', code: 'LS' }, { name: 'Liberia', code: 'LR' }, { name: 'Libyan Arab Jamahiriya', code: 'LY' }, { name: 'Liechtenstein', code: 'LI' }, { name: 'Lithuania', code: 'LT' }, { name: 'Luxembourg', code: 'LU' }, { name: 'Macao', code: 'MO' }, { name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK' }, { name: 'Madagascar', code: 'MG' }, { name: 'Malawi', code: 'MW' }, { name: 'Malaysia', code: 'MY' }, { name: 'Maldives', code: 'MV' }, { name: 'Mali', code: 'ML' }, { name: 'Malta', code: 'MT' }, { name: 'Marshall Islands', code: 'MH' }, { name: 'Martinique', code: 'MQ' }, { name: 'Mauritania', code: 'MR' }, { name: 'Mauritius', code: 'MU' }, { name: 'Mayotte', code: 'YT' }, { name: 'Mexico', code: 'MX' }, { name: 'Micronesia, Federated States of', code: 'FM' }, { name: 'Moldova, Republic of', code: 'MD' }, { name: 'Monaco', code: 'MC' }, { name: 'Mongolia', code: 'MN' }, { name: 'Montserrat', code: 'MS' }, { name: 'Morocco', code: 'MA' }, { name: 'Mozambique', code: 'MZ' }, { name: 'Myanmar', code: 'MM' }, { name: 'Namibia', code: 'NA' }, { name: 'Nauru', code: 'NR' }, { name: 'Nepal', code: 'NP' }, { name: 'Netherlands', code: 'NL' }, { name: 'Netherlands Antilles', code: 'AN' }, { name: 'New Caledonia', code: 'NC' }, { name: 'New Zealand', code: 'NZ' }, { name: 'Nicaragua', code: 'NI' }, { name: 'Niger', code: 'NE' }, { name: 'Nigeria', code: 'NG' }, { name: 'Niue', code: 'NU' }, { name: 'Norfolk Island', code: 'NF' }, { name: 'Northern Mariana Islands', code: 'MP' }, { name: 'Norway', code: 'NO' }, { name: 'Oman', code: 'OM' }, { name: 'Pakistan', code: 'PK' }, { name: 'Palau', code: 'PW' }, { name: 'Palestinian Territory, Occupied', code: 'PS' }, { name: 'Panama', code: 'PA' }, { name: 'Papua New Guinea', code: 'PG' }, { name: 'Paraguay', code: 'PY' }, { name: 'Peru', code: 'PE' }, { name: 'Philippines', code: 'PH' }, { name: 'Pitcairn', code: 'PN' }, { name: 'Poland', code: 'PL' }, { name: 'Portugal', code: 'PT' }, { name: 'Puerto Rico', code: 'PR' }, { name: 'Qatar', code: 'QA' }, { name: 'Reunion', code: 'RE' }, { name: 'Romania', code: 'RO' }, { name: 'Russian Federation', code: 'RU' }, { name: 'RWANDA', code: 'RW' }, { name: 'Saint Helena', code: 'SH' }, { name: 'Saint Kitts and Nevis', code: 'KN' }, { name: 'Saint Lucia', code: 'LC' }, { name: 'Saint Pierre and Miquelon', code: 'PM' }, { name: 'Saint Vincent and the Grenadines', code: 'VC' }, { name: 'Samoa', code: 'WS' }, { name: 'San Marino', code: 'SM' }, { name: 'Sao Tome and Principe', code: 'ST' }, { name: 'Saudi Arabia', code: 'SA' }, { name: 'Senegal', code: 'SN' }, { name: 'Serbia and Montenegro', code: 'CS' }, { name: 'Seychelles', code: 'SC' }, { name: 'Sierra Leone', code: 'SL' }, { name: 'Singapore', code: 'SG' }, { name: 'Slovakia', code: 'SK' }, { name: 'Slovenia', code: 'SI' }, { name: 'Solomon Islands', code: 'SB' }, { name: 'Somalia', code: 'SO' }, { name: 'South Africa', code: 'ZA' }, { name: 'South Georgia and the South Sandwich Islands', code: 'GS' }, { name: 'Spain', code: 'ES' }, { name: 'Sri Lanka', code: 'LK' }, { name: 'Sudan', code: 'SD' }, { name: 'Suriname', code: 'SR' }, { name: 'Svalbard and Jan Mayen', code: 'SJ' }, { name: 'Swaziland', code: 'SZ' }, { name: 'Sweden', code: 'SE' }, { name: 'Switzerland', code: 'CH' }, { name: 'Syrian Arab Republic', code: 'SY' }, { name: 'Taiwan, Province of China', code: 'TW' }, { name: 'Tajikistan', code: 'TJ' }, { name: 'Tanzania, United Republic of', code: 'TZ' }, { name: 'Thailand', code: 'TH' }, { name: 'Timor-Leste', code: 'TL' }, { name: 'Togo', code: 'TG' }, { name: 'Tokelau', code: 'TK' }, { name: 'Tonga', code: 'TO' }, { name: 'Trinidad and Tobago', code: 'TT' }, { name: 'Tunisia', code: 'TN' }, { name: 'Turkey', code: 'TR' }, { name: 'Turkmenistan', code: 'TM' }, { name: 'Turks and Caicos Islands', code: 'TC' }, { name: 'Tuvalu', code: 'TV' }, { name: 'Uganda', code: 'UG' }, { name: 'Ukraine', code: 'UA' }, { name: 'United Arab Emirates', code: 'AE' }, { name: 'United Kingdom', code: 'GB' }, { name: 'United States', code: 'US' }, { name: 'United States Minor Outlying Islands', code: 'UM' }, { name: 'Uruguay', code: 'UY' }, { name: 'Uzbekistan', code: 'UZ' }, { name: 'Vanuatu', code: 'VU' }, { name: 'Venezuela', code: 'VE' }, { name: 'Viet Nam', code: 'VN' }, { name: 'Virgin Islands, British', code: 'VG' }, { name: 'Virgin Islands, U.S.', code: 'VI' }, { name: 'Wallis and Futuna', code: 'WF' }, { name: 'Western Sahara', code: 'EH' }, { name: 'Yemen', code: 'YE' }, { name: 'Zambia', code: 'ZM' }, { name: 'Zimbabwe', code: 'ZW' }];
    }

    function getLocation() {
        var deferred = $q.defer();
        // If location has been fetched, return it
        if (service.location) {
            deferred.resolve(service.location);
        } else {
            // If it is crawler, don't get location.
            if (!FunctionLibrary.isCrawler()) {
                service.location = deferred.promise; // Set the promise to the service to prevent double calls
                $http({
                    url: '/api/v1/geolocate',
                    method: 'GET'
                }).then(function (response) {
                    service.location = response.data;
                    deferred.resolve(response.data);
                }).catch(deferred.reject);
            } else {
                deferred.reject();
            }
        }
        return deferred.promise;
    }

    function geoCode(val) {
        return $http.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: val,
                sensor: false
            }
        }).then(function (response) {
            return response.data.results.map(function (item) {
                var location = {
                    name: item.formatted_address,
                    geo: item.geometry.location,
                    components: item.address_components
                };
                return location;
            });
        });
    }
});
'use strict';

angular.module('modules.mapbox', []);
angular.module('modules.mapbox').directive('mapbox', function () {
    return {
        restrict: 'E',
        scope: {
            callback: '='
        },
        templateUrl: 'app/modules/mapbox/tpls/mapbox.html',
        link: function link(scope, element, attributes) {

            L.mapbox.accessToken = 'pk.eyJ1IjoiZGF2aWRyZXZheSIsImEiOiJjaWdrMXdzbjgwMDhtdW5sem80ZzU2ZnB1In0.Rnao2anlQSjflypv84f-Xw';
            var map = L.mapbox.map(element[0], 'davidrevay.o2lae1db', {
                maxBounds: [[-90, -180], [90, 180]],
                maxBoundsViscosity: 1.0,
                minZoom: 3
            });
            scope.callback(map);
        }
    };
});
'use strict';

angular.module('modules.maps', []);
angular.module('modules.maps').directive('goToMap', function ($state) {
    return {
        restrict: 'A',
        scope: {
            location: '=', //{lat: XX, lng: XX}
            locationType: '@' },
        link: function link(scope, element, attrs) {
            element.bind('click', function (e) {
                $state.go('app.map', {
                    type: scope.locationType,
                    c: scope.location.lat + ':' + scope.location.lng + ':20'
                });
            });
        }
    };
}).service('MapService', function () {});
'use strict';

angular.module('modules.material-design', ['ngMaterial', 'ngMessages']);
angular.module('modules.material-design').config(function ($mdIconProvider, $mdThemingProvider) {

      $mdIconProvider.iconSet('action', 'assets/icons/material/action-icons.svg', 24).iconSet('alert', 'assets/icons/material/alert-icons.svg', 24).iconSet('av', 'assets/icons/material/av-icons.svg', 24).iconSet('communication', 'assets/icons/material/communication-icons.svg', 24).iconSet('content', 'assets/icons/material/content-icons.svg', 24).iconSet('device', 'assets/icons/material/device-icons.svg', 24).iconSet('editor', 'assets/icons/material/editor-icons.svg', 24).iconSet('file', 'assets/icons/material/file-icons.svg', 24).iconSet('hardware', 'assets/icons/material/hardware-icons.svg', 24).iconSet('icons', 'assets/icons/material/icons-icons.svg', 24).iconSet('image', 'assets/icons/material/image-icons.svg', 24).iconSet('maps', 'assets/icons/material/maps-icons.svg', 24).iconSet('navigation', 'assets/icons/material/navigation-icons.svg', 24).iconSet('notification', 'assets/icons/material/notification-icons.svg', 24).iconSet('social', 'assets/icons/material/social-icons.svg', 24).iconSet('toggle', 'assets/icons/material/toggle-icons.svg', 24);

      // Configure URLs for icons specified by [set:]id.
      $mdIconProvider
      // AV ----------------------------------------------------------
      .icon('video-collection', '/assets/icons/av/svg/production/ic_video_collection_48px.svg')
      // NAVIGATION ----------------------------------------------------------
      .icon('menu', '/assets/icons/navigation/svg/production/ic_menu_48px.svg').icon('more-v', '/assets/icons/navigation/svg/production/ic_more_vert_48px.svg').icon('more-h', '/assets/icons/navigation/svg/production/ic_more_horiz_48px.svg').icon('close', '/assets/icons/navigation/svg/production/ic_close_48px.svg').icon('chevron-left', '/assets/icons/navigation/svg/production/ic_chevron_left_48px.svg').icon('chevron-right', '/assets/icons/navigation/svg/production/ic_chevron_right_48px.svg').icon('expand-more', '/assets/icons/navigation/svg/production/ic_expand_more_48px.svg').icon('arrow-back', '/assets/icons/navigation/svg/production/ic_arrow_back_48px.svg')
      // SOCIAL --------------------------------------------------------------
      .icon('notification', '/assets/icons/social/svg/production/ic_notifications_48px.svg').icon('share', '/assets/icons/social/svg/production/ic_share_48px.svg').icon('person', '/assets/icons/social/svg/production/ic_person_48px.svg').icon('location-city', '/assets/icons/social/svg/production/ic_location_city_48px.svg').icon('public', '/assets/icons/social/svg/production/ic_public_48px.svg')
      // CONTENT -------------------------------------------------------------
      .icon('add', '/assets/icons/content/svg/production/ic_add_48px.svg').icon('add-circle', '/assets/icons/content/svg/production/ic_add_circle_48px.svg').icon('add-circle-outline', '/assets/icons/content/svg/production/ic_add_circle_outline_48px.svg').icon('remove', '/assets/icons/content/svg/production/ic_remove_48px.svg').icon('reply', '/assets/icons/content/svg/production/ic_reply_48px.svg').icon('sort', '/assets/icons/content/svg/production/ic_sort_24px.svg').icon('link', '/assets/icons/content/svg/production/ic_link_48px.svg')
      // COMMUNICATION -------------------------------------------------------
      .icon('messenger', '/assets/icons/communication/svg/production/ic_messenger_48px.svg')
      // HARDWARE -------------------------------------------------------
      .icon('move-up', '/assets/icons/hardware/svg/production/ic_keyboard_capslock_24px.svg').icon('memory', '/assets/icons/hardware/svg/production/ic_memory_48px.svg')
      // ACTION --------------------------------------------------------------
      .icon('assignment', '/assets/icons/action/svg/production/ic_assignment_48px.svg').icon('bug-report', '/assets/icons/action/svg/production/ic_bug_report_48px.svg').icon('done', '/assets/icons/action/svg/production/ic_done_48px.svg').icon('exit_to_app', '/assets/icons/action/svg/production/ic_exit_to_app_48px.svg').icon('help', '/assets/icons/action/svg/production/ic_help_48px.svg').icon('settings', '/assets/icons/action/svg/production/ic_settings_48px.svg').icon('search', '/assets/icons/action/svg/production/ic_search_48px.svg').icon('visibility', '/assets/icons/action/svg/production/ic_visibility_48px.svg').icon('visibility-off', '/assets/icons/action/svg/production/ic_visibility_off_48px.svg').icon('lock-outline', '/assets/icons/action/svg/production/ic_lock_outline_24px.svg').icon('open_in_new', '/assets/icons/action/svg/production/ic_open_in_new_24px.svg').icon('label', '/assets/icons/action/svg/production/ic_label_24px.svg').icon('home', '/assets/icons/action/svg/production/ic_home_24px.svg').icon('swap_horiz', '/assets/icons/action/svg/production/ic_swap_horiz_24px.svg')
      // ALERY ---------------------------------------------------------------
      .icon('error', '/assets/icons/alert/svg/production/ic_error_48px.svg')
      // TOGGLE --------------------------------------------------------------
      .icon('checkbox', '/assets/icons/toggle/svg/production/ic_check_box_48px.svg').icon('star-o', '/assets/icons/toggle/svg/production/ic_star_outline_24px.svg').icon('star', '/assets/icons/toggle/svg/production/ic_star_24px.svg')
      // FILE ----------------------------------------------------------------
      .icon('upload', '/assets/icons/file/svg/production/ic_file_upload_48px.svg').icon('download', '/assets/icons/file/svg/production/ic_file_download_48px.svg').icon('create_new_folder', '/assets/icons/file/svg/production/ic_create_new_folder_48px.svg').icon('folder', '/assets/icons/file/svg/production/ic_folder_48px.svg')
      // EDITOR --------------------------------------------------------------
      .icon('edit', '/assets/icons/editor/svg/production/ic_mode_edit_48px.svg').icon('insert-photo', '/assets/icons/editor/svg/production/ic_insert_photo_48px.svg').icon('section-move', '/assets/icons/editor/svg/production/ic_format_line_spacing_24px.svg').icon('functions', '/assets/icons/editor/svg/production/ic_functions_24px.svg')
      // DEVICE --------------------------------------------------------------
      .icon('access-time', '/assets/icons/device/svg/production/ic_access_time_24px.svg').icon('gps-fixed', '/assets/icons/device/svg/production/ic_gps_fixed_48px.svg')
      // OTHER ---------------------------------------------------------------
      .icon('up-o', '/assets/icons/other/up_outline_24px.svg').icon('up', '/assets/icons/other/up_24px.svg').icon('down-o', '/assets/icons/other/up_outline_24px.svg').icon('down', '/assets/icons/other/up_24px.svg').icon('twitter', '/assets/icons/other/twitter_24px.svg').icon('twitter-filled', '/assets/icons/other/twitter_filled_24px.svg').icon('linkedin', '/assets/icons/other/linkedin_24px.svg').icon('facebook', '/assets/icons/other/facebook_24px.svg').icon('facebook-filled', '/assets/icons/other/facebook_filled_24px.svg').icon('heart', '/assets/icons/other/heart_24px.svg').icon('heart-filled', '/assets/icons/other/heart_filled_24px.svg').icon('response', '/assets/icons/other/response_24px.svg').icon('response-filled', '/assets/icons/other/response_filled_24px.svg').icon('dropbox', '/assets/icons/other/dropbox_24px.svg').icon('drive', '/assets/icons/other/drive_24px.svg')
      // Editor layouts
      .icon('layout-left', '/assets/icons/other/editor-layout-left.svg').icon('layout-right', '/assets/icons/other/editor-layout-right.svg').icon('layout-center', '/assets/icons/other/editor-layout-center.svg').icon('layout-full-width', '/assets/icons/other/editor-layout-full-width.svg').icon('layout-full-width-banner', '/assets/icons/other/editor-layout-full-width-banner.svg').icon('layout-full-width-banner-text', '/assets/icons/other/editor-layout-full-width-banner-text.svg').icon('layout-wide', '/assets/icons/other/editor-layout-wide.svg')
      // Compare
      .icon('compare-side', '/assets/icons/other/compare/side-by-side.svg').icon('compare-onion', '/assets/icons/other/compare/onion-skin.svg').icon('compare-slide', '/assets/icons/other/compare/slide.svg').icon('compare-top', '/assets/icons/other/compare/top-bottom.svg').icon('compare-single', '/assets/icons/other/compare/single.svg');

      var stemnGreen = $mdThemingProvider.extendPalette('light-green', {
            'contrastDefaultColor': 'dark',
            'contrastLightColors': ['500']
      });
      // Register the new color palette map
      $mdThemingProvider.definePalette('stemnGreen', stemnGreen);

      $mdThemingProvider.theme('default').accentPalette('stemnGreen', {
            'default': '500',
            'hue-1': '100',
            'hue-2': '600',
            'hue-3': 'A100'
      });
      $mdThemingProvider.theme('warn').primaryPalette('red');
      $mdThemingProvider.theme('orange').primaryPalette('orange');
      $mdThemingProvider.theme('default').accentPalette('stemnGreen', {
            'default': '500',
            'hue-1': '100',
            'hue-2': '600',
            'hue-3': 'A100'
      }).primaryPalette('grey', {
            'default': '500',
            'hue-1': '500',
            'hue-2': '500',
            'hue-3': '500'
      });
}).directive('mdContainer', function () {
      return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<div layout="row" layout-align="center"><div layout="column" class="md-content-container" ng-transclude></div></div>'
      };
}).run(function ($rootScope, $mdDialog) {
      // Close dialogs on state change
      $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            // set state.dialog to true of dialogs should NOT close on success load.
            if (!toState.dialog) {
                  $mdDialog.cancel();
            }
      });
});

//// NOT WORKING ---------- Icon Morph
//directive('mdMorphIcon', function ($mdIcon) {
//    return {
//        restrict: 'A',
//        link: function(scope, element, attr) {
//
//            var iconElement
//
//            var replace = function(newicon) {
//                console.log(iconElement)
//                console.log(newicon)
//                new SVGMorpheus(iconElement).to(newicon);
//                iconElement = newicon;
//            }
//
//            // watch for any changes
//            var changeCount = 0;
//            attr.$observe('mdMorphIcon', function(newicon) {
//                console.log(newicon)
//                $mdIcon(newicon).then(function(newiconEl){
//                    if(changeCount === 0){
//                        iconElement = newiconEl;
//                        element.append(newiconEl);
//                    }
//                    else{
//                        replace(newiconEl)
//                    }
//                    changeCount++
//                });
//            });
//
//        }
//    };
//});
'use strict';

angular.module('modules.mathjax', []);
angular.module('modules.mathjax').service('MathJaxService', function (LazyLoadingService) {
    this.load = load;

    //////////////////////////////////

    function load() {
        return LazyLoadingService.load([{
            global: 'MathJax',
            src: 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
            type: 'js'
        }]).then(function (modules) {
            window.MathJax.Hub.Config({
                skipStartupTypeset: true,
                messageStyle: "none",
                "HTML-CSS": {
                    //			showMathMenu: false,
                    //			scale: 150
                }
            });
            window.MathJax.Hub.Configured();
            return window.MathJax;
        });
    }
}).directive("mathjaxBind", function (MathJaxService) {
    // http://stackoverflow.com/questions/16087146/getting-mathjax-to-update-after-changes-to-angularjs-model
    return {
        restrict: "A",
        controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
            $scope.$watch($attrs.mathjaxBind, function (value) {
                var $script = angular.element("<script type='math/tex'>").html(value === undefined ? "" : value);
                $element.html("");
                $element.append($script);
                MathJaxService.load().then(function () {
                    window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "MathOutput"]);
                });
            });
        }]
    };
}).directive("renderInlineMathjax", function ($timeout, MathJaxService) {
    return {
        restrict: "A",
        link: function link(scope, element, attrs) {
            scope.$watch(attrs.ngBindHtml, processMathElements);

            ///////////////

            function processMathElements() {
                $timeout(function () {
                    angular.forEach(element[0].querySelectorAll('.math'), function (mathEl) {
                        mathEl = angular.element(mathEl);
                        var content = mathEl[0].innerText || mathEl[0].textContent; // IE || Others
                        var replacementMathEl = angular.element('<span class="inlineMathJax"></span>');
                        mathEl.after(replacementMathEl);
                        mathEl.remove();
                        var $script = angular.element("<script type='math/tex'>").html(content === undefined ? "" : content);
                        replacementMathEl.html("");
                        replacementMathEl.append($script);
                        MathJaxService.load().then(function () {
                            window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "MathOutput"]);
                        });
                    });
                }, 1);
            }
        }
    };
});
'use strict';

angular.module('modules.medium-editor-ext-backspace-merge', []);
angular.module('modules.medium-editor-ext-backspace-merge').service('MediumEditorBackspaceMergeExt', function ($timeout, RealtimeEditorService) {

	this.backspaceMerge = backspaceMerge; // function(scope, element, attrs)

	/////////////////////////////////////////////////////////////////

	function backspaceMerge(scope, iElement) {
		return window.MediumEditor.Extension.extend({
			name: 'backspace-section-merge',
			init: function init() {
				this.subscribe('editableKeyup', this.handleKeydown.bind(this));
			},
			memory: {
				lastCaretOffset: ''
			},
			handleKeydown: function handleKeydown(event, editable) {
				var self = this;
				// If key pressed was backspace
				if (event.keyCode == 8) {
					// If the current section and previous section is 'text'
					if (checkMergeAbove()) {
						// Get the caret offset position so we know if we are at the start of the editable
						var range = window.getSelection().getRangeAt(0);
						var caretOffset = getCharacterOffsetWithin(range, editable);
						if (caretOffset === 0 && self.memory.lastCaretOffset === 0) {
							mergeWithAbove();
							scope.$apply();
						}
						self.memory.lastCaretOffset = caretOffset;
					}
				}

				////////////////////////////////////////////////////////

				function getCharacterOffsetWithin(range, node) {
					// http://stackoverflow.com/questions/4767848/get-caret-cursor-position-in-contenteditable-area-containing-html-content
					var treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, function (node) {
						var nodeRange = document.createRange();
						nodeRange.selectNode(node);
						return nodeRange.compareBoundaryPoints(Range.END_TO_END, range) < 1 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
					}, false);
					var charCount = 0;
					while (treeWalker.nextNode()) {
						charCount += treeWalker.currentNode.length;
					}
					if (range.startContainer.nodeType == 3) {
						charCount += range.startOffset;
					}
					return charCount;
				}

				function deleteSection() {
					delete scope.editorSections[scope.editorSectionId];
					scope.editorOrder.splice(scope.editorSectionIndex, 1);
					if (scope.editorOptions.realtime) {
						RealtimeEditorService.deleteSection(scope.editorSectionId);
					};
				}

				function checkMergeAbove() {
					// returns true if we can merge
					if (scope.editorSections[scope.editorOrder[scope.editorSectionIndex]] && scope.editorSections[scope.editorOrder[scope.editorSectionIndex - 1]] && (!RealtimeEditorService.edits[scope.editorOrder[scope.editorSectionIndex - 1]] || !scope.editorOptions.realtime) && // If the previous section is not locked
					scope.editorSections[scope.editorOrder[scope.editorSectionIndex]].type == 'text' && scope.editorSections[scope.editorOrder[scope.editorSectionIndex - 1]].type == 'text') {
						return true;
					} else {
						return false;
					}
				}

				function mergeWithAbove() {
					// Check if we can merge
					if (checkMergeAbove()) {
						// Add the content onto the previous section
						scope.editorSections[scope.editorOrder[scope.editorSectionIndex - 1]].content = scope.editorSections[scope.editorOrder[scope.editorSectionIndex - 1]].content + scope.editorSections[scope.editorOrder[scope.editorSectionIndex]].content;
						if (scope.editorOptions.realtime) {
							RealtimeEditorService.saveSection(scope.editorSections[scope.editorOrder[scope.editorSectionIndex - 1]]);
						}
						scope.editorSections[scope.editorOrder[scope.editorSectionIndex - 1]].contentElement.focus();
						deleteSection();
					}
				}
			}
		});
	}
});
'use strict';

angular.module('modules.medium-editor-ext-insert-media', ['modules.core']);
angular.module('modules.medium-editor-ext-insert-media').service('MediumEditorInsertMediaExt', function ($compile, $timeout, MediumEditorUtilService) {

	this.insertMedia = insertMedia; // function(scope, element, attrs, ctrl)

	/////////////////////////////////////////////////////////////////

	function insertMedia(scope, iElement, attrs, ctrl) {
		return window.MediumEditor.Extension.extend({
			name: 'insert-media',
			init: function init() {
				this.initialise();
				this.subscribe('editableClick', this.handleKeydown.bind(this));
				this.subscribe('editableKeyup', this.handleKeydown.bind(this));
			},
			elements: {
				insertButtonEle: ''
			},
			handleKeydown: function handleKeydown(event, editable) {

				MediumEditorUtilService.removeSpanStyles(iElement);
				MediumEditorUtilService.removeEmptyP(iElement);

				var targetElement = angular.element(event.target),
				    editableElement = angular.element(editable),
				    selection = window.getSelection(),
				    self = this,
				    range,
				    currentElement;

				$timeout(function () {
					// This section is wrapped in a timeout...
					// When we are focused on a 'h2/h3' and press return, the next line starts off as a 'div'.
					// This div is then replaced with a 'p' (i'm not sure where this happens).
					// Wrapping in a timeout means the range selection will include the 'p' and not the 'div'
					range = selection.getRangeAt(0);
					currentElement = angular.element(range.commonAncestorContainer);

					// If we are in a TD and not in the first column
					if (currentElement[0].tagName == 'TD' && currentElement[0].cellIndex > 0) {
						hideButtons();
						return;
					}
					// If the element is not a text element
					if (currentElement.length && currentElement.text().trim() === '' && currentElement[0].nodeName !== '#text') {
						if (!self.elements.insertButtonEle) self.elements.insertButtonEle = createInsertButtons();
						$timeout(function () {
							positionButtons(self.elements.insertButtonEle, currentElement); // Give current Element time to render
						}, 0);
						showButtons();
					} else {
						hideButtons();
					}
				}, 1);

				// Hotkeys
				if (event.which == 73 && event.ctrlKey) {
					// Ctrl + I
					scope.showInsertTools = !scope.showInsertTools;
					scope.$apply();
				}
				if (event.which == 27) {
					// ESC
					scope.showInsertTools = false;
					scope.$apply();
				}

				////////////////////////////////

				function hideButtons() {
					scope.showInsertButtons = false;
					scope.showInsertTools = false;
					scope.$apply();
				}

				function showButtons() {
					scope.showInsertButtons = true;
					scope.$apply();
				}

				function positionButtons(insertButtonEle, positionEle) {
					var position = positionEle.position();
					insertButtonEle.css(position);
				}

				function createInsertButtons() {
					// Note, the insert buttons begin with a 'ng-hide' because otherwise they will animate on initial load
					var insertButtonEle = angular.element('<editor-insert-buttons></editor-insert-buttons');
					// Compile the element
					$compile(insertButtonEle)(scope);
					// Append element to body
					iElement.after(insertButtonEle);
					return insertButtonEle;
				}
			},
			initialise: function initialise() {
				scope.ctrl = ctrl; // Hack to pass ctrl through on scope
				scope.iElement = iElement; // Hack to pass ctrl through on scope
			}
		});
	}
});
'use strict';

angular.module('modules.medium-editor-ext-mathjax', ['modules.mathjax']);
angular.module('modules.medium-editor-ext-mathjax').service('MediumEditorMathjaxExt', function ($rootScope, MathJaxService) {

    this.mathButton = mathButton; // function(scope, element, attrs)
    this.mathPreview = mathPreview; // function(scope, element, attrs)

    /////////////////////////////////////////////////////////////////

    rangy.init();
    function mathButton() {
        return MediumEditor.extensions.button.extend({
            name: 'math',

            tagNames: ['mark'],
            contentDefault: '<b>H</b>',
            contentFA: '<i class="fa fa-superscript"></i>',
            aria: 'Hightlight',
            action: 'highlight',

            init: function init() {
                MediumEditor.extensions.button.prototype.init.call(this);

                this.classApplier = rangy.createClassApplier('math', {
                    elementTagName: 'mark',
                    normalize: true
                });
            },

            handleClick: function handleClick(event) {
                this.classApplier.toggleSelection();
            }
        });
    }

    function mathPreview() {
        return MediumEditor.Extension.extend({
            name: 'math-preview',
            hideDelay: 500,
            previewValueSelector: 'a',
            showWhenToolbarIsVisible: false,
            mathElementType: 'mark',

            init: function init() {
                this.anchorPreview = this.createPreview();
                this.getEditorOption('elementsContainer').appendChild(this.anchorPreview);
                this.subscribe('editableMouseover', this.handleEditableMouseover.bind(this));
                this.subscribe('editableKeyup', this.handleEditableKeyup.bind(this));
            },

            createPreview: function createPreview() {
                var el = this.document.createElement('div');

                el.id = 'medium-editor-anchor-preview-' + this.getEditorId();
                el.className = 'medium-editor-anchor-preview';
                el.innerHTML = this.getTemplate();

                this.on(el, 'click', this.handleClick.bind(this));

                return el;
            },

            getTemplate: function getTemplate() {
                return '<div class="medium-editor-toolbar-anchor-preview medium-editor-math-preview" id="medium-editor-toolbar-anchor-preview">' + '    <a class="medium-editor-toolbar-anchor-preview-inner"></a>' + '</div>';
            },

            destroy: function destroy() {
                if (this.anchorPreview) {
                    if (this.anchorPreview.parentNode) {
                        this.anchorPreview.parentNode.removeChild(this.anchorPreview);
                    }
                    delete this.anchorPreview;
                }
            },

            hidePreview: function hidePreview() {
                this.anchorPreview.classList.remove('medium-editor-anchor-preview-active');
                this.activeAnchor = null;
            },

            showPreview: function showPreview(anchorEl) {
                if (this.anchorPreview.classList.contains('medium-editor-anchor-preview-active') || anchorEl.getAttribute('data-disable-preview')) {
                    return true;
                }

                this.anchorPreview.classList.add('medium-toolbar-arrow-over');
                this.anchorPreview.classList.remove('medium-toolbar-arrow-under');

                if (!this.anchorPreview.classList.contains('medium-editor-anchor-preview-active')) {
                    this.anchorPreview.classList.add('medium-editor-anchor-preview-active');
                }

                this.activeAnchor = anchorEl;

                this.positionPreview();
                this.attachPreviewHandlers();

                return this;
            },

            updatePreviewText: function updatePreviewText(anchorEl) {
                var self = this;
                var currentMathText = anchorEl.textContent;
                if (currentMathText != this.lastMathText) {
                    this.renderMath(currentMathText);
                    setTimeout(function () {
                        self.positionPreview(anchorEl);
                    }, 400);
                }
            },

            positionPreview: function positionPreview(activeAnchor) {
                activeAnchor = activeAnchor || this.activeAnchor;
                var buttonHeight = this.anchorPreview.offsetHeight,
                    boundary = activeAnchor.getBoundingClientRect(),
                    middleBoundary = (boundary.left + boundary.right) / 2,
                    diffLeft = this.diffLeft,
                    diffTop = this.diffTop,
                    halfOffsetWidth,
                    defaultLeft;

                halfOffsetWidth = this.anchorPreview.offsetWidth / 2;
                var toolbarExtension = this.base.getExtensionByName('toolbar');
                if (toolbarExtension) {
                    diffLeft = toolbarExtension.diffLeft;
                    diffTop = toolbarExtension.diffTop;
                }
                defaultLeft = diffLeft - halfOffsetWidth;

                this.anchorPreview.style.top = Math.round(buttonHeight + boundary.bottom - diffTop + this.window.pageYOffset - this.anchorPreview.offsetHeight) + 'px';
                if (middleBoundary < halfOffsetWidth) {
                    this.anchorPreview.style.left = defaultLeft + halfOffsetWidth + 'px';
                } else if (this.window.innerWidth - middleBoundary < halfOffsetWidth) {
                    this.anchorPreview.style.left = this.window.innerWidth + defaultLeft - halfOffsetWidth + 'px';
                } else {
                    this.anchorPreview.style.left = defaultLeft + middleBoundary + 'px';
                }
            },

            renderMath: function renderMath(mathText) {
                var displayEl = angular.element(this.anchorPreview.querySelector(this.previewValueSelector));
                var $script = angular.element("<script type='math/tex'>").html(mathText === undefined ? "" : mathText);
                displayEl.empty();
                displayEl.append($script);
                MathJaxService.load().then(function (MathJax) {
                    MathJax.Hub.Queue(["Reprocess", MathJax.Hub, displayEl[0]]);
                });
                this.lastMathText = mathText;
            },

            handleClick: function handleClick(event) {
                var anchorExtension = this.base.getExtensionByName('anchor'),
                    activeAnchor = this.activeAnchor;

                if (anchorExtension && activeAnchor) {
                    event.preventDefault();

                    this.base.selectElement(this.activeAnchor);

                    // Using setTimeout + delay because:
                    // We may actually be displaying the anchor form, which should be controlled by delay
                    //                    this.base.delay(function () {
                    //                        if (activeAnchor) {
                    //                            var opts = {
                    //                                url: activeAnchor.attributes.href.value,
                    //                                target: activeAnchor.getAttribute('target'),
                    //                                buttonClass: activeAnchor.getAttribute('class')
                    //                            };
                    //                            anchorExtension.showForm(opts);
                    //                            activeAnchor = null;
                    //                        }
                    //                    }.bind(this));
                }

                this.hidePreview();
            },

            handleAnchorMouseout: function handleAnchorMouseout() {
                this.anchorToPreview = null;
                this.off(this.activeAnchor, 'mouseout', this.instanceHandleAnchorMouseout);
                this.instanceHandleAnchorMouseout = null;
            },

            handleEditableMouseover: function handleEditableMouseover(event) {
                var target = MediumEditor.util.getClosestTag(event.target, this.mathElementType);
                this.handleEditableGeneric(target);
            },

            handleEditableKeyup: function handleEditableKeyup(event) {
                var target = MediumEditor.util.getClosestTag(this.getSelectionStart(), this.mathElementType);
                this.handleEditableGeneric(target);
            },

            handleEditableGeneric: function handleEditableGeneric(target) {
                if (false === target) {
                    return;
                }
                // only show when toolbar is not present
                var toolbar = this.base.getExtensionByName('toolbar');
                if (!this.showWhenToolbarIsVisible && toolbar && toolbar.isDisplayed && toolbar.isDisplayed()) {
                    return true;
                }

                // detach handler for other anchor in case we hovered multiple anchors quickly
                if (this.activeAnchor && this.activeAnchor !== target) {
                    this.detachPreviewHandlers();
                }

                this.anchorToPreview = target;

                this.instanceHandleAnchorMouseout = this.handleAnchorMouseout.bind(this);
                this.on(this.anchorToPreview, 'mouseout', this.instanceHandleAnchorMouseout);
                // Using setTimeout + delay because:
                // - We're going to show the anchor preview according to the configured delay
                //   if the mouse has not left the anchor tag in that time
                this.base.delay(function () {
                    if (this.anchorToPreview) {
                        this.showPreview(this.anchorToPreview);
                        this.updatePreviewText(this.anchorToPreview);
                    }
                }.bind(this));
            },

            getSelectionStart: function getSelectionStart() {
                var node = document.getSelection().anchorNode;
                return node.nodeType == 3 ? node.parentNode : node;
            },

            handlePreviewMouseover: function handlePreviewMouseover() {
                this.lastOver = new Date().getTime();
                this.hovering = true;
            },

            handlePreviewMouseout: function handlePreviewMouseout(event) {
                if (!event.relatedTarget || !/anchor-preview/.test(event.relatedTarget.className)) {
                    this.hovering = false;
                }
            },

            updatePreview: function updatePreview() {
                if (this.hovering) {
                    return true;
                }
                var durr = new Date().getTime() - this.lastOver;
                if (durr > this.hideDelay) {
                    // hide the preview 1/2 second after mouse leaves the link
                    this.detachPreviewHandlers();
                }
            },

            detachPreviewHandlers: function detachPreviewHandlers() {
                // cleanup
                clearInterval(this.intervalTimer);
                if (this.instanceHandlePreviewMouseover) {
                    this.off(this.anchorPreview, 'mouseover', this.instanceHandlePreviewMouseover);
                    this.off(this.anchorPreview, 'mouseout', this.instanceHandlePreviewMouseout);
                    if (this.activeAnchor) {
                        this.off(this.activeAnchor, 'mouseover', this.instanceHandlePreviewMouseover);
                        this.off(this.activeAnchor, 'mouseout', this.instanceHandlePreviewMouseout);
                    }
                }

                this.hidePreview();

                this.hovering = this.instanceHandlePreviewMouseover = this.instanceHandlePreviewMouseout = null;
            },

            // TODO: break up method and extract out handlers
            attachPreviewHandlers: function attachPreviewHandlers() {
                this.lastOver = new Date().getTime();
                this.hovering = true;

                this.instanceHandlePreviewMouseover = this.handlePreviewMouseover.bind(this);
                this.instanceHandlePreviewMouseout = this.handlePreviewMouseout.bind(this);

                this.intervalTimer = setInterval(this.updatePreview.bind(this), 200);

                this.on(this.anchorPreview, 'mouseover', this.instanceHandlePreviewMouseover);
                this.on(this.anchorPreview, 'mouseout', this.instanceHandlePreviewMouseout);
                this.on(this.activeAnchor, 'mouseover', this.instanceHandlePreviewMouseover);
                this.on(this.activeAnchor, 'mouseout', this.instanceHandlePreviewMouseout);
            }
        });
    }
});
'use strict';

angular.module('modules.medium-editor-ext-mentions', ['modules.popup', 'modules.keyboard-navigation']);

angular.module('modules.medium-editor-ext-mentions').service('MediumEditorMentionsExt', function ($rootScope, $timeout, PopupService, CoreLibrary) {

    this.mentions = mentions; // function(scope, element, attrs)

    /////////////////////////////////////////////////////////////////

    function mentions() {
        var scope = $rootScope.$new(true);

        // Scoped functions;
        scope.showPanel = showPanel;
        scope.hidePanel = hidePanel;
        scope.mentionSelect = mentionSelect;

        scope.$watch('showPopup', panelHideOrShow);

        var extraClassName = ''; // Extra className to be added with the `medium-editor-mention-panel` element.
        var extraActiveClassName = ''; // Extra active className to be added with the `medium-editor-mention-panel-active` element.
        var tagName = 'strong'; // Element tag name that would indicate that this mention. It will have medium-editor-mention-at` className applied on it.
        var activeTriggerList = ['@'];
        var triggerClassNameMap = {
            "@": 'mention-at'
        };
        var hideOnBlurDelay = 300;

        return window.MediumEditor.Extension.extend({
            name: 'mention',
            init: function init() {
                initMentionPanel();
                scope.base = this.base;
                this.subscribe('editableKeyup', handleKeyup.bind(this));
            },
            destroy: function destroy() {
                PopupService.destroy(scope.popupEl);
            }
        });

        /////////////////////////////////////////////////

        function initMentionPanel() {
            scope.popupEl = PopupService.create({
                template: '<mention-search class="md-whiteframe-z2"></mention-search>',
                scope: scope
            });
        }

        function handleKeyup(event) {
            var keyCode = window.MediumEditor.util.getKeyCode(event);
            // Ignore Escape, up, down and return keys
            if (keyCode == CoreLibrary.keyCodes.ESCAPE || keyCode == CoreLibrary.keyCodes.UPARROW || keyCode == CoreLibrary.keyCodes.DOWNARROW || keyCode == CoreLibrary.keyCodes.RETURNKEY) {
                return;
            }
            scope.word = getWordFromSelection(event.target, 0);
            if (scope.word && scope.word.word) {
                showPanel();
            } else {
                hidePanel();
            }
        }

        function showPanel() {
            PopupService.show(scope);
            scope.activeMention = wrapWordInMentionAt(scope.word, scope);
            PopupService.position({
                popupEl: scope.popupEl,
                targetEl: scope.activeMention,
                type: 'start',
                side: 'bottom',
                padding: '10px 0 0 0'
            });
        }

        function hidePanel() {
            PopupService.hide(scope);
        }

        function panelHideOrShow() {
            // Panel Hide
            if (!scope.popupShow && scope.activeMention) {
                // If the mention element does not have an ID, it is unfinished so we unwrap
                if (!scope.activeMention.getAttribute("id")) {
                    scope.base.saveSelection();
                    unwrapForTextNode(scope.activeMention, document);
                    scope.base.restoreSelection();
                }
                // Else, we have done a successful mention
                else {
                        $timeout(function () {
                            // Put this section in a timeout so when we press return with the mention-list-nav we don't insert a new para in the editor
                            // TODO - Fix this - wierd race condition?

                            // Set the caret after the inserted mention and add a space
                            var selection = window.rangy.getSelection();
                            //create a range object to set the caret positioning for
                            var range = window.rangy.createRange();
                            //get the node of the element you wish to put the caret after
                            var startNode = scope.activeMention;
                            //set the caret after the node for this range
                            range.setStartAfter(startNode);
                            range.setEndAfter(startNode);
                            //apply this range to the selection object
                            selection.removeAllRanges();
                            selection.addRange(range);
                            insertHtmlAfterSelection('&nbsp;', range);
                        }, 500);
                    }
            }
        }

        function insertHtmlAfterSelection(html, range) {
            // this function will insert html/text after the caret/range
            // http://stackoverflow.com/questions/3597116/insert-html-after-a-selection
            var node;
            range.collapse(false);
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(),
                node,
                lastNode;
            while (node = el.firstChild) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);
        }

        function mentionSelect(id, type, name) {
            var mentionId = CoreLibrary.getUuid();
            scope.activeMention.innerHTML = scope.word.trigger + name;
            scope.activeMention.setAttribute('contenteditable', 'false');
            scope.activeMention.setAttribute('id', mentionId);
            // type: mentionId-parentType-parentId
            scope.activeMention.setAttribute('type', mentionId + '-' + type + '-' + id);
            scope.hidePanel();
        }

        function getWordFromSelection(target, initialDiff) {
            var _MediumEditor$selection$getSelectionRange = window.MediumEditor.selection.getSelectionRange(document);

            var startContainer = _MediumEditor$selection$getSelectionRange.startContainer;
            var startOffset = _MediumEditor$selection$getSelectionRange.startOffset;
            var endContainer = _MediumEditor$selection$getSelectionRange.endContainer;
            var endOffset = _MediumEditor$selection$getSelectionRange.endOffset;

            if (startContainer !== endContainer) {
                return;
            }
            var textContent = startContainer.textContent;

            function getWordPosition(_x, _x2) {
                var _again = true;

                _function: while (_again) {
                    var position = _x,
                        diff = _x2;
                    _again = false;

                    var prevText = textContent[position - 1];
                    if (null == prevText || 0 === prevText.trim().length || 0 >= position || textContent.length < position) {
                        return position;
                    } else {
                        _x = position + diff;
                        _x2 = diff;
                        _again = true;
                        prevText = undefined;
                        continue _function;
                    }
                }
            }
            // Ger current word
            var wordCurrentStart = getWordPosition(startOffset + initialDiff, -1);
            var wordCurrentEnd = getWordPosition(startOffset + initialDiff, 1) - 1;
            var wordCurrent = textContent.slice(wordCurrentStart, wordCurrentEnd);
            var wordCurrentFirst = wordCurrent.slice(0, 1);

            // Ger previous word
            var wordPrevStart = getWordPosition(wordCurrentStart - 1, -1);
            var wordPrevEnd = wordCurrentStart - 1;
            var wordPrev = textContent.slice(wordPrevStart, wordPrevEnd);
            var wordPrevFirst = wordPrev.slice(0, 1);

            var word = {};
            if (activeTriggerList.indexOf(wordCurrentFirst) != -1) {
                // Current word has an active trigger
                word.wordStart = wordCurrentStart;
                word.wordEnd = wordCurrentEnd;
            } else if (activeTriggerList.indexOf(wordPrevFirst) != -1) {
                // First previous word has an active trigger
                word.wordStart = wordPrevStart;
                word.wordEnd = wordCurrentEnd;
            } else {
                // No triggers found
                word.wordStart = 0;
                word.wordEnd = 0;
            }
            word.word = textContent.slice(word.wordStart, word.wordEnd);
            word.trigger = word.word.slice(0, 1);
            word.wordSearch = word.word.substring(1);
            word.triggerClassName = triggerClassNameMap[word.trigger];
            return word;
        }

        function wrapWordInMentionAt(word) {
            var selection = document.getSelection();
            var parentNode = angular.element(selection.anchorNode.parentElement);
            // If the parent node is a mention
            if (parentNode.hasClass(word.triggerClassName)) {
                return parentNode[0];
            }
            // If the parent node is not a mention
            else {
                    if (selection.rangeCount) {
                        // http://stackoverflow.com/a/6328906/1458162
                        var range = selection.getRangeAt(0).cloneRange();
                        range.setStart(range.startContainer, word.wordStart);
                        range.setEnd(range.startContainer, Math.min(word.wordEnd, range.startContainer.textContent.length));
                        // Instead, insert our own version of it.
                        // TODO: Not sure why, but using <span> tag doens't work here
                        var element = document.createElement(tagName);
                        element.classList.add(word.triggerClassName);

                        //
                        range.surroundContents(element);

                        selection.removeAllRanges();
                        selection.addRange(range);
                        window.MediumEditor.selection.select(document, element.firstChild, word.word.length);

                        // Return the active mention
                        return element;
                    }
                }
        }

        function unwrapForTextNode(el, doc) {
            var parentNode = el.parentNode,
                prevNode,
                currentNode;
            window.MediumEditor.util.unwrap(el, doc);
            // Merge textNode
            currentNode = parentNode.lastChild;
            while (prevNode = currentNode.previousSibling) {
                if (3 === currentNode.nodeType && 3 === prevNode.nodeType) {
                    prevNode.textContent += currentNode.textContent;
                    parentNode.removeChild(currentNode);
                }
                currentNode = prevNode;
            }
        }
    }
}).directive('mentionSearch', function (SearchService) {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/medium-editor-ext-mentions/tpls/mention-search.html',
        controller: function controller($scope, $timeout, $document, CoreLibrary) {
            $scope.$watch('word.wordSearch', search);

            //////////////////////////////////

            function search() {
                if ($scope.word) {
                    SearchService.search({
                        types: ['user', 'project', 'organisation'],
                        key: 'name',
                        value: $scope.word.wordSearch,
                        select: ['name', 'picture']
                    }).then(function (response) {
                        $scope.results = response.data;
                    });
                }
            }
        }
    };
}).directive("renderMentions", function ($timeout, CoreLibrary, $compile) {
    return {
        restrict: "A",
        link: function link(scope, element, attrs) {
            scope.$watch(attrs.ngBindHtml, process);

            ///////////////

            function process() {
                $timeout(function () {
                    angular.forEach(element[0].querySelectorAll('.mention-at'), function (mentionEl) {
                        mentionEl = angular.element(mentionEl);
                        var mentionInfo = mentionEl[0].getAttribute('type');
                        if (mentionInfo) {
                            var mentionDetails = mentionInfo.split('-');
                            if (mentionDetails.length == 3) {
                                var mentionId = mentionDetails[0];
                                var parentType = mentionDetails[1];
                                var parentId = mentionDetails[2];
                                var mentionContent = mentionEl[0].textContent;
                                var cardContent = '<card card-type=\'' + parentType + '\' card-id=\'' + parentId + '\'></card>';
                                var replacementMentionEl = angular.element('<a class="mention" popup popup-content="' + cardContent + '" id="' + mentionId + '" href="' + CoreLibrary.getHref(parentType, parentId) + '">' + mentionContent + '</a>');
                                $compile(replacementMentionEl)(scope);
                                mentionEl.after(replacementMentionEl);
                                mentionEl.remove();
                            }
                        }
                    });
                }, 1);
            }
        }
    };
});
'use strict';

angular.module('modules.medium-editor', ['modules.medium-editor-ext-backspace-merge', 'modules.medium-editor-ext-insert-media', 'modules.medium-editor-ext-mentions', 'modules.medium-editor-ext-mathjax'
//	'modules.medium-editor-ext-mathjax'
]);
angular.module('modules.medium-editor').directive('mediumEditor', function (MediumEditorInsertMediaExt, MediumEditorBackspaceMergeExt, MediumEditorMathjaxExt, MediumEditorMentionsExt, $timeout, $interval) {

	// From https://github.com/thijsw/angular-medium-editor/blob/master/src/angular-medium-editor.js
	return {
		require: 'ngModel',
		restrict: 'EA',
		scope: {
			bindOptions: '=',
			editorOrder: '=',
			editorSections: '=',
			editorSectionIndex: '=',
			editorSectionId: '=',
			editorType: '@?',
			editorOptions: '=?'
		},
		link: function link(scope, iElement, iAttrs, ctrl) {
			//			scope.editorSections[scope.editorSectionIndex].element = iElement;
			var InsertMediaExtension = MediumEditorInsertMediaExt.insertMedia(scope, iElement, iAttrs, ctrl);
			var MentionsExtension = MediumEditorMentionsExt.mentions(scope, iElement, iAttrs, ctrl);
			var BackspaceSectionMerge = MediumEditorBackspaceMergeExt.backspaceMerge(scope, iElement, iAttrs, ctrl);
			var CleanCaptionExtension = CleanCaptionExtension(scope, iElement, iAttrs, ctrl);
			var MathButton = MediumEditorMathjaxExt.mathButton();

			////////////////////////////////////////////////////////////////////////////////////////////////////

			angular.element(iElement).addClass('angular-medium-editor');

			// Parse options
			var opts = {};
			if (scope.editorType == 'caption') {
				opts = {
					toolbar: {
						buttons: ['bold', 'underline', 'anchor']
					},
					placeholder: { text: 'Enter your caption here...' },
					extensions: {
						'insert-media': new InsertMediaExtension(),
						'clean-caption': new CleanCaptionExtension()
					},
					autoLink: true,
					targetBlank: true,
					imageDragging: false,
					buttonLabels: 'fontawesome',
					anchor: {
						linkValidation: true
					}
				};
			} else if (scope.editorType == 'caption-banner') {
				opts = {
					toolbar: {
						buttons: ['h2', 'bold', 'italic', 'underline', 'quote', 'anchor']
					},
					placeholder: { text: 'Enter your caption here...' },
					extensions: { 'insert-media': new InsertMediaExtension() },
					autoLink: true,
					targetBlank: true,
					imageDragging: false,
					buttonLabels: 'fontawesome',
					anchor: {
						linkValidation: true
					}
				};
			} else if (scope.editorType == 'text') {
				opts = {
					toolbar: {
						buttons: ['bold', 'underline', 'anchor']
					},
					placeholder: { text: iAttrs.placeholder || 'Type your text' },
					autoLink: true,
					targetBlank: true,
					imageDragging: false,
					buttonLabels: 'fontawesome'

				};
			} else if (scope.editorType == 'text-rich') {
				opts = {
					toolbar: {
						buttons: ['bold', 'underline', 'anchor', 'quote', 'unorderedlist']
					},
					placeholder: { text: iAttrs.placeholder || 'Type your text' },
					extensions: {
						'mentions': new MentionsExtension()
					},
					autoLink: true,
					targetBlank: true,
					imageDragging: false,
					buttonLabels: 'fontawesome',
					anchor: {
						linkValidation: true
					}

				};
			} else {
				opts = {
					toolbar: {
						buttons: ['h2', 'h3', 'bold', 'italic', 'underline', 'quote', 'unorderedlist', 'anchor', 'table', 'math']
					},
					placeholder: { text: iAttrs.placeholder || 'Text section' },
					extensions: {
						'insert-media': new InsertMediaExtension(),
						'backspace-section-merge': new BackspaceSectionMerge(),
						'mentions': new MentionsExtension(),
						'MathPreview': new (MediumEditorMathjaxExt.mathPreview())(),
						'MathButton': new MathButton(),
						'table': new MediumEditorTable()
					},
					autoLink: true,
					targetBlank: true,
					imageDragging: false,
					buttonLabels: 'fontawesome',
					anchor: {
						linkValidation: true
					}
				};
			}

			var onChange = function onChange() {
				scope.$apply(function () {
					if (iElement.html() === '<br>' || iElement.html() === '') {
						var editor = new MediumEditor(iElement, opts);
					}
					ctrl.$setViewValue(iElement.html());
				});
			};
			var onFocus = function onFocus() {
				// Fix html on focus to make sure we can type.
				var html = iElement.html();
				if (!html || html == '<p></p>' || html == '<br>' || html == '<h1></h1>' || html == '<h2></h2>' || html == '<h3></h3>') {
					iElement.html('<p><br></p>');
				}
			};

			// view -> model
			iElement.on('focus', onFocus);
			iElement.on('blur', onChange);
			iElement.on('input', onChange);

			//			$interval(function(){
			//				console.log(ctrl.$viewValue);
			//			},1000)

			// model -> view
			ctrl.$render = function () {
				if (!this.editor) {
					this.editor = new MediumEditor(iElement, opts);
				}
				if (!ctrl.$viewValue || ctrl.$viewValue == '<p></p>' || ctrl.$viewValue == '<p><br></p>' || ctrl.$viewValue == '<p class=""></p>' || ctrl.$viewValue == '<p class></p>' || ctrl.$viewValue == '<br>') {
					iElement.html('<p><br></p>');
					iElement.addClass('medium-editor-placeholder');
				} else {
					iElement.html(ctrl.$viewValue);
					iElement.removeClass('medium-editor-placeholder');
				}
			};

			////////////////////////////////////////////////////////////////////////

			function CleanCaptionExtension(scope, element, attrs, ctrl) {
				// Unwrap italics and remove h2
				return window.MediumEditor.Extension.extend({
					init: function init() {
						$timeout(function () {
							angular.forEach(element[0].querySelectorAll('h2,blockquote'), function (element) {
								angular.element(element).contents().unwrap().wrap('<p></p>');
							});
							angular.forEach(element[0].querySelectorAll('i'), function (element) {
								angular.element(element).contents().unwrap();
							});
						}, 0);
					}
				});
			}
		}
	};
}).service('MediumEditorModalService', function ($mdDialog) {
	this.insertVideo = function (event) {
		return $mdDialog.show({
			templateUrl: 'app/modules/medium-editor/tpls/editor-video-modal.html',
			controller: function controller($scope) {
				$scope.cancel = function () {
					$mdDialog.cancel();
				};
				$scope.save = function () {
					if ($scope.LinkForm.$valid) {
						$mdDialog.hide($scope.link);
					}
				};
			},
			targetEvent: event
		});
	};
	this.createLink = function (event, link) {
		return $mdDialog.show({
			templateUrl: 'app/modules/medium-editor/tpls/editor-link-modal.html',
			controller: function controller(data, $scope) {
				$scope.data = {
					link: data
				};
				$scope.cancel = function () {
					$mdDialog.cancel();
				};
				$scope.save = function () {
					if ($scope.LinkForm.$valid) {
						$mdDialog.hide($scope.data);
					}
				};
			},
			targetEvent: event,
			locals: { data: link }
		});
	};
}).service('MediumEditorUtilService', function ($mdDialog) {
	this.removeSpanStyles = removeSpanStyles; // function(editorElement)
	this.removeEmptyP = removeEmptyP; // function(editorElement)

	///////////////////////////////////

	function removeSpanStyles(editorElement) {
		angular.element(editorElement).find("span[style]").contents().unwrap();
	}
	function removeEmptyP(editorElement) {
		angular.element(editorElement).find("p:empty").remove();
	}
});
'use strict';

angular.module('modules.missing-fields', []);
angular.module('modules.missing-fields').directive('missingFields', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            entity: '=', // The entity to inspect for missing fields
            requiredFields: '=',
            form: '=?' // The form which form.$completed will be assigned when there are no missing fields
            /*****************************
                requiredFields : [
                    {
                        condition: function(entity){function that returns true}
                        title: 'There is no name. <a ng-click="field.click()">Click here to add a name.</a>'
                    }
                ]
            *****************************/
        },
        controller: function controller($scope) {
            $scope.$watch(function () {
                if ($scope.form) {
                    $scope.form.$completed = !_.find($scope.requiredFields, 'missing');
                }

                _.forEach($scope.requiredFields, function (field) {
                    field.missing = !field.condition($scope.entity);
                });
            });
        },
        templateUrl: 'app/modules/missing-fields/tpls/missing-fields.html'
    };
});
'use strict';

angular.module('modules.modular-editor.append-buttons', []);
angular.module('modules.modular-editor.append-buttons').directive('editorAppendButtons', function () {
	return {
		restrict: 'E',
		templateUrl: 'app/modules/modular-editor/append-buttons/append-buttons.html',
		controller: function controller($scope, $timeout, ModularEditorService, UploadsModalService, MediumEditorModalService, RealtimeEditorService) {
			$scope.insertText = function (event) {
				var newSection = ModularEditorService.getTextSection();
				ModularEditorService.pushNewSection($scope.editorSections, newSection);
				var newSections = {};
				newSections[newSection.id] = newSection;
				if ($scope.editorOptions.realtime) {
					RealtimeEditorService.addSections(newSections, $scope.editorSections.sectionOrder);
				}
				focusNewSection(newSection.id);
			};
			$scope.insertImage = function (event) {
				UploadsModalService.uploadImageNewModal(event).then(function (result) {
					var newSection = ModularEditorService.getImageSection(result);
					ModularEditorService.pushNewSection($scope.editorSections, newSection);
					var newSections = {};
					newSections[newSection.id] = newSection;
					if ($scope.editorOptions.realtime) {
						RealtimeEditorService.addSections(newSections, $scope.editorSections.sectionOrder);
					}
					focusNewSection(newSection.id);
				});
			};
			$scope.insertVideo = function (event) {
				MediumEditorModalService.insertVideo(event).then(function (result) {
					var newSection = ModularEditorService.getVideoSection(result);
					ModularEditorService.pushNewSection($scope.editorSections, newSection);
					var newSections = {};
					newSections[newSection.id] = newSection;
					if ($scope.editorOptions.realtime) {
						RealtimeEditorService.addSections(newSections, $scope.editorSections.sectionOrder);
					}
					focusNewSection(newSection.id);
				});
			};
			$scope.insertMath = function (event) {
				var newSection = ModularEditorService.getMathSection();
				ModularEditorService.pushNewSection($scope.editorSections, newSection);
				var newSections = {};
				newSections[newSection.id] = newSection;
				if ($scope.editorOptions.realtime) {
					RealtimeEditorService.addSections(newSections, $scope.editorSections.sectionOrder);
				}
				focusNewSection(newSection.id);
			};
			$scope.insertCode = function (event) {
				var newSection = ModularEditorService.getCodeSection();
				ModularEditorService.pushNewSection($scope.editorSections, newSection);
				var newSections = {};
				newSections[newSection.id] = newSection;
				if ($scope.editorOptions.realtime) {
					RealtimeEditorService.addSections(newSections, $scope.editorSections.sectionOrder);
				}
				focusNewSection(newSection.id);
			};
			$scope.insertFiles = function (event) {
				UploadsModalService.uploadFiles(event).then(function (result) {
					var newSection = ModularEditorService.getFileSection(result);
					ModularEditorService.pushNewSection($scope.editorSections, newSection);
					var newSections = {};
					newSections[newSection.id] = newSection;
					if ($scope.editorOptions.realtime) {
						RealtimeEditorService.addSections(newSections, $scope.editorSections.sectonOrder);
					}
					focusNewSection(newSection.id);
				});
			};

			///////////////////////////////////////////////

			function focusNewSection(sectionId) {
				$timeout(function () {
					if ($scope.editorSections.sections[sectionId].contentElement) {
						$scope.editorSections.sections[sectionId].contentElement.focus();
					}
				}, 200);
			}
		}
	};
});
'use strict';

angular.module('modules.modular-editor.caption', []);

angular.module('modules.modular-editor.caption').directive('editorCaptionPublic', function () {
	return {
		restrict: 'E',
		templateUrl: 'app/modules/modular-editor/caption/public/caption.html'
	};
}).directive('editorCaptionEdit', function () {
	return {
		restrict: 'E',
		templateUrl: 'app/modules/modular-editor/caption/edit/caption.html'
	};
});
'use strict';

angular.module('modules.modular-editor.help-footer', []);
angular.module('modules.modular-editor.help-footer').directive('editorHelpFooter', function () {
	return {
		restrict: 'E',
		templateUrl: 'app/modules/modular-editor/help-footer/help-footer.html',
		controller: function controller($scope, TipService, Authentication) {
			$scope.currentHelpSection = 0;
			$scope.next = next; // function()
			$scope.previous = previous; // function()
			$scope.close = close; //function()
			initialise();
			$scope.helpSections = [{
				html: '<div class="md-headline text-center">Add images and other media by starting a new line and clicking the <img src="/assets/images/editor/insert.png" alt="Insert Button"> or [Ctrl + I]</div>' + '<img src="/assets/images/editor/InsertTool.gif" alt="Insert Media">'
			}, {
				html: '<div class="md-headline text-center">Want to change text formatting, add links or headings?</div>' + '<img src="/assets/images/editor/ChangeTextFormat.gif" alt="Change Text Formatting">'
			}];

			///////////////////////////////////////////////////////////
			var tipStatuses;
			function initialise() {
				if (Authentication.currentUser.isLoggedIn()) {
					TipService.getStatuses().then(function (statuses) {
						tipStatuses = statuses;
						// show the tip if we have not seen it and the editor is not minimal
						//                        if(statuses.editorHelp && !$scope.editorOptions.minimal){
						//                            $scope.editorOptions.showHelp = true
						//                        }
						//                        else{
						//                            $scope.editorOptions.showHelp = false;
						//                        }
						$scope.editorOptions.showHelp = false;
					});
				}
			}

			function close() {
				if (tipStatuses.editorHelp) {
					TipService.markAsRead('editorHelp');
				}
				$scope.editorOptions.showHelp = false;
			}

			var looper = 0;
			function next() {
				looper++;
				$scope.currentHelpSection = Math.abs(looper % $scope.helpSections.length);
			}
			function previous() {
				looper--;
				$scope.currentHelpSection = Math.abs(looper % $scope.helpSections.length);
			}
		}
	};
});
'use strict';

angular.module('modules.modular-editor.insert-buttons', []);
angular.module('modules.modular-editor.insert-buttons').directive('editorInsertButtons', function (ModularEditorService, UploadsModalService, RealtimeEditorService, MediumEditorModalService, $timeout) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'app/modules/modular-editor/insert-buttons/insert-buttons.html',
		link: function link(scope, element, attrs, ctrl) {
			ctrl = scope.ctrl; // Pass Ctrl through scope
			var iElement = scope.iElement; // Pass iElement through scope

			// Tool buttons
			scope.toggleInsertTools = function () {
				scope.showInsertTools = !scope.showInsertTools;
			};
			scope.insertTextSection = function () {
				scope.showInsertButtons = false;
				scope.showInsertTools = false;
				ModularEditorService.addNewSections({
					editorSections: scope.editorSections,
					editorOrder: scope.editorOrder,
					sections: [getNewTextSection()],
					location: scope.editorSectionIndex
				});
				focusNewSection();
				var modifiedSections = getModifiedSections(2, scope.editorSections, scope.editorOrder, scope.editorSectionIndex);
				if (scope.editorOptions.realtime) {
					RealtimeEditorService.addSections(modifiedSections, scope.editorOrder);
				}
			};
			scope.insertImage = function (event) {
				scope.showInsertButtons = false;
				scope.showInsertTools = false;
				var selection = saveSelection();
				UploadsModalService.uploadImageNewModal(event).then(function (result) {
					restoreSelection(selection);
					ModularEditorService.addNewSections({
						editorSections: scope.editorSections,
						editorOrder: scope.editorOrder,
						sections: [ModularEditorService.getImageSection(result), getNewTextSection()],
						location: scope.editorSectionIndex
					});
					focusNewSection();
					var modifiedSections = getModifiedSections(3, scope.editorSections, scope.editorOrder, scope.editorSectionIndex);
					if (scope.editorOptions.realtime) {
						RealtimeEditorService.addSections(modifiedSections, scope.editorOrder);
					}
				});
			};
			scope.insertFiles = function (event) {
				scope.showInsertButtons = false;
				scope.showInsertTools = false;
				var selection = saveSelection();
				UploadsModalService.uploadFiles(event).then(function (result) {
					restoreSelection(selection);
					ModularEditorService.addNewSections({
						editorSections: scope.editorSections,
						editorOrder: scope.editorOrder,
						sections: [ModularEditorService.getFileSection(result), getNewTextSection()],
						location: scope.editorSectionIndex
					});
					var modifiedSections = getModifiedSections(3, scope.editorSections, scope.editorOrder, scope.editorSectionIndex);
					if (scope.editorOptions.realtime) {
						RealtimeEditorService.addSections(modifiedSections, scope.editorOrder);
					}
				});
			};
			scope.insertVideo = function (event) {
				scope.showInsertButtons = false;
				scope.showInsertTools = false;
				var selection = saveSelection();
				MediumEditorModalService.insertVideo(event).then(function (result) {
					restoreSelection(selection);
					ModularEditorService.addNewSections({
						editorSections: scope.editorSections,
						editorOrder: scope.editorOrder,
						sections: [ModularEditorService.getVideoSection(result), getNewTextSection()],
						location: scope.editorSectionIndex
					});
					focusNewSection();
					var modifiedSections = getModifiedSections(3, scope.editorSections, scope.editorOrder, scope.editorSectionIndex);
					if (scope.editorOptions.realtime) {
						RealtimeEditorService.addSections(modifiedSections, scope.editorOrder);
					}
				});
			};
			scope.insertMath = function (event) {
				scope.showInsertButtons = false;
				scope.showInsertTools = false;
				ModularEditorService.addNewSections({
					editorSections: scope.editorSections,
					editorOrder: scope.editorOrder,
					sections: [ModularEditorService.getMathSection(), getNewTextSection()],
					location: scope.editorSectionIndex
				});
				focusNewSection();
				var modifiedSections = getModifiedSections(3, scope.editorSections, scope.editorOrder, scope.editorSectionIndex);
				if (scope.editorOptions.realtime) {
					RealtimeEditorService.addSections(modifiedSections, scope.editorOrder);
				}
			};
			scope.insertCode = function (event) {
				scope.showInsertButtons = false;
				scope.showInsertTools = false;
				ModularEditorService.addNewSections({
					editorSections: scope.editorSections,
					editorOrder: scope.editorOrder,
					sections: [ModularEditorService.getCodeSection(), getNewTextSection()],
					location: scope.editorSectionIndex
				});
				focusNewSection();
				var modifiedSections = getModifiedSections(3, scope.editorSections, scope.editorOrder, scope.editorSectionIndex);
				if (scope.editorOptions.realtime) {
					RealtimeEditorService.addSections(modifiedSections, scope.editorOrder);
				}
			};

			///////////////////////////////////////////////////////////////////////////////////////

			function getModifiedSections(number, editorSections, editorOrder, editorSectionIndex) {
				// number is the number of fields modified
				var modifiedSections = {};
				if (number >= 1) modifiedSections[editorOrder[editorSectionIndex]] = editorSections[editorOrder[editorSectionIndex]];
				if (number >= 2) modifiedSections[editorOrder[editorSectionIndex + 1]] = editorSections[editorOrder[editorSectionIndex + 1]];
				if (number >= 3) modifiedSections[editorOrder[editorSectionIndex + 2]] = editorSections[editorOrder[editorSectionIndex + 2]];
				return modifiedSections;
			}
			function focusNewSection() {
				$timeout(function () {
					(scope.editorSections[scope.editorOrder[scope.editorSectionIndex + 1]].contentElement || scope.editorSections[scope.editorOrder[scope.editorSectionIndex + 1]].captionElement).focus();
				}, 100);
				// We update the model using the view
				ctrl.$setViewValue(iElement.html());
			}

			// Functions for extracting content after caret ---------------------------------------
			// http://stackoverflow.com/questions/5740640/contenteditable-extract-text-from-caret-to-end-of-element
			function getNewTextSection() {
				var newSectionContent = extractSectionContents();
				// Set newsectionContent to <p><br></p> if empty
				if (!newSectionContent || newSectionContent == '<p class=""></p>' || newSectionContent == '<p></p>' || newSectionContent == '<br>' || newSectionContent == '</br>' || newSectionContent == '<h1></h1>' || newSectionContent == '<h2></h2>') {
					newSectionContent = '';
				}
				return ModularEditorService.getTextSection(newSectionContent);
			}

			function extractSectionContents() {
				var sel = window.getSelection();
				if (sel.rangeCount) {
					var selRange = sel.getRangeAt(0);
					var blockEl = getBlockContainer(selRange.endContainer);
					if (blockEl) {
						var range = selRange.cloneRange();
						range.selectNodeContents(blockEl);
						range.setStart(selRange.endContainer, selRange.endOffset);

						// Outputting the fragment content using a throwaway intermediary DOM element (div):
						var fragment = range.extractContents();
						var body = angular.element(document.body);
						var tempDiv = angular.element('<div class="hidden"></div>');
						body.append(tempDiv); // Append to body
						tempDiv.append(fragment); // Append fragment
						var innerHtml = tempDiv[0].innerHTML; // Get inner html
						tempDiv.remove(); // Remove temp div
						return innerHtml;
					}
				}
			}

			function getBlockContainer(node) {
				while (node) {
					// Example block elements below, you may want to add more
					if (node.nodeType == 1 && node.hasAttribute('medium-editor')) {
						return node;
					}
					node = node.parentNode;
				}
			}

			// Functions for saving and restoring range -------------------------------------------
			// http://stackoverflow.com/questions/1181700/set-cursor-position-on-contenteditable-div
			function saveSelection() {
				var savedRange;
				// non IE Browsers
				if (window.getSelection) {
					savedRange = window.getSelection().getRangeAt(0);
				}
				// IE
				else if (document.selection) {
						savedRange = document.selection.createRange();
					}
				return savedRange;
			}

			function restoreSelection(savedRange) {
				iElement.focus();
				if (savedRange !== null) {
					//non IE and there is already a selection
					if (window.getSelection) {
						var s = window.getSelection();
						if (s.rangeCount > 0) s.removeAllRanges();
						s.addRange(savedRange);
					}
					//non IE and no selection
					else if (document.createRange) {
							window.getSelection().addRange(savedRange);
						}
						//IE
						else if (document.selection) {
								savedRange.select();
							}
				}
			}
		}
	};
});
'use strict';

angular.module('modules.modular-editor', ['modules.modular-editor.section', 'modules.modular-editor.caption', 'modules.modular-editor.append-buttons', 'modules.modular-editor.help-footer', 'modules.modular-editor.insert-buttons', 'modules.modular-editor.section-buttons', 'modules.modular-editor.toolbar', 'modules.medium-editor',
//	'youtube-embed',
'anguvideo', 'modules.mathjax']);
angular.module('modules.modular-editor').

/****************************************************************************************************
    Example Content

    var sectionOrder = ["asfasfafsas1", "asfasfafsas2", "asfasfafsas3", "asfasfafsas4"];
    var sections  = {
        'asfasfafsas1' : {
            id      : 'asfasfafsas1',
            type    : 'file',
            files   : [
                {
                    name: "File 1",
                    size: 3369,
                    type: "jpeg",
                    url: "/uploads/e42802c6-754b-44b0-8eda-a9ef4e7a5fdf.jpeg"
                },{
                    name: "File 2",
                    size: 3369,
                    type: "jpeg",
                    url: "/uploads/e42802c6-754b-44b0-8eda-a9ef4e7a5fdf.jpeg"
                },
            ]
        },
        'asfasfafsas2' : {
            id       : 'asfasfafsas2',
            content : "e^{ \\pm i\\theta } = \\cos \\theta \\pm i\\sin \\theta",
            caption : "<p>Equation 1: its a fraction</p>",
            type    : 'math',
        },
        'asfasfafsas3' : {
            id      : 'asfasfafsas3',
            content : '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet quisquam tempora, ab aspernatur officia, minima eveniet voluptatem consequatur reprehenderit porro excepturi, modi doloribus asperiores. Vel debitis laboriosam iste fugit at?</p>'+
            '<p>Dolore laboriosam dolor aspernatur adipisci laborum mollitia impedit ipsam quibusdam, tempore reprehenderit porro expedita labore eaque in neque cumque nostrum, magnam aperiam harum odio commodi molestias! Magni repudiandae praesentium quod.</p>'+
            '<p>Delectus facere atque, omnis harum pariatur explicabo in. Delectus laudantium tenetur, quam, nobis, minus modi consequuntur possimus a commodi placeat ratione ad numquam. Atque nostrum, eveniet repudiandae quibusdam, unde ipsum.</p>',
            type    : 'text',
        },
        'asfasfafsas4' : {
            id      : 'asfasfafsas4',
            image   : {
                url    : '/uploads/upload_e67024024584a2d970d5b5ba163f0958.jpg',
                width  : 1920.
                height : 1080
            },
            type    : 'image',
            layout  : 'full-width-banner-text',
            caption : '<p>This is some random sort of caption..</p>'
        },
    }
    $scope.sectionData = {
        sections     : sections,
        sectionOrder : sectionOrder
    }

****************************************************************************************************/

service('ModularEditorService', function (CoreLibrary, $timeout) {
	var service = this;
	this.stripSectionDomElements = stripSectionDomElements; //function(section)
	this.stripSectionsDomElements = stripSectionsDomElements; //function(section)

	this.getTextSection = getTextSection; //function(content)
	this.getImageSection = getImageSection; //function(content)
	this.getVideoSection = getVideoSection; //function(content)
	this.getFileSection = getFileSection; //function(content)
	this.getMathSection = getMathSection; //function(content)
	this.getCodeSection = getCodeSection; //function(content)

	this.pushNewSection = pushNewSection; //function(sectionData, section) - pushes new section onto sectionOrder array and adds to section object
	this.addNewSections = addNewSections; //function({editorSections, editorOrder, sections, location}) - adds a new section onto sectionOrder array and adds to section object

	this.focusFirstContent = focusFirstContent; //function(sectionData)

	////////////////////////////////////////

	function stripSectionDomElements(section) {
		delete section.captionElement;
		delete section.contentElement;
		delete section.sectionElement;
		delete section.toc;
	}
	function stripSectionsDomElements(sections) {
		_.forEach(sections, function (section) {
			stripSectionDomElements(section);
		});
	}

	function getTextSection(content) {
		var section = {
			id: CoreLibrary.getUuid(),
			content: content || '',
			type: 'text'
		};
		return section;
	}
	function getImageSection(content) {
		console.log(content);
		var section = {
			id: CoreLibrary.getUuid(),
			image: content, //{url: '', width: 1920, height: 1080}
			type: 'image',
			layout: 'center',
			caption: ''
		};
		return section;
	}
	function getVideoSection(content) {
		var section = {
			id: CoreLibrary.getUuid(),
			videoUrl: content,
			videoType: 'youtube',
			type: 'video',
			layout: 'wide',
			caption: ''
		};
		return section;
	}
	function getFileSection(content) {
		var section = {
			id: CoreLibrary.getUuid(),
			files: content || [],
			type: 'file'
		};
		return section;
	}
	function getCodeSection(content) {
		var section = {
			id: CoreLibrary.getUuid(),
			code: content,
			type: 'code'
		};
		return section;
	}
	function getMathSection(content) {
		var section = {
			id: CoreLibrary.getUuid(),
			content: content,
			type: 'math',
			caption: ''
		};
		return section;
	}
	function pushNewSection(sectionData, section) {
		sectionData.sections = sectionData.sections || {};
		sectionData.sections[section.id] = section;
		sectionData.sectionOrder.push(section.id);
	}
	function addNewSections(data) {
		/***************************************************
  data : {
  	editorSections : sections object
  	editorOrder    : order array
  	sections       : array of new sections
  	location       : location to add new sections
  }
  ***************************************************/
		_.forEachRight(data.sections, function (section) {
			data.editorSections[section.id] = section; // Add each section to editorSections
			data.editorOrder.splice(data.location + 1, 0, section.id); // Splice each onto the array
		});
	}
	function focusFirstContent(sectionData) {
		if (sectionData.sectionOrder[0]) {
			$timeout(function () {
				document.getElementById('content-' + sectionData.sectionOrder[0]).focus();
			}, 100);
		}
	}
}).

// Set Element directives
directive('editorSectionElement', function () {
	return {
		restrict: 'A',
		link: function link(scope, element, attrs) {
			scope.section.sectionElement = element;
		}
	};
}).directive('editorContentElement', function () {
	return {
		restrict: 'A',
		link: function link(scope, element, attrs) {
			scope.section.contentElement = element;
		}
	};
}).directive('editorCaptionElement', function () {
	return {
		restrict: 'A',
		link: function link(scope, element, attrs) {
			scope.section.captionElement = element;
		}
	};
}).

// Set Input directives

directive('modularEditor', function () {
	return {
		restrict: 'E',
		templateUrl: 'app/modules/modular-editor/tpls/editor-sections.html',
		// Classes: minimal
		scope: {
			editorSections: '=',
			editorOptions: '=',
			edit: '=',
			focus: '=?',
			placeholder: '@?'
		},
		/********************************************
  Inputs:
  		The editorSections object describes all the section data
  editorSections : {
  	sections : {
  		sectionId1 : {sectionObject},
  		sectionId2 : {sectionObject},
  	},
  	sectionsOrder : [sectionId1, sectionId2]
  }
  		editorOptions : {
  	realtime  : true || false - is it a realtime editor?
  	contained : true || false - if true we assume directive is in md-container
  	minimal   : true || false - if true it will hide the lower add section button
  	showHelp  : true || false - if true it show the help footer
  }
  		*********************************************/
		controller: function controller($scope, ModularEditorService, RealtimeEditorService, $timeout, $interval, $element) {
			// Defaults
			$scope.editorOptions = $scope.editorOptions || {};
			$scope.editorOptions.realtime = $scope.editorOptions.realtime || false;
			$scope.editorOptions.contained = $scope.editorOptions.contained || false;
			$scope.editorOptions.minimal = $scope.editorOptions.minimal || false;
			$scope.editorSections = $scope.editorSections || {};
			$scope.editorSections.sections = $scope.editorSections.sections || {};
			$scope.editorSections.sectionOrder = $scope.editorSections.sectionOrder || [];

			$scope.RealtimeEditorService = RealtimeEditorService;
			if ($scope.editorOptions.realtime) {
				// Assign service values
				RealtimeEditorService.sectionOrder = $scope.editorSections.sectionOrder;
				RealtimeEditorService.sections = $scope.editorSections.sections;
				// Link to the service
				$scope.editorSections = RealtimeEditorService;
			}

			$scope.addTextSection = function () {
				var textSection = ModularEditorService.getTextSection();
				//                textSection.content = '<p><br></p><p><br></p><p><br></p>';
				$scope.editorSections.sections[textSection.id] = textSection;
				$scope.editorSections.sectionOrder.push(textSection.id);
				//				$timeout(function(){
				//					if($scope.editorSections.sections[textSection.id].contentElement){
				//						$scope.editorSections.sections[textSection.id].contentElement.focus();
				//					}
				//				},200)
			};

			// If empty, we add an initial text section
			if ($scope.editorSections.sectionOrder.length == 0) {
				$scope.addTextSection();
			}

			$scope.sortableConfig = {
				handle: ".my-handle",
				animation: 300,
				onUpdate: function onUpdate(event) {
					if ($scope.editorOptions.realtime) {
						RealtimeEditorService.changeSectionOrder(event.models);
					};
				}
			};

			$scope.$watch('focus', focus);

			////////////////////////////

			function focus() {
				// Focus the first content section if focus is true
				if ($scope.focus) {
					ModularEditorService.focusFirstContent($scope.editorSections);
				}
			}
		}
	};
}).directive('editorDivider', function () {
	return {
		restrict: 'E',
		scope: {
			section: '=',
			editorSections: '=',
			editorOrder: '=',
			editorSectionIndex: '=',
			editorSectionId: '=',
			editorOptions: '='
		},
		templateUrl: 'app/modules/modular-editor/tpls/editor-divider.html'
	};
});
'use strict';

angular.module('modules.modular-editor.section-buttons', []);
angular.module('modules.modular-editor.section-buttons').directive('editorSectionButtons', function (UploadsModalService, MediumEditorModalService, RealtimeEditorService) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'app/modules/modular-editor/section-buttons/section-buttons.html',
		controller: function controller($scope) {
			$scope.deleteSection = deleteSection; // function()
			$scope.checkMergeAbove = checkMergeAbove; // function()
			$scope.checkMergeBelow = checkMergeBelow; // function()
			$scope.mergeWihAbove = mergeWithAbove; // function()
			$scope.mergeWithBelow = mergeWithBelow; // function()
			$scope.changeImage = changeImage; // function(event)
			$scope.uploadFiles = uploadFiles; // function(event)
			$scope.changeVideo = changeVideo; // function(event)
			$scope.createLink = createLink; // function(event, link)
			$scope.highlightSection = highlightSection; // function(sectionIndex, style)
			$scope.deleteHighlight = deleteHighlight; // function(sectionIndex
			$scope.deleteUnhighlight = deleteUnhighlight; // function(sectionIndex)
			$scope.unhighlightSection = unhighlightSection; // function(sectionIndex)
			$scope.highlightSections = highlightSections; // function()
			$scope.unhighlightSections = unhighlightSections; // function()

			//////////////////////////////////////
			function deleteSection() {
				delete $scope.editorSections[$scope.editorSectionId];
				$scope.editorOrder.splice($scope.editorSectionIndex, 1);
				if ($scope.editorOptions.realtime) {
					RealtimeEditorService.deleteSection($scope.editorSectionId);
				};
			}

			function checkMergeAbove() {
				// returns true if we can merge
				if ($scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex]] && $scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex - 1]] && (!RealtimeEditorService.edits[$scope.editorOrder[$scope.editorSectionIndex - 1]] || !$scope.editorOptions.realtime) && // If the previous section is not locked
				$scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex]].type == 'text' && $scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex - 1]].type == 'text') {
					return true;
				} else {
					return false;
				}
			}
			function checkMergeBelow() {
				// returns true if we can merge
				if ($scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex]] && $scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex + 1]] && (!RealtimeEditorService.edits[$scope.editorOrder[$scope.editorSectionIndex + 1]] || !$scope.editorOptions.realtime) && // If the previous section is not locked
				$scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex]].type == 'text' && $scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex + 1]].type == 'text') {
					return true;
				} else {
					return false;
				}
			}

			function mergeWithAbove() {
				// Check if we can merge
				if (checkMergeAbove()) {
					// Add the content onto the previous section
					$scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex - 1]].content = $scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex - 1]].content + $scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex]].content;
					if ($scope.editorOptions.realtime) {
						RealtimeEditorService.saveSection($scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex - 1]]);
					}
					$scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex - 1]].contentElement.focus(); // This change focus saves
					deleteSection();
					unhighlightSections();
				}
			}

			function mergeWithBelow() {
				// Check if we can merge
				if (checkMergeBelow()) {
					// Add the content onto the previous section
					$scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex + 1]].content = $scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex]].content + $scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex + 1]].content;
					if ($scope.editorOptions.realtime) {
						RealtimeEditorService.saveSection($scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex + 1]]);
					}
					$scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex + 1]].contentElement.focus(); // This change focus saves
					deleteSection();
					unhighlightSections();
				}
			}

			function changeImage(event) {
				UploadsModalService.uploadImageNewModal(event).then(function (result) {
					$scope.section.image = result;
				});
			}
			function uploadFiles(event) {
				UploadsModalService.uploadFiles(event).then(function (result) {
					$scope.section.files = $scope.section.files.concat(result);
				});
			}

			function changeVideo(event) {
				MediumEditorModalService.insertVideo(event).then(function (result) {
					$scope.section.videoUrl = result;
				});
			}
			function createLink(event, link) {
				MediumEditorModalService.createLink(event, link).then(function (result) {
					$scope.section.linkUrl = result.link;
				});
			}

			function highlightSection(sectionIndex) {
				$scope.editorSections[$scope.editorOrder[sectionIndex]].sectionElement.addClass('highlight-edit');
			}
			function deleteHighlight(sectionIndex) {
				$scope.editorSections[$scope.editorOrder[sectionIndex]].sectionElement.addClass('highlight-delete');
			}
			function deleteUnhighlight(sectionIndex) {
				$scope.editorSections[$scope.editorOrder[sectionIndex]].sectionElement.removeClass('highlight-delete');
			}
			function unhighlightSection(sectionIndex) {
				$scope.editorSections[$scope.editorOrder[sectionIndex]].sectionElement.removeClass('highlight-edit');
			}
			function highlightSections() {
				_.forEach($scope.editorSections, function (section) {
					if (section.sectionElement) {
						section.sectionElement.addClass('highlight-edit');
					}
				});
			}
			function unhighlightSections() {
				_.forEach($scope.editorSections, function (section) {
					if (section.sectionElement) {
						section.sectionElement.removeClass('highlight-edit');
					}
				});
			}
		}
	};
});
'use strict';

angular.module('modules.modular-editor.section', []);
angular.module('modules.modular-editor.section').directive('editorSection', function (CodeMirrorService) {
    return {
        restrict: 'E',
        scope: {
            section: '=',
            editorSections: '=',
            editorOrder: '=',
            editorSectionIndex: '=',
            editorSectionId: '=',
            editorOptions: '=',
            edit: '=',
            placeholder: '@'
        },
        link: function link(scope, element, attrs) {
            //            getTemplatePath();
            scope.$watch('section.layout', getTemplatePath);

            if (scope.section.type == 'code') {
                // Code otions
                scope.options = {
                    indentWithTabs: true,
                    readOnly: !scope.edit,
                    dragDrop: false,
                    lineWrapping: true,
                    onLoad: function onLoad(cmEditor) {
                        scope.cmEditor = cmEditor;
                        CodeMirrorService.changeCodeMode(cmEditor, scope.section.codeMode);
                    }
                };
            }

            ////////////////////////////

            function getTemplatePath() {
                var path = 'app/modules/modular-editor/section/';
                path += scope.section.type + '/';
                path += scope.edit ? 'edit/' : 'public/';
                path += scope.section.layout ? scope.section.layout : scope.section.type;
                path += '.html';
                scope.template = path;
            }
        },
        template: '<div layout="row" layout-align="center" ng-include="template"></div>'
    };
}).directive('editorVideoOverlay', function () {
    return {
        restrict: 'E',
        replace: true,
        // tabindex allows the div to be focused
        template: '<div tabindex="0" ng-if="edit" class="editor-video-overlay"></div>'
    };
});
'use strict';

angular.module('modules.modular-editor.toolbar', []);
angular.module('modules.modular-editor.toolbar').directive('editorToolbarLayout', function () {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'app/modules/modular-editor/toolbar/toolbar.html',
		controller: function controller($scope) {
			$scope.layoutButtonDetails = {
				'full-width': {
					tooltip: 'Full width',
					icon: 'layout-full-width'
				},
				'full-width-banner': {
					tooltip: 'Full width banner',
					icon: 'layout-full-width-banner'
				},
				'full-width-banner-text': {
					tooltip: 'Full width banner text',
					icon: 'layout-full-width-banner-text'
				},
				'left': {
					tooltip: 'Left',
					icon: 'layout-left'
				},
				'right': {
					tooltip: 'Right',
					icon: 'layout-right'
				},
				'center': {
					tooltip: 'Center',
					icon: 'layout-center'
				},
				'wide': {
					tooltip: 'Wide',
					icon: 'layout-wide'
				}
			};
			if ($scope.section.type == 'image') {
				if ($scope.editorOptions.contained) {
					$scope.layoutButtons = ['left', 'center', 'wide', 'right'];
				} else {
					$scope.layoutButtons = ['full-width', 'full-width-banner', 'full-width-banner-text', 'left', 'center', 'wide', 'right'];
				}
			} else if ($scope.section.type == 'video') {
				$scope.layoutButtons = ['left', 'wide', 'right'];
			} else {
				console.error('No type defined');
			}
		}
	};
}).directive('editorToolbar', function ($compile, $timeout, $document) {
	// This is enabled/disabled by changing the attribute value
	// Example:
	// <div editor-toolbar="true">Some Content</div>  - This is enabled
	// <div editor-toolbar="false">Some Content</div> - This is disabled
	return {
		restrict: 'A',
		link: function link(scope, element, attrs) {
			var bodyElement = angular.element(document.body);
			var toolbarEle;
			element.bind('click', function () {
				if (attrs.editorToolbar == 'true') {
					if (!toolbarEle) {
						createToolbar();
					}
					$timeout(function () {
						positionToolbar(toolbarEle, element);
						toolbarEle.addClass('medium-editor-toolbar-active');
						bindNextClick();
					}, 100);
				}
			});
			function createToolbar() {
				toolbarEle = angular.element('<editor-toolbar-layout></editor-toolbar-layout>');
				$compile(toolbarEle)(scope);
				bodyElement.append(toolbarEle);
			}
			function positionToolbar(toolbarElement, containerEle) {
				// position the toolbar at left 0, so we can get the real width of the toolbar
				toolbarElement[0].style.left = '0';

				var diffTop = -10;
				var diffLeft = 0;

				var windowWidth = window.innerWidth,
				    boundary = containerEle[0].getBoundingClientRect(),
				    middleBoundary = (boundary.left + boundary.right) / 2,
				    toolbarHeight = toolbarElement[0].offsetHeight,
				    toolbarWidth = toolbarElement[0].offsetWidth,
				    halfOffsetWidth = toolbarWidth / 2,
				    buttonHeight = 50,
				    defaultLeft = diffLeft - halfOffsetWidth;

				if (boundary.top < buttonHeight) {
					toolbarElement[0].classList.add('medium-toolbar-arrow-over');
					toolbarElement[0].classList.remove('medium-toolbar-arrow-under');
					toolbarElement[0].style.top = buttonHeight + boundary.bottom - diffTop + window.pageYOffset - toolbarHeight + 'px';
				} else {
					toolbarElement[0].classList.add('medium-toolbar-arrow-under');
					toolbarElement[0].classList.remove('medium-toolbar-arrow-over');
					toolbarElement[0].style.top = boundary.top + diffTop + window.pageYOffset - toolbarHeight + 'px';
				}

				if (middleBoundary < halfOffsetWidth) {
					toolbarElement[0].style.left = defaultLeft + halfOffsetWidth + 'px';
				} else if (windowWidth - middleBoundary < halfOffsetWidth) {
					toolbarElement[0].style.left = windowWidth + defaultLeft - halfOffsetWidth + 'px';
				} else {
					toolbarElement[0].style.left = defaultLeft + middleBoundary + 'px';
				}
			}
			function bindNextClick() {
				$document.bind('click', function (event) {
					$document.unbind('click');
					toolbarEle.removeClass('medium-editor-toolbar-active');
					scope.$apply();
				});
			}
		}
	};
});
'use strict';

angular.module('modules.moment', ['angularMoment']);
angular.module('modules.moment').run(function (moment) {
    // configure moment display strings
    moment.locale('en', {
        relativeTime: {
            future: 'in %s',
            past: '%s ago',
            s: '%d seconds',
            m: 'a minute',
            mm: '%d minutes',
            h: 'an hour',
            hh: '%d hours',
            d: 'a day',
            dd: '%d days',
            M: 'a month',
            MM: '%d months',
            y: 'a year',
            yy: '%d years'
        }
    });
});
'use strict';

angular.module('modules.new-creations', []);
angular.module('modules.new-creations').directive('clickCreate', function (NewCreationsService) {
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            element.bind('click', function (event) {
                NewCreationsService.createModal(event);
            });
        }
    };
}).service('NewCreationsService', function (ProjectService, ThreadService, $state, $mdDialog, EntityService) {
    this.create = create; // function(entity, type)
    this.createModal = createModal; // function(event, data)

    //////////////////////////

    function create(type, entity) {
        if (type == 'project') {
            EntityService.create('project', entity).then(function (response) {
                $state.go('app.project.files', { stub: response.stub });
            });
        } else if (type == 'thread') {
            EntityService.create('thread', entity).then(function (response) {
                $state.go('app.thread.edit', { stub: response.stub });
            });
        } else if (type == 'job') {
            EntityService.create('job', entity).then(function (response) {
                $state.go('app.job', {
                    stub: response._id,
                    edit: 'JobForm'
                });
            });
        }
    }

    function createModal(event) {
        return $mdDialog.show({
            templateUrl: 'app/modules/new-creations/tpls/new-something-modal.html',
            controller: 'NewSomethingModalCtrl',
            clickOutsideToClose: true,
            targetEvent: event
        });
    }
}).controller('NewSomethingModalCtrl', function ($scope, $mdDialog) {
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
});
'use strict';

angular.module('modules.notifications', ['modules.authentication']);
angular.module('modules.notifications').directive('notifications', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/modules/notifications/tpls/notifications.html',
        controller: function controller($scope, NotificationService, $state, HttpQuery) {
            $scope.query = NotificationService.query;

            $scope.markAllRead = NotificationService.markAllRead; // function()
            $scope.markRead = NotificationService.markRead; // function(notification)
            $scope.goSettings = function () {
                $state.go('app.usersettings.notifications');
            };
        }
    };
}).directive('notification', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/modules/notifications/tpls/notification.html'
    };
}).service('NotificationService', function (Authentication, favicoService, $interval, HttpService, HttpQuery, $http) {

    var service = this;

    $interval(function () {
        service.query.refresh();
    }, 20000);

    this.query = HttpQuery({
        url: 'api/v1/notifications',
        params: {
            size: 20,
            order: 'timestamp'
        },
        onSuccess: function onSuccess(results) {
            _.forEach(results, function (notification) {
                notification.text = service.notificationText[notification.type];
            });
            service.updateFavicoCount();
            return results;
        }
    });
    this.query.more();

    this.notificationText = {
        'added-project': 'added you to their project',
        'added-organisation': 'added you to the organisation',
        'invite-accepted': 'joined',
        'followed-user-project': 'has a new project',
        'followed-user-blog': 'has a new blog',
        'followed-user-general': 'has a new discussion',
        'followed-user-question': 'has a new question',
        'followed-project-blog': 'has a new blog',
        'followed-project-general': 'has a new discussion',
        'followed-project-question': 'has a new question',
        'followed-project-post': 'commented',
        'followed-field-project': 'has a new project',
        'followed-field-blog': 'has a new blog',
        'followed-field-general': 'has a new discussion',
        'followed-organisation-project': 'has a new project',
        'followed-field-question': 'has a new question',
        'followed-organisation-blog': 'has a new blog',
        'followed-organisation-general': 'has a new discussion',
        'followed-organisation-question': 'has a new question',
        'followed-own-user': 'is now following you.',
        'followed-own-project': 'is now following your project',
        'followed-own-question': 'is now following your question',
        'followed-own-blog': 'is now following your blog',
        'followed-own-general': 'is now following your discussion',
        'followed-own-organisation': 'is now following your organisation',
        'followed-question-post': 'posted an answer in',
        'followed-blog-post': 'posted a comment on',
        'followed-general-post': 'posted a reply in',
        'own-question-post': 'answered your question',
        'own-blog-post': 'posted on your blog',
        'own-general-post': 'replied in your discussion',
        'own-question-like': 'liked your question',
        'own-blog-like': 'liked your blog',
        'own-general-like': 'liked your discussion',
        'own-post-like': 'liked your post',
        'own-post-post': 'replied to your post',
        'own-user-mention': 'mentioned you in',
        'own-project-mention': 'mentioned your project in',
        'own-organisation-mention': 'mentioned your organisation in',
        'own-blog-mention': 'mentioned your blog in',
        'own-general-mention': 'mentioned your discussion in',
        'own-question-mention': 'mentioned your question in',

        'own-application-pendingReview': 'application is now pending review.',
        'own-application-underReview': 'application is now under review.',
        'own-application-awaitingUpdate': 'application is awaiting update.',
        'own-application-readyToSubmit': 'application is now submitted.',
        'own-application-submittedToCompany': 'application has been rejected.',
        'own-application-rejected': 'application has been rejected.',
        'own-application-processLater': 'application is now submitted.'
    };

    ////////////////////////////////////////

    this.markAllRead = function () {
        _.each(service.query.results, function (notification) {
            service.markRead(notification);
        });
    };

    this.markRead = function (notification) {
        notification.read = true;
        service.updateFavicoCount();
        return $http({
            method: 'PUT',
            url: '/api/v1/notifications/' + notification._id,
            data: {
                read: true
            }
        });
    };

    this.updateFavicoCount = function (count) {
        count = count || _.where(service.query.results, { read: false }).length;
        favicoService.badge(count);
    };
});
'use strict';

angular.module('modules.onboarding', ['modules.settings', 'modules.users', 'modules.checklist', 'modules.state-history']);
angular.module('modules.onboarding').service('OnboardingService', function ($state, $localStorage) {
    var service = this;
    this.goToOnboarding = goToOnboarding;
    this.goToLanding = goToLanding;
    this.beenLanding = false;

    //////////////////////////////////////

    function goToLanding() {
        // If the initial state includes the word 'job' (such as 'app.browse.jobs' or 'app.job')
        if ($localStorage.initialState.name.indexOf('job') != -1) {
            $state.go('app.landing.jobs');
        } else {
            $state.go('app.landing.sync');
        }
    }
    function goToOnboarding() {
        if ($localStorage.initialState.name.indexOf('job') != -1) {
            $state.go('app.onboarding.select');
        } else {
            $state.go('app.onboarding.sync.intro');
        }
    }
}).directive('tipThrobber', function ($compile, $window, $timeout, $rootScope, $mdDialog, TipService, Authentication) {
    /*******************************************************************************
      This will create the throbber and link the tip data.
    The throbber will be positioned relative to where the [tip-throbber] attribute is added.
      [tip-throbber] = String - representing the tip to display
    [tip-position] = String - The position 'bottom-right' || 'bottom-left'
    [tip-offset-x] = String - The x-axis offset - '10px'
    [tip-offset-y] = String - The y-axis offset - '10px'
      Example:
    <div tip-throbber="menu" tip-position="top-right" tip-offset-x="10px" tip-offset-y="10px">
        -- content the throbber refers to would go in here --
    </div>
    This would create a 'menu' tip throbber 10px from the top-right corner/
      *******************************************************************************/
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            var throbberEl;
            // Logic ---------------------------------------------------------------
            var tip = attrs.tipThrobber;
            if (Authentication.currentUser.isLoggedIn()) {
                if (tip) {
                    TipService.getStatuses().then(function (statuses) {
                        // if we want to show the tip
                        if (statuses[tip]) {
                            throbberEl = createThrobber();
                            positionThrobber(throbberEl);
                            bindClickFunctions(tip);
                        }
                    });
                }
            }
            // Positioning ---------------------------------------------------------
            function positionThrobber(element) {
                var positionCss = {};
                if (attrs.tipPosition == 'bottom-right') {
                    positionCss.bottom = attrs.tipOffsetY || 0;
                    positionCss.right = attrs.tipOffsetX || 0;
                    positionCss.marginBottom = '-29px';
                    positionCss.marginRight = '-29px';
                } else if (attrs.tipPosition == 'bottom-left') {
                    positionCss.bottom = attrs.tipOffsetY || 0;
                    positionCss.left = attrs.tipOffsetX || 0;
                    positionCss.marginBottom = '-29px';
                    positionCss.marginLeft = '-29px';
                } else if (attrs.tipPosition == 'top-left') {
                    positionCss.top = attrs.tipOffsetY || 0;
                    positionCss.left = attrs.tipOffsetX || 0;
                    positionCss.marginTop = '-29px';
                    positionCss.marginLeft = '-29px';
                } else if (attrs.tipPosition == 'top-right') {
                    positionCss.top = attrs.tipOffsetY || 0;
                    positionCss.right = attrs.tipOffsetX || 0;
                    positionCss.marginTop = '-29px';
                    positionCss.marginRight = '-29px';
                } else {
                    console.error('Tip Throbber Position Undefined');
                }
                element.css(positionCss);
            }

            // Bind click functions ------------------------------------------------
            function bindClickFunctions(tip) {
                throbberEl.bind('click touchstart', function (event) {
                    TipService.markAsRead(tip);
                    throbberEl.addClass('explode');
                    $timeout(function () {
                        throbberEl.remove();
                    }, 1000);
                    addActiveStyle(element);
                    $mdDialog.show({
                        templateUrl: 'app/modules/onboarding/tpls/tip-modal.html',
                        controller: function controller(tip, $scope, TipService) {
                            $scope.data = TipService.tips[tip];
                            $scope.cancel = function () {
                                $mdDialog.cancel();
                            };
                            $scope.confirm = function () {
                                $mdDialog.hide();
                            };
                            $scope.optOut = function () {
                                TipService.markAllAsRead();
                                $mdDialog.hide();
                            };
                        },
                        locals: { tip: tip },
                        targetEvent: event,
                        clickOutsideToClose: true
                    }).then(function () {
                        removeActiveStyle(element);
                    }).catch(function () {
                        removeActiveStyle(element);
                    });
                });
            }

            // Functions -----------------------------------------------------------
            function addActiveStyle(element) {
                element.css({ 'z-index': 200 });
            }
            function removeActiveStyle(element) {
                element.css({ 'z-index': '' });
            }

            function createThrobber() {
                var template = angular.element('<tip-throbber></tip-throbber>');
                // Compile the element
                $compile(template)(scope);
                // Append element to body
                element.append(template);
                return template;
            }
        }
    };
}).directive('tipBanner', function (TipService, Authentication) {
    /*******************************************************************************
    [tip]      = String  - representing the tip to display
    [tip-hide] = boolean - This will hide the tip if true
    *******************************************************************************/
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            tip: '@?', // string - this corresponds to a message in the settings object
            tipHide: '=?',
            local: '=?' // true || false - if true, we do not check server for status
        },
        templateUrl: 'app/modules/onboarding/tpls/tip-banner.html',
        link: function link(scope, element, attrs) {

            initialise();
            scope.close = close; //function()

            ///////////////////////////////////////////////////////////

            function initialise() {
                if (Authentication.currentUser.isLoggedIn()) {
                    if (scope.local) {
                        scope.enableTip = true;
                    } else if (scope.tip) {
                        TipService.getStatuses().then(function (statuses) {
                            // show the tip
                            if (statuses[scope.tip]) {
                                scope.enableTip = true;
                            } else if (statuses[scope.tip] == undefined) {
                                console.error('No tip exists with the name: ' + scope.tip);
                            } else {
                                scope.enableTip = false;
                            }
                        });
                    } else {
                        console.error('No Tip configured');
                    }
                }
            }

            function close() {
                if (scope.tip) {
                    TipService.markAsRead(scope.tip);
                }
                scope.hideTip = true;
            }
        }
    };
}).service('TipService', function ($mdDialog, SettingsService, Authentication) {
    var settings;
    this.tips = {
        // This is an object that contains the different tip messages
        // The key is the tip name
        dynamicMenu: {
            title: 'The Dynamic menu',
            body: '<img src="/assets/images/tips/dynamicMenu.png">' + '<p>Normally, the top navigation of a website never really changes. This is <strong>not</strong> the case on STEMN...</p>' + '<p>You\'ll notice that the top menu adapts to the page you are on. This means it is different for each and every type of page.' + ' Keep an eye out for these menu changes because they\'ll reveal lots of different content and settings.</p>'
        },
        backToHome: {
            title: 'Your feed',
            body: '<img src="/assets/images/tips/backToHome.png">' + '<p>Wherever you are, click on the astronaut and she\'ll take you back home.</p>'
        },
        saveDraft: {
            title: 'Save Draft',
            body: '<p>You can save your drafts at any time. It will not be publically available until you actually decide to publish it.</p>' + '<p>You can find this and any other drafts in <a class="text-green" href="/creations" target="_blank">your creations.</a></p>'
        }
    };

    this.markAllAsRead = function () {
        _.forEach(settings.tips, function (n, key) {
            settings.tips[key] = false;
        });
        settings.save();
    };

    this.markAllAsUnread = function (tip) {
        _.forEach(settings.tips, function (n, key) {
            settings.tips[key] = true;
        });
        settings.save();
    };

    this.markAsRead = function (tip) {
        settings.tips[tip] = false;
        settings.save();
    };

    this.getStatuses = function () {
        return SettingsService.getSettings().then(function (_settings) {
            settings = _settings;
            return settings.tips;
        });
    };
}).directive('feedChecklist', function (ChecklistService) {
    /*******************************************************************************
    This will run the update whenever it becomes visible
    *******************************************************************************/
    return {
        restrict: 'E',
        scope: {
            incomplete: '='
        },
        templateUrl: 'app/modules/onboarding/tpls/feed-checklist.html',
        link: function link(scope, element, attrs) {
            ChecklistService.updateChecklist();
            scope.checklist = ChecklistService.checklist;
            scope.checklistItems = ChecklistService.checklistItems;
            scope.incomplete = ChecklistService.incomplete;
        }
    };
}).service('ChecklistService', function (Authentication, FollowService, $q, NewCreationsService, UserService, SettingsService, $mdDialog) {

    var self = this;

    this.checklistItems = {
        newsfeed: {
            text: 'Visit your newsfeed.',
            href: '/',
            complete: true
        },
        followFields: {
            text: 'Follow 5 fields',
            href: '/browse/fields',
            complete: false
        },
        basicProfile: {
            text: 'Fill out your basic profile.',
            href: '/profile-wizard',
            complete: false
        },
        newProject: {
            text: "Create a project.",
            click: NewCreationsService.createModal,
            complete: false
        }
    };

    this.checklist = ['newsfeed', 'followFields', 'basicProfile', 'newProject'];

    this.incomplete = {
        status: false // This is set to true when the checklist is complete
    };
    this.updateChecklist = updateChecklist; // function()

    updateChecklist();

    ///////////////////////////////////////////

    function updateChecklist() {
        // If logged in and not complete
        if (Authentication.currentUser.isLoggedIn()) {
            // Load userdata
            Authentication.loadUserData().then(function () {
                // Evaluate Async checks
                $q.all([followFieldsCheck(self.checklistItems.followFields), basicProfileCheck(self.checklistItems.basicProfile)]).then(function () {
                    // Evaluate sync checks
                    self.checklistItems.newProject.complete = hasProject();

                    // If the checklist is complete
                    if (self.checklistItems.followFields.complete && self.checklistItems.basicProfile.complete && self.checklistItems.newProject.complete) {
                        self.incomplete.status = false;
                    } else {
                        self.incomplete.status = true;
                    }
                });
            });
        }
    }

    function followFieldsCheck(checklistItem) {
        // TODO: Put the number of field follows on the currentuser object
        return FollowService.getFollowing({
            user: Authentication.currentUser._id,
            type: 'field',
            page: 1,
            size: 5
        }).then(function (results) {
            checklistItem.complete = results.length >= 5;
        });
    }
    function basicProfileCheck(checklistItem) {
        return SettingsService.getSettings().then(function (settings) {
            checklistItem.complete = !settings.messages.userOnboarding;
        });
    }
    function newSomethingCheck() {
        return Authentication.currentUser.numProjects > 0 || Authentication.currentUser.numBlogs > 0 || Authentication.currentUser.numGenerals > 0 || Authentication.currentUser.numQuestions > 0 || Authentication.currentUser.numThreads > 0;
    }
    function hasProject() {
        return Authentication.currentUser.numProjects > 0;
    }
});
'use strict';

angular.module('modules.organisations', ['modules.authentication', 'modules.restangular', 'modules.uploads']);
angular.module('modules.organisations').directive('organisationIcon', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            itemId: '@?',
            item: '=?'
        },
        templateUrl: 'app/modules/organisations/tpls/organisation-icon.html',
        controller: function controller($scope, Authentication, OrganisationService) {
            if ($scope.itemId) {
                OrganisationService.getOrganisation($scope.itemId, 'sm').then(function (result) {
                    $scope.item = result;
                });
            }
        }
    };
}).directive('clickCreateOrganisation', function (OrganisationModalService) {
    return {
        restrict: 'A',
        scope: {
            organisation: '=?'
        },
        link: function link(scope, element, attrs) {
            element.bind('click', function (event) {
                OrganisationModalService.organisationNewModal(event, scope.organisation);
            });
        }
    };
}).directive('organisationCards', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            size: '@?',
            field: '@?',
            sort: '@?',
            hideMore: '=?', // true || false - if true, the 'see more' button will be hidden
            items: '=?'
        },
        templateUrl: 'app/modules/organisations/tpls/organisation-cards.html',
        controller: function controller($scope, HttpService) {
            initialise();
            $scope.more = more; // function()

            /////////////////////////

            function initialise() {
                $scope.noMoreResults = false;
                $scope.notEnoughResults = false;
                $scope.page = 0;
                // Defaults
                $scope.size = $scope.size || 4;
                $scope.sort = $scope.sort || 'updated';
                more();
            }

            function more() {
                if ($scope.noMoreResults || $scope.notEnoughResults) return;
                $scope.page++;
                if ($scope.size < 8 && $scope.page == 2) {
                    $scope.size = 8;
                    $scope.page = 1;
                }
                $scope.loading = true;
                return HttpService({
                    method: 'GET',
                    url: 'api/v1/organisations',
                    params: {
                        field: $scope.field,
                        page: $scope.page,
                        size: $scope.size,
                        sort: $scope.sort
                    }
                }).then(function (items) {
                    if ($scope.page == 1) {
                        $scope.notEnoughResults = items.length < $scope.size;
                        $scope.items = [];
                    }
                    $scope.loading = false;
                    $scope.items = $scope.items.concat(items);
                    $scope.noMoreResults = items.length < $scope.size;
                });
            }
        }
    };
}).directive('organisationGroups', function ($mdDialog, $timeout) {
    return {
        restrict: 'E',
        scope: {
            organisations: '=',
            viewLayout: '@?', // tile || row(default)
            edit: '=?' // true || false - change the edit status
        },
        templateUrl: 'app/modules/organisations/tpls/organisation-groups.html',
        controller: function controller($scope) {

            $scope.sortConfig = {
                animation: 150,
                handle: '.my-handle'
            };
            $scope.delete = function (group, index) {
                group.splice(index, 1);
            };
        }
    };
}).service('OrganisationModalService', function ($mdDialog) {
    this.organisationNewModal = function (event, data) {
        return $mdDialog.show({
            templateUrl: 'app/modules/organisations/tpls/organisation-new-modal.html',
            controller: 'OrganisationNewModalCtrl',
            clickOutsideToClose: true,
            targetEvent: event,
            locals: {
                data: data
            }
        });
    };
}).controller('OrganisationNewModalCtrl', function (data, $scope, $mdDialog, SearchService, OrganisationService, Authentication, CoreLibrary) {
    $scope.data = angular.copy(data);

    $scope.checkOrganisationExists = function (name) {
        if (name) {
            $scope.stub = CoreLibrary.stubify(name);
            SearchService.search({ type: 'organisation', key: 'stub', value: $scope.stub, match: 'insensitive' }).then(function (response) {
                if (response.data.length === 0) {
                    $scope.NewOrganisationForm.name.$setValidity('exists', true);
                } else {
                    $scope.NewOrganisationForm.name.$setValidity('exists', false);
                }
            });
        }
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.save = function () {
        // Add current user to the team
        $scope.data.team = $scope.data.team || [];
        $scope.data.team.push({
            _id: Authentication.currentUser._id,
            role: 'Creator',
            group: 'Core Team'
        });
        OrganisationService.updateOrganisation($scope.data).then(function (organisation) {
            $mdDialog.hide(organisation);
        });
    };
}).service('OrganisationService', function (Restangular, Authentication) {

    this.createOrganisation = function (organisation) {
        analytics.track('Organisation Create', {
            organisation: organisation.name
        });
        return Restangular.all('organisations').post(organisation).then(function (organisation) {
            return organisation;
        });
    };

    this.getOrganisation = function (organisation) {
        return Restangular.one('organisations', organisation).get();
    };

    this.getOrganisations = function (data) {
        return Restangular.all('organisations').getList(data);
    };

    this.updateOrganisation = function (organisation) {
        analytics.track('Organisation Update', {
            updater: Authentication.currentUser.name,
            organisation: organisation.name
        });

        if (!organisation._id) {
            return this.createOrganisation(organisation);
        } else {
            return Restangular.one('organisations', organisation._id).customPUT(organisation);
        }
    };

    this.deleteOrganisation = function (organisation) {
        analytics.track('Organisation Delete', {
            organisation: organisation.name
        });
        return organisation.remove();
    };
});
'use strict';

angular.module('modules.overlay-tabs', []);
angular.module('modules.overlay-tabs').directive('overlayViews', function () {
    return {
        restrict: 'E',
        transclude: true,
        template: '<fade-overlay ng-click="back()" ng-show="showOverlay"></fade-overlay><div ng-transclude></div>',
        controller: function controller($scope, $element, $rootScope, ActiveOverlaysService, $state, $timeout, $window, LayoutOptions) {

            $scope.back = function () {
                $state.go(ActiveOverlaysService.underlay.name, ActiveOverlaysService.underlay.params);
            };

            var disablePromise;

            function enable() {
                $timeout.cancel(disablePromise);
                $scope.showOverlay = true;
                $element.addClass('enabled');
                //                $timeout(function(){ // This is in timeout because it defaults to false on state change
                //					LayoutOptions.body.hideOverflow = true;
                //				},1)
            }
            function disable() {
                $scope.showOverlay = false;
                //				LayoutOptions.body.disableScroll = false;
                disablePromise = $timeout(function () {
                    $element.removeClass('enabled');
                }, 1000);
            }

            $rootScope.$on('$stateChangeSuccess', function () {
                // If there is an active underlay, and we are on an overlay page, we enable
                if (ActiveOverlaysService.underlay && $state.current.overlay) {
                    enable();
                }
                // Else, we disable
                else {
                        disable();
                    }
            });

            //            // Remove enabled if too small
            //            $scope.$watch(function () {
            //                return $window.innerWidth;
            //            }, function (value) {
            //                if (value <= 960) {
            //                    disable();
            //                }
            //            });
        }
    };
}).directive('overlay', function ($state, $rootScope, $timeout, $compile, ActiveOverlaysService) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            ngHide: '=', // Used to show/hide the content
            view: '@' // The name of the contained ui-view
        },
        template: '<md-content><div ng-transclude></div></md-content>',
        link: function link(scope, element, attrs, ctrl) {

            $rootScope.$on('$stateChangeSuccess', checkFunction);
            checkFunction();

            function checkFunction() {
                // If this view matches the current state, show it!
                if (ActiveOverlaysService.activeView == scope.view) {
                    scope.ngHide = false;
                    // If the state is an overlay, enable the overlay
                    if ($state.current.overlay) {
                        element.addClass('enabled');
                        element.attr('layout-offset-top-banner', true);
                    } else {
                        element.removeClass('enabled');
                        element.attr('layout-offset-top-banner', '');
                    }
                }
                // If this view is the active underlay...
                else if (ActiveOverlaysService.underlay.viewname == scope.view) {
                        // If the state is an overlay, show the underlay
                        if ($state.current.overlay) {
                            scope.ngHide = false;
                        }
                        // Else, hide the underlay
                        else {
                                scope.ngHide = true;
                            }
                        // In any case, it is an underlay so remove enabled class
                        element.removeClass('enabled');
                        element.attr('layout-offset-top-banner', '');
                    }
                    // Else, this view is NOT active and is NOT the underlay
                    else {
                            // Hide it!
                            scope.ngHide = true;
                        }
            }
        }
    };
}).service('ActiveOverlaysService', function ($rootScope, $stickyState, $state, $stateParams, $previousState) {

    // Api description ------------------------------------------------
    var ret = {
        activeView: '', // string representing the current view - eg. 'tab1'
        underlay: {} // object for the current underlay state
    };

    // Functions -------------------------------------------------------
    function checkForNewUnderlay() {
        // This function will search sticky states for a potential underlay state.
        // If it finds one, it will set it and the state params. Else it will set underlay to false.

        // Get the inactive sticky states, reverse the array so most recently active is first.
        var inactiveStates = _.map($stickyState.getInactiveStates(), 'self').reverse();
        // Find the first underlay (state with overlay false)
        var underlay = _.find(inactiveStates, function (state) {
            return !state.overlay;
        });
        // If there is an underlay, set it
        if (underlay) {
            ret.underlay = underlay;
            ret.underlay.params = $stateParams;
            // If the underlay has a view, set the viewname
            if (underlay.views) {
                ret.underlay.viewname = Object.keys(underlay.views)[0].split("@")[0];
            }
        }
        // Else, set underlay to false because there is none
        else {
                ret.underlay = false;
            }
    }
    function getActiveView() {
        /// This function will set activeView to the currently active view.
        if ($state.current.views) {
            // Get the current view
            ret.activeView = Object.keys($state.current.views)[0].split("@")[0];
        }
        // Else, the active view is a standard ui-view
        else {
                ret.activeView = '';
            }
    }

    // Main Code ------------------------------------------------------

    // Initialise
    checkForNewUnderlay();
    getActiveView();

    // Run on each new state
    $rootScope.$on('$stateChangeSuccess', function () {
        checkForNewUnderlay();
        getActiveView();
    });

    return ret;
});
'use strict';

angular.module('modules.page-loading-overlay', ['modules.loadbar']);

// The 'page-loading-overlay' should be placed on the index page
// This directive will hide the overlay when the document is ready.
// This is done by applying the ng-hide class
// This does NOT have a template because if it did Angular would first have to load before the
// overlay was shown, this would defeat the purpose...
//
// This pluging also allows messages to be shown if load is slow.
// These messages are controlled via CSS but they required ANIMATE.CSS
// Again, this all all CSS so it will fuction if angular does not...
//
// EXAMPLE ----------------------------------------------------------------------
//    <page-loading-overlay>
//        <div class="messages">
//            <div class="message1 animated zoomIn">
//                <h3>This is taking longer than usual<loading-dots></loading-dots></h3>
//            </div>
//            <div class="message2 animated zoomIn">
//                <h4>Try and force refresh by pressing:
//                    <br>
//                    <br>(Windows) - Crl + F5
//                    <br>(Mac) - Command + R
//                    <br>(Linux) - F5
//                    <br>
//                    <br>If this re-occurs, please let us know in our <a class="underlined" href="https://www.facebook.com/groups/STEMN">beta discussion group.</a>
//                </h4>
//            </div>
//        </div>
//    </page-loading-overlay>

angular.module('modules.page-loading-overlay').directive('pageLoadingOverlay', function ($timeout, $document, $rootScope, cfpLoadingBar) {
    return {
        restrict: 'E',
        link: function link(scope, element, attr) {
            var removeTimeout,
                loading,
                count = 1;
            // Page Loading Overlay
            $document.ready(function () {
                removeTimeout = $timeout(removeOverlay, 0);
            });

            //            $rootScope.$on('cfpLoadingBar:started',function(){
            //                $timeout.cancel(removeTimeout);
            //                // Remove in 10s no matter what
            //                $timeout(removeOverlay, 10000);
            //            })
            //            $rootScope.$on('cfpLoadingBar:loaded',function(){
            //                $timeout.cancel(removeTimeout);
            //            })
            //            $rootScope.$on('cfpLoadingBar:completed',function(){
            //                count++
            //                // Wierd hack - complete seems to be called at the start and
            //                // at the end (end is often 0.97 or similar)
            //                if(cfpLoadingBar.status()>=0.5 || count > 1){
            //                    removeTimeout = $timeout(removeOverlay, 500);
            //                }
            //            })

            /////////////////////

            function removeOverlay(timeoutDelay) {
                element.addClass('animate');
                $timeout(function () {
                    element.remove();
                    window.prerenderReady = true; // Shitty thing so prerender.io works
                }, 800); // The CSS animation takes  800ms
            }
        }
    };
});
'use strict';

angular.module('modules.pagination', []);
angular.module('modules.pagination').directive('loadMore', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            page: '=?',
            loading: '=?', // true || false - Represents the state of loading
            loadFn: '&?'
        },
        templateUrl: 'app/modules/pagination/tpls/load-more.html',
        controller: function controller($scope, $state) {
            $scope.loading = false;
            $scope.loadMore = function () {
                $scope.loadFn();
            };
        }

    };
}).directive('simplePagination', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/modules/pagination/tpls/simple-pagination.html',
        scope: {
            noMoreResults: '=?',
            page: '=?'
        },
        controller: function controller($scope, $stateParams, $location) {
            // Else we are using state params
            if (!$scope.page) {
                $scope.page = $stateParams.page || 1;
            }
            $scope.prev = function () {
                $scope.page--;
            };
            $scope.next = function () {
                $scope.page++;
            };
            $scope.nextPage = parseInt($scope.page) + 1;
            $scope.prevPage = parseInt($scope.page) - 1;
        }

    };
});
;'use strict';

angular.module('modules.popup-cards', ['modules.popup', 'modules.users', 'modules.organisations', 'modules.projects']);
angular.module('modules.popup-cards').directive('popupUser', function () {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        link: function link(scope, element, attrs) {
            attrs.$observe('userId', function (value) {
                scope.userId = value;
            });
            scope.userId = attrs.userId;
            scope.href = attrs.href;
        },
        template: '<a ng-href="{{::href}}" popup popup-content="<personcard id=\'{{userId}}\' size=\'sm\'></personcard>" ng-transclude></a>'
    };
}).directive('popupField', function () {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        link: function link(scope, element, attrs) {
            scope.fieldId = attrs.fieldId;
            scope.href = attrs.href;
        },
        template: '<a ng-href="{{::href}}" popup popup-content="<field-card style=\'padding-top: 10px; display: block;\' id=\'{{::fieldId}}\' size=\'sm\'></field-card>" ng-transclude></a>'
    };
}).directive('popupOrganisation', function () {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        link: function link(scope, element, attrs) {
            scope.organisationId = attrs.organisationId;
            scope.href = attrs.href;
        },
        template: '<a ng-href="{{::href}}" popup popup-content="<organisation-card id=\'{{organisationId}}\' size=\'sm\'></organisation-card>" ng-transclude></a>'
    };
}).directive('popupProject', function () {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        link: function link(scope, element, attrs) {
            scope.projectId = attrs.projectId;
            scope.href = attrs.href;
        },
        template: '<a ng-href="{{::href}}" popup popup-content="<creation-card entity-type=\'project\' entity-id=\'{{projectId}}\'></creation-card>" ng-transclude></a>'
    };
}).directive('urlCard', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            title: '@?',
            subTitle: '@?',
            anchor: '@?'
        },
        controller: function controller($scope) {
            $scope.href = 'https://stemn.com' + location.pathname;
        },
        templateUrl: 'app/modules/popup-cards/tpls/url-card.html'
    };
});
'use strict';

angular.module('modules.popup', []);
angular.module('modules.popup').directive('popup', function ($timeout, $window, $compile, $rootScope, $document) {
    // This directive create a popup and appends it to the document.body
    return {
        restrict: 'A',
        scope: {
            popupContent: '@',
            popupWidth: '@?',
            popupFixedBottom: '=?' },
        link: function link(scope, element, attrs) {
            // Intiate promises
            var showTimeout; // The show  timeout object
            var hideTimeout; // The close timeout object

            // Initiate variables
            var popup = {}; // The popup object
            var delayOpen = 400; // The delay before pop
            popup.width = scope.popupWidth || 300;
            // Initate functions
            var show = function show() {
                popup.position = getPosition();
                popup.element = popup.element ? popup.element : createPopup(); // get the popup element, else, create it
                setPosition(popup.element, popup.position); // position the popup
                scope.show = true; // show the popup
                scope.$apply();
            };

            var hide = function hide() {
                scope.show = false;
                scope.$apply();
            };

            var setPosition = function setPosition(element, position) {
                // Set the css for the new position
                element.css({
                    'top': position.top,
                    'left': position.left,
                    'width': popup.width
                });
                if (scope.popupFixedBottom) {
                    // If fixed at the bottom of the screen, we define vertical position
                    element.css({
                        'top': '',
                        'bottom': '50px',
                        'position': 'fixed'
                    });
                }
            };

            var createPopup = function createPopup() {
                // This create the popup element and appends it to the body
                // It also compiles the element relative to the scope
                // Create the popup element
                var popupTpl = angular.element('<div class="popup" ng-show="show">' + scope.popupContent + '</div>');
                // Compile the popup element
                $compile(popupTpl)(scope);
                // Bind the hover functions
                bindOpenTrigger(popupTpl);
                bindCloseTrigger(popupTpl);
                // Append element to body
                angular.element(document.body).append(popupTpl);
                return popupTpl;
            };

            var getPosition = function getPosition() {
                // This function outputs the left and top positions of the popup
                // it does this by inspecting the location of the calling element
                // it corrects for crashes when the screen is too small
                var windowEl = angular.element($window); // Get window element
                var scrollPosition = windowEl.scrollTop(); // Get scroll position
                var boundingRect = element[0].getBoundingClientRect();
                var hCenter = boundingRect.left + boundingRect.width / 2;
                var popupLeft = hCenter - popup.width / 2;
                var popupRight = hCenter + popup.width / 2;

                if (popupLeft < 0) {
                    // Crash left
                    return {
                        left: 15,
                        top: boundingRect.bottom + scrollPosition
                    };
                } else if (popupRight > $window.innerWidth) {
                    // Crash right
                    return {
                        left: $window.innerWidth - popup.width - 15,
                        top: boundingRect.bottom + scrollPosition
                    };
                } else {
                    return {
                        left: popupLeft,
                        top: boundingRect.bottom + scrollPosition
                    };
                }
            };
            // Show the popup when the mouse enters the area
            var bindOpenTrigger = function bindOpenTrigger(element) {
                element.bind('mouseenter', function () {
                    $timeout.cancel(hideTimeout); // Cancel the hide
                    showTimeout = $timeout(show, delayOpen);
                });
            };

            // Cancel the Show Timeout of the mouse leaves the hover area
            var bindCloseTrigger = function bindCloseTrigger(element) {
                element.bind('mouseleave', function () {
                    $timeout.cancel(showTimeout); // Cancel the show
                    hideTimeout = $timeout(hide, 50);
                });
            };

            // Bind the calling element
            bindOpenTrigger(element);
            bindCloseTrigger(element);

            // Remove the popups after a state change
            $rootScope.$on('$stateChangeSuccess', function () {
                $timeout.cancel(showTimeout); // Cancel the show
                if (popup.element) {
                    popup.element.remove();
                }
            });
        }
    };
}).directive('popup', function (PopupService, $timeout) {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        template: '<div ng-transclude></div>',
        scope: {
            // Attrs:
            // popupPadding  - '10px 0 0 0' padding string
            // popupPosition - start || center || end
            // popupSide     - top || right || bottom || left
        },
        link: function link(scope, element, attrs) {
            var popupEl; // The popup element is assigned to this once it has been created
            var contentEl; // The content element
            var targetEl = element.parent();

            // Remove the element from the DOM
            // It will be inserted when the popup is created
            element.detach();

            $timeout(function () {
                bindTrigger('target'); // bind the trigger to the target el
            }, 100);

            // Destroy the popup
            scope.$on('$destroy', function () {
                PopupService.destroy(popupEl);
            });

            ///////////////////////////////////////////////////////////////////

            function showFn() {
                // If the popup does not exist, create it.
                if (!popupEl) {
                    create();
                }
                scope.showPopup = true;
                $timeout(function () {
                    PopupService.position({
                        popupEl: popupEl,
                        targetEl: targetEl[0],
                        side: attrs.popupSide || 'right',
                        type: attrs.popupPosition || 'start',
                        arrow: 'true',
                        padding: attrs.popupPadding
                    });
                });
                scope.$apply();
            }
            function create() {
                popupEl = PopupService.create({
                    scope: scope
                });
                contentEl = angular.element(popupEl[0].querySelector('.popup-content'));
                contentEl.append(element);
                bindTrigger('popup'); // Bind the triggers to the popup
            }

            function bindTrigger(triggerToBind) {
                // triggerToBind = 'target' || 'popup'
                PopupService.bindTrigger({
                    popupEl: popupEl,
                    targetEl: targetEl,
                    trigger: 'hover',
                    scope: scope,
                    showFn: showFn,
                    hideFn: hideFn,
                    delayOpen: 10
                }, triggerToBind);
            }

            function hideFn() {
                scope.showPopup = false;
                scope.$apply();
            }
        }
    };
}).directive('popupTooltip', function (PopupService, $timeout) {
    return {
        restrict: 'A',
        scope: {
            popupTooltip: '@'
        },
        link: function link(scope, element, attrs) {

            var popupEl = PopupService.create({
                template: '<div class="tooltip-popup">' + scope.popupTooltip + '</div>',
                scope: scope
            });

            $timeout(function () {
                PopupService.bindTrigger({
                    popupEl: popupEl,
                    targetEl: element,
                    trigger: 'hover',
                    scope: scope,
                    showFn: showFn,
                    hideFn: hideFn
                });
            }, 100);

            function showFn() {
                scope.showPopup = true;
                $timeout(function () {
                    PopupService.position({
                        popupEl: popupEl,
                        targetEl: element[0],
                        side: attrs.popupSide || 'right',
                        type: attrs.popupPosition || 'start',
                        arrow: 'true',
                        padding: attrs.popupPadding
                    });
                });
                scope.$apply();
            }
            function hideFn() {
                scope.showPopup = false;
                scope.$apply();
            }
            scope.$on('$destroy', function () {
                PopupService.destroy(popupEl);
            });
        }
    };
}).service('PopupService', function ($compile, $timeout, $rootScope) {
    var service = this;

    this.create = create;
    this.destroy = destroy;
    this.position = position;
    this.show = show;
    this.bindTrigger = bindTrigger;
    this.hide = hide;
    var $window = angular.element(window);

    //////////////////////////////////

    function create(data) {
        /***********************
        This is used to initialse the popup element
          data: {
            template : 'Template String - <div></div>',
            hover    : true || false - will enabled hover binds
            scope    : angular scope
        }
        **********************/
        var popupEl = angular.element('<div class="popup" ng-show="showPopup"><div class="popup-arrow"></div><div class="popup-content">' + (data.template || '') + '</div></div>');
        angular.element(document.body).append(popupEl);
        $compile(popupEl)(data.scope);
        return popupEl;
    }
    function bindTrigger(data, triggerToBind) {

        /***********************
        This will bind the click/hover events.
          This function can be run to bind the click events to the trigger (the button/area which activated the popup)
        or the popup element (useful for hover triggers)
          data: {
            targetEl  : element
            popupEl   : element
            trigger   : 'hover' || 'click'
            scope     : angular scope (used to assigned hover timeout)
            showFn    : function to be run on show
            hideFn    : function to be run on hide
            delayOpen : number - ms to wait before opening popup
        }
        triggerToBind : 'both' (default) || 'target' || 'popup'
            **********************/

        triggerToBind = triggerToBind || 'both';
        if (data.trigger == 'hover') {
            var delayOpen = data.delayOpen || 400;
            var delayClose = 50;

            if (triggerToBind == 'target') {
                bindOpenTrigger(data.targetEl, data.scope, delayOpen, data.showFn);
                bindCloseTrigger(data.targetEl, data.scope, delayClose, data.hideFn);
            } else if (triggerToBind == 'popup') {
                bindOpenTrigger(data.popupEl, data.scope, delayOpen, data.showFn);
                bindCloseTrigger(data.popupEl, data.scope, delayClose, data.hideFn);
            } else {
                bindOpenTrigger(data.targetEl, data.scope, delayOpen, data.showFn);
                bindOpenTrigger(data.popupEl, data.scope, delayOpen, data.showFn);
                bindCloseTrigger(data.targetEl, data.scope, delayClose, data.hideFn);
                bindCloseTrigger(data.popupEl, data.scope, delayClose, data.hideFn);
            }

            $rootScope.$on('$stateChangeSuccess', function () {
                $timeout.cancel(data.scope.popupShowTimeout); // Cancel the show
                if (data.popupEl) {
                    data.scope.showPopup = false;
                }
            });
        }
    }
    function destroy(popupEl) {
        if (popupEl) {
            popupEl.remove();
        }
    }
    function position(data) {
        /***********************
        data: {
            targetEl : element
            popupEl  : element
            side     : left || right || bottom || top
            type     : start || end || center
            padding  : '10px 0 0 0'
            arrow    : true || false - if true we show an arrow
        }
          Positions described with [side type] as follows
             [t s]  [t c]  [t e]
            _________________
        [l s]|                 |[right start]
           |                 |
        [l c]|                 |[right center]
           |                 |
        [l e]|_________________|[right end]
             [b s]  [b c]  [b e]
          **********************/
        var lockPadding = 15; // Padding if the popup crashes

        // Defaults
        data.side = data.side || 'bottom';
        data.type = data.type || 'center';

        positionArrow(data);

        var targetBoundingRect = data.targetEl.getBoundingClientRect();
        var targetBottom = targetBoundingRect.bottom;
        var targetLeft = targetBoundingRect.left;
        var targetWidth = targetBoundingRect.width;
        var targetHeight = targetBoundingRect.height;
        var middleBoundary = (targetBoundingRect.left + targetBoundingRect.right) / 2;
        var pageXOffset = window.pageXOffset; // Window scrollbar x direction
        var pageYOffset = window.pageYOffset; // Window scrollbar y direction
        var windowWidth = window.innerWidth; // Width of the window
        var popupWidth = data.popupEl[0].offsetWidth; // Width of the popup
        var popupHeight = data.popupEl.outerHeight(true); // Height of the popup

        var left, top;

        if (data.side == 'bottom' || data.side == 'top') {
            if (data.type == 'start') {
                left = pageXOffset + targetLeft;
            } else if (data.type == 'end') {
                left = pageXOffset + targetLeft + targetWidth - popupWidth;
            } else if (data.type == 'center') {
                left = pageXOffset + targetLeft + targetWidth / 2 - popupWidth / 2;
            }
        } else if (data.side == 'right' || data.side == 'left') {
            if (data.type == 'start') {
                top = pageYOffset + targetBottom - targetHeight;
            } else if (data.type == 'end') {
                top = pageYOffset + targetBottom;
            } else if (data.type == 'center') {
                top = pageYOffset + targetBottom - targetHeight / 2 - popupHeight / 2;
            }
        }
        // Side positions
        if (data.side == 'right') {
            left = pageXOffset + targetLeft + targetWidth;
        } else if (data.side == 'left') {
            left = pageXOffset + targetLeft;
        } else if (data.side == 'bottom') {
            top = pageYOffset + targetBottom;
        } else if (data.side == 'top') {
            top = pageYOffset + targetBottom - targetHeight - popupHeight;
        }

        // If crash: right||left and we have side: right||left, change to side: top
        if (data.side == 'left' || data.side == 'right') {
            if (left + popupWidth >= windowWidth || left <= 0) {
                // If crash right || left
                // Set side to bottom
                data.side = 'bottom';
                data.arrow = false;
                data.padding = '';
                service.position(data);
                return; // Recalc position
            }
        } else {
            // Lock the popup to the left/right if side: bottom || top
            if (left + popupWidth >= windowWidth) {
                // If crash right
                left = windowWidth - popupWidth - lockPadding;
                positionArrow(data, true); //reposition arrow after crash
            } else if (left <= 0) {
                // If crash left
                left = lockPadding;
                positionArrow(data, true); //reposition arrow after crash
            }
        }

        data.popupEl.css({
            'top': top + 'px',
            'left': left + 'px',
            'margin': data.padding
        });
    }

    function positionArrow(data, crashed) {
        /***********************
        data: {
            popupEl  : element
            side     : left || right || bottom || top
            type     : start || end || center
            arrow    : true || false
        }
        **********************/

        var left,
            right,
            top,
            bottom,
            arrowCss = {},
            popupCss = {};
        var width = 10;
        var widthPx = '-5px';
        var marginPx = '7px';
        var arrowEl = angular.element(data.popupEl[0].querySelector('.popup-arrow'));

        // If data is not enabled
        if (data.arrow && !crashed) {
            if (data.side == 'bottom' || data.side == 'top') {
                if (data.type == 'start') {
                    arrowCss.left = '2px';
                } else if (data.type == 'end') {
                    arrowCss.right = '2px';
                } else if (data.type == 'center') {
                    arrowCss.left = '50%';
                    arrowCss['margin-left'] = -width / 2 + 'px';
                }
            } else if (data.side == 'right' || data.side == 'left') {
                if (data.type == 'start') {
                    arrowCss.top = '2px';
                } else if (data.type == 'end') {
                    arrowCss.bottom = '2px';
                } else if (data.type == 'center') {
                    arrowCss.top = '50%';
                    arrowCss['margin-top'] = -width / 2 + 'px';
                }
            }

            // Normalise any remaining margin styles (these are left over if we crash and change side)
            popupCss['margin-top'] = '0px';
            popupCss['margin-right'] = '0px';
            popupCss['margin-bottom'] = '0px';
            popupCss['margin-left'] = '0px';

            // Side positions
            if (data.side == 'right') {
                arrowCss.left = widthPx;
                popupCss['margin-left'] = marginPx;
            } else if (data.side == 'left') {
                arrowCss.right = widthPx;
                popupCss['margin-right'] = marginPx;
            } else if (data.side == 'bottom') {
                arrowCss.top = widthPx;
                popupCss['margin-top'] = marginPx;
            } else if (data.side == 'top') {
                arrowCss.bottom = widthPx;
                popupCss['margin-bottom'] = marginPx;
            }
        } else if (crashed) {
            // If we have crashed
            var targetBoundingRect = data.targetEl.getBoundingClientRect();
            var targetCenterFromRight = window.innerWidth - (targetBoundingRect.left + targetBoundingRect.width / 2);
            arrowCss.right = targetCenterFromRight - 15;
            arrowCss.left = 'auto';
        } else {
            arrowCss.opacity = 0;
        }
        arrowEl.css(arrowCss);
        data.popupEl.css(popupCss);
    }

    function show(scope) {
        if (!scope.popupCloseClick) {
            getCloseClick(scope);
        };
        $window.off('mousedown', scope.popupCloseClick);
        $window.on('mousedown', scope.popupCloseClick);
        scope.showPopup = true;
    }

    function hide(scope) {
        $window.off('mousedown', scope.popupCloseClick);
        scope.showPopup = false;
    }

    function getCloseClick(scope) {
        scope.popupCloseClick = function (event) {
            var element = event.target;
            if (angular.element(element).hasClass('popup')) {
                return;
            } else {
                var editorSectionElement = angular.element(element).parents('.popup')[0];
                if (!editorSectionElement) {
                    hide(scope);
                } else {
                    return;
                }
            }
        };
    }

    function bindOpenTrigger(element, scope, delayOpen, triggerFn) {
        // Delay the open
        element.bind('mouseenter', function () {
            $timeout.cancel(scope.popupHideTimeout); // Cancel the hide
            scope.popupShowTimeout = $timeout(function () {
                triggerFn();
            }, delayOpen);
        });
    }

    function bindCloseTrigger(element, scope, delayClose, triggerFn) {
        // Cancel the Show Timeout of the mouse leaves the hover area
        element.bind('mouseleave', function () {
            $timeout.cancel(scope.popupShowTimeout); // Cancel the show
            scope.popupHideTimeout = $timeout(function () {
                triggerFn();
            }, delayClose);
        });
    }
});
;'use strict';

angular.module('modules.posts', ['modules.editor', 'modules.scroll-highlight']);
angular.module('modules.posts').

//directive('posts', function () {
//    /****************************************************************
//    This directive will set up the posts for a thread/blog/project
//    The data object should contain:
//    data = {
//        posts         : [], - An array of posts
//        owner         : [], - The owner of the thread/project
//    }
//
//    STATE PARAMS:
//    The reply state param can be added. If true, we open the reply window.
//
//    ****************************************************************/
//    return {
//        restrict: 'E',
//        scope: {
//            parent : '=', // The parent object (thread/project)
//        },
//        templateUrl: 'app/modules/posts/tpls/posts.html',
//        controller: function ($scope, PostService, $stateParams, $timeout, HighlightElement) {
//            getPosts($scope.parent);
//            $scope.orderFilter = '';        // Set default order filter - 'timestamp' || '' if tree
//            $scope.toggleSort  = toggleSort; // function()
//            $scope.reply       = '';       // Assigned using set reply
//            $scope.sectionData = {};
//            $scope.setReply   = setReply;  // function(parent)
//            $scope.sendReply  = sendReply; // function()
//
//
//            // Watch the posts, sort them when they change
//            $scope.$watchCollection('parent.posts', sortPosts);
//
//            if($stateParams.reply){
//                $timeout($scope.setReply, 1000)
//            }
//
//            ///////////////////////////////////////////////////////////////////////
//
//            function setReply(parent){
//                HighlightElement.scrollHighlightElement('reply', {background: true, offset: 200});
//                $scope.inputTitle = parent.owner.name ? 'Replying to '+ parent.owner.name +'\'s post.' : '';
//                $scope.postInputStatus.active = true;
//                $scope.reply = PostService.newPost($scope.parent);
//                if (parent) {
//                    // Set the post parent to the ID of the post being replied to
//                    $scope.reply.parent = parent._id;
//                }
//                // Go to edit box
//                $scope.postInputStatus.active = true; // Set input to inactive
//            }
//
//            function sendReply() {
//                if(!$scope.reply){$scope.reply=PostService.newPost($scope.parent)}
//                var post;
//                $scope.reply.sectionData = $scope.sectionData.model;
//                // Set the function that will be run when the post is to be submitted
//                PostService.savePost($scope.parent._id, $scope.reply).then(function(newPost) {
//                    $scope.postInputStatus.active = false; // Set input to inactive
//                    $scope.sectionData        = {}; // Clear Section data
//                    $scope.reply              = ''; // Clear Reply data
//                    post = newPost;
//                    // set the post time to the clients browser as
//                    // they're probably out of sync with the server
//                    // which makes the '1 min ago' timestamp effect
//                    post.timestamp = moment(Date.now()).format("YYYY-MM-DDTHH:mm:ssZZ");
//                    $scope.parent.posts.push(post);
//                }).catch(function(){
//                    $scope.postInputStatus.active = true;
//                });
//
//            }
//
//            function getPosts(parent){
//                // This will check to see if parent.posts exists.
//                // If not, it will request the posts from the server
//                if(parent.posts.length === 0){
//                    PostService.getPosts(parent).then(function(posts){
//                        parent.posts = posts;
//                    })
//                }
//            }
//
//            function toggleSort(){
//                // If time view
//                if($scope.orderFilter == 'timestamp'){
//                    $scope.orderFilter = '';
//                    $scope.sortIcon = 'sort'
//                }
//                // Time tree view
//                else{
//                    $scope.orderFilter = 'timestamp';
//                    $scope.sortIcon = 'access-time'
//                }
//            }
//
//            function sortPosts() {
//                if($scope.parent.posts && $scope.parent.posts.length > 0){
//                    $scope.posts = sortFlatTree($scope.parent.posts);
//                }
//            }
//
//            function sortFlatTree(_posts) {
//                // create indent list
//                var posts = angular.copy(_posts);
//                var tree = [];
//                //build the top level posts
//                var i = 0;
//                while (i < posts.length) {
//                    if (!posts[i].parent) {
//                        posts[i].indentation = 0;
//                        tree.push(posts[i]);
//                        posts.splice(i, 1);
//                    } else {
//                        i++;
//                    }
//                }
//                //build the children for each post
//                i = 0;
//                // start at the first tree root node
//                while (i < tree.length) {
//                    // step chronologically backwards through the list of replies
//                    for (var j = posts.length - 1; j >= 0; j--) {
//                        // if the current post is a child of the current parent
//                        if (posts[j].parent == tree[i]._id) {
//                            posts[j].indentation = tree[i].indentation + 1;
//                            tree.splice(i + 1, 0, posts[j]);
//                            posts.splice(j, 1);
//                        }
//                    }
//                    i++;
//                }
//                // Iterate of the array and add the position value
//                _.forEach(tree, function(n, key) {
//					n.tree = key;
//                });
//                return tree;
//            }
//
//        }
//    };
//}).

directive('post', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/posts/tpls/post.html',
        scope: {
            post: '=',
            parent: '=',
            timeline: '='
        },
        controller: function controller($scope, EditorService, PostService) {
            // mark the post to indicate if it was posted by a team member
            $scope.post.isTeam = isTeam();
            // mark the post to indicate if it was posted by the original poster
            $scope.post.isOwner = isOwner();

            $scope.deletePost = deletePost; // function()
            $scope.editPost = editPost; // function()
            $scope.savePost = savePost; // function()
            $scope.cancel = cancel; // function()
            $scope.replyPost = replyPost; // function()

            $scope.editorOptions = {
                realtime: false,
                contained: true,
                minimal: true
            };

            $scope.post.sectionData = $scope.post.sectionData || { sectionOrder: [] };

            //////////////////////////////////////

            function isTeam() {
                _.any($scope.parent.projects, function (project) {
                    _.any(project.team, function (member) {
                        if (member && member._id) {
                            // Fux because project.team member sometimes null? TODO
                            return member._id == $scope.post.owner._id;
                        }
                    });
                });
            }
            function isOwner() {
                if ($scope.parent.owner && $scope.post.owner) {
                    return $scope.post.owner._id == $scope.parent.owner._id;
                }
            }
            function deletePost() {
                PostService.deletePost($scope.post._id).then(function () {
                    var itemIndex = _.findIndex($scope.timeline, '_id', $scope.post._id);
                    if (itemIndex) {
                        $scope.timeline.splice(itemIndex, 1);
                    }
                });
            }

            function editPost() {
                $scope.edit = true;
            }

            function replyPost() {
                $scope.replyActive = true;
            }

            function cancel() {
                $scope.edit = false;
            }

            function savePost() {
                $scope.edit = false;
                PostService.savePost($scope.parent._id, $scope.post).then(function (post) {
                    $scope.post.edited = moment(Date.now()).format("YYYY-MM-DDTHH:mm:ssZZ");
                });
            }
        }
    };
}).directive('postReply', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/posts/tpls/post-reply.html',
        scope: {
            parent: '=',
            timeline: '=',
            parentPost: '=?',
            replyActive: '=?'
        },
        controller: function controller($scope, PostService) {
            $scope.reply = {
                sectionData: {}
            };
            if ($scope.parentPost) {
                $scope.reply.parent = $scope.parentPost;
            }

            $scope.submit = submit;

            ////////////////////////////////

            function submit() {
                PostService.savePost($scope.parent._id, $scope.reply).then(function (post) {
                    $scope.postInputStatus.active = false; // Set input to inactive
                    $scope.reply = { sectionData: {} };
                    post.timestamp = moment().format();
                    post.event = 'post';
                    $scope.replyActive = false;
                    $scope.timeline.push(post);
                }).catch(function () {
                    $scope.postInputStatus.active = true;
                });
            }
        }
    };
}).directive('postSummary', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/posts/tpls/post-summary.html',
        scope: {
            post: '='
        },
        controller: function controller($scope, CoreLibrary) {
            if ($scope.post.thread && $scope.post.thread.type) {
                $scope.sref = CoreLibrary.getSrefBase($scope.post.thread.type) + '({"stub": "' + $scope.post.thread.stub + '",  "#" : "' + $scope.post._id + '"})';
            } else {
                $scope.sref = CoreLibrary.getSrefBase('project') + '({"stub": "' + $scope.post.project.stub + '",  "#" : "' + $scope.post._id + '"})';
            }
            $scope.editorOptions = {
                realtime: false,
                contained: true,
                minimal: true
            };
        }
    };
}).directive('userPosts', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/posts/tpls/user-posts.html',
        scope: {
            userId: '@'
        },
        controller: function controller($scope, PostService) {
            PostService.getUserPosts({
                owner: $scope.userId
            }).then(function (results) {
                $scope.data = results.data;
            });
        }
    };
}).service('PostService', function (Restangular, $http, Authentication, ModularEditorService, $q) {

    // this service handles both thread posts and project comments

    this.getPosts = getPosts; // function(parent) - Get posts for the project || thread
    this.savePost = savePost; // function(post)   - Save an existing post
    this.deletePost = deletePost; // function(postId)   - Delete a post
    this.getUserPosts = getUserPosts; // function(data)

    ///////////////////////////////////////////////

    function getUserPosts(data) {
        if (!data || !data.owner) {
            return console.error('Invalid Input');
        }
        return $http({
            url: '/api/v1/posts',
            method: "GET",
            params: {
                owner: data.owner,
                sort: '_id',
                order: 'dsc',
                size: 200
            }
        });
    }

    function getPosts(parent) {
        return $http({
            url: '/api/v1/threads/' + parent._id + '/posts',
            method: "GET"
        });
    }

    function savePost(parentId, post) {
        var postClone = _.clone(post, true);
        ModularEditorService.stripSectionsDomElements(postClone.sectionData.sections);
        return $http({
            url: postClone._id ? '/api/v1/posts/' + post._id : '/api/v1/threads/' + parentId + '/posts',
            method: postClone._id ? 'PUT' : 'POST',
            data: postClone
        }).then(function (response) {
            return response.data;
        });
    }

    function deletePost(postId) {
        return $http({
            url: '/api/v1/posts/' + postId,
            method: 'DELETE'
        });
    }
});
'use strict';

angular.module('modules.preview.cad', []);
angular.module('modules.preview.cad').directive('previewAutodesk', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/preview/preview-cad/tpls/autodesk-preview.html',
        scope: {
            project: '=',
            fileMeta: '=',
            previewer: '='
        },
        controller: function controller($element, $scope, $http, $timeout, $mdToast, AutoDeskService, $window, SyncService, $q, $interval) {
            var checkStatusInterval;
            $scope.previewer.render = initPreview;
            initPreview();

            ///////////////////////////////////////////////

            function initPreview() {
                $scope.status = 'pending';
                $scope.initialiseAutodesk = false;

                onDestroy();
                if (AutoDeskService.isWebGlSupported()) {
                    return loadPackages().then(initAutodeskPreview);
                } else {
                    $scope.status = 'disabled';
                }
            }

            function loadPackages() {
                return $q.all([SyncService.render($scope.project.stub, $scope.fileMeta.path, { revision: $scope.fileMeta.rev }), AutoDeskService.load(), AutoDeskService.authenticate()]);
            }

            function onDestroy() {
                $interval.cancel(checkStatusInterval);
            }

            function initAutodeskPreview(responses) {
                $scope.urn64 = responses[0].data.urn;
                $scope.token = responses[2].data.token;
                checkStatusInterval = $interval(checkStatus, 700);

                ///////////////////////////////////////

                function checkStatus() {
                    AutoDeskService.getViewStatus($scope.urn64).then(function (response) {
                        $scope.status = response.data.status;
                        if ($scope.status == 'success') {
                            $scope.initialiseAutodesk = true;
                            $interval.cancel(checkStatusInterval);
                        } else if ($scope.status == 'failed') {
                            $interval.cancel(checkStatusInterval);
                        }
                    });
                }
            }

            $scope.$on('$destroy', onDestroy);
        }
    };
}).directive('autodeskElement', function () {
    return {
        restrict: 'E',
        scope: {
            previewer: '=?',
            urn64: '@?',
            token: '@?'

        },
        controller: function controller($element, $scope, $mdToast, $timeout, $interval, AutoDeskInstanceService) {
            $scope.previewer = $scope.previewer || {};

            var viewerEl = $element[0];
            var oDocument = null,
                viewerInstance = null;
            var oViewables = null,
                oViews3D = null,
                oViews2D = null;
            var options = {
                'document': $scope.urn64,
                'accessToken': $scope.token,
                'env': 'AutodeskProduction'
            };

            $scope.$on('$destroy', onDestroy);
            $scope.previewer.center = center;

            viewerInstance = AutoDeskInstanceService.register(viewerEl); // With toolbar

            window.Autodesk.Viewing.Initializer(options, function () {
                viewerInstance.initialize();
                loadDocument(viewerInstance, options);
            });

            ////////////////////////////////

            function center() {
                if (viewerInstance) {
                    console.log('center');
                    viewerInstance.resize();
                }
            }

            function loadDocument(viewer, options) {
                if (options.document.substring(0, 4) === 'urn:') {
                    options.document = options.document.substring(4);
                }
                window.Autodesk.Viewing.Document.load('urn:' + options.document, onLoadCallback, onErrorCallback);
            }

            function onLoadCallback(doc) {
                // Get all the 3D and 2D views (but keep in separate arrays so we can differentiate in the UI)
                oViews3D = window.Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
                    'type': 'geometry',
                    'role': '3d'
                }, true);
                oViews2D = window.Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
                    'type': 'geometry',
                    'role': '2d'
                }, true);

                // Load up first a 3D view by default
                if (oViews3D.length > 0) {
                    viewerInstance.load(doc.getViewablePath(oViews3D[0]));
                } else if (oViews2D.length > 0) {
                    viewerInstance.load(doc.getViewablePath(oViews2D[0]));
                } else {
                    $mdToast.show($mdToast.simple().theme('warn').content('Error: No views found'));
                }
            }

            function onErrorCallback(errorMsg) {
                $mdToast.show($mdToast.simple().theme('warn').content('Error: ' + errorMsg));
            }

            function onDestroy() {
                AutoDeskInstanceService.deregister(viewerInstance);
            }
        }
    };
}).service('autodeskInterceptor', function ($q) {
    return {
        request: function request(config) {
            // This function will be updated after token is known
            return config;
        }
    };
}).config(function ($httpProvider) {
    $httpProvider.interceptors.push('autodeskInterceptor');
}).service('AutoDeskService', function ($http, LazyLoadingService, autodeskInterceptor) {
    var service = this;

    this.load = load;
    this.accessToken = '';
    this.authenticate = authenticate;
    this.getViewStatus = getViewStatus;
    this.isWebGlSupported = isWebGlSupported;

    authenticate();
    // Update interceptor
    autodeskInterceptor.request = function (config) {
        if (config.url.indexOf('autodesk.com') != -1) {
            config.headers.Authorization = 'Bearer ' + service.accessToken;
        }
        return config;
    };

    ////////////////////////////////////////

    function load() {
        return LazyLoadingService.load([{
            global: 'Autodesk',
            src: 'https://developer.api.autodesk.com/viewingservice/v1/viewers/viewer3D.min.js'
        }, {
            src: 'https://developer.api.autodesk.com/viewingservice/v1/viewers/style.min.css'
        }, {
            src: 'https://developer.api.autodesk.com/viewingservice/v1/viewers/three.min.js'
        }, {
            src: 'https://developer.api.autodesk.com/viewingservice/v1/viewers/lmvworker.min.js'
        }]).then(function (modules) {
            return modules[0];
        });
    }
    //            src    : 'assets/js/autodesk/css/style.min.css'

    function authenticate() {
        return $http({
            method: 'POST',
            url: 'api/v1/auth/autodesk'
        }).then(function (response) {
            service.accessToken = response.data.token;
            return response;
        });
    }

    function getViewStatus(urn64) {
        return $http({
            method: 'GET',
            url: 'https://developer.api.autodesk.com/viewingservice/v1/' + urn64 + '/status'
        });
    }

    function isWebGlSupported(return_context) {
        if (!!window.WebGLRenderingContext) {
            var canvas = document.createElement("canvas"),
                names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
                context = false;

            for (var i = 0; i < 4; i++) {
                try {
                    context = canvas.getContext(names[i]);
                    if (context && typeof context.getParameter == "function") {
                        // WebGL is enabled
                        if (return_context) {
                            // return WebGL object if the function's argument is present
                            return { name: names[i], gl: context };
                        }
                        // else, return just true
                        return true;
                    }
                } catch (e) {}
            }

            // WebGL is supported, but disabled
            return false;
        }

        // WebGL not supported
        return false;
    }
}).service('AutoDeskInstanceService', function (CoreLibrary, $interval, $timeout, $document) {
    var service = this;

    this.activeInstances = [];
    this.register = register;
    this.deregister = deregister;

    var oldState = { viewport: { eye: [1] } };
    var filter = { viewport: true };
    var syncIsActive = false;

    ////////////////////////

    function onMove() {
        if (service.activeInstances && service.activeInstances.length > 1) {
            var newState;
            var oldInstances = [];
            _.forEach(service.activeInstances, function (instance) {
                if (instance.viewerState) {
                    var possibleNewState = instance.getState(filter);
                    // If the state is different, this is the new state!
                    if (possibleNewState.viewport.eye[0] != oldState.viewport.eye[0]) {
                        newState = possibleNewState;
                    } else {
                        oldInstances.push(instance);
                    }
                }
            });

            // If there is a new state, update the old instances
            if (newState) {
                if (oldInstances.length > 0) {
                    _.forEach(oldInstances, function (instance) {
                        instance.restoreState(newState, filter, true);
                    });
                }
                oldState = newState;
            }
        }
    }

    function register(viewerEl) {
        var id = CoreLibrary.getUuid();
        var instance = new window.Autodesk.Viewing.Private.GuiViewer3D(viewerEl, {});
        instance.id = id;
        service.activeInstances.push(instance);
        if (service.activeInstances.length > 1 && !syncIsActive) {
            syncIsActive = true;
            $document.on('mousemove vmousemove mousewheel click mousedown DOMMouseScroll scroll', onMove);
        }
        return instance;
    }
    function deregister(instance) {
        if (instance) {
            service.activeInstances.splice(_.findIndex(service.activeInstances, 'id', instance.id), 1);
            if (service.activeInstances.length < 2 && syncIsActive) {
                syncIsActive = false;
                $document.off('mousemove vmousemove mousewheel click mousedown DOMMouseScroll scroll', onMove);
            }
            instance.finish();
        }
    }
});
'use strict';

angular.module('modules.preview.code', []);
angular.module('modules.preview.code').directive('previewCode', function ($window) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            project: '=',
            fileMeta: '=',
            previewer: '=?'
        },
        controller: function controller($scope, CodeMirrorService, LazyLoadingService, SyncService) {

            $scope.previewer.render = initPreview;
            initPreview();

            ////////////////////////
            function initPreview() {
                $scope.loading = true;
                SyncService.download($scope.fileMeta.downloadUrl).then(function (response) {
                    $scope.loading = false;
                    $scope.previewer.fileData = response.data;
                });
                $scope.optionsView = {
                    indentWithTabs: true,
                    readOnly: true,
                    dragDrop: false,
                    lineWrapping: true,
                    lineNumbers: true,
                    onLoad: function onLoad(cmEditor) {
                        $scope.cmEditor = cmEditor;
                        var modeName = window.CodeMirror.findModeByFileName($scope.fileMeta.name);
                        if (modeName) {
                            CodeMirrorService.changeCodeMode(cmEditor, modeName.mode);
                        }
                    }
                };
                $scope.optionsEdit = {
                    indentWithTabs: true,
                    readOnly: false,
                    dragDrop: false,
                    lineWrapping: true,
                    lineNumbers: true,
                    onLoad: function onLoad(cmEditor) {
                        $scope.cmEditor = cmEditor;
                        var modeName = window.CodeMirror.findModeByFileName($scope.fileMeta.name);
                        if (modeName) {
                            CodeMirrorService.changeCodeMode(cmEditor, modeName.mode);
                        }
                    }
                };
            }
        },
        templateUrl: 'app/modules/preview/preview-code/tpls/preview-code.html'
    };
});
'use strict';

angular.module('modules.preview.embed', []);
angular.module('modules.preview.embed').service('PreviewEmbedService', function ($mdDialog) {
    this.modal = function (event, fileMeta) {
        return $mdDialog.show({
            templateUrl: 'app/modules/preview/preview-embed/tpls/preview-embed-modal.html',
            controller: function controller($scope, $mdDialog, SyncUrlService) {
                $scope.fileMeta = fileMeta;
                $scope.version = 'latest';
                $scope.change = function (version) {
                    $scope.src = 'http://embed.stemn.com/preview/' + fileMeta.parentProject + '/' + fileMeta.path + (version == 'specific' ? '@' + fileMeta.rev : '') + (fileMeta.virtualChildren ? '?children=' + SyncUrlService.getChildPath(fileMeta.virtualChildren, version == 'latest' ? true : false) : '');
                    $scope.code = '<iframe allowfullscreen width="100%" height="500" frameborder="0" src="' + $scope.src + '"><a href="' + $scope.src + '">Preview ' + fileMeta.name + '</a></iframe>';
                };

                $scope.change($scope.version);
                $scope.cancel = $mdDialog.cancel; // function()
                $scope.save = function () {
                    $mdDialog.hide();
                };
            },
            targetEvent: event
        });
    };
});
'use strict';

angular.module('modules.preview.files', []);
angular.module('modules.preview.files').directive('previewFiles', function ($window) {
    return {
        restrict: 'E',
        scope: {
            project: '=',
            viewerType: '=',
            fileMeta: '=',
            previewer: '=?'
        },
        controller: function controller($scope, SyncUtilService) {
            $scope.previewer = $scope.previewer || {};
            $scope.previewer.type = SyncUtilService.getViewerType($scope.fileMeta.fileType, $scope.fileMeta.provider);

            $scope.hostDomain = window.location.hostname;
        },
        templateUrl: 'app/modules/preview/preview-files/tpls/preview-files.html'
    };
});
'use strict';

angular.module('modules.preview.gerber', []);

angular.module('modules.preview.gerber').directive('previewGerber', function ($window) {
    return {
        restrict: 'E',
        scope: {
            fileMeta: '=?',
            previewer: '=?'
        },
        templateUrl: 'app/modules/preview/preview-gerber/tpls/preview-gerber.html',
        controller: function controller($scope, WebGerberService, LazyLoadingService, $element, $http, $q, SyncService, SyncUtilService, $timeout, $mdToast) {
            var webGerberInstance,
                gerberFile = {};

            $scope.previewer.render = initPreview;
            $scope.previewer.center = center;
            initPreview();

            // Scoped functions
            $scope.toggleLayer = toggleLayer; //function(layer)
            $scope.flip = flip; //function()
            $scope.center = center; //function()

            $scope.$on('$destroy', onDestroy);

            ////////////////////////////////

            function initPreview() {
                onDestroy();
                $scope.loading = true;
                if ($scope.fileMeta.virtualChildren) {
                    _.forEach($scope.fileMeta.virtualChildren, function (child) {
                        child.enabled = true;
                    });
                    $q.all([loadPackages(), loadFiles()]).then(function (response) {
                        gerberFile = response[1];
                        init();
                    });
                } else {
                    $q.all([loadPackages(), loadFile($scope.fileMeta.name, $scope.fileMeta.endingUrl)]).then(function (response) {
                        gerberFile = [response[1]];
                        init();
                    });
                }
            }

            function toggleLayer(layer) {
                $timeout(function () {
                    _.forEach(WebGerberService.activeInstances, function (instance) {
                        var matchingLayer = _.find(instance.layers, 'name', layer.name);
                        if (matchingLayer) {
                            matchingLayer.enabled = layer.enabled;
                            instance.repaint = 0;
                        }
                    });
                }, 1);
            }

            function init() {
                webGerberInstance = WebGerberService.register();
                $scope.previewer.instance = webGerberInstance;

                webGerberInstance.callbacks = {
                    renderStart: function renderStart() {},
                    renderComplete: function renderComplete() {
                        $scope.loading = false;
                    }
                };

                $scope.layers = _.map(gerberFile, webGerberInstance.parse);

                // Pop Error messages and remove bad layers
                _.forEachRight($scope.layers, function (layer, index) {
                    if (layer.error) {
                        toast(layer.error);
                        $scope.layers.splice(index, 1);
                    } else if (layer.isGerber && layer.cmds.length === 0) {
                        toast('Could not parse file.');
                        $scope.layers.splice(index, 1);
                    }
                });

                // If we still have layers, display them
                if ($scope.layers.length > 0) {
                    // Push on the back layer if it is a pcb/brd file
                    if (!$scope.layers[0].isGerber) {
                        $scope.layers[0].side = 2;
                        var backLayer = _.clone($scope.layers[0], true);
                        backLayer.boardFlipped = true;
                        backLayer.side = 1;
                        $scope.layers.push(backLayer);
                    }

                    webGerberInstance.init($scope.layers, $element[0].querySelector(".canvas-parent"), WebGerberService.activeInstances);
                    // Flip the board if we only have bottom layers
                    if (!_.find($scope.layers, 'side', 2)) {
                        flip(true);
                    }
                } else {
                    $scope.previewer.type = 'other';
                }
            }

            function loadFiles() {
                return $q.all(_.map($scope.fileMeta.virtualChildren, function (file) {
                    return loadFile(file.name, file.endingUrl);
                }));
            }

            function loadFile(name, endingUrl) {
                return $http({
                    method: 'GET',
                    url: 'api/v1/sync/download/' + endingUrl,
                    cache: true
                }).then(function (response) {
                    var result = {
                        name: name,
                        data: response.data
                    };
                    return result;
                });
            }

            function loadPackages() {
                return LazyLoadingService.load([{ src: 'assets/js/gerber/js/thr51.min.js?digest=v2' }, { src: 'assets/js/gerber/js/ObjectControls.js?digest=v2' }, { src: 'assets/js/gerber/js/webGerber.js?digest=v2' }, { src: 'assets/js/gerber/js/parse/gerber.js?digest=v2' }, { src: 'assets/js/gerber/js/parse/eagle.js?digest=v2' }, { src: 'assets/js/gerber/js/render/viewee-generic.js?digest=v2' }, { src: 'assets/js/gerber/js/render/gerber.js?digest=v2' }, { src: 'assets/js/gerber/js/render/viewee-canvas.js?digest=v2' }, { src: 'assets/js/gerber/js/viewee.js?digest=v2' }]);
            }

            function onDestroy() {
                WebGerberService.deregister(webGerberInstance);
            }

            function center() {
                _.forEach(WebGerberService.activeInstances, function (instance) {
                    instance.center();
                });
            }
            function flip(status) {
                $scope.flipped = status ? status : !$scope.flipped;
                _.forEach(WebGerberService.activeInstances, function (instance) {
                    instance.flip($scope.flipped);
                });
            }

            function toast(message) {
                $mdToast.show($mdToast.simple().theme('warn').content(message));
            }
        }
    };
}).service('WebGerberService', function (CoreLibrary) {
    var service = this;

    this.activeInstances = [];
    this.register = register;
    this.deregister = deregister;

    ////////////////////////

    function register() {
        var id = CoreLibrary.getUuid();
        var instance = window.webGerber();
        instance.id = id;
        service.activeInstances.push(instance);
        return instance;
    }
    function deregister(instance) {
        if (instance) {
            instance.destroy();
            service.activeInstances.splice(_.findIndex(service.activeInstances, 'id', instance.id), 1);
        }
    }
});
'use strict';

angular.module('modules.preview.pcb', []);

angular.module('modules.preview.pcb').directive('previewPcb', function ($window) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            fileUrl: '@',
            previewer: '=?'
        },
        templateUrl: 'app/modules/preview/preview-pcb/tpls/preview-pcb.html',
        controller: function controller($scope, LazyLoadingService, $element, $timeout, PanZoomService, ViewPcbService, $q, SyncService) {

            var ViewEEInstance;
            var canvasElement;
            var panZoomInstance;

            $scope.previewer.render = initPreview;
            $scope.previewer.center = reset;
            initPreview();

            function initPreview() {
                onDestroy();
                $scope.loading = true;
                loadPackages().then(init);
            }

            function init(response) {
                console.log();
                var url = $scope.fileUrl;
                canvasElement = $element[0].querySelector(".canvas");
                ViewEEInstance = ViewPcbService.register(canvasElement);
                ViewEEInstance.drawCallback = function () {
                    $scope.loading = false;
                    // Add Zoom Pan after draw is complete
                    //                    addPanZoom()
                };
                ViewEEInstance.loadText(response[0].data);

                $scope.flipBoard = flipBoard; //function()
                $scope.reset = reset; //function()
            }
            $scope.$on('$destroy', onDestroy);

            ////////////////////////////////

            function loadPackages() {
                return $q.all([SyncService.download($scope.fileUrl), LazyLoadingService.load([{ src: 'fonts/ocr-a/fonts.css' }, { src: 'assets/js/viewee/js/utils/object-assign.js' }, { src: 'assets/js/viewee/js/utils/minivents.js' }, { src: 'assets/js/viewee/js/utils/htmlel.js' }, { src: 'assets/js/viewee/js/parsers/eagle_xml_parser.js' }, { src: 'assets/js/viewee/js/parsers/kicad_pcb_parser.js' }, { src: 'assets/js/viewee/js/parsers/geda_parser.js' }, { src: 'assets/js/viewee/js/renderers/renderer.js' }, { src: 'assets/js/viewee/js/renderers/canvas_renderer.js' }, { src: 'assets/js/viewee/js/renderers/svg_renderer.js' }, { src: 'assets/js/viewee/js/viewee.js' }, { src: 'assets/js/viewee/js/pan-zoom/svg-pan-zoom.js' }])]);
            }

            function addPanZoom() {
                panZoomInstance = PanZoomService.register(canvasElement, {
                    zoomScaleSensitivity: 0.4,
                    minZoom: 0.1,
                    maxZoom: 20,
                    onZoom: function onZoom(zoom) {
                        _.forEach(PanZoomService.activeInstances, function (instance) {
                            if (instance.id != panZoomInstance.id) {
                                instance.zoom(zoom);
                            }
                        });
                    },
                    onPan: function onPan(pan) {
                        _.forEach(PanZoomService.activeInstances, function (instance) {
                            if (instance.id != panZoomInstance.id) {
                                instance.pan(pan);
                            }
                        });
                    }
                });
            }

            function onDestroy() {
                PanZoomService.deregister(panZoomInstance);
                ViewPcbService.deregister(ViewEEInstance);
            }

            function flipBoard() {
                $scope.flipped = !$scope.flipped;
                _.forEach(ViewPcbService.activeInstances, function (instance) {
                    instance.setBoardFlipped($scope.flipped);
                });
            }

            function reset() {
                _.forEach(PanZoomService.activeInstances, function (instance) {
                    instance.resize();
                    instance.fit();
                    instance.center();
                    console.log(instance.getSizes());
                });
            }
        }
    };
}).service('ViewPcbService', function ($window, CoreLibrary) {
    var service = this;
    this.activeInstances = [];
    this.register = register;
    this.deregister = deregister;

    //////////////////////////////////////////

    function register(element) {
        var id = CoreLibrary.getUuid();
        var instance = new window.ViewEEPCB(element);
        instance.id = id;
        service.activeInstances.push(instance);
        return instance;
    }

    function deregister(instance) {
        if (instance) {
            service.activeInstances.splice(_.findIndex(service.activeInstances, 'id', instance.id), 1);
        }
    }
}).service('PanZoomService', function ($window, CoreLibrary) {
    var service = this;
    this.activeInstances = [];
    this.register = register;
    this.deregister = deregister;

    //////////////////////////////////////////

    function register(element, options) {
        var id = CoreLibrary.getUuid();
        var instance = window.svgPanZoom(element, options);
        instance.id = id;
        service.activeInstances.push(instance);
        return instance;
    }

    function deregister(instance) {
        if (instance) {
            service.activeInstances.splice(_.findIndex(service.activeInstances, 'id', instance.id), 1);
            instance.destroy();
        }
    }
});
'use strict';

angular.module('modules.preview.pdf', []);

angular.module('modules.preview.pdf').directive('previewPdf', function ($window) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            fileUrl: '@'
        },
        templateUrl: 'app/modules/preview/preview-pdf/tpls/preview-pdf.html',
        controller: function controller($scope) {
            console.log($scope.fileUrl);
            $scope.loading = true;
            window.pdfLoadCompleteCallback = function () {
                $scope.loading = false;
                $scope.$apply();
            };
        }
    };
});
'use strict';

angular.module('modules.project.project-create-modal', []);
angular.module('modules.project.project-create-modal').service('ProjectCreateModalService', function ($mdDialog, $timeout) {
    this.newProject = function (event, data) {
        /********************************************************************
        We pass data into the modal to tell it which fields, orgs and project
        that it should automaticaly tag.
        We MUST include the thread type
            data = {
                fields        : [],
                organisations : [],
                projects      : [],
            }
        ********************************************************************/
        return $mdDialog.show({
            templateUrl: 'app/modules/project/project-create-modal/tpls/project-create-modal.html',
            controller: 'ProjectCreateModalCtrl',
            targetEvent: event,
            locals: {
                data: data
            }
        });
    };
}).controller('ProjectCreateModalCtrl', function (data, $scope, $state, $mdDialog, ProjectCreateModalService, LicenseData, NewCreationsService, CoreLibrary) {
    $scope.forms = {};
    $scope.project = data || {};

    $scope.project.permissions = $scope.project.permissions || {};
    $scope.project.permissions.projectType = $scope.project.permissions.projectType || 'public';
    $scope.project.license = $scope.project.license || 'CC BY';
    $scope.project.stub = CoreLibrary.getRandomString(30);

    $scope.activeTab = {};
    $scope.tabs = [{
        label: 'General',
        path: 'app/modules/project/project-create-modal/tpls/project-create-modal.basic.html',
        click: function click() {
            $scope.activeTab.label = this.label;
            $scope.activeTab.path = this.path;
        }
    }, {
        label: 'Permissions',
        path: 'app/modules/project/project-create-modal/tpls/project-create-modal.permissions.html',
        click: function click() {
            $scope.activeTab.label = this.label;
            $scope.activeTab.path = this.path;
        }
    }];
    $scope.tabs[0].click();

    $scope.steps = {
        'General': {
            nextText: 'Next',
            nextFn: function nextFn() {
                $scope.tabs[1].click();
            },
            isDisabled: function isDisabled() {
                return $scope.forms.generalForm && $scope.forms.generalForm.$invalid;
            }
        },
        'Permissions': {
            nextText: 'Create Project',
            nextFn: function nextFn() {
                if (!$scope.submitted) {
                    $scope.submitted = true;
                    NewCreationsService.create('project', $scope.project);
                }
            }
        }
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };
});
'use strict';

angular.module('modules.project', ['modules.project.project-create-modal']);
angular.module('modules.project').directive('clickCreateProject', function (ProjectCreateModalService) {
    return {
        restrict: 'A',
        scope: {
            project: '=?'
        },
        link: function link(scope, element, attrs) {
            element.bind('click', function (event) {
                ProjectCreateModalService.newProject(event, scope.project);
            });
        }
    };
}).directive('projectTypeRadios', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/project/tpls/project-type-radios.html'
    };
}).directive('projectLicenses', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/project/tpls/project-licenses.html',
        controller: function controller($scope, LicenseData) {
            $scope.licenses = LicenseData.licenses;
            $scope.$watch('project.license', function () {
                $scope.license = _.find($scope.licenses, { 'type': $scope.project.license });
            });
        }
    };
}).service('ProjectStatusData', function () {
    return [{
        value: '1',
        text: 'Planned'
    }, {
        value: '2',
        text: 'Underway'
    }, {
        value: '3',
        text: 'Postponed'
    }, {
        value: '4',
        text: 'Complete'
    }, {
        value: '5',
        text: 'Cancelled'
    }];
}).service('LicenseData', function () {
    // If Symbols is a blank array, the display will show the name.
    return {
        licenses: [{
            type: 'CC BY',
            name: 'Creative Commons - Attribution',
            url: 'http://creativecommons.org/licenses/by/4.0/',
            symbols: ['cc', 'cc-by'],
            description: 'This license lets others distribute, remix, tweak, and build upon your work, even commercially, as long as they credit you for the original creation.'
        }, {
            type: 'CC BY-SA',
            name: 'Creative Commons - Attribution - Share Alike',
            url: 'http://creativecommons.org/licenses/by-sa/4.0/',
            symbols: ['cc', 'cc-by', 'cc-sa'],
            description: 'This license lets others remix, tweak, and build upon your work even for commercial purposes, as long as they credit you and license their new creations under the identical terms.'
        }, {
            type: 'CC BY-ND',
            name: 'Creative Commons - Attribution - No Derivatives',
            url: 'http://creativecommons.org/licenses/by-nd/4.0/',
            symbols: ['cc', 'cc-by', 'cc-nd'],
            description: 'This license allows for redistribution, commercial and non-commercial, as long as it is passed along unchanged and in whole, with credit to you.'
        }, {
            type: 'CC BY-NC',
            name: 'Creative Commons - Attribution - Non-Commercial',
            url: 'http://creativecommons.org/licenses/by-nc/4.0/',
            symbols: ['cc', 'cc-by', 'cc-nc'],
            description: 'This license lets others remix, tweak, and build upon your work non-commercially, and although their new works must also acknowledge you and be non-commercial, they don’t have to license their derivative works on the same terms.'
        }, {
            type: 'CC BY-NC-SA',
            name: 'Creative Commons - Attribution - Non-Commercial - Share Alike',
            url: 'http://creativecommons.org/licenses/by-nc-sa/4.0/',
            symbols: ['cc', 'cc-by', 'cc-nd', 'cc-sa'],
            description: 'This license lets others remix, tweak, and build upon your work non-commercially, as long as they credit you and license their new creations under the identical terms.'
        }, {
            type: 'CC BY-NC-ND',
            name: 'Creative Commons - Attribution - Non-Commercial - No Derivatives',
            url: 'http://creativecommons.org/licenses/by-nc-nd/4.0/',
            symbols: ['cc', 'cc-by', 'cc-nd', 'cc-nc'],
            description: 'This license is the most restrictive of the Creative Commons licenses, only allowing others to download your works and share them with others as long as they credit you, but they can’t change them in any way or use them commercially.'
        }, {
            type: 'MPL',
            name: 'Mozilla Public License',
            url: 'https://www.mozilla.org/MPL/2.0/',
            symbols: [],
            description: 'The MPL allows source code to be mixed with other files under a different, even proprietary license. However, code files licensed under the MPL must remain under the MPL and freely available in source form.'
        }, {
            type: 'Other',
            name: 'Other License',
            url: '',
            symbols: [],
            description: 'Other License'
        }],
        symbols: {
            'cc': {
                tooltip: 'Creative Commons'
            },
            'cc-by': {
                tooltip: 'Attribution'
            },
            'cc-sa': {
                tooltip: 'Share-alike'
            },
            'cc-nd': {
                tooltip: 'No Derivative Works'
            },
            'cc-nc': {
                tooltip: 'Non-commercial'
            },
            'mozilla': {
                tooltip: 'Non-commercial'
            }
        }
    };
});
'use strict';

angular.module('modules.projects', ['modules.project']);
angular.module('modules.projects').directive('projectFilterBar', function () {
    return {
        restrict: 'E',
        scope: {
            filter: '=',
            view: '='
        },
        templateUrl: 'app/modules/projects/tpls/projects-filter-bar.html',
        controller: function controller($scope) {
            // The diffrent types of filters
            $scope.filters = [{
                text: 'Activity',
                model: 'updated',
                reverse: true
            }, {
                text: 'Threads',
                model: 'numThreads',
                reverse: true
            }, {
                text: 'Likes',
                model: 'likes',
                reverse: true
            }, {
                text: 'Age',
                model: 'created',
                reverse: true
            }];
            $scope.view = $scope.view || 'block';

            $scope.updateFilter = function () {
                $scope.filter.sort = $scope.active.filter.model;
                $scope.filter.order = $scope.active.filter.reverse ? 'des' : 'asc';
                $scope.filter.page = 1; // reset the index to the start
            };
            // Initiate OrderBy filter
            $scope.active = {
                filter: $scope.filters[0]
            };
        }
    };
}).service('ProjectService', function (HttpService, Restangular, Authentication, ModularEditorService, LocalCache) {

    this.getProject = getProject; // function(stubOrId, select)
    this.getProjects = getProjects; // function(data)
    this.createProject = createProject; // function(project)
    this.deleteProject = deleteProject; // function(projectId)
    this.updateProject = updateProject; // function(project)

    var endpoint = 'project';

    //////////////////////////////////

    function getProject(stubOrId, select) {
        // Default the selectFields
        var selectFields;
        if (select == 'sm') {
            selectFields = ['stub', 'name', 'picture', 'blurb'];
        } else if (select == 'md') {
            selectFields = ['stub', 'name', 'picture', 'blurb', 'created', 'updated', 'fields', 'organisations', 'team', 'likes', 'numComments', 'location'];
        } else {
            selectFields = ['*'];
            select = 'lg';
        }

        var getPromise = function getPromise(data) {
            // data - [asfasffsa, asfafsasfasf] - Array of user ids
            return HttpService({
                url: '/api/v1/projects',
                method: "GET",
                params: {
                    'select[]': selectFields,
                    'ids[]': data
                }
            });
        };
        return LocalCache.getPackaged(endpoint + select, stubOrId, getPromise);
    }

    function getProjects(data) {
        /***************************************** /
         page : The page number to request
         size : The number of results per page
         sort : The field to sort the results by
         type : The entity to get results for e.g. user, organisation, field
        / *****************************************/
        // default to getting projects for user
        if (data.type) {
            data.type = data.type + 's'; // pluralise for api route
            return Restangular.one(data.type, data._id).all('projects').getList(data);
        } else {
            return Restangular.all('projects').getList(data);
        }
    }

    function createProject(project) {
        return HttpService({
            method: 'POST',
            url: 'api/v1/projects',
            data: project
        });
    }
    function updateProject(project) {
        analytics.track('Project Update', {
            project: project.stub,
            teamMembers: project.team.length
        });
        var projectCopy = _.clone(project, true);
        ModularEditorService.stripSectionsDomElements(projectCopy.sectionData.sections);
        LocalCache.save(endpoint + 'lg', projectCopy);
        // to save exceeding request size, remove unnecessary data
        return HttpService({
            method: 'PUT',
            url: 'api/v1/projects/' + projectCopy._id,
            data: projectCopy
        });
    }

    function deleteProject(id) {
        return HttpService({
            url: '/api/v1/projects/' + id,
            method: "DELETE"
        });
    }
});
'use strict';

angular.module('modules.prompt-overlay', []);
angular.module('modules.prompt-overlay').directive('promptOverlay', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            img: '@'
        },
        templateUrl: 'app/modules/prompt-overlay/tpls/prompt-overlay.html',
        controller: function controller($scope, PromptOverlayService) {
            $scope.PromptOverlayService = PromptOverlayService;
            $scope.close = function () {
                $scope.PromptOverlayService.showPrompt = false;
            };
        }
    };
}).service('PromptOverlayService', function () {
    this.showPrompt = true;
});
'use strict';

angular.module('modules.publish', ['modules.transition-overlay']);
angular.module('modules.publish').directive('publishShareLink', function ($mdDialog, $location) {
    // This will pop to the share-link model
    // [publishShareLink] = id
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            element.bind('click', function (event) {
                $mdDialog.show({
                    templateUrl: 'app/modules/publish/tpls/publish-share-link-modal.html',
                    controller: function controller(data, $scope) {
                        $scope.url = $location.absUrl();
                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };
                        $scope.confirm = function () {
                            $mdDialog.hide();
                        };
                    },
                    clickOutsideToClose: true,
                    targetEvent: event,
                    locals: {
                        data: attrs.publishShareLink
                    }
                });
            });
        }
    };
}).directive('clickUnpublish', function () {
    return {
        restrict: 'A',
        scope: {
            entity: '=',
            saveFn: '&'
        },
        link: function link(scope, element, attrs) {
            element.bind('click', function (event) {
                scope.entity.published = false;
                console.log(scope.saveFn);
                scope.saveFn();
            });
        }
    };
}).service('PublishService', function ($mdDialog, $mdToast) {
    var service = this;

    this.entity = {}; // Blog || Project || Question || Discussion entity
    this.showEdit = ''; // If edit should be shown

    this.selectStubModal = selectStubModal; //function(event, entity, stubPrefix)
    this.missingFieldsToast = missingFieldsToast; //function(form)

    /////////////////////////////////////////


    function missingFieldsToast(form) {
        var toast = $mdToast.simple().content('You must add missing fields.').theme('warn').highlightAction(false);

        if (form && !form.$visible) {
            toast.action('Edit');
        }
        $mdToast.show(toast).then(function (response) {
            if (response == 'ok') {
                // If the form is not visible - we change to edit mode
                if (!form.$visible) {
                    form.$edit();
                }
            }
        });
    }

    function selectStubModal(event, entity, stubPrefix) {
        stubPrefix = stubPrefix || ''; // Default the stub prepend
        return $mdDialog.show({
            templateUrl: 'app/modules/publish/tpls/select-stub-modal.html',
            controller: function controller(entity, $scope, CoreLibrary, SearchService) {
                $scope.checkAvailability = checkAvailability; //function(name)
                $scope.entity = entity;

                var urlMapping = ['project', 'job', 'organisation', 'field', 'blog'];
                $scope.type = entity.entityType;

                if (urlMapping.indexOf(entity.type || entity.entityType) != -1) {
                    $scope.urlType = entity.type || entity.entityType;
                } else {
                    $scope.urlType = 'thread';
                }

                checkAvailability(entity.name);

                /////////////////////////////////////////

                function checkAvailability(name) {
                    if (name) {
                        $scope.stub = CoreLibrary.stubify(stubPrefix + name);
                        if ($scope.stub) {
                            SearchService.search({ type: $scope.type, key: 'stub', value: $scope.stub, match: 'insensitive', published: true }).then(function (response) {
                                if (response.data.length === 0) {
                                    $scope.Form.title.$setValidity('notavailable', true);
                                } else {
                                    $scope.Form.title.$setValidity('notavailable', false);
                                }
                            });
                        }
                    }
                }

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };

                $scope.save = function () {
                    if ($scope.Form.$valid) {
                        $mdDialog.hide($scope.stub);
                    }
                };
            },
            locals: {
                entity: entity
            },
            targetEvent: event
        });
    }
});
'use strict';

angular.module('modules.reading-time', []);
angular.module('modules.reading-time').directive('readingTime', function () {
    /**********************************************
    This will output the amount of time to read
    something based on the number of words.
      [words] : number - the number of words
    **********************************************/
    return {
        restrict: 'E',
        replace: true,
        template: '<span>{{readingTime}}</span>',
        link: function link(scope, element, attrs) {
            var wordsPerMin = 250;
            var time = Math.floor(parseInt(attrs.words) / wordsPerMin);
            if (time < 1) {
                scope.readingTime = '1 min read';
            } else {
                scope.readingTime = time + ' min read';
            }
        }
    };
});
'use strict';

angular.module('modules.realtime-editor', ['modules.socket', 'modules.xxhash', 'modules.error-handling']);
angular.module('modules.realtime-editor').service('RealtimeEditorService', function (SocketService, $mdToast, $document, $timeout, Authentication, XxhashService, RealtimeEditorModalService, ErrorModalService) {

	var finishEditingTimeout;

	registerIncomingEvents();
	this.subscribeToEdits = subscribeToEdits; // function({id:'',type:''})
	this.unsubscribeToEdits = unsubscribeToEdits; // function()
	this.saveSection = saveSection; // function(section)
	this.startEditingSection = startEditingSection; // function(section)
	this.finishEditingSection = finishEditingSection; // function(section)
	this.saveSectionIfChanged = saveSectionIfChanged; // function()
	this.checkIfSectionChanged = checkIfSectionChanged; // function()
	this.changeSectionOrder = changeSectionOrder; // function(sections)
	this.deleteSection = deleteSection; // function(sectionId)
	this.addSections = addSections; // function(sectionId)
	this.entity = {};
	this.edits = {}; // the currenOtly edited sections { sectionId : userId }

	this.sectionOrder = []; // Array containing the order of all sections
	this.sections = {}; // Object containing all the sections

	this.saveStatus = {}; // If the section has been saved.
	this.currentSectionId = ''; // The section the user is currently editing
	this.currentSectionInitialHash = ''; // The starting hash of the section the user is currently editing


	var service = this;

	/////////////////////////////////////////////////

	function subscribeToEdits(entity) {
		// entityType and entityId
		service.entity = entity;
		SocketService.emit('reset');
		SocketService.emit('join', { id: service.entity.id, type: service.entity.type, user: Authentication.currentUser._id });
	}

	function unsubscribeToEdits() {
		SocketService.emit('leave', { id: service.entity.id, user: Authentication.currentUser._id });
	}

	function saveSection(section) {
		service.saveStatus.message = 'Saving Section...';
		var sectionCopy = _.clone(section, true);
		stripDomElements(sectionCopy);
		SocketService.emit('section-save', { id: service.entity.id, section: sectionCopy, user: Authentication.currentUser._id }, function (response) {
			if (response.result === 'success') {
				setCurrentSectionHash(); // Set the hash to the new version
				service.saveStatus.message = 'Saved';
			} else {
				service.saveStatus.message = 'Failed to save';
			}
		});
	}

	function changeSectionOrder(orderArray) {
		service.sectionOrder = orderArray;
		service.finishEditingSection();
		SocketService.emit('section-reorder', { id: service.entity.id, sectionOrder: orderArray, user: Authentication.currentUser._id });
	}

	function startEditingSection(sectionId) {
		// If we are editing a new section
		if (sectionId != service.currentSectionId) {
			//			console.log('Start editing', sectionId);
			// Save the previous section if it has changed.
			saveSectionIfChanged();
			// Now comes the real logic for our new section
			service.currentSectionId = sectionId;
			setCurrentSectionHash();
			$timeout.cancel(finishEditingTimeout);
			var data = {
				id: service.entity.id,
				section: service.currentSectionId,
				type: service.entity.type,
				user: Authentication.currentUser._id
			};
			console.log('section-edit', data);
			SocketService.emit('section-edit', data);
		}
	}
	function finishEditingSection() {
		// If we were previously editing a section.
		if (service.currentSectionId) {
			var data = {
				id: service.entity.id,
				section: service.currentSectionId,
				type: service.entity.type,
				user: Authentication.currentUser._id
			};
			finishEditingTimeout = $timeout(function () {
				SocketService.emit('section-deedit', data);
			}, 100);

			saveSectionIfChanged();
			// Set current section to null because we are not editing anything
			service.currentSectionId = null;
		}
	}
	function deleteSection(sectionId) {
		SocketService.emit('section-delete', { id: service.entity.id, section: sectionId, user: Authentication.currentUser._id });
	}
	function addSections(modifiedSections, sectionOrder) {
		// remove the DOM elements for the sections
		var modifiedSectionsCopy = _.clone(modifiedSections, true);
		_.forEach(modifiedSectionsCopy, function (section) {
			stripDomElements(section);
		});
		SocketService.emit('section-add', { id: service.entity.id, sections: modifiedSectionsCopy, sectionOrder: sectionOrder, user: Authentication.currentUser._id });
	}

	function stripDomElements(section) {
		delete section.captionElement;
		delete section.contentElement;
		delete section.sectionElement;
	}

	function saveSectionIfChanged() {
		if (checkIfSectionChanged()) {
			// If the secton has changed, save it.
			service.saveSection(service.sections[service.currentSectionId]);
		}
	}

	function checkIfSectionChanged() {
		// // This will check to see if the current section has changed since last saving.
		if (service.sections[service.currentSectionId]) {
			// Check if the section has changed
			var currentSectionFinalHash = XxhashService(JSON.stringify(service.sections[service.currentSectionId]), 0xABCD).toString();
			if (service.currentSectionInitialHash !== currentSectionFinalHash) {
				service.saveStatus.message = 'Unsaved changes';
				return true;
			} else {
				service.saveStatus.message = 'Saved';
				return false;
			}
		} else {
			return false;
		}
	}

	function setCurrentSectionHash() {
		if (service.sections[service.currentSectionId]) {
			service.currentSectionInitialHash = XxhashService(JSON.stringify(service.sections[service.currentSectionId]), 0xABCD).toString();
		}
	}

	////////////// incoming events /////////////////
	function registerIncomingEvents() {
		// data object: { edits, users }
		SocketService.on('state', function (data) {
			// Remove any edit states that belong to the current user
			_.forEach(data, function (value, key) {
				if (value == Authentication.currentUser._id) {
					delete data[key];
				}
			});
			service.edits = data;
		});

		// data object: { sectionId : userId }
		SocketService.on('section-edit', function (data) {
			service.edits = service.edits || {}; // Assign empty object if undefined
			// remove any existing section edits for the user from our system state
			var editingUser = data[Object.keys(data)[0]];
			Object.keys(service.edits).forEach(function (section) {
				if (service.edits[section] === editingUser) {
					delete service.edits[section];
				}
			});
			// update our system state with the new edit
			_.extend(service.edits, data);
		});

		// data object: { sectionId : userId }
		SocketService.on('section-deedit', function (data) {
			var section = Object.keys(data)[0];
			delete service.edits[section];
		});

		// data object: [ sectionIds ]
		SocketService.on('section-reorder', function (data) {
			service.sectionOrder = data.sectionOrder;
		});

		SocketService.on('section-delete', function (data) {
			// remove the section id from the section order array
			service.sectionOrder.splice(service.sectionOrder.indexOf(data.section), 1);
			delete service.sections[data.section];
		});

		SocketService.on('section-add', function (data) {
			// over write our copy of the index and merge in the new sections
			service.sectionOrder = data.sectionOrder;
			_.merge(service.sections, data.sections);
		});

		SocketService.on('section-update', function (section) {
			// over write our copy of the section with the new section data
			_.merge(service.sections, section);
		});

		SocketService.on('err', function (err) {
			console.log('socket err', err);

			if (err.type == 'multiple-edit') {
				RealtimeEditorModalService.multipleEdit();
			} else {
				// Generic error modal
				ErrorModalService.error(null, {
					title: 'Editor error',
					body: err.message
				});
			}

			//////////////////////////////

			function blurAll() {
				// Focus the body element (so we are not focusing an editiable element)
				var tmp = document.createElement("input");
				document.body.appendChild(tmp);
				tmp.focus();
				document.body.removeChild(tmp);
			}
		});
	}
}).service('RealtimeEditorModalService', function ($mdDialog) {
	this.multipleEdit = function (event, data) {
		return $mdDialog.show({
			templateUrl: 'app/modules/realtime-editor/tpls/multiple-edit-modal.html',
			controller: function controller(data, $scope) {
				$scope.data = data;
				$scope.cancel = function () {
					$mdDialog.cancel();
				};
			},
			locals: { data: data },
			clickOutsideToClose: false,
			targetEvent: event
		});
	};
}).directive('realtimeEditorSaveStatus', function (RealtimeEditorService) {
	return {
		restrict: 'E',
		template: '<div>{{saveStatus.message}}</div>',
		link: function link(scope, element, attrs) {
			scope.saveStatus = RealtimeEditorService.saveStatus;
		}
	};
}).directive('realtimeEditor', function (RealtimeEditorService, $interval, $document, $timeout) {
	return {
		restrict: 'A',
		// [entity-id]
		// [entity-type]
		link: function link(scope, element, attrs) {
			var checkForEdits = 500; // Time in ms
			var saveIfChanged = 500; // Time in ms

			var entity = {
				id: attrs.entityId,
				type: attrs.entityType
			};
			RealtimeEditorService.subscribeToEdits(entity);
			scope.$on('$destroy', onDestroy);
			// Autosave function
			$interval(checkforChanges, checkForEdits);

			/////////////////////////////////////////

			var saveTimeout;
			function checkforChanges() {
				if (RealtimeEditorService.checkIfSectionChanged()) {
					if (!saveTimeout) {
						saveTimeout = $timeout(function () {
							RealtimeEditorService.saveSectionIfChanged();
							saveTimeout = null;
						}, saveIfChanged);
					}
				} else {
					// If no changes, cancel the save timeout
					$timeout.cancel(saveTimeout);
					saveTimeout = null;
				}
			}

			function onDestroy() {
				RealtimeEditorService.unsubscribeToEdits();
			}
		}
	};
}).directive('realtimeEditorSection', function (RealtimeEditorService, XxhashService, $document, $timeout) {
	// This directive is used on buttons and the main editor sections.
	// When these elements are clicked we will look for a parent with [editor-section-element] attr.
	// If found, we know we click something inside the section and we should lock edit.
	// If not found, we click outside the section
	return {
		restrict: 'A',
		link: function link(scope, element, attrs) {
			// If realtime editor enabled
			if (attrs.realtimeEditorSection == 'true') {
				// Find if the clicked element has a parent with [editor-section-element] attribute
				element.on('mousedown', function (event) {
					// This is mousedown because it covers the case when we highlight some text and then
					// mouseup outside the editable element.
					bindClick(event);
				});
				// We also bind to focus in/out. This covers for keyboard users and for element.focus() methods
				element.bind('focusin', focusin);
			}

			/////////////////////////////////////////////////////

			function bindClick(event) {
				var element = event.target;
				// If current element has [editor-section-element]
				if (angular.element(element)[0].hasAttribute('editor-section-element')) {
					var elementScope = angular.element(element).scope();
					var editorSectionId = elementScope.editorSectionId || elementScope.$parent.editorSectionId || elementScope.$parent.$parent.editorSectionId;
					RealtimeEditorService.startEditingSection(editorSectionId);
				} else {
					var editorSectionElement = angular.element(element).parents('[editor-section-element]')[0];
					if (editorSectionElement) {
						var elementScope = angular.element(editorSectionElement).scope();
						var editorSectionId = elementScope.editorSectionId || elementScope.$parent.editorSectionId || elementScope.$parent.$parent.editorSectionId;
						RealtimeEditorService.startEditingSection(editorSectionId);
					} else {
						RealtimeEditorService.finishEditingSection();
					}
				}
			}
			function focusin() {
				// If there is a sectionId (there wont be if the [realtime-editor-section] is on a md-menu for example (in these cases we rely on click binds above)
				if (scope.sectionId) {
					RealtimeEditorService.startEditingSection(scope.sectionId);
				}
			}
		}
	};
}).directive('realtimeEditorLocked', function () {
	return {
		restrict: 'E',
		scope: {
			section: '='
		},
		templateUrl: 'app/modules/realtime-editor/tpls/realtime-editor-locked.html',
		controller: function controller($scope, RealtimeEditorService) {
			$scope.RealtimeEditorService = RealtimeEditorService;
		}
	};
});
'use strict';

angular.module('modules.referrals', ['ngStorage']);
angular.module('modules.referrals').service('ReferralsService', function ($stateParams, $state, $location, $localStorage) {

	this.setRefCode = setRefCode; // function()
	this.getRefCode = getRefCode; // function()

	//////////////////////////////////////////////

	function setRefCode() {
		// Clear out some query params from $location;
		if ($stateParams.ref) {
			$state.current.reloadOnSearch = false;
			$location.search('ref', null);
			// Set to memory
			$localStorage.refCode = $stateParams.ref;
		}
	}
	function getRefCode() {
		return $localStorage.refCode;
	}
});
'use strict';

angular.module('modules.related', ['modules.tags', 'modules.feed' // Used for feed-item display
]);
angular.module('modules.related').directive('related', function (RelatedService) {
    return {
        restrict: 'E',
        scope: {
            parentType: '@',
            parentId: '@',
            type: '@?', // field || user || project || organisation || question || general || blog
            displayStyle: '@?' // feed || tags || list
        },
        replace: true,
        template: '<div ng-include="template"></div>',
        controller: function controller($scope, $timeout, $element) {
            // Set defaults and info --------------------------------------------------------
            $scope.type = $scope.type || 'field';
            var typeInfos = { // The keys match type inputs
                'field': { size: 10, title: 'Related Fields' },
                'user': { size: 4, title: 'Related People' },
                'organisation': { size: 10, title: 'Related Organisations' },
                'project': { size: 3, title: 'Similar Projects' },
                'blog': { size: 3, title: 'Similar Blogs' },
                'general': { size: 3, title: 'Similar Discussions' },
                'question': { size: 3, title: 'Similar Questions' }
            };
            $scope.typeInfo = typeInfos[$scope.type];

            // TEMP BUG FIX
            // This will change the projects title to 'Top Projects' for the hompeage sidebar
            if ($scope.displayStyle != 'feed' && $scope.type == 'project') {
                $scope.typeInfo.title = 'Top Projects';
            }

            // Set layout --------------------------------------------------------------------
            $scope.displayStyle = $scope.displayStyle || 'tags';
            var displayStyles = { // The keys match type inputs
                'feed': { template: 'app/modules/related/tpls/related-compact-feed.html' },
                'tags': { template: 'app/modules/related/tpls/related-tags.html' }
            };
            $scope.template = displayStyles[$scope.displayStyle].template;

            // Functions ---------------------------------------------------------------------
            // This will get related fields and organisations.
            var getRelated = function getRelated(page) {
                RelatedService.getRelated({
                    parentType: $scope.parentType,
                    parentId: $scope.parentId,
                    type: $scope.type,
                    page: page,
                    size: $scope.typeInfo.size
                }).then(function (related) {
                    if (related.length === 0) {
                        $scope.noMoreResults = true;
                    } // If there are results, set noMoreResults
                    if (page > 1) {
                        $scope.data = $scope.data.concat(related);
                    } // Push onto existing array
                    else {
                            $scope.data = related;
                        }
                    // If no results on first page, hide the element
                    if (related.length === 0 && page == 1) {
                        $element.addClass('hide');
                    }
                });
            };
            // Get the first page on load
            getRelated(1);
            var page = 2; // Set page to 2, this is because we already have page 1.
            $scope.more = function () {
                getRelated(page);
                page++;
            };
        }
    };
}).directive('tagged', function () {
    return {
        restrict: 'E',
        scope: {
            tags: '=?',
            type: '@?' },
        replace: true,
        templateUrl: 'app/modules/related/tpls/related-tags.html',
        controller: function controller($scope, $timeout, Authentication) {
            // Set default
            $scope.type = $scope.type || 'field';

            var typeInfos = { // The keys match type inputs
                'field': { title: 'Tagged Fields' },
                'organisation': { title: 'Tagged Organisations' },
                'project': { title: 'Tagged Projects' }
            };
            $scope.typeInfo = typeInfos[$scope.type];

            // Get the data
            var size = 6;
            var page = 1;
            var allData = $scope.tags;

            var getMore = function getMore() {
                var sliceSize = allData.length - size * page;
                if (sliceSize < 0) {
                    sliceSize = 0;
                }
                $scope.data = allData.slice(sliceSize).reverse();
                if (size * page > $scope.data.length) {
                    $scope.noMoreResults = true;
                }
                page++;
            };
            getMore();

            $scope.more = function () {
                getMore();
                $timeout(function () {
                    $scope.currentTab = 0;
                }, 500);
            };
        }
    };
}).service('RelatedService', function (Restangular) {

    /***************************************** /
     parentType : the type of the parent to get related things for
     parentId : the id of the parent to get related things for
     page : The page number to request
     size : The number of results per page
     sort : The field to sort the results by (defaults to views)
     type : The entity to get related for e.g. organisation, field
    / *****************************************/
    this.getRelated = function (options) {
        return Restangular.one(options.parentType + 's', options.parentId).all('related').getList(options);
    };
});
'use strict';

angular.module('modules.request-ownership', []);
angular.module('modules.request-ownership').directive('clickRequestOwnership', function ($http, $mdToast, Authentication) {
    return {
        restrict: 'A',
        scope: {
            parentType: '@',
            parentId: '@'
        },
        link: function link(scope, element, attrs) {
            scope.message = 'Account: ' + JSON.stringify(Authentication.currentUser.accounts);
            element.bind('click', function (event) {
                $http({
                    url: '/api/v1/request-ownership',
                    method: "GET",
                    params: {
                        parentType: scope.parentType,
                        parentId: scope.parentId,
                        message: scope.message
                    }
                }).success(function (result) {
                    element.css({
                        'opacity': '0.5',
                        'pointer-events': 'none',
                        'display': 'inline-block'
                    });
                    $mdToast.show($mdToast.simple().content('Review pending... We\'ll email you if we require more info'));
                }).catch(function () {
                    $mdToast.show($mdToast.simple().theme('warn').content('Something went wrong. Please email requests@stemn.com'));
                });
            });
        }
    };
});
'use strict';

angular.module('modules.restangular', ['restangular', 'modules.authentication']);
angular.module('modules.restangular').run(function (Restangular, $mdToast, Authentication) {
    Restangular.setErrorInterceptor(function (response, deferred, responseHandler) {
        if (response.status === 401) {
            if (response.config.url === '/api/v1/notifications') {
                // TODO: investigate further
                // log the user out if they can't get their notification rather than prompting them
                // that they can't. i'm guessing this is happening because they have logged out, but
                // another tab is open where the state of the app hasn't changed, but localstorage has
                Authentication.currentUser.logout();
            } else {
                $mdToast.show($mdToast.simple().theme('warn').content(response.data.error || 'You\'re not authorized to do that!'));
            }
            $mdToast.show($mdToast.simple().theme('warn').content(response.data.error || 'You\'re not authorized to do that!'));
        } else if (response.status === 404) {
            $mdToast.show($mdToast.simple().theme('warn').content(response.data.error || 'Couldn\'t find that, sorry.'));
        } else if (response.status === 480) {
            // custom stemn error code
            $mdToast.show($mdToast.simple().theme('warn').content('Can\'t do that ' + response.data.error));
        } else if (response.status === 422) {
            $mdToast.show($mdToast.simple().theme('warn').content('Oops... ' + response.data.error));
        } else {
            return false;
        }
    });
}).config(function (RestangularProvider) {
    RestangularProvider.setBaseUrl('/api/v1');
    RestangularProvider.setRestangularFields({
        id: '_id'
    });

    // transform textual response of 'true' to boolean true and textual 'false' to boolean false for http responses
    RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
        if (data === 'false') {
            data = false;
        } else if (data === 'true') {
            data = true;
        } else if (data === 'null') {
            data = null;
        }
        return data;
    });
});
'use strict';

angular.module('modules.row-views', []);
angular.module('modules.row-views').directive('userRow', function () {
    return {
        restrict: 'E',
        scope: {
            itemId: '@?',
            data: '=?',
            showEdit: '=?',
            deleteFn: '&?'
        },
        controller: function controller($scope, UserService) {
            if ($scope.itemId) {
                $scope.loading = true;
                UserService.getUser($scope.itemId, 'sm').then(function (result) {
                    $scope.data = result;
                    $scope.loading = false;
                });
            }
        },
        templateUrl: 'app/modules/row-views/tpls/user-row.html'
    };
}).directive('fieldRow', function () {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        templateUrl: 'app/modules/row-views/tpls/field-row.html'
    };
}).directive('organisationRow', function () {
    return {
        restrict: 'E',
        scope: {
            data: '=',
            showEdit: '=?',
            showRole: '=?',
            deleteFn: '&?'
        },
        templateUrl: 'app/modules/row-views/tpls/organisation-row.html'
    };
}).directive('rowView', function () {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        templateUrl: 'app/modules/row-views/tpls/row-view.html',
        controller: function controller($scope, EntityService, CoreLibrary) {
            $scope.data = angular.copy($scope.data); // Clone the data so $scope.data.loading is not saved in the parent scope
            // Set avatar Type
            setAvatarType();

            // If no name, blurb and not already loading, get the entity
            if (!$scope.data.name && !$scope.data.blurb && !$scope.data.loading) {
                $scope.data.loading = true;

                EntityService.get($scope.data.entityType, $scope.data._id, 'sm').then(function (response) {
                    $scope.data = response;
                    $scope.data.loading = false;
                    setHref();
                });
            } else {
                setHref();
            }

            /////////////////////////////////////////

            function setHref() {
                $scope.data.href = CoreLibrary.getHref($scope.data.type || $scope.data.entityType, $scope.data.stub || $scope.data._id);
            }

            function setAvatarType() {
                if ($scope.data.entityType == 'user') {
                    $scope.avatarType = 'avatar-circle';
                } else if ($scope.data.entityType == 'organisation' || $scope.data.entityType == 'job') {
                    $scope.avatarType = 'avatar-square-contain';
                } else {
                    $scope.avatarType = 'avatar-square-cover';
                }
            }
        }
    };
}).directive('loadingRow', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/modules/row-views/tpls/loading-row.html'
    };
});
'use strict';

angular.module('modules.schema', []);

angular.module('modules.schema').directive('schemaJsonLd', function ($http) {
    return {
        restrict: 'E',
        replace: true,
        template: '<script type="application/ld+json"></script>',
        link: function link(scope, element, attrs) {
            var jsonLd = {
                //			  "@context": "http://schema.org",
                //			  "@type": "NewsArticle",
                //			  "headline": "Article headline",
                //			  "alternativeHeadline": "The headline of the Article",
                //			  "image": [
                //				"thumbnail1.jpg",
                //				"thumbnail2.jpg"
                //			  ],
                //			  "datePublished": "2015-02-05T08:00:00+08:00",
                //			  "description": "A most wonderful article",
                "articleBody": "The full body of the article"
            };
            element[0].innerHTML = JSON.stringify(jsonLd);
        }
    };
});
'use strict';

angular.module('modules.scroll-highlight', []);
angular.module('modules.scroll-highlight').run(function ($rootScope, $location, $timeout, HighlightElement, $document, $stateParams) {
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        // Scroll to anchor hash
        // TODO - This scroll has a timeout which is a race condition with DOM load

        // SlowScroll State Param will force anchor to be slow
        var speed, timeout;

        // If no preview state, timeout is long, otherwise, short
        if ($stateParams.slowscroll) {
            speed = 5000;
        } else {
            speed = 500;
        }
        timeout = !fromState.name ? 3000 : 100;
        if ($location.hash()) {
            $timeout(function () {
                HighlightElement.scrollHighlightElement($location.hash(), { speed: speed, background: true });
            }, timeout);
        }
    });
}).directive('scrollHighlight', function (HighlightElement) {
    // takes in attr 'scrollHighlight' and scrolls to the element with that id
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            element.bind('click', function (event) {
                var element = HighlightElement.scrollHighlightElement(attrs.scrollHighlight, { background: true });
            });
        }
    };
}).service('HighlightElement', function ($timeout, $document, $stateParams) {
    // These functions highlight elements - typically used with Anchor links
    this.outline = outline;
    this.background = background;
    this.scrollHighlightElement = scrollHighlightElement;

    var self = this;

    /////////////////////////////////////////

    function scrollHighlightElement(elementId, options) {
        /**************************
        options: {
            speed: the scroll speed
            background: true || false (defaults to bg+outline)
            offset: offset height (dont include px)
        }
        **************************/
        // defaults
        options = options || {};
        options.speed = options.speed || 500;
        options.offset = options.offset || 64;

        var anchorElement = angular.element(document.getElementById(elementId));
        if (anchorElement[0]) {
            $document.scrollToElement(anchorElement, options.offset, options.speed).then(function () {
                if ($stateParams.slowscroll) {
                    $document.scrollTopAnimated(0, options.speed / 3);
                } else if (options.background) {
                    self.background(anchorElement);
                } else {
                    self.outline(anchorElement);
                }
            });
            return anchorElement;
        }
    }

    function outline(highlightElement) {
        // Outlines the element with yellow and then fades it out
        $timeout(function () {
            highlightElement.css({ outline: '10px solid rgba(255, 255, 214, 0)' });
        }, 0);
        $timeout(function () {
            highlightElement.css({ transition: 'all 0.5s linear' });
        }, 100);
        $timeout(function () {
            highlightElement.css({ outline: '10px solid rgba(255, 255, 214, 1)' });
        }, 500);
        $timeout(function () {
            highlightElement.css({ background: 'rgb(255, 255, 214)' });
        }, 500);
        $timeout(function () {
            highlightElement.css({ background: '' });
        }, 2000);
        $timeout(function () {
            highlightElement.css({ outline: '10px solid rgba(255, 255, 214, 0)' });
        }, 2000);
        $timeout(function () {
            highlightElement.css({ outline: '' });
        }, 3000);
        $timeout(function () {
            highlightElement.css({ transition: '' });
        }, 3000);
    }
    function background(highlightElement) {
        // Outlines the element with yellow and then fades it out
        $timeout(function () {
            highlightElement.css({ transition: 'all 0.5s linear' });
        }, 0);
        $timeout(function () {
            highlightElement.css({ background: 'rgb(255, 255, 214)' });
        }, 400);
        $timeout(function () {
            highlightElement.css({ background: '' });
        }, 2000);
        $timeout(function () {
            highlightElement.css({ transition: '' });
        }, 3000);
    }
});
'use strict';

angular.module('modules.scroll', ['duScroll']);
angular.module('modules.scroll').value('duScrollOffset', 0).value('duScrollGreedy', true).run(function ($rootScope, $document) {
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        // Split the state.name to find substates, for example: app.user.projects
        var toStates = toState.name.split(".");
        var fromStates = fromState.name.split(".");
        // Page specific rules:
        if (toStates[1] === 'search' && fromStates[1] === 'search') {
            // Do nothing
        } else {
            $document.scrollTopAnimated(0, 100);
        }
    });
}).directive('smoothScrollToc', function ($document) {

    return {
        link: function link($scope, $element, $attr) {
            $element.on('click', function (e) {
                if ((!$attr.href || $attr.href.indexOf('#') === -1) && $attr.smoothScrollToc === '') return;
                var id = $attr.href ? $attr.href.replace(/.*(?=#[^\s]+$)/, '').substring(1) : $attr.smoothScrollToc;
                var target = document.getElementById(id) || document.getElementsByName(id)[0];
                if (!target || !target.getBoundingClientRect) return;

                var offset = $element[0].getBoundingClientRect().top;
                $document.scrollToElement(target, offset, 500);

                if (e.stopPropagation) e.stopPropagation();
                if (e.preventDefault) e.preventDefault();
            });
        }
    };
}).directive('fixTopOrBottom', function ($window) {
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            var windowEl = angular.element($window);
            var checkIfFix = function checkIfFix() {
                if (element[0].offsetHeight <= $window.innerHeight) {
                    // If the sidebar height is less than window height
                    // The sidebar is fixed at the top
                    element.css({
                        position: 'fixed',
                        top: '0px',
                        bottom: ''
                    });
                } else if ($window.innerHeight + windowEl.scrollTop() >= element[0].offsetHeight) {
                    // If the sidebar is greater than the window and we have scrolled past the bottom
                    // We must fix sidebar at bottom
                    element.css({
                        position: 'fixed',
                        top: '',
                        bottom: '0px'
                    });
                } else {
                    // Else we are somwhere in between, sidebar scrolls with absolute
                    element.css({
                        position: 'absolute',
                        top: '0px',
                        bottom: ''
                    });
                }
            };
            windowEl.on('scroll', scope.$apply.bind(scope, checkIfFix));
            checkIfFix();
        }
    };
}).directive('scrollDown', function ($window) {
    return {
        restrict: 'E',
        replace: true,
        template: '<a class="scroll-down"><md-icon md-svg-icon="expand-more"></md-icon></a>',
        link: function link(scope, element, attrs) {
            var $body = angular.element(document.body);
            var windowEl = angular.element($window);

            windowEl.on('scroll', onScroll);
            scope.$on('$destroy', onDestroy);
            onScroll();

            //////////////////////////////////////////////////

            function onScroll() {
                if (windowEl.scrollTop() === 0) {
                    $body.removeClass('scrolled-past-top');
                } else {
                    $body.addClass('scrolled-past-top');
                }
            }

            function onDestroy() {
                windowEl.off('scroll', onScroll);
            }
        }
    };
});
'use strict';

angular.module('modules.search.organisation', []);
angular.module('modules.search.organisation').directive('organisationSearch', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '=', // The data array, will default to []
            single: '=?', // true || false - This will overwrite the first entry in the array
            noArray: '=?', // true || false - This will make it an object not array of objects
            placeholder: '@?',
            searchText: '=?',
            focus: '=?', // true || false - Autofocus
            organisationType: '@?' },
        templateUrl: 'app/modules/search/organisation-search/tpls/organisation-search.html',
        controller: function controller($scope, $http, OrganisationModalService) {
            // Default data
            $scope.data = $scope.data || [];

            // Set the typeahead text
            if ($scope.noArray && $scope.data && $scope.data.name) {
                $scope.searchText = $scope.data.name;
            } else if ($scope.single && $scope.data[0] && $scope.data[0].name) {
                $scope.searchText = $scope.data[0].name;
            }

            $scope.search = function (name) {
                return $http({
                    url: '/api/v1/search',
                    params: {
                        type: 'organisation',
                        key: 'name',
                        value: name,
                        match: 'regex'
                    }
                }).then(function (response) {
                    // remove any organisations that are
                    // already added from the response
                    var result = response.data.filter(function (organisation) {
                        return !_.any($scope.existing, {
                            _id: organisation._id
                        });
                    });
                    result.push({
                        addNew: true,
                        name: (result.length === 0 ? 'Organisation not found. Create ' : 'None of these? Create ') + name,
                        searchText: name
                    });
                    return result;
                });
            };

            // Process Result
            $scope.processResult = function (result) {
                if (result) {
                    if (result.addNew) {
                        $scope.create(null, result.searchText);
                        $scope.searchText = '';
                    } else {
                        if ($scope.noArray) {
                            $scope.data = result;
                        } else if ($scope.single) {
                            $scope.data[0] = result;
                            $scope.searchText = result.name;
                        } else {
                            $scope.data.push(result);
                            // Remove non-uniques
                            $scope.data = _.uniq($scope.data, '_id');
                            // clear the typeahead text on selection
                            $scope.searchText = '';
                        }
                    }
                }
            };

            // Create organisationNewModal
            $scope.create = function (event, name) {
                var data = {
                    name: name,
                    organisationType: $scope.organisationType
                };
                OrganisationModalService.organisationNewModal(event, data).then(function (result) {
                    $scope.processResult(result);
                });
            };
        }
    };
});
'use strict';

angular.module('modules.search', ['modules.restangular', 'modules.fields', 'modules.organisations', 'modules.users', 'modules.search.organisation']);
angular.module('modules.search').directive('locationSearch', function ($http) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '=', // The data array, will default to []
            placeholder: '@?',
            single: '=?', // true || false - This will overwrite the first entry in the array
            focus: '=?' // true || false - Autofocus
        },
        templateUrl: 'app/modules/search/tpls/location-search.html',
        controller: function controller($scope, LocationService) {

            // Default data
            $scope.data = $scope.data || [];

            // Set the typeahead text
            if ($scope.single && $scope.data[0]) {
                $scope.searchText = $scope.data[0].name;
            }

            // Get location from Google GeoCode API
            $scope.getLocation = function (val) {
                return LocationService.geoCode(val);
            };

            // Process Result
            $scope.processResult = function (result) {
                if (result) {
                    if ($scope.single) {
                        $scope.data[0] = result;
                    } else {
                        $scope.data.push(result);
                        // Remove non-uniques
                        $scope.data = _.uniq($scope.data, 'name');
                        // clear the typeahead text on selection
                        $scope.searchText = '';
                    }
                }
            };
        }
    };
}).directive('userSearch', function ($http) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '=', // The data array, will default to []
            single: '=?', // true || false - This will overwrite the first entry in the array
            placeholder: '@',
            parent: '=?', // project object
            group: '@?', // string - user group
            focus: '=?', // true || false - Autofocus
            preProcessFn: '=?'
        },
        templateUrl: 'app/modules/search/tpls/user-search.html',
        controller: function controller($scope, SearchService, UsersModalService, $mdToast) {
            // Default data
            $scope.data = $scope.data || [];
            // Set the typeahead text
            if ($scope.single && $scope.data[0] && $scope.data[0].name) {
                $scope.searchText = $scope.data[0].name;
            }

            //Search
            $scope.search = function (name) {
                return SearchService.search({ type: 'user', key: 'name', value: name }).then(function (response) {
                    // remove any fields that are already added from the response
                    var result = response.data.filter(function (field) {
                        return !_.any($scope.data, {
                            _id: field._id
                        });
                    });
                    result.push({
                        addNew: true,
                        name: (result.length === 0 ? 'User not found. Invite ' : 'None of these? Invite ') + name,
                        searchText: name
                    });
                    return result;
                });
            };

            // Process Result -----------------------------------------------------------------
            var debounce = false;
            $scope.processResult = function (result) {

                if (result && $scope.preProcessFn) {
                    result = $scope.preProcessFn(result);
                }

                if (debounce === false) {
                    // If we are adding a new item
                    if (result && result.addNew) {
                        $scope.create(null, result.searchText);
                        $scope.searchText = '';
                    } else {
                        if ($scope.single) {
                            $scope.data[0] = result;
                        } else {
                            // Check to see if it already exists on the list
                            if (_.find($scope.data, '_id', result._id)) {
                                $mdToast.show($mdToast.simple().theme('warn').content('Can\'t do that. ' + result.profile.firstname + ' has already been added'));
                            }
                            // Else, push it onto the list
                            else {
                                    $scope.data.push(result);
                                }

                            // Remove non-uniques
                            $scope.data = _.uniq($scope.data, '_id');
                            // clear the typeahead text on selection
                            $scope.searchText = '';
                            debounce = true; // Debounce because we just changed searchText
                        }
                    }
                } else {
                    // Debounce must have been true, so we set it to false
                    debounce = false;
                }
            };

            // Inivite by email
            $scope.create = function (event, name) {
                var data = {
                    name: name,
                    parentType: $scope.parent.type,
                    parentId: $scope.parent._id,
                    group: $scope.group
                };
                UsersModalService.usersNew(event, data).then(function (result) {
                    $scope.searchText = '';
                });
            };
        }
    };
}).directive('projectSearch', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '=', // The data array, will default to []
            single: '=?', // true || false - This will overwrite the first entry in the array
            placeholder: '@?',
            focus: '=?' // true || false - Autofocus
        },
        templateUrl: 'app/modules/search/tpls/project-search.html',
        controller: function controller($scope, SearchService) {

            // Default data
            $scope.data = $scope.data || [];

            // Set the typeahead text
            if ($scope.single && $scope.data[0]) {
                $scope.searchText = $scope.data[0].name;
            }

            // Search for fields
            $scope.search = function (val) {
                return SearchService.search({
                    type: 'project',
                    key: 'name',
                    value: val
                }).then(function (response) {
                    // remove any projects that are already added from the response
                    var result = response.data.filter(function (field) {
                        return !_.any($scope.data, {
                            _id: field._id
                        });
                    });
                    return result;
                });
            };

            // Process Result
            $scope.processResult = function (result) {
                if (result) {
                    if ($scope.single) {
                        $scope.data[0] = result;
                    } else {
                        $scope.data.push(result);
                        // Remove non-uniques
                        $scope.data = _.uniq($scope.data, '_id');
                        // clear the typeahead text on selection
                        $scope.searchText = '';
                    }
                }
            };
        }
    };
}).directive('fieldSearch', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '=', // The data array, will default to []
            single: '=?', // true || false - This will overwrite the first entry in the array
            placeholder: '@?',
            focus: '=?' // true || false - Autofocus
        },
        templateUrl: 'app/modules/search/tpls/field-search.html',
        controller: function controller($scope, SearchService, FieldModalService) {

            // Default data
            $scope.data = $scope.data || [];

            // Set the typeahead text
            if ($scope.single && $scope.data[0]) {
                $scope.searchText = $scope.data[0].name;
            }

            // Search for fields
            $scope.search = function (name) {
                return SearchService.search({
                    type: 'field',
                    key: 'name',
                    value: name,
                    match: 'regex',
                    sort: 'numProjects'
                }).then(function (response) {
                    // remove any fields that are already added from the response
                    var result = response.data.filter(function (field) {
                        return !_.any($scope.data, {
                            _id: field._id
                        });
                    });
                    result.push({
                        addNew: true,
                        name: (result.length === 0 ? 'Field not found. Create ' : 'None of these? Create ') + name,
                        searchText: name
                    });
                    return result;
                });
            };

            // Process Result
            $scope.processResult = function (result) {
                if (result) {
                    if (result.addNew) {
                        $scope.create(null, result.searchText);
                        $scope.searchText = '';
                    } else {
                        if ($scope.single) {
                            $scope.data[0] = result;
                        } else {
                            $scope.data.push(result);
                            // Remove non-uniques
                            $scope.data = _.uniq($scope.data, '_id');
                            // clear the typeahead text on selection
                            $scope.searchText = '';
                        }
                    }
                }
            };

            // Create
            $scope.create = function (event, name) {
                var data = {
                    name: name
                };
                FieldModalService.fieldNewModal(event, data).then(function (result) {
                    console.log(result);
                    $scope.processResult(result);
                });
            };
        }
    };
}).

/***************************************** /

  Data object properties
  type  : the entity type to search by
  key   : the property of the entity to seach by
  value : the value of the key to match
  match : regex or exact
  sort  : the entity property by which to sort

  location  : {
    northeast : {
            latitude: '',
            longitude: ''
        },
    southwest: {
        latitude: '',
        longitude: ''
    }
    };
    the bounds object

  populate  : true || false - if false will send back IDs
  published : true || false || 'both' - defaults to true
/ *****************************************/

service('SearchService', function ($http) {
    this.search = function (data) {
        return $http({
            url: '/api/v1/search',
            method: "GET",
            params: {
                type: data.type,
                'types[]': data.types,
                key: data.key,
                value: data.value,
                match: data.match || 'regex',
                order: data.order,
                sort: data.sort,
                size: data.size,
                page: data.page,
                'select[]': data.select,
                location: data.location,
                populate: data.populate,
                published: data.published,
                parentType: data.parentType,
                parentId: data.parentId
            }
        });
    };
});
'use strict';

/*********************************************************
This module is used to set the page title and description


A SEO object is required in the $stateProvider config
for each view. If no object is found it will look at the
parent state to see if it has seo function.

NOTES:
Make sure that the seo object is defined on the root state
(this is usually app)

The index.html must have page.title and page.description
interpolations to set the seo params

EXAMPLE:
seo: function(resolve){
    return {
        title       : resolve.blog.name,
        description : resolve.blog.blurb
    }
}

*********************************************************/
angular.module('modules.seo', []);
angular.module('modules.seo').run(function ($rootScope, $state, CoreLibrary) {
    $rootScope.page = {};
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

        var resolve = $state.$current.locals.resolve.$$values;
        var toStateDetailed = toState.$$state();
        var seoFnTitle = CoreLibrary.checkStateParentsSeo(toStateDetailed, 'seo', 'title', resolve);
        var seoFnPic = CoreLibrary.checkStateParentsSeo(toStateDetailed, 'seo', 'picture', resolve);
        var seoFnDesc = CoreLibrary.checkStateParentsSeo(toStateDetailed, 'seo', 'description', resolve);

        var seoFn = {
            title: seoFnTitle,
            picture: seoFnPic,
            description: seoFnDesc
        };

        setPageSeo(seoFn);

        ////////////////////////////////////////////

        function setPageSeo(seo) {
            $rootScope.page.title = seo.title;
            $rootScope.page.description = seo.description;
            $rootScope.page.picture = seo.picture;
        }
    });
});
'use strict';

angular.module('modules.settings', []);
angular.module('modules.settings').service('SettingsService', function (Restangular, $q) {
    var settings;

    this.getSettings = function () {
        // we don't always hit the server and do an async lookup, so wrap the settings return logic in a when
        var self = this;
        var deferred = $q.defer();

        if (!settings) {
            settings = deferred.promise;
            Restangular.one('settings').get().then(function (userSettings) {
                settings = userSettings;

                // we need to apply the default settings here. the back end doesn't send down
                // any empty objects to save data, so remake those empty objects here
                settings.tips = settings.tips || {};
                settings.messages = settings.messages || {};
                settings.feed = settings.feed || {};
                settings.notifications = settings.notifications || {};
                settings.emails = settings.emails || {};

                deferred.resolve(settings);
            });
        } else {
            deferred.resolve(settings);
        }

        return deferred.promise;
    };

    this.updatePassword = function (oldPassword, newPassword, resetToken) {
        return Restangular.one('settings').all('password').post({
            oldPassword: oldPassword,
            newPassword: newPassword,
            resetToken: resetToken
        }).then(function (response) {
            return response;
        });
    };

    this.updateEmail = function (email) {
        return Restangular.one('settings').all('email').post({
            email: email
        }).then(function (response) {
            return response;
        });
    };

    this.saveSettings = function () {
        return settings.save();
    };

    this.reset = function () {
        settings = undefined;
    };

    // Data ------------------------------------------------------------------------------------
    this.toggleData = {
        'added-project': {
            name: 'Project invites',
            description: 'When someone adds you to a project.'
        },
        'added-organisation': {
            name: 'Organisation invites',
            description: 'When someone adds you to an organisation.'
        },
        'invite-accepted': {
            name: 'Project accept',
            description: 'When someone accepts your invite to a project.'
        },
        'followed-user-project': {
            name: 'Followed user projects',
            description: 'When someone you follow adds a new project.'
        },
        'followed-user-blog': {
            name: 'Followed user blogs',
            description: 'When someone you follow posts a blog.'
        },
        'followed-user-general': {
            name: 'Followed user discussions',
            description: 'When someone you follow starts a discussion.'
        },
        'followed-user-question': {
            name: 'Followed user questions',
            description: 'When someone you follow asks a question.'
        },
        'followed-project-blog': {
            name: 'Followed project blogs',
            description: 'When a blog is posted on a project you follow.'
        },
        'followed-project-general': {
            name: 'Followed project discussions',
            description: 'When a discussion is posted on a project you follow.'
        },
        'followed-project-question': {
            name: 'Followed project questions',
            description: 'When a question is asked on a project you follow.'
        },
        'followed-field-project': {
            name: 'Followed field projects',
            description: 'When a project is posted to a field you follow.'
        },
        'followed-field-blog': {
            name: 'Followed field blogs',
            description: 'When a blog is posted to a field you follow.'
        },
        'followed-field-general': {
            name: 'Followed field discussions',
            description: 'When a discussion is posted to a field you follow.'
        },
        'followed-field-question': {
            name: 'Followed field questions',
            description: 'When a question is asked on a field you follow.'
        },
        'followed-organisation-project': {
            name: 'Followed organisation projects',
            description: 'When a project is posted to an organisation you follow.'
        },
        'followed-organisation-blog': {
            name: 'Followed organisation blogs',
            description: 'When a blog is posted to an organisation you follow.'
        },
        'followed-organisation-general': {
            name: 'Followed organisation discussions',
            description: 'When a discussion is posted to an organisation you follow.'
        },
        'followed-organisation-question': {
            name: 'Followed Organisation question',
            description: 'When a question is asked an organisation you follow.'
        },
        'followed-own-user': {
            name: 'New follower',
            description: 'When someone follows you.'
        },
        'followed-own-project': {
            name: 'New project follower',
            description: 'When someone follows your project.'
        },
        'followed-own-question': {
            name: 'New question follower',
            description: 'When someone follows your question.'
        },
        'followed-own-blog': {
            name: 'New blog follower',
            description: 'When someone follows your blog.'
        },
        'followed-own-general': {
            name: 'New discussion follower',
            description: 'When someone follows your discussion.'
        },
        'followed-question-post': {
            name: 'Followed question answers',
            description: 'When someone answers a question you follow.'
        },
        'followed-blog-post': {
            name: 'Followed blog replies',
            description: 'When someone posts in a blog you follow.'
        },
        'followed-general-post': {
            name: 'Followed discussion replies',
            description: 'When someone posts in a discussion you follow.'
        },
        'followed-project-comment': { // TO BE UPDATED TO POSTS
            name: 'Followed project replies',
            description: 'When someone posts in a project you follow.'
        },
        'own-question-post': {
            name: 'Question replies',
            description: 'When someone answers your question.'
        },
        'own-blog-post': {
            name: 'Blog replies',
            description: 'When someone posts in your blog.'
        },
        'own-general-post': {
            name: 'Discussion replies',
            description: 'When someone posts in your discussion.'
        },
        'own-question-like': {
            name: 'Question likes',
            description: 'When someone likes your question.'
        },
        'own-blog-like': {
            name: 'Blog likes',
            description: 'When someone likes your blog.'
        },
        'own-general-like': {
            name: 'Discussion likes',
            description: 'When someone likes your discussion.'
        },
        'own-post-like': {
            name: 'Post likes',
            description: 'When someone likes your post.'
        },
        'own-post-post': {
            name: 'Post replies',
            description: 'When someone replies to your post.'
        },
        'own-project-comment': { // TO BE UPDATED TO POSTS
            name: 'Project comments',
            description: 'When someone posts in your project.'
        },
        'digest': {
            name: 'Weekly Digests',
            description: "Just once a week, you'll get a community-curated list of the best space projects."
        },
        'jobs': {
            name: 'Weekly Jobs Digests',
            description: "Just once a week, you'll get a personalised list of the latest space jobs based on the fields you follow."
        },
        'product': {
            name: 'Product Updates',
            description: "We're proud of every new feature we add to STEMN, and when a new feature is ready for you, we want you to be the first to know."
        },
        'own-user-mention': {
            name: 'Direct mentions',
            description: 'When someone mentions you.'
        },
        'own-project-mention': {
            name: 'Project mentions',
            description: 'When someone mentions your project.'
        },
        'own-organisation-mention': {
            name: 'Organisation mentions',
            description: 'When someone mentions your organisation.'
        },
        'own-thread-mention': {
            name: 'Blog, question, and discussion mentions',
            description: 'When someone mentions your blog, question, or discussion.'
        }
    };

    this.notificationToggles = [{
        name: 'Invites',
        title: 'Invites',
        description: 'When you are invited to projects.',
        toggles: ['added-project', 'added-organisation']
    }, {
        name: 'FollowedUserProjectCreation',
        title: 'People and Projects you follow',
        description: 'When something is posted by someone or a project you follow.',
        toggles: ['followed-user-project', 'followed-user-blog', 'followed-user-general', 'followed-user-question', 'followed-project-blog', 'followed-project-general', 'followed-project-question']
    }, {
        name: 'FollowedFieldOrgCreation',
        title: 'Fields and Organisations you follow',
        description: 'When something is posted to a field or organisation you follow.',
        toggles: ['followed-field-project', 'followed-field-blog', 'followed-field-general', 'followed-field-question', 'followed-organisation-project', 'followed-organisation-blog', 'followed-organisation-general', 'followed-organisation-question']
    }, {
        name: 'FollowedCreationPost',
        title: 'Blogs, Questions and Discussion you follow',
        description: 'When someone posts on project, blog or thread you follow.',
        toggles: ['followed-question-post', 'followed-blog-post', 'followed-general-post', 'followed-project-comment']
    }, {
        name: 'FollowedLikeOwnCreation',
        title: 'Likes and Follows on your creations',
        description: 'When others like or follow you or your creations.',
        toggles: ['followed-own-user', 'followed-own-project', 'followed-own-blog', 'followed-own-general', 'followed-own-question', 'own-question-like', 'own-blog-like', 'own-general-like', 'own-post-like']
    }, {
        name: 'OwnCreationsPost',
        title: 'Posts on your creations',
        description: 'When others reply to you or post on your creations.',
        toggles: ['own-question-post', 'own-blog-post', 'own-general-post', 'own-project-comment', 'own-post-post']
    }, {
        name: 'Mentions',
        title: 'Mentions',
        description: 'When others mention you or your creations.',
        toggles: ['own-user-mention', 'own-project-mention', 'own-organisation-mention', 'own-thread-mention']
    }];

    this.emailsToggles = [
    // The name field is used to create anchor links
    // for example: stemn.com/settings/email#Invites will highlight the invite toggle
    {
        name: 'News',
        title: 'STEMN News',
        description: "Friendly emails including community-curated list of the best space projects, the latest STEMN features, and occasional VIP treatment (exclusive previews, invitations to events etc.)",
        toggles: ['digest', 'jobs', 'product']
    }, {
        name: 'Invites',
        title: 'Invites',
        description: 'When you are invited to projects.',
        toggles: ['added-project', 'added-organisation']
    }, {
        name: 'FollowedOwnCreation',
        title: 'Follows on your creations',
        description: 'When others follow you or your creations.',
        toggles: ['followed-own-user', 'followed-own-project', 'followed-own-question', 'followed-own-blog', 'followed-own-general']
    }, {
        name: 'FollowedUserProjectCreation',
        title: 'People and Projects you follow',
        description: 'When something is posted by someone or a project you follow.',
        toggles: ['followed-user-project', 'followed-user-blog', 'followed-user-general', 'followed-user-question', 'followed-project-blog', 'followed-project-general', 'followed-project-question']
    }, {
        name: 'FollowedFieldOrgCreation',
        title: 'Fields and Organisations you follow',
        description: 'When something is posted to a field or organisation you follow.',
        toggles: ['followed-field-project', 'followed-field-blog', 'followed-field-general', 'followed-field-question', 'followed-organisation-project', 'followed-organisation-blog', 'followed-organisation-general', 'followed-organisation-question']
    }, {
        name: 'FollowedCreationPost',
        title: 'Blogs, Questions and discussion you follow',
        description: 'When someone posts on blog or thread you follow.',
        toggles: ['followed-question-post', 'followed-blog-post', 'followed-general-post', 'followed-project-comment']
    }, {
        name: 'OwnCreationsPost',
        title: 'Posts on your creations',
        description: 'When others reply to you or post on your creations.',
        toggles: ['own-question-post', 'own-blog-post', 'own-general-post', 'own-project-comment', 'own-post-post']
    }, {
        name: 'Mentions',
        title: 'Mentions',
        description: 'When others mention you or your creations.',
        toggles: ['own-user-mention', 'own-project-mention', 'own-organisation-mention', 'own-thread-mention']
    }];

    this.feedToggles = [{
        name: 'FollowedUserProjectCreation',
        title: 'People and projects you follow.',
        description: 'When something is posted by someone or a project you follow.',
        toggles: ['followed-user-project', 'followed-user-blog', 'followed-user-general', 'followed-user-question', 'followed-project-blog', 'followed-project-general', 'followed-project-question']
    }, {
        name: 'FollowedFieldOrgCreation',
        title: 'Fields and Organisations you follow',
        description: 'When something is posted to a field or organisation you follow.',
        toggles: ['followed-field-project', 'followed-field-blog', 'followed-field-general', 'followed-organisation-project', 'followed-field-question', 'followed-organisation-blog', 'followed-organisation-general', 'followed-organisation-question']
    }, {
        name: 'FollowedCreationPost',
        title: 'Blogs, Questions and Discussion you follow',
        description: 'When someone posts on a blog or thread you follow.',
        toggles: ['followed-question-post', 'followed-blog-post', 'followed-general-post']
    }, {
        name: 'FollowedLikeOwnCreation',
        title: 'Likes on your creations',
        description: 'When others like you or your creations.',
        toggles: ['own-question-like', 'own-blog-like', 'own-general-like', 'own-post-like']
    }, {
        name: 'OwnCreationsPost',
        title: 'Posts on your creations',
        description: 'When others reply to you or post on your creations.',
        toggles: ['own-question-post', 'own-blog-post', 'own-general-post', 'own-project-comment', 'own-post-post']
    }];
});
'use strict';

angular.module('modules.site-search', ['modules.search']);
angular.module('modules.site-search').directive('siteSearch', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/site-search/tpls/site-search.html',
        scope: {},
        controller: function controller($scope, $timeout, $state, $document, $element, CoreLibrary, SearchService) {
            var debounceTimeout;
            var debounceTimeoutTime = 300;

            $scope.results = {};
            $scope.hidePanel = hidePanel;
            $scope.goToResult = goToResult;
            //            $scope.goToResults = goToResults;

            // Bind click on touch of element
            $scope.$watch('search', processSearch);

            $scope.$watch('results', processResults, true);
            $scope.$watch('showResults', processResults, true);
            $scope.$on('$destroy', onDestroy);

            ///////////////////////////

            function processSearch() {
                $timeout.cancel(debounceTimeout);
                if ($scope.search) {
                    debounceTimeout = $timeout(function () {
                        showPanel();
                        $scope.fullResults = [];
                        SearchService.search({
                            types: ['project', 'field', 'user', 'thread', 'organisation', 'job'],
                            key: 'name',
                            value: $scope.search,
                            size: 3,
                            page: 1,
                            populate: false,
                            select: ['name', 'picture', 'stub', 'type']
                        }).then(function (response) {
                            var results = CoreLibrary.groupByKey(response.data, 'entityType');
                            results.creations = results.creations || [];
                            results.thread = results.thread || [];
                            results.project = results.project || [];
                            if (results.project && results.project.length > 0) {
                                results.creations = results.project.concat(results.thread);
                            } else if (results.thread && results.thread.length > 0) {
                                results.creations = results.thread;
                            }
                            if (results.creations) {
                                results.creations = results.creations.splice(0, 3); // Take only first 3
                            }
                            _.forEach(results, function (values, key) {
                                $scope.results[key] = $scope.results[key] || [];
                                CoreLibrary.assignArray($scope.results[key], values, '_id');
                            });
                            if (response.data.length === 0) {
                                _.forEach($scope.results, function (resultType) {
                                    if (resultType) {
                                        CoreLibrary.assignArray(resultType, [], '_id');
                                    }
                                });
                            }
                        });
                    }, debounceTimeoutTime);
                } else {
                    hidePanel();
                }
            }

            function processResults() {
                $scope.fullResults = [];
                $scope.fullResults = $scope.fullResults.concat($scope.results.creations, $scope.results.user, $scope.results.organisation, $scope.results.field, $scope.results.job);
            }

            function goToResult(stub, type) {
                if (type === 'user') {
                    $state.go('app.user.profile', { stub: stub }, { inherit: false });
                } else if (type === 'project') {
                    $state.go('app.project.overview', { stub: stub }, { inherit: false });
                } else if (type === 'organisation') {
                    $state.go('app.organisation.overview', { stub: stub }, { inherit: false });
                } else if (type === 'field') {
                    $state.go('app.field.top', { stub: stub }, { inherit: false });
                } else if (type === 'blog') {
                    $state.go('app.thread', { stub: stub }, { inherit: false });
                } else if (type === 'general') {
                    $state.go('app.thread', { stub: stub }, { inherit: false });
                } else if (type === 'question') {
                    $state.go('app.thread', { stub: stub }, { inherit: false });
                } else if (type === 'job') {
                    $state.go('app.job', { stub: stub }, { inherit: false });
                }
                hidePanel();
            }

            function hidePanel() {
                $document.off('mousedown', hidePanelBind);
                $scope.showResults = false;
            }

            function showPanel() {
                $document.off('mousedown', hidePanelBind);
                $document.on('mousedown', hidePanelBind);
                $scope.showResults = true;
            }

            function hidePanelBind(event) {
                var element = event.target;
                if (angular.element(element).hasClass('showResultsOnClick')) {
                    return;
                } else {
                    var editorSectionElement = angular.element(element).parents('.showResultsOnClick')[0];
                    if (!editorSectionElement) {
                        hidePanel();
                        $scope.$apply();
                    } else {
                        return;
                    }
                }
            }
            function onDestroy() {
                $document.off('mousedown', hidePanelBind);
            }
        }
    };
});
'use strict';

angular.module('modules.skills', []);
angular.module('modules.skills').directive('userSkills', function () {
    return {
        restrict: 'E',
        scope: {
            user: '=',
            activeFields: '='
        },
        templateUrl: 'app/modules/skills/tpls/user-skills.html',
        controller: function controller($scope, $http, EntityService, SkillsService) {
            var activeFieldsArray = _.map($scope.activeFields, '_id');

            $scope.tags = $scope.user.profile.profileDetails.skills.concat($scope.user.profile.profileDetails.technologies);

            SkillsService.getSkills($scope.user._id).then(function (response) {
                var evidencedFieldsAll = response.data;
                $scope.unclassifiedFields = SkillsService.createFieldsFromEvidence(evidencedFieldsAll);
            });
            detemineActive($scope.tags);

            /////////////////////////////

            function detemineActive(tags) {
                _.forEach(tags, function (tag) {
                    if (activeFieldsArray.indexOf(tag._id) != -1) {
                        tag.active = true;
                    }
                });
            }
        }
    };
}).directive('evidencedFields', function () {
    return {
        restrict: 'E',
        scope: {
            user: '=',
            edit: '=',
            activeFields: '='
        },
        templateUrl: 'app/modules/skills/tpls/evidenced-fields.html',
        controller: function controller($scope, $http, EntityService, SkillsService) {
            var evidencedFieldsAll; // All evidenced fields
            init();

            //////////////////////////////

            function init() {
                SkillsService.getSkills($scope.user._id).then(function (results) {
                    evidencedFieldsAll = results.data;
                    $scope.unclassifiedFields = SkillsService.createFieldsFromEvidence(evidencedFieldsAll);

                    // Merge evidenced fields with profileDetail.skills && profileDetails.technologies
                    SkillsService.mergeEvidencedSkills($scope.user.profile.profileDetails.skills, evidencedFieldsAll, $scope.unclassifiedFields);
                    SkillsService.mergeEvidencedSkills($scope.user.profile.profileDetails.technologies, evidencedFieldsAll, $scope.unclassifiedFields);

                    // Watch the skills and technologies fields. If they change (fields added), merge the evidence field
                    $scope.$watch('user.profile.profileDetails.skills', function (ov, nv) {
                        if (ov.length != nv.length) {
                            SkillsService.mergeEvidencedSkills($scope.user.profile.profileDetails.skills, evidencedFieldsAll, $scope.unclassifiedFields);
                        }
                    }, true);
                    $scope.$watch('user.profile.profileDetails.technologies', function (ov, nv) {
                        if (ov.length != nv.length) {
                            SkillsService.mergeEvidencedSkills($scope.user.profile.profileDetails.technologies, evidencedFieldsAll, $scope.unclassifiedFields);
                        }
                    }, true);

                    // Extend the unclassified fields with the data
                    SkillsService.populateFields($scope.unclassifiedFields);
                });
            }
        }
    };
}).service('SkillsService', function (HttpService, LocalCache, Authentication, $http, EntityService) {
    var service = this;
    this.getStatus = getStatus; // function(jobId)

    this.getSkills = getSkills;
    this.mergeEvidencedSkills = mergeEvidencedSkills;
    this.populateFields = populateFields;
    this.createFieldsFromEvidence = createFieldsFromEvidence;

    ///////////////////////////////////

    function getStatus(fieldId) {
        var getPromise = function getPromise(fieldId) {
            return HttpService({
                url: '/api/v1/social',
                method: "GET",
                params: {
                    socialType: 'skill',
                    'parentIds[]': fieldId,
                    childId: Authentication.currentUser._id
                }
            });
        };
        return LocalCache.getPackaged('skills-status', fieldId, getPromise);
    }

    function getSkills(userId) {
        return $http({
            url: 'api/v1/users/' + userId + '/skills',
            method: 'GET'
        });
    }

    function mergeEvidencedSkills(destinationArray, evidencedAll, evidencedUnclassified) {
        // This will merge the evidenced skills to the destination array
        if (evidencedAll) {
            _.forEach(destinationArray, function (field) {
                // If the field is evidenced - extend with the evidence data
                if (evidencedAll[field._id]) {
                    field.evidence = evidencedAll[field._id];
                    field.noDelete = true;
                    // Delete from the unclassified array
                    var evidencedFieldIndex = _.findIndex(evidencedUnclassified, { '_id': field._id });
                    if (evidencedFieldIndex != -1) {
                        evidencedUnclassified.splice(evidencedFieldIndex, 1);
                    }
                }
            });
        }
    }

    function populateFields(unpopulatedFields) {
        _.forEach(unpopulatedFields, function (field) {
            EntityService.get('field', field._id, 'sm').then(function (response) {
                _.extend(field, response);
            });
        });
    }

    function createFieldsFromEvidence(evidence) {
        return _.map(evidence, function (fieldEvidence, fieldId) {
            return {
                _id: fieldId,
                evidence: fieldEvidence,
                noDelete: true
            };
        });
    }
});
'use strict';

angular.module('modules.social-media', ['modules.authentication']);
angular.module('modules.social-media').service('SocialModalService', function ($mdDialog) {
    this.sharePrompt = sharePrompt; // function(event, data)

    /////////////////////////////////////////////////////

    function sharePrompt(event, data) {
        /***********************************************************
        data = {
            entity: 'project' || 'blog' || 'question' - This is used in the title and body
        }
        ************************************************************/
        return $mdDialog.show({
            templateUrl: 'app/modules/social-media/tpls/social-prompt-modal.html',
            controller: function controller($scope, $mdDialog, data) {
                $scope.data = data;
                $scope.cancel = $mdDialog.hide; //function()
            },
            targetEvent: event,
            clickOutsideToClose: true,
            locals: {
                data: data
            }
        });
    }
}).directive('socialShareButton', function (Authentication) {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/social-media/tpls/social-share-button.html',
        scope: {
            title: '@?', // Optional, reverts to default
            summary: '@?', // Optional, reverts to default
            root: '@?' // If root is true, link to root, stemn.com
        },
        controller: function controller($scope, $rootScope, $location) {
            // Set defaults ------------------------------------------
            if ($scope.root == 'true') {
                // set the url if root is true
                $scope.url = 'https://stemn.com/';
                // fetch the ref code
                $scope.ref = Authentication.currentUser.ref;
                // add the ref code if it exists
                if ($scope.ref) {
                    $scope.url = $scope.url.concat('?ref=' + Authentication.currentUser.ref);
                }
            } else {
                // set the url to the current page otherwise
                $scope.url = $location.absUrl();
                // If it includes the edit state param, remove it
                var index = $scope.url.indexOf('?edit=') || $scope.url.indexOf('&edit=');
                if (index) {
                    $scope.url = $scope.url.substring(0, index);
                }
            }
            $scope.title = $scope.title || $rootScope.page.title;
            $scope.summary = $scope.summary || $rootScope.page.description;
            // Create the links for the share buttons
            $scope.shares = [{
                title: 'Share to Facebook',
                icon: 'fa-facebook',
                href: "https://www.facebook.com/sharer/sharer.php?u=" + $scope.url
            }, {
                title: 'Share to Twitter',
                icon: 'fa-twitter',
                href: "https://twitter.com/home?status=" + $scope.summary + "%20%20@stem_network%20" + $scope.url
            }, {
                title: 'Share to Linkedin',
                icon: 'fa-linkedin',
                href: "https://www.linkedin.com/shareArticle?mini=true&url=" + $scope.url + "&title=" + $scope.title + "&summary=" + $scope.summary + "&source="
            }];
        }
    };
}).directive('socialShareButtons', function (Authentication) {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/social-media/tpls/social-share-buttons.html',
        scope: {
            title: '@?', // Optional, reverts to default
            summary: '@?', // Optional, reverts to default
            root: '@?', // If root is true, link to root, stemn.com
            tiles: '=?', // true || false (default)
            ref: '@?' // ref code
        },
        controller: function controller($scope, $rootScope, $location) {
            // Set defaults ------------------------------------------
            if ($scope.root == 'true') {
                // set the url if root is true
                $scope.url = 'https://stemn.com/';
            } else {
                // set the url to the current page otherwise
                $scope.url = $location.absUrl();
            }
            // add the ref code if it exists
            if ($scope.ref) {
                $scope.url = $scope.url.concat('?ref=' + $scope.ref);
            }
            $scope.title = $scope.title || $rootScope.page.title;
            $scope.summary = $scope.summary || $rootScope.page.description;
            $scope.summaryShort = $scope.summary.slice(0, 120) + '... ';

            // Create the links for the share buttons
            $scope.shareDetails = [{
                title: 'Share to twitter',
                icon: 'twitter',
                href: "https://twitter.com/home?status=" + $scope.summaryShort + "%20%20@stem_network%20" + $scope.url
            }, {
                title: 'Share to linkedin',
                icon: 'linkedin',
                href: "https://www.linkedin.com/shareArticle?mini=true&url=" + $scope.url + "&title=" + $scope.title + "&summary=" + $scope.summaryShort + "&source="
            }, {
                title: 'Share to facebook',
                icon: 'facebook',
                href: "https://www.facebook.com/sharer/sharer.php?u=" + $scope.url
            }];
            $scope.shares = $scope.shareDetails;
            //            if($scope.tiles){
            //            }
            //            else{
            //                $scope.shares = [ $scope.shareDetails[0], $scope.shareDetails[2] ]
            //            }
        }
    };
}).directive('socialLinks', function ($timeout) {
    // This directive is used to create links to social accounts such as Facebook and Github
    // It can be used at either project or user pages with a different 'type' param
    // More links can easily be added. Be sure to change both the 'linkOrder' and 'links'
    // arrays.
    return {
        restrict: 'E',
        scope: {
            data: '=', // The data to manipulate - this is an object of the form:
            // {github : 'DavidR', facebook : 'revay'}
            edit: '=?', // To show/hide edit
            type: '@?', // project, organisation or user?
            showEdit: '=?', // showEdit button
            saveFn: '&?' // saveFn for edit modal
        },
        templateUrl: 'app/modules/social-media/tpls/social-links.html',
        controller: function controller($scope, $mdDialog) {

            // Set defaults
            if (!$scope.data) {
                $scope.data = {};
            }
            if (!$scope.type) {
                $scope.type = 'user';
            }

            // Set link types
            if ($scope.type == 'user') {
                $scope.linkOrder = ['website', 'twitter', 'facebook', 'linkedin', 'github', 'google', 'stack', 'youtube'];
            } else if ($scope.type == 'project') {
                $scope.linkOrder = ['website', 'twitter', 'facebook', 'github', 'youtube'];
            } else if ($scope.type == 'organisation') {
                $scope.linkOrder = ['website', 'twitter', 'facebook', 'linkedin', 'youtube'];
            } else {
                console.log('Error - Social links Type must be defined');
            }

            $scope.editModal = editModal; //function(event)

            $scope.links = {

                website: {
                    base: 'http://',
                    alt: 'http://',
                    icon: 'fa-globe'
                },
                twitter: {
                    base: 'https://twitter.com/',
                    icon: 'fa-twitter'
                },
                facebook: {
                    base: 'http://facebook.com/',
                    icon: 'fa-facebook'
                },
                linkedin: {
                    base: 'http://linkedin.com/',
                    icon: 'fa-linkedin'
                },
                github: {
                    base: 'https://github.com/',
                    icon: 'fa-github'
                },
                google: {
                    base: 'http://plus.google.com/',
                    icon: 'fa-google-plus'
                },
                stack: {
                    base: 'http://stackoverflow.com/',
                    icon: 'fa-stack-overflow'
                },
                youtube: {
                    base: 'http://youtube.com/',
                    icon: 'fa-youtube-play'
                }
            };

            ///////////////////////////////////////////////

            function editModal($event) {
                $mdDialog.show({
                    templateUrl: 'app/modules/social-media/tpls/social-links-modal.html',
                    controller: function controller(data, type, $scope) {
                        $scope.data = angular.copy(data);
                        $scope.type = type;
                        $scope.confirm = function () {
                            $mdDialog.hide($scope.data);
                        };
                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };
                    },
                    locals: {
                        data: $scope.data,
                        type: $scope.type
                    },
                    targetEvent: event
                }).then(function (data) {
                    $scope.data = data;
                    $timeout($scope.saveFn, 0);
                });
            }
        }
    };
});
'use strict';

angular.module('modules.socket', []);
angular.module('modules.socket').service('SocketService', function ($rootScope) {
    //    var socket = window.io('/editor').connect();

    //    var socket = window.io().connect();
    //    window.io.Manager('http://localhost:3000', { autoConnect: false });
    //    var socket = window.io();
    this.on = on; // function (eventName, callback)
    this.emit = emit; // function (eventName, data, callback)
    //
    //    /////////////////////////////////////////////////////////

    //    function on (eventName, callback) {
    //        function wrapper() {
    //            var args = arguments;
    //            $rootScope.$apply(function () {
    //                callback.apply(socket, args);
    //            });
    //        }
    //
    //        socket.on(eventName, wrapper);
    //
    //        return function () {
    //            socket.removeListener(eventName, wrapper);
    //        };
    //    }
    //
    //    function emit (eventName, data, callback) {
    //        socket.emit(eventName, data, function () {
    //            var args = arguments;
    //            $rootScope.$apply(function () {
    //                if(callback) {
    //                    callback.apply(socket, args);
    //                }
    //            });
    //        });
    //    }

    //////////// stub function code /////////////
    function on() {};
    function emit() {};
});
'use strict';

angular.module('modules.sortable', ['ng-sortable']);
angular.module('modules.sortable');

/*******************************************************************
The anular module for sortable is pasted below.
This would normally come from the bower files.
*******************************************************************/

/**
 * @typedef   {Object}        ngSortEvent
 * @property  {*}             model      List item
 * @property  {Object|Array}  models     List of items
 * @property  {number}        oldIndex   before sort
 * @property  {number}        newIndex   after sort
 */

angular.module('ng-sortable', []);
angular.module('ng-sortable').constant('version', '0.3.7').directive('ngSortable', ['$parse', function ($parse) {
    var removed, nextSibling;

    function getSource(el) {
        var scope = angular.element(el).scope();
        var ngRepeat = [].filter.call(el.childNodes, function (node) {
            return node.nodeType === 8 && node.nodeValue.indexOf('ngRepeat:') !== -1;
        })[0];

        if (!ngRepeat) {
            // Without ng-repeat
            return null;
        }

        // tests: http://jsbin.com/kosubutilo/1/edit?js,output
        ngRepeat = ngRepeat.nodeValue.match(/ngRepeat:\s*(?:\(.*?,\s*)?([^\s)]+)[\s)]+in\s+([^\s|]+)/);

        var itemExpr = $parse(ngRepeat[1]);
        var itemsExpr = $parse(ngRepeat[2]);

        return {
            item: function item(el) {
                return itemExpr(angular.element(el).scope());
            },
            items: function items() {
                return itemsExpr(scope);
            }
        };
    }

    // Export
    return {
        restrict: 'AC',
        link: function link(scope, $el, attrs) {
            var el = $el[0],
                ngSortable = attrs.ngSortable,
                options = scope.$eval(ngSortable) || {},
                source = getSource(el),
                sortable;

            function _emitEvent( /**Event*/evt, /*Mixed*/item) {
                var name = 'on' + evt.type.charAt(0).toUpperCase() + evt.type.substr(1);

                /* jshint expr:true */
                options[name] && options[name]({
                    model: item || source && source.item(evt.item),
                    models: source && source.items(),
                    oldIndex: evt.oldIndex,
                    newIndex: evt.newIndex
                });
            }

            function _sync( /**Event*/evt) {
                if (!source) {
                    // Without ng-repeat
                    return;
                }

                var oldIndex = evt.oldIndex,
                    newIndex = evt.newIndex,
                    items = source.items();

                if (el !== evt.from) {
                    var prevSource = getSource(evt.from),
                        prevItems = prevSource.items();

                    oldIndex = prevItems.indexOf(prevSource.item(evt.item));
                    removed = prevItems[oldIndex];

                    if (evt.clone) {
                        evt.from.removeChild(evt.clone);
                        removed = angular.copy(removed);
                    } else {
                        prevItems.splice(oldIndex, 1);
                    }

                    items.splice(newIndex, 0, removed);

                    evt.from.insertBefore(evt.item, nextSibling); // revert element
                } else {
                    items.splice(newIndex, 0, items.splice(oldIndex, 1)[0]);
                }

                scope.$apply();
            }

            sortable = Sortable.create(el, Object.keys(options).reduce(function (opts, name) {
                opts[name] = opts[name] || options[name];
                return opts;
            }, {
                onStart: function onStart( /**Event*/evt) {
                    nextSibling = evt.item.nextSibling;
                    _emitEvent(evt);
                    scope.$apply();
                },
                onEnd: function onEnd( /**Event*/evt) {
                    _emitEvent(evt, removed);
                    scope.$apply();
                },
                onAdd: function onAdd( /**Event*/evt) {
                    _sync(evt);
                    _emitEvent(evt, removed);
                    scope.$apply();
                },
                onUpdate: function onUpdate( /**Event*/evt) {
                    _sync(evt);
                    _emitEvent(evt);
                },
                onRemove: function onRemove( /**Event*/evt) {
                    _emitEvent(evt, removed);
                },
                onSort: function onSort( /**Event*/evt) {
                    _emitEvent(evt);
                }
            }));

            $el.on('$destroy', function () {
                sortable.destroy();
                sortable = null;
                nextSibling = null;
            });

            if (ngSortable && !/{|}/.test(ngSortable)) {
                // todo: ugly
                angular.forEach(['sort', 'disabled', 'draggable', 'handle', 'animation', 'onStart', 'onEnd', 'onAdd', 'onUpdate', 'onRemove', 'onSort'], function (name) {
                    scope.$watch(ngSortable + '.' + name, function (value) {
                        if (value !== void 0) {
                            options[name] = value;

                            if (!/^on[A-Z]/.test(name)) {
                                sortable.option(name, value);
                            }
                        }
                    });
                });
            }
        }
    };
}]);
'use strict';

angular.module('modules.state-history', []);
angular.module('modules.state-history').run(function ($rootScope, StateHistoryService) {
    $rootScope.$on('$stateChangeSuccess', StateHistoryService.processStateChange);
}).service('StateHistoryService', function () {
    /******************************************************
    This service produces the stateHistory Array
    stateHistory = [{
        name   : 'state name',
        params : {state params},
    },{
        name   : 'state name',
        params : {state params},
    },{
        name   : 'state name',
        params : {state params},
    }]
    ******************************************************/
    var service = this;
    this.stateHistory = [];
    this.processStateChange = processStateChange;

    //////////////////////////////////////

    function processStateChange(event, toState) {
        service.stateHistory.push({
            name: toState.name,
            params: toState.params
        });
    }
});
'use strict';

angular.module('modules.statistics', ['modules.authentication']);
angular.module('modules.statistics').directive('statButton', function () {
    return {
        restrict: 'E',
        replace: 'true',
        scope: {
            // Classes: lg, green
            parentId: '@?', // Id of the parent
            parentType: '@?', // project || user || thread || blog || post
            type: '@', // like || follow || vote
            count: '=?', // The number of the stat
            displayStyle: '@?', // rectangle || circle
            entityText: '@?' // Entity text to be displayed on the button eg) project gives 'follow project' on button
        },
        templateUrl: 'app/modules/statistics/tpls/stat-button.html',
        controller: function controller($scope, Authentication, StatButtonTypes, $element, FollowLikeService, LocalCache) {
            $scope.hover = false;

            if (Authentication.currentUser._id) {
                // Watch the ID. This is required because the value is initially indefined.
                $scope.$watch('parentId', function (nv, ov) {
                    // check the status based on the current user
                    if ($scope.parentId) {
                        dontLetUsersFollowSelf();

                        var convertedTypes = FollowLikeService.convertTypes($scope.parentType, $scope.type);
                        $scope.parentType = convertedTypes.parentType;
                        $scope.type = convertedTypes.type;

                        FollowLikeService.checkStatus($scope).then(function (itemStatus) {
                            $scope.itemStatus = itemStatus;
                        });
                    }
                });
            }
            $scope.types = StatButtonTypes;
            $scope.clickButton = function () {

                var convertedTypes = FollowLikeService.convertTypes($scope.parentType, $scope.type);
                $scope.parentType = convertedTypes.parentType;
                $scope.type = convertedTypes.type;

                // If we are activating the button:
                if (!$scope.itemStatus.status) {
                    $scope.itemStatus.status = true; // toggle status
                    FollowLikeService.followLike($scope);
                }

                // If we are de-activating the button:
                else if ($scope.itemStatus) {
                        $scope.itemStatus.status = false; // toggle status
                        FollowLikeService.unfollowLike($scope);
                    }
                $scope.hover = false; // Remove the hover class
            };

            function dontLetUsersFollowSelf() {
                // Hide the button if the parent-id is current user's id
                if ($scope.parentId == Authentication.currentUser._id) {
                    $element.addClass('vishidden');
                }
            }
        }
    };
}).service('FollowLikeService', function (HttpService, LocalCache, EntityService, Restangular, Authentication, StatButtonTypes, $q, $mdToast, $timeout, $mdDialog) {
    var service = this;

    this.followLike = followLike; // function(data)
    this.unfollowLike = unfollowLike; // function(data)
    this.checkStatus = checkStatus; // function(data)
    this.convertTypes = convertTypes; // function(parentType, type)

    ///////////////////////////////////////////////////////////

    function convertTypes(parentType, type) {
        // If the parentType is thread||blog||question||general:
        if (parentType == 'thread' || parentType == 'question' || parentType == 'blog' || parentType == 'discussion' || parentType == 'general') {
            // Set the parentType to thread
            parentType = 'thread';
        }
        return {
            parentType: parentType,
            type: type
        };
    }
    function checkStatus(data) {
        /***************************************** /
        This will check the follow/like status of things
        data: {
        parentId   : the parents id
        parentType : project || user || thread || blog
        type       : like || follow || vote
        }
        / *****************************************/

        if (!Authentication.currentUser._id || !data.parentType || !data.type) {
            console.error('Error - Invalid follow inputs');
            return;
        }
        var getPromise = function getPromise(parentId) {
            // data - [asfasffsa, asfafsasfasf] - Array of user ids
            return HttpService({
                url: '/api/v1/social',
                method: "GET",
                params: {
                    'childId': Authentication.currentUser._id,
                    'parentIds[]': parentId,
                    'socialType': data.type
                }
            });
        };
        //        console.log('social-'+Authentication.currentUser._id+'-'+data.type, data.parentId);
        return LocalCache.getPackaged('social-' + Authentication.currentUser._id + '-' + data.type, data.parentId, getPromise);
    }

    function followLike(data) {
        /***************************************** /
         This is used to follow or like things
         data: {
        	parentId   : the parents id
        	parentType : project || user || thread || blog || post
        	type       : like || follow || vote
        	count      : the number of likes / follows
         }
        / *****************************************/

        Restangular.one('users', Authentication.currentUser._id).one(data.type + 's', data.parentId).put().then(function () {
            data.count++;
            // Update status in cache
            LocalCache.save('social-' + Authentication.currentUser._id + '-' + data.type, {
                _id: data.parentId,
                status: true
            });
            EntityService.get(data.parentType, data.parentId, 'sm').then(function (entity) {
                var entityText = data.parentType == 'post' ? '\'s post.' : '';

                $mdToast.show({
                    controller: function controller($scope, $mdToast) {
                        $scope.entityName = entity.name || entity.owner.name;
                    },
                    template: '<md-toast>' + '<span flex>You have ' + StatButtonTypes[data.type].doVerb + ' <b>{{entityName | letters: 20}}</b>' + entityText + '</span>' + '</md-toast>',
                    hideDelay: 2000
                });
            });
        });
    }
    function unfollowLike(data) {
        /***************************************** /
         This is used to follow or like things
         data: {
        	parentId   : the parents id
        	parentType : project || user || thread || blog
        	type       : like || follow || vote
        	count      : the number of likes / follows
         }
        / *****************************************/
        Restangular.one('users', Authentication.currentUser._id).one(data.type + 's', data.parentId).remove().then(function () {
            data.count--;
            LocalCache.save('social-' + Authentication.currentUser._id + '-' + data.type, {
                _id: data.parentId,
                status: false
            });
            EntityService.get(data.parentType, data.parentId, 'sm').then(function (entity) {
                var entityText = data.parentType == 'post' ? '\'s post.' : '';

                $mdToast.show({
                    controller: function controller($scope, $mdToast) {
                        $scope.entityName = entity.name || entity.owner.name;
                    },
                    template: '<md-toast class="md-orange-theme">' + '<span flex>You have ' + StatButtonTypes[data.type].undoVerb + ' <b>{{entityName | letters: 20}}' + entityText + '</b></span>' + '</md-toast>',
                    hideDelay: 2000
                });
            });
        });
    }
}).directive('statDisplayModal', function () {
    return {
        restrict: 'A',
        scope: {
            parentId: '@?', // Id of the parent
            parentType: '@?', // project || user || thread || blog
            type: '@?' },
        controller: function controller($scope, $element, $mdDialog, $timeout, FollowLikeService) {
            $element.bind('click', function (event) {

                var convertedTypes = FollowLikeService.convertTypes($scope.parentType, $scope.type);
                $scope.parentType = convertedTypes.parentType;
                $scope.type = convertedTypes.type;

                var titles = {
                    like: 'Likers',
                    follow: 'Followers',
                    vote: 'Likers'
                };

                var data = {
                    parentId: $scope.parentId,
                    parentType: $scope.parentType,
                    type: $scope.type,
                    title: titles[$scope.type]
                };

                return $mdDialog.show({
                    templateUrl: 'app/modules/statistics/tpls/stat-display-modal.html',
                    targetEvent: event,
                    locals: {
                        data: data
                    },
                    controller: function controller(data, $scope, $mdDialog) {
                        $scope.data = data;
                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };
                    }
                });
            });
        }
    };
}).directive('statDisplay', function () {
    return {
        restrict: 'E',
        scope: {
            parentId: '@?', // Id of the parent
            parentType: '@?', // project || user || thread || blog || organisation
            type: '@?', // like || follow || vote
            refreshCallback: '=?' },
        templateUrl: 'app/modules/statistics/tpls/stat-display.html',
        controller: function controller($scope, $element, Restangular) {
            var page = 1;
            var size = 12;
            $scope.results = [];

            $scope.more = function () {
                Restangular.one($scope.parentType + 's', $scope.parentId).all($scope.type + 's').getList({ page: page, size: size, type: $scope.parentType }).then(function (results) {
                    $scope.results = $scope.results.concat(results);
                    if (results.length < size) {
                        $scope.loading = true;
                        $scope.noMoreResults = true;
                    } else {
                        $scope.loading = false;
                    }
                    page++;
                });
            };

            $scope.refreshCallback = function () {
                page = 1;
                $scope.results = [];
                $scope.more();
            };
        }
    };
}).directive('statCounter', function () {
    return {
        restrict: 'E',
        scope: {
            parentId: '@?', // Id of the parent
            parentType: '@?', // project || user || thread || blog
            type: '@?', // like || follow || vote
            count: '=' // The stat count
        },
        template: '<a stat-display-modal parent-id="{{parentId}}" parent-type="{{parentType}}" type="{{type}}" ng-if="count>0">' + '{{count}} {{count==1 ? "person" : "people"}} {{::title}} this' + '</a>',
        link: function link(scope, element, attrs) {
            var titles = {
                like: 'liked',
                follow: 'followed',
                vote: 'liked'
            };
            scope.title = titles[scope.type];
        }
    };
}).service('StatButtonTypes', function ($rootScope) {
    return {
        like: {
            inactive: {
                usual: {
                    text: 'Like',
                    icon: 'heart'
                },
                hover: {
                    text: 'Like',
                    icon: 'heart'
                }
            },
            active: {
                usual: {
                    text: 'Liked',
                    icon: 'heart-filled'
                },
                hover: {
                    text: 'Unlike',
                    icon: 'heart-filled'
                }
            },
            doVerb: 'liked',
            undoVerb: 'unliked'
        },
        follow: {
            inactive: {
                usual: {
                    text: 'Follow',
                    icon: 'add-circle-outline'
                },
                hover: {
                    text: 'Follow',
                    icon: 'add-circle-outline'
                }
            },
            active: {
                usual: {
                    text: 'Following', // Following
                    icon: 'add-circle'
                },
                hover: {
                    text: 'Following', // Unfollow
                    icon: 'add-circle'
                }
            },
            doVerb: 'followed',
            undoVerb: 'unfollowed'
        },
        vote: {
            inactive: {
                usual: {
                    text: 'Like',
                    icon: 'heart'
                },
                hover: {
                    text: 'Like',
                    icon: 'heart'
                }
            },
            active: {
                usual: {
                    text: 'Liked',
                    icon: 'heart-filled'
                },
                hover: {
                    text: 'Unlike',
                    icon: 'heart-filled'
                }
            },
            doVerb: 'liked',
            undoVerb: 'unliked'
        }
    };
}).service('FollowService', function (HttpService) {
    /************************* /
     user  : user id
     [type : type of entity],
     page  : the page of results to access
     size  : the number of results per page
    / *************************/
    this.getFollowing = function (data) {
        return HttpService({
            method: 'GET',
            url: 'api/v1/users/' + data.user + '/following',
            params: {
                type: data.type, // organisation || project || user || field
                page: data.page,
                size: data.size
            }
        });
    };
});
'use strict';

angular.module('modules.sync.file-select', []);
angular.module('modules.sync.file-select').directive('syncFileSelect', function (RecursionHelper) {
    return {
        restrict: 'E',
        scope: {
            path: '=',
            project: '=',
            provider: '=',
            selected: '='
        },
        templateUrl: 'app/modules/sync/sync-file-select/tpls/sync-file-select.html',
        controller: function controller($scope, SyncUtilService, SyncService, $stateParams) {
            $scope.select = select; //function(item)
            $scope.selected = $scope.selected || {};

            list($scope.path);
            ///////////////////////////

            function getCrumbs() {
                // Get breadcrumbs
                if ($scope.provider == 'drive') {
                    SyncService.getPath($scope.path, $scope.project.stub).then(function (response) {
                        $scope.breadCrumbs = response;
                    });
                } else {
                    $scope.breadCrumbs = SyncUtilService.getCrumbs($scope.path);
                }
            }

            function list(path) {
                $scope.path = path || '';
                $scope.selected = {};
                getCrumbs();
                $scope.loading = true;
                SyncService.list($scope.project.stub, $scope.path).then(function (response) {
                    $scope.files = response.data.entries;
                    $scope.loading = false;
                });
            }
            function select(item) {
                if (item['.tag'] == 'folder') {
                    list(item.path);
                } else {
                    $scope.selected = item;
                }
            }
        }
    };
}).service('SyncFileSelectService', function ($mdDialog) {
    this.select = select; //function()

    /////////////////////////////////////

    function select(event, data) {
        /************************************************
        data = {
            provider: 'dropbox' || 'drive',
            project: project,
            path: startin path
        }
        ************************************************/
        return $mdDialog.show({
            templateUrl: 'app/modules/sync/sync-file-select/tpls/sync-file-select-modal.html',
            controller: function controller($scope, $mdDialog, CoreLibrary) {
                $scope.project = data.project;
                $scope.provider = data.provider;
                $scope.path = data.path;
                $scope.selected = {};
                $scope.cancel = $mdDialog.cancel; // function()
                $scope.save = function () {
                    $mdDialog.hide($scope.selected);
                };
            },
            targetEvent: event
        });
    }
});
'use strict';

angular.module('modules.sync.folder-select', []);
angular.module('modules.sync.folder-select').directive('syncFolderSelect', function (RecursionHelper) {
    return {
        restrict: 'E',
        scope: {
            provider: '@', // 'dropbox' || 'drive'
            item: '=',
            open: '=?',
            selected: '=',
            loading: '=?'
        },
        templateUrl: 'app/modules/sync/sync-folder-select/tpls/sync-folder-select.html',
        compile: function compile(element) {
            return RecursionHelper.compile(element);
        },
        controller: function controller($scope, SyncUtilService, SyncService, $stateParams) {
            $scope.selected = $scope.selected || {};
            $scope.item = $scope.item || {};
            $scope.item.path = $scope.item.path || '';

            // Functions
            $scope.toggle = toggle; //function(path)
            $scope.select = select; //function(item)

            if ($scope.open) {
                toggle($scope.item.path);
                $scope.$watch('item', function () {
                    assignLevel($scope.item, 0);
                }, true);
            }

            function assignLevel(item, level) {
                level = level + 1;

                if (item && item.children) {
                    _.forEach(item.children, function (child) {
                        child.level = level - 1;
                        assignLevel(child, level);
                    });
                }
            }

            ///////////////////////////

            function toggle(path) {
                if (!$scope.item.children) {
                    $scope.loading.status = true;
                    SyncService.explorePrivate($scope.provider, path).then(function (response) {
                        $scope.loading.status = false;
                        $scope.item.children = response.data.entries;
                        $scope.item.showChildren = true;
                    });
                } else {
                    $scope.item.showChildren = !$scope.item.showChildren;
                }
            }
            function select(item) {
                $scope.selected.id = item.id;
                $scope.selected.path = item.path;
                $scope.selected.name = item.name;
            }
        }
    };
}).service('SyncFolderSelectService', function ($mdDialog) {
    this.select = select; //function()

    /////////////////////////////////////

    function select(event, data) {
        /************************************************
        data = {
            provider: 'dropbox' || 'drive',
            projectName: project name
        }
        ************************************************/
        return $mdDialog.show({
            templateUrl: 'app/modules/sync/sync-folder-select/tpls/sync-folder-select-modal.html',
            controller: function controller($scope, $mdDialog, CoreLibrary) {
                $scope.selected = {};
                $scope.loading = {};
                $scope.provider = data.provider;
                $scope.projectName = CoreLibrary.stubify(data.projectName);

                $scope.folder = { type: 'new' }; // Default select mod
                $scope.cancel = $mdDialog.cancel; // function()
                $scope.save = function () {
                    if ($scope.folder == 'new') {
                        $scope.selected = {};
                    }
                    $mdDialog.hide($scope.selected);
                };
            },
            targetEvent: event
        });
    }
}).factory('RecursionHelper', function ($compile) {
    return {
        /**
         * Manually compiles the element, fixing the recursion loop.
         * @param element
         * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
         * @returns An object containing the linking functions.
         */
        compile: function compile(element, link) {
            // Normalize the link parameter
            if (angular.isFunction(link)) {
                link = { post: link };
            }

            // Break the recursion loop by removing the contents
            var contents = element.contents().remove();
            var compiledContents;
            return {
                pre: link && link.pre ? link.pre : null,
                /**
                 * Compiles and re-adds the contents
                 */
                post: function post(scope, element) {
                    // Compile the contents
                    if (!compiledContents) {
                        compiledContents = $compile(contents);
                    }
                    // Re-add the compiled contents to the element
                    compiledContents(scope, function (clone) {
                        element.append(clone);
                    });

                    // Call the post-linking function, if any
                    if (link && link.post) {
                        link.post.apply(null, arguments);
                    }
                }
            };
        }
    };
});
'use strict';

angular.module('modules.sync.list-widget', []);
angular.module('modules.sync.list-widget').directive('syncListWidget', function () {
    return {
        restrict: 'E',
        scope: {
            project: '=',
            path: '@'
        },
        templateUrl: 'app/modules/sync/sync-list-widget/tpls/sync-list-widget.html',
        controller: function controller($scope, SyncService, SyncUtilService) {
            $scope.loading = true;
            $scope.openFileFolder = SyncUtilService.openFileFolder; //function(path, projectStub, type)
            SyncService.list($scope.project.stub, $scope.path || '').then(function (response) {
                $scope.loading = false;
                $scope.items = response.data.entries;
            });
            //            SyncService.fileStats($scope.project.stub, $scope.path || '').then(function(response){
            //                console.log(response);
            //            })
        }
    };
});
'use strict';

angular.module('modules.sync.service', []);
angular.module('modules.sync.service').service('SyncService', function ($http, SyncUtilService, $auth, Authentication, SyncFolderSelectService, HttpService, $q, $timeout, CoreLibrary) {
    var service = this;

    this.authorize = authorize;
    this.list = list;
    this.getPath = getPath; // function(projectStub, path)
    this.download = download;
    this.render = render;
    this.metadata = metadata;
    this.metadataVirtual = metadataVirtual;
    this.search = search;
    this.revisions = revisions;
    this.revisionsDeep = revisionsDeep;
    this.remove = remove;
    this.createFolder = createFolder;
    this.upload = upload;
    this.folderMembers = folderMembers;
    this.ownerInfo = ownerInfo;
    this.fileStats = fileStats;
    this.explorePrivate = explorePrivate; // function(provider, path)

    this.remoteLink = remoteLink; // function(projectStub, provider, params)
    this.remoteUnlink = remoteUnlink; // function(projectStub, provider)


    var pathCache = {};
    //////////////////////////////////

    function authorize(provider) {
        // provider = 'dropbox' || 'google'
        return $auth.authenticate(provider).then(function (response) {
            Authentication.currentUser.accounts[provider] = response.data[provider];
            return response;
        });
    }

    function remoteLink(event, projectStub, provider, projectName) {
        // provider = 'dropbox' || 'drive'
        var providerAlt = provider == 'drive' ? 'google' : 'dropbox';
        if (!Authentication.currentUser.accounts[providerAlt][providerAlt == 'google' ? 'refreshToken' : 'id']) {
            return service.authorize(providerAlt).then(function () {
                return link();
            });
        } else {
            return link();
        }

        function link() {
            return SyncFolderSelectService.select(event, { provider: provider, projectName: projectName }).then(function (selected) {
                return $http({
                    method: 'PUT',
                    url: '/api/v1/sync/link/' + projectStub + '/' + provider,
                    params: {
                        path_display: selected.path_display,
                        path: selected.path,
                        id: selected.id
                    }
                });
            });
        }
    }

    function remoteUnlink(projectStub, provider) {
        var providerAlt = provider == 'google' ? 'drive' : 'dropbox';
        return $http({
            method: 'DELETE',
            url: '/api/v1/sync/link/' + projectStub + '/' + providerAlt
        });
    }

    function list(project, path) {
        return $http({
            method: 'GET',
            url: '/api/v1/sync/listFolder/' + project + '/' + path
        }).then(function (response) {
            if (response.data.files) {
                // If Google
                response.data.entries = _.map(response.data.files, function (item) {
                    return processDrive(item, project);
                });
            }
            var virtualFiles = SyncUtilService.processVirtualFiles(response.data.entries, project, path);
            response.data.entries = response.data.entries.concat(virtualFiles);
            response.data.entries = _.sortByOrder(response.data.entries, ['.tag', 'client_modified'], ['desc', 'desc']);
            return response;
        });
    }

    // Gets the full path of a file/folder because Google Sucks!

    function getPath(filePath, projectStub, rootId, absolute) {
        var recursionLimit = 20;
        var recursionCounter = 0;

        var deferred = $q.defer();
        var requestFn = projectStub && !absolute ? getPathRelative : getPathAbsolute;
        var endpoint = projectStub && !absolute ? 'sync-path-' + projectStub : 'sync-path-' + projectStub + 'abs';

        // Save the current folder details to the cache
        $q.all(checkCache(filePath)).then(function (response) {
            var results = [];
            _.forEachRight(response, function (item1) {
                if (item1.constructor === Array) {
                    _.forEach(item1, function (item2) {
                        item2.path = item2.id;
                        results.push(item2);
                    });
                } else {
                    item1.path = item1.id;
                    results.push(item1);
                }
            });
            deferred.resolve(results);
        });
        return deferred.promise;

        ////////////////////
        function checkCache(folderId, resultArray) {
            recursionCounter++;
            // Default the results
            resultArray = resultArray || [];
            // Default the cache
            pathCache[endpoint] = pathCache[endpoint] || {};

            var folderInfo = pathCache[endpoint][folderId];

            // If it is already in the results array, return as we are stuck in a loop
            var isAlreadyInResults;
            if (resultArray.length > 1) {
                isAlreadyInResults = !!_.find(resultArray, 'id', folderInfo.id);
            }
            if (isAlreadyInResults) {
                return resultArray;
            }

            if (folderInfo) {
                // We have an entry in the cache
                if (folderInfo.parent && folderInfo.path && folderInfo.id != rootId && recursionCounter < recursionLimit) {
                    // If it has a parent and it is not the root directory
                    resultArray.push(folderInfo);
                    return checkCache(folderInfo.parent, resultArray); // This will return resultArray
                } else {
                    // Else, it is a promise
                    resultArray.push(folderInfo);
                    return resultArray;
                }
            } else {
                // Else, we must make a request to the server
                pathCache[endpoint][folderId] = requestFn(folderId).then(function (response) {
                    _.forEach(response.data[0], function (folder) {
                        cacheSave(endpoint, folder);
                    });
                    return response.data[0];
                });
                return resultArray.concat(pathCache[endpoint][folderId]);
            }
        }

        function getPathRelative(folderId) {
            return $http({
                url: '/api/v1/sync/path/' + projectStub + '/',
                method: "GET",
                params: {
                    'folderId[]': folderId
                }
            });
        }
        function getPathAbsolute(folderId) {
            return $http({
                url: '/api/v1/sync/path/' + projectStub + '/',
                method: "GET",
                params: {
                    'folderId[]': folderId,
                    absolute: true
                }
            });
        }
    }

    function cacheSave(endpoint, item) {
        pathCache[endpoint] = pathCache[endpoint] || {};
        pathCache[endpoint][item.id] = item;
    }

    function download(downloadUrl) {
        var splitUrl = downloadUrl.split('@');
        return $http({
            method: 'GET',
            url: splitUrl[0],
            params: {
                revision: splitUrl[1]
            }
        });
    }
    function metadata(project, path, params) {
        return $http({
            method: 'GET',
            url: '/api/v1/sync/metadata/' + project + '/' + path,
            params: params
        }).then(function (response) {
            if (response.data.mimeType) {
                // If google
                response.data = processDrive(response.data, project);
            }
            return response;
        });
    }

    function metadataVirtual(projectStub, pathMeta, children) {
        if (children) {
            var promiseMap = [service.metadata(projectStub, pathMeta.path).then(function (response) {
                return response.data;
            })];
            promiseMap = promiseMap.concat(_.map(children, function (childMeta) {
                return service.metadata(projectStub, childMeta.path, { revision: childMeta.rev }).then(function (response) {
                    return response.data;
                });
            }));
            return $q.all(promiseMap).then(function (response) {
                var folderMeta = response[0];
                response.shift();
                return SyncUtilService.processVirtualFiles(response, projectStub, pathMeta.path, folderMeta)[0];
            });
        } else {
            return service.metadata(projectStub, pathMeta.path, { revision: pathMeta.rev }).then(function (response) {
                return response.data;
            });
        }
    }

    function render(project, path, params) {
        return $http({
            method: 'GET',
            url: '/api/v1/sync/render/' + project + '/' + path,
            params: params
        });
    }

    function revisions(projectStub, path) {
        return $http({
            method: 'GET',
            url: '/api/v1/sync/revisions/' + projectStub + '/' + path
        }).then(function (response) {
            // return drive || dropbox
            return response.data.revisions || response.data.entries;
        });
    }

    function revisionsDeep(meta) {
        if (meta.virtualChildren) {
            // Get child versions
            var promiseMap = _.map(meta.virtualChildren, function (child) {
                return service.revisions(meta.parentProject, child.path).then(function (response) {
                    child.revisions = response;
                    return child;
                });
            });
            return $q.all(promiseMap).then(function (response) {
                meta.virtualChildren = response;

                // Get the unique periods
                var uniquePeriods = [];
                _.forEach(meta.virtualChildren, function (child) {
                    _.forEach(child.revisions, function (revision) {
                        var time = new Date(revision.client_modified).getTime();
                        if (uniquePeriods.indexOf(time) == -1) {
                            uniquePeriods.push(time);
                        }
                    });
                });

                // Order the unique periods
                uniquePeriods = uniquePeriods.sort();

                // Construct the parent revision timeline - unique periods must me in order
                var parentVersions = [];
                _.forEach(uniquePeriods, function (period, index) {
                    if (!parentVersions[index]) {
                        parentVersions[index] = {
                            name: meta.name,
                            path: meta.path,
                            client_modified: moment(period).format(),
                            revDecimal: index + 1,
                            virtualChildren: [],
                            virtualChildrenRevs: [],
                            rev: index + 1
                        };
                    }
                    _.forEach(meta.virtualChildren, function (child) {
                        // Find the last child that existed at the period in question
                        var lastChild = _.findLast(child.revisions, function (revision) {
                            var time = new Date(revision.client_modified).getTime();
                            return time <= period;
                        });
                        parentVersions[index].virtualChildren.push(lastChild);
                        parentVersions[index].virtualChildrenRevs.push(lastChild.rev);
                    });
                });
                meta.revisions = parentVersions;

                // Finally, check to see what version we are on currently
                var actualRevs = _.map(meta.virtualChildren, 'rev');
                var metaExtra = _.find(meta.revisions, function (revision) {
                    return _.difference(revision.virtualChildrenRevs, actualRevs).length === 0;
                });
                if (metaExtra) {
                    meta.revDecimal = metaExtra.revDecimal;
                    meta.rev = metaExtra.rev;
                }
                return meta;
            });
        } else {
            return service.revisions(meta.parentProject, meta.path).then(function (response) {
                meta.revisions = response;
                var metaExtra = _.find(meta.revisions, 'rev', meta.rev);
                if (metaExtra) {
                    meta.revDecimal = metaExtra.revDecimal;
                }
                return meta;
            });
        }
    }

    function remove(project, path) {
        return $http({
            method: 'DELETE',
            url: '/api/v1/sync/delete/' + project + '/' + path
        });
    }

    function createFolder(project, path) {
        return $http({
            method: 'POST',
            url: '/api/v1/sync/createFolder/' + project + '/' + path
        });
    }

    function upload(project, path, params, data) {
        return $http({
            method: 'POST',
            url: '/api/v1/sync/upload/' + project + '/' + path,
            params: {
                revision: params.revision
            },
            headers: {
                'Content-Type': 'application/octet-stream'
            },
            data: data
        });
    }

    function spaceUsage(project) {
        return $http({
            method: 'GET',
            url: '/api/v1/sync/spaceUsage/' + project
        });
    }

    function search(project, path, params) {
        return $http({
            method: 'GET',
            url: '/api/v1/sync/search/' + project + '/' + path,
            params: params
        }).then(function (response) {
            if (response.data.files) {
                // If Google
                response.data.matches = _.map(response.data.files, function (item) {
                    console.log(item);
                    return processDrive(item, project);
                });
            }
            return response;
        });
    }

    function folderMembers(project, path) {
        return $http({
            method: 'GET',
            url: '/api/v1/sync/folderMembers/' + project + '/' + path
        });
    }

    function ownerInfo(project, path) {
        return $http({
            method: 'GET',
            url: '/api/v1/sync/ownerInfo/' + project + '/' + path
        }).then(function (response) {
            var result = {};
            if (response.data.name.display_name) {
                // Dropbox
                result.email = response.data.email;
                result.name = response.data.name.display_name;
                result.given_name = response.data.name.given_name;
                result.family_name = response.data.name.surname;
            } else {
                // Google
                result.email = response.data.email;
                result.name = response.data.name;
                result.given_name = response.data.given_name;
                result.family_name = response.data.family_name;
            }
            return result;
        });
    }

    function explorePrivate(provider, path) {
        return $http({
            method: 'GET',
            url: '/api/v1/sync/explore/' + provider + '/' + path
        }).then(function (response) {
            if (response.data.files) {
                // If Google
                response.data.entries = _.map(response.data.files, function (item) {
                    return processDrive(item);
                });
            }
            response.data.entries = _.filter(response.data.entries, function (file) {
                return file['.tag'] == 'folder';
            });
            return response;
        });
    }

    function fileStats(project, path) {
        return $http({
            method: 'GET',
            url: '/api/v1/sync/fileStats/' + project + '/' + path
        }).then(function (response) {
            var result = { numFiles: 0 };
            _.forEach(response.data, function (num, type) {
                result.numFiles = result.numFiles + parseInt(num);
            });
            return result;
        });
    }

    function processDrive(file, projectStub) {
        if (file.mimeType == 'application/vnd.google-apps.folder') {
            cacheSave('sync-path-' + projectStub || 'absolute', { id: file.id, name: file.name, path: file.name, parent: file.parents[0] });
        }
        return file;
    }
});
'use strict';

angular.module('modules.sync.timeline', []);
angular.module('modules.sync.timeline').directive('syncTimeline', function () {
    return {
        restrict: 'E',
        scope: {
            timeline: '='
        },
        templateUrl: 'app/modules/sync/sync-timeline/tpls/timeline.html',
        controller: function controller($scope) {
            $scope.iconMap = {
                update: 'editor:mode_edit',
                create: 'content:add'
            };
        }
    };
});
'use strict';

angular.module('modules.sync', ['modules.sync.timeline', 'modules.sync.list-widget', 'modules.sync.folder-select', 'modules.sync.file-select', 'modules.sync.service', 'satellizer']);
angular.module('modules.sync').service('SyncUtilService', function ($state, SyncUrlService) {
    var service = this;
    var viewerFileTypes = {
        general: {
            gerber: ['gerber', // Virtual gerber type
            'drl', 'drd', 'txt', // This goes first so txt does not display as gerber
            'out', 'outline', 'gbl', 'sol', 'gbs', 'sts', 'gbp', 'crs', 'gbo', 'pls', 'gtl', 'cmp', 'gts', 'stc', 'gtp', 'crc', 'gto', 'plc'],
            pcb: ['brd', 'pcb', 'kicad_pcb'],
            code: getCodeMirrorExts(),
            autodesk: ['3dm', '3ds', 'asm', 'cam360', 'catpart', 'cgr', 'collaboration', 'dae', 'dgn', 'dlv3', 'dwf', 'dwfx', 'dwg', 'dwt', 'dxf', 'exp', 'f3d', 'fbx', 'g', 'gbxml', 'iam', 'idw', 'ifc', 'ige', 'iges', 'igs', 'ipt', 'jt', 'model', 'neu', 'nwc', 'nwd', 'obj', 'pdf', 'prt', 'rcp', 'rvt', 'sab', 'sat', 'session', 'skp', 'sldprt', 'smb', 'smt', 'ste', 'step', 'stl', 'stla', 'stlb', 'stp', 'wire', 'x_b', 'x_t', 'xas', 'xpr'],
            // Assem - 'sldasm' 'catproduct'
            google: ['webm', 'mpeg4', '3gpp', 'mov', 'avi', 'mpegps', 'wmv', 'flv', //https://gist.github.com/izazueta/4961650
            'xls', 'xlsx', 'pages', 'psd', 'tiff', 'eps', 'ps', 'ai', 'ttf', 'xps'],
            image: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'bmp', 'ico'],
            pdf: ['pdf']
        },
        dropbox: {
            pdf: ['docx', 'doc', 'docm', 'ppt', 'pps', 'ppsx', 'ppsm', 'pptx', 'pptm', 'rtf']
        },
        drive: {
            google: ['docx', 'doc', 'docm', 'ppt', 'pps', 'ppsx', 'ppsm', 'pptx', 'pptm', 'rtf'],
            gdoc: ['gdoc', 'gsheet', 'gslides']
        }
    };

    var compareModeMap = ['sideBySide', 'aboveAndBelow', 'onion', 'slider'];
    var compareModeTable = {
        gerber: [0, 1, 2, 3],
        code: [0, 1],
        autodesk: [0, 1, 2, 3],
        google: [0, 1],
        image: [0, 1, 2, 3],
        pdf: [0, 1],
        pcb: [0, 1, 2, 3],
        gdoc: [0, 1],
        other: [0, 1]
    };

    //    https://docs.google.com/open?id=1HIrHHMWmN2pVeepMT8qf7ESzr74K2KQUvnZo7ryeqY4
    this.getCrumbs = getCrumbs;
    this.getFileName = getFileName;
    this.getFileType = getFileType;
    this.getViewerType = getViewerType;
    this.getEndingUrl = getEndingUrl;
    this.openFileFolder = openFileFolder;
    this.isGerber = isGerber;
    this.processVirtualFiles = processVirtualFiles;
    this.getCompareModes = getCompareModes;

    /////////////////////////////////////////////////////////////////

    function getCompareModes(previewerType1, previewerType2) {
        var compareModes1 = compareModeTable[previewerType1];
        var compareModes2 = compareModeTable[previewerType2];
        var compareModes = compareModes2 ? _.intersection(compareModes1, compareModes2) : compareModes1;
        return _.map(compareModes, function (modeNum) {
            return compareModeMap[modeNum];
        });
    }

    function getCodeMirrorExts() {
        var codeExts = [];
        _.forEach(window.CodeMirror.modeInfo, function (mode) {
            if (mode.ext) {
                codeExts = codeExts.concat(mode.ext);
            }
        });
        return codeExts;
    }

    function getCrumbs(path) {
        if (path) {
            var splitPath = path.split('/');
            // Remove first entry if it is undefined ( when path begins with '/' )
            if (splitPath[0] === '') {
                splitPath.shift();
            }
            var pathTemp = '';
            return _.map(splitPath, function (name, idx) {
                pathTemp = pathTemp ? pathTemp + '/' + name : name;
                return {
                    name: name,
                    path: pathTemp
                };
            });
        }
    }

    function getFileType(path) {
        var pathSplit = path.split('.');
        return pathSplit[pathSplit.length - 1];
    }

    function getFileName(path) {
        var pathSplit = path.split('/');
        return pathSplit[pathSplit.length - 1];
    }

    function getEndingUrl(projectStub, path, revision) {
        var fileUrlEnding = projectStub + '/' + path;
        if (revision) {
            fileUrlEnding = fileUrlEnding + '?revision=' + revision;
        }
        return fileUrlEnding;
    }

    function getViewerType(fileType, provider) {
        var result;
        var fileTypeLower = fileType ? fileType.toLowerCase() : '';
        provider = provider == 'drive' ? 'drive' : 'dropbox';

        // Extend the fileTypes array by the provider specific info
        var viewerFileTypesProvider = _.clone(viewerFileTypes.general);
        _.forEach(viewerFileTypes[provider], function (values, key) {
            viewerFileTypesProvider[key] = viewerFileTypesProvider[key] || [];
            viewerFileTypesProvider[key] = viewerFileTypesProvider[key].concat(values);
        });
        _.forEach(viewerFileTypesProvider, function (fileTypes, viewerType) {
            if (fileTypes.indexOf(fileTypeLower) != -1) {
                result = viewerType;
            }
        });
        return result || 'other';
    }

    function isGerber(fileType) {
        var fileTypeLower = fileType ? fileType.toLowerCase() : '';
        return viewerFileTypes.general.gerber.indexOf(fileTypeLower) != -1;
    }

    function openFileFolder(file) {
        if (file['.tag'] == 'folder') {
            $state.go('app.project.files', {
                path: file.path,
                stub: file.parentProject
            });
        } else {
            $state.go('app.preview', {
                path: SyncUrlService.getPath(file),
                projectStub: file.parentProject,
                children: file.virtualChildrenMap ? _.map(file.virtualChildren, SyncUrlService.getPath).join(',') : ''
            });
        }
    }

    function processVirtualFiles(files, projectStub, path, folderMeta) {
        folderMeta = folderMeta || {};
        var virtualFiles = [];
        // Count the unique gerber file types
        var gerberFileTypes = {};
        var allGerberFiles = {};
        _.forEach(files, function (file) {
            if (service.isGerber(file.fileType)) {
                allGerberFiles[file.nameRaw] = allGerberFiles[file.nameRaw] || [];
                gerberFileTypes[file.nameRaw] = gerberFileTypes[file.nameRaw] || [];
                if (gerberFileTypes[file.nameRaw].indexOf(file.fileType) == -1) {
                    gerberFileTypes[file.nameRaw].push(file.fileType);
                    allGerberFiles[file.nameRaw].push(file);
                }
            }
        });
        _.forEach(allGerberFiles, function (gerberFiles, name) {
            // If we have a gerber - create a virtual file.
            if (gerberFiles.length > 3) {
                var virtualFile = _.extend({}, folderMeta, {
                    '.tag': 'virtual',
                    name: name + '.gerber',
                    size: _.sum(gerberFiles, 'size'),
                    fileType: 'gerber',
                    client_modified: _.reduce(gerberFiles, function (prevTime, file) {
                        var time = new Date(file.client_modified).getTime();
                        return time > prevTime ? time : prevTime;
                    }, 0),
                    path: path,
                    virtualChildren: gerberFiles,
                    virtualChildrenMap: _.map(gerberFiles, 'path'),
                    parentProject: projectStub,
                    endingUrl: service.getEndingUrl(projectStub, path),
                    provider: gerberFiles[0].provider
                });
                virtualFiles.push(virtualFile);
            }
        });

        return virtualFiles;
    }
}).service('SyncUrlService', function ($state) {
    var service = this;
    this.getPath = getPath;
    this.getChildPath = getChildPath;
    this.parseChildren = parseChildren;
    this.parsePath = parsePath;

    /////////////////

    function getPath(meta, head) {
        // If head = true - we do not add a specific verion
        if (meta.rev && !head) {
            return meta.path + '@' + meta.rev;
        } else {
            return meta.path;
        }
    }

    function getChildPath(children, head) {
        // If head = true - we do not add a specific verion
        if (children) {
            return _.map(children, function (child) {
                return service.getPath(child, head);
            }).join(',');
        }
    }

    function parseChildren(children) {
        if (children) {
            var childrenSplit = children.split(',');
            return _.map(childrenSplit, function (child) {
                var nameSplit = child.split('@');
                return {
                    path: nameSplit[0],
                    rev: nameSplit[1]
                };
            });
        }
    }
    function parsePath(path) {
        var nameSplit = path.split('@');
        return {
            path: nameSplit[0],
            rev: nameSplit[1]
        };
    }
}).directive('fileThumbnail', function () {
    return {
        restrict: 'E',
        scope: {
            endingUrl: '=?',
            fileType: '=',
            thumbLink: '=?'
        },
        templateUrl: 'app/modules/sync/tpls/file-thumbnail.html',
        controller: function controller($scope) {
            var imageTypes = ['jpeg', 'png', 'jpg'];
            if (imageTypes.indexOf($scope.fileType) != -1) {
                $scope.isImage = true;
                $scope.thumnailPath = $scope.thumbLink || 'api/v1/sync/thumbnail/' + $scope.endingUrl;
            } else {
                $scope.thumnailPath = '/assets/images/vectors/filetype/' + ($scope.fileType || 'folder') + '.svg';
            }
        }
    };
}).directive('fileBreadCrumbs', function () {
    return {
        restrict: 'E',
        scope: {
            breadCrumbs: '=',
            project: '=',
            showProjectName: '=',
            selectFn: '=?'
        },
        templateUrl: 'app/modules/sync/tpls/file-bread-crumbs.html',
        controller: function controller($scope, SyncUtilService) {
            $scope.select = function (item) {
                if ($scope.selectFn) {
                    $scope.selectFn(item);
                } else {
                    SyncUtilService.openFileFolder(item);
                }
            };
        }
    };
}).directive('fileReadme', function () {
    return {
        restrict: 'E',
        scope: {
            project: '=',
            files: '=?', // Either path or files is required
            path: '@?', // Either path or files is required
            readme: '='
        },
        templateUrl: 'app/modules/sync/tpls/file-readme.html',
        controller: function controller($scope, SyncService) {
            $scope.readme = $scope.readme || {};

            if ($scope.files) {
                var found;
                _.forEach($scope.files, function (item) {
                    if (item.name.toLowerCase() == 'readme.md') {
                        found = item;
                    } else if (item.name.toLowerCase() == 'readme.txt' && !found) {
                        found = item;
                    }
                });

                // If a file is found - get it.
                if (found) {
                    $scope.readme.body = ' ';
                    $scope.readme.loading = true;
                    SyncService.download(found.downloadUrl).then(function (response) {
                        $scope.readme.path = found.path;
                        $scope.readme.loading = false;
                        $scope.readme.body = response.data;
                    });
                }
            } else if ($scope.path) {
                $scope.readme.body = ' ';
                $scope.readme.loading = true;
                SyncService.download('api/v1/sync/download/' + $scope.project.stub + '/' + $scope.path).then(function (response) {
                    $scope.readme.path = $scope.path;
                    $scope.readme.loading = false;
                    $scope.readme.body = response.data;
                });
            }
        }
    };
}).directive('fileList', function () {
    return {
        restrict: 'E',
        scope: {
            project: '=',
            path: '=',
            selectFn: '=?'
        },
        templateUrl: 'app/modules/sync/tpls/file-list.html',
        controller: function controller($scope, SyncUtilService, SyncService, $stateParams) {
            $scope.loading = true;
            SyncService.list($scope.project.stub, $scope.path || '').then(function (response) {
                $scope.files = response.data.entries;
                $scope.loading = false;

                var lastType;
                _.forEach($scope.files, function (item, idx) {
                    // Check to see if this file is part of current path
                    if ($stateParams.path && $stateParams.path.substring(0, item.path.length) == item.path) {
                        item.isCurrent = true;
                    }
                    // If we transition from files to folders, add a divider
                    lastType = lastType || item['.tag'];
                    if (item['.tag'] != lastType) {
                        // Set the last item to isDivider
                        if ($scope.files[idx - 1]) {
                            $scope.files[idx - 1].isDivider = true;
                        }
                    }
                    lastType = item['.tag'];
                });
            });
            $scope.select = function (item) {
                if ($scope.selectFn) {
                    $scope.selectFn(item);
                } else {
                    SyncUtilService.openFileFolder(item);
                }
            };
        }
    };
});
'use strict';

angular.module('modules.tab-dropdown', []);
angular.module('modules.tab-dropdown').directive('tabDropdown', function ($compile, $document, $timeout) {
    return {
        restrict: 'A',
        scope: {
            tabDropdown: '='
        },
        link: function link(scope, element, attrs) {

            element.bind("click", function (e) {
                var dropdownEl = createDropdown();
                positionElement(dropdownEl);
                $timeout(function () {
                    bindCloseClick(dropdownEl);
                }, 10);
            });

            // Hoisted functions --------------------------
            function bindCloseClick(dropdown) {
                $document.bind('click touchstart', function (e) {
                    dropdown.remove();
                    unbindCloseClick();
                });
            }
            function unbindCloseClick() {
                $document.unbind('click touchstart');
            }
            function positionElement(dropdown) {
                var boundingRect = element[0].getBoundingClientRect();
                dropdown.css({
                    'position': 'fixed',
                    'top': boundingRect.top,
                    'left': boundingRect.left,
                    'right': window.innerWidth - boundingRect.right

                });
            }

            function createDropdown() {
                var template = angular.element('<tab-dropdown>' + '<div ng-repeat="item in tabDropdown">' + '<a>{{item.name}}</a>' + '</div>' + '</tab-dropdown>');
                // Compile the element
                $compile(template)(scope);
                // Append element to body
                angular.element(document.body).append(template);
                return template;
            }
        }
    };
});
'use strict';

angular.module('modules.tables', []);
angular.module('modules.tables').directive('filterColumnOrder', function ($parse, $stateParams) {
    /***********************************************
    filterObject : {
        model: '',
        reverse: '',
        onChange: function to run on change
        query: HttpQuery object (optional)
    }
      ************************************************/
    return {
        restrict: 'A',
        scope: {
            filterObject: '=',
            filterModel: '@',
            filterReverse: '=?', // true || false' - If true we can sort ascending, otherwise only descending
            filterQuery: '=?'
        },
        link: function link(scope, element, attrs) {

            element.bind('click', function (event) {
                // If this column is already selected, reverse
                if (scope.filterObject.model == scope.filterModel && scope.filterReverse) {
                    scope.filterObject.reverse = !scope.filterObject.reverse;
                }
                // Else, we filter by this column
                else {
                        scope.filterObject.model = scope.filterModel;
                        scope.filterObject.reverse = false;
                    }
                // If an onChange function exists
                if (scope.filterObject.onChange) {
                    scope.filterObject.onChange({
                        model: scope.filterObject.model,
                        reverse: scope.filterObject.reverse
                    });
                }
                // If the query object is supplied - run generic method
                var query = scope.filterObject.query || scope.filterQuery;
                if (query) {
                    query.params.sort = scope.filterObject.model;
                    query.params.order = scope.filterObject.reverse ? 'asc' : 'dsc';
                    query.updateQueryParams();
                    query.refresh();
                }
                scope.$apply();
            });
            scope.$watch('filterObject', function () {
                if (scope.filterObject.model == scope.filterModel) {
                    // Add classes for arrows
                    if (scope.filterObject.reverse === true) {
                        element.addClass('up');
                        element.removeClass('down');
                    } else if (scope.filterObject.reverse === false) {
                        element.addClass('down');
                        element.removeClass('up');
                    }
                } else {
                    element.removeClass('down');
                    element.removeClass('up');
                }
            }, true);
        }
    };
});
'use strict';

angular.module('modules.tabs', []);
angular.module('modules.tabs').directive('textTabs', function ($timeout) {
    return {
        restrict: 'AC',
        transclude: true,
        templateUrl: 'app/modules/tabs/tpls/tabs.html',
        link: function link(scope, element, attrs) {
            var scrollElement = angular.element(element.children()[1]);
            var fudgeFactor = 10; // If we are 10px from the end, the funtion will run
            $timeout(checkScroll, 1);
            scrollElement.bind('scroll', checkScroll);

            /////////////////////

            function checkScroll() {
                // If we are 10px from the end
                if (scrollElement[0].scrollLeft + scrollElement[0].offsetWidth + fudgeFactor > scrollElement[0].scrollWidth) {
                    element.removeClass('isNotEnded');
                } else {
                    element.addClass('isNotEnded');
                }

                if (scrollElement[0].scrollLeft > fudgeFactor) {
                    element.addClass('isNotStart');
                } else {
                    element.removeClass('isNotStart');
                }
            }
        }
    };
});
'use strict';

angular.module('modules.tags', ['modules.popup-cards']);
angular.module('modules.tags').directive('tags', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            tags: '=', // An array of tag objects
            type: '@?', // field || user || project || organisation || location
            size: '@?', // sm or xs or nothing for medium
            edit: '=?', // true or false to show edit
            image: '=?', // true or false to show image
            limit: '=?', // number - the number of tags to show
            evidence: '=?', // true or false - If true and type=field we show the evidence for the field
            status: '=?', // true or false - If true, we get the skill status for each field
            dropArea: '=?' },
        templateUrl: 'app/modules/tags/tpls/tags.html',
        link: function link(scope, element, attrs) {
            var path = 'app/modules/tags/tpls/types/';
            if (scope.edit) {
                scope.template = path + 'tag-edit.html';
            } else {
                scope.template = path + scope.type + '.html';
            }
        },
        controller: function controller($scope, CoreLibrary, SkillsService, Authentication) {
            $scope.limit = $scope.limit || '1000';
            // Useful functions
            $scope.delTag = function (idx) {
                $scope.tags.splice(idx, 1);
            };
            // Sortable
            $scope.sortableConfig = {
                handle: ".my-handle",
                animation: 150,
                group: $scope.type,
                onAdd: function onAdd(event) {
                    CoreLibrary.uniqueArray(event.models, '_id');
                }
            };

            if ($scope.status && $scope.type == 'field' && Authentication.currentUser._id) {
                _.forEach($scope.tags, function (tag) {
                    SkillsService.getStatus(tag._id).then(function (response) {
                        tag.active = response.status;
                    });
                });
            }
        }
    };
}).service('TagsModalService', function ($mdDialog) {
    this.editTags = function (event, data) {
        /****************************************************
        Data should contain the tags:
        data = {
            fields        : [],
            organisations : [],
            projects      : [],
        }
          This function returns a promise.
        This should be used to save or assign the results.
          ****************************************************/
        return $mdDialog.show({
            templateUrl: 'app/modules/tags/tpls/tags-edit-modal.html',
            controller: 'TagsEditModalCtrl',
            targetEvent: event,
            locals: {
                data: data
            }
        });
    };
}).controller('TagsEditModalCtrl', function (data, $scope, $mdDialog) {
    // Isolate the data
    $scope.data = angular.copy(data);
    // Set funtions
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.save = function () {
        $mdDialog.hide($scope.data);
    };
});
'use strict';

angular.module('modules.toc', []);
angular.module('modules.toc').directive('tocContent', function () {
    // This directive tkes in ngModel
    // It inspects this for h1,h2,h3 etc
    // These are used to created the TOC sections objects.
    return {
        restrict: 'A',
        scope: {
            tocPrepend: '=?',
            tocAppend: '=?',
            tocContent: '=',
            tocRefresh: '=?'
        },
        controller: function controller($scope, $document, $timeout, $element) {
            //$timeout(UpdateTOC,0)
            $scope.$watch('tocRefresh', function () {
                if ($scope.tocRefresh) {
                    $timeout(UpdateTOC, 0);
                }
            });

            /////////////////////////////////////

            function UpdateTOC() {
                var tocContent = angular.copy($scope.tocPrepend) || [];
                angular.forEach($element[0].querySelectorAll('h2,h3'), function (element) {
                    var id = ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
                    element.id = id;
                    var tocHeading = {
                        id: id,
                        level: element.tagName, // Set level so it can be used as class (section/h1/h2)
                        label: angular.element(element).text().slice(-1) === ':' ? angular.element(element).text().slice(0, -1) : angular.element(element).text(), // remove colon from end of text line if exists
                        element: element };
                    if (tocHeading.label.length > 2) {
                        // Only push if the heading has content (aka a label)
                        tocContent.push(tocHeading);
                    }
                });
                // Add the tocAppend data
                tocContent = tocContent.concat($scope.tocAppend);
                $scope.tocContent = tocContent;
            }
        }
    };
}).directive('tocNav', function () {
    return {
        restrict: 'E',
        scope: {
            sections: '='
        },
        templateUrl: 'app/modules/toc/tpls/toc.html',
        controller: function controller($scope, $document) {}
    };
});
'use strict';

angular.module('modules.top-banner', []);
angular.module('modules.top-banner').directive('topBanner', function () {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'app/modules/top-banner/tpls/top-banner.html',
		scope: {},
		controller: function controller($rootScope, $stateParams, $scope, $timeout, TopBannerService, AuthenticationModalService, Authentication, $state, $http, $mdToast, OnboardingService) {
			$scope.TopBannerService = TopBannerService;
			$scope.currentUser = Authentication.currentUser;

			$scope.$on("authentication.logIn", $scope.TopBannerService.hideBanner);
			$scope.$on("authentication.logOut", $scope.TopBannerService.showBanner);

			// Email validation banner
			$scope.resendVerification = resendVerification;
			$scope.resendVerificationDisabled = false;
			$scope.resendVerificationCount = 0;

			// Signup Banner
			$scope.signup = AuthenticationModalService.login; // function()
			$scope.learnMore = OnboardingService.goToLanding; // function()

			///////////////////////////////////////////


			function resendVerification() {
				$http.get('/api/v1/account/reverify');
				$scope.resendVerificationDisabled = true;
				$scope.resendVerificationCount++;
				$timeout(function () {
					$scope.resendVerificationDisabled = false;
				}, 5000);
				$mdToast.show({
					controller: function controller($scope, $mdToast) {
						$scope.closeToast = function () {
							$mdToast.hide();
						};
						$scope.currentUser = Authentication.currentUser;
					},
					template: '<md-toast>' + '<span flex>Email sent to {{currentUser.email}}</span>' + '<md-button ui-sref="app.usersettings.account" ng-click="closeToast()">' + 'Change Email' + '</md-button>' + '</md-toast>',
					hideDelay: 8000,
					position: 'bottom left'
				});
			}
		}
	};
}).service('TopBannerService', function () {
	// Intialise
	var self = this;
	var body = angular.element(document.body);

	// Accessible
	this.banner = {
		//		message: 'New to STEMN?',
		open: false,
		closed: false };
	this.showBanner = showBanner; //function()
	this.hideBanner = hideBanner; //function()
	this.closeBanner = closeBanner; //function()

	///////////////////////////////////

	function showBanner() {
		self.banner.open = true;
		body.addClass('top-banner-open');
	}
	function hideBanner() {
		self.banner.open = false;
		body.removeClass('top-banner-open');
	}
	function closeBanner() {
		self.banner.open = false;
		self.banner.closed = true;
		body.removeClass('top-banner-open');
	}
});
'use strict';

angular.module('modules.transition-overlay', []);
// This will apply a transition overlay on State-Change start
// Overlay will be removed after success
angular.module('modules.transition-overlay').directive('transitionOverlay', function ($rootScope) {
    return {
        restrict: 'E',
        scope: {},
        replace: true,
        template: '<div class="transition-overlay" ng-show="OverlayService.transitionOverlay.show"></div>',
        controller: function controller($scope, $rootScope, OverlayService) {
            $scope.OverlayService = OverlayService;
            $rootScope.$on('$stateChangeStart', function () {
                OverlayService.transitionOverlay.show = true;
            });
            $rootScope.$on('$stateChangeSuccess', function () {
                OverlayService.transitionOverlay.show = false;
            });
            $rootScope.$on('$stateChangeError', function () {
                OverlayService.transitionOverlay.show = false;
            });
        }
    };
}).service('OverlayService', function () {
    this.transitionOverlay = {
        show: false
    };
});
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*jshint globalstrict: true*/
/*jshint undef:false */

// @todo NOTE We should investigate changing default to 
// $routeChangeStart see https://github.com/angular-ui/ui-router/blob/3898270241d4e32c53e63554034d106363205e0e/src/compat.js#L126

angular.module('unsavedChanges', ['lazyModel']);

angular.module('unsavedChanges').provider('unsavedWarningsConfig', function () {

    var _this = this;

    // defaults
    var logEnabled = false;
    var useTranslateService = true;
    var routeEvent = ['$locationChangeStart', '$stateChangeStart'];
    var navigateMessage = 'You will lose unsaved changes if you leave this page';
    var reloadMessage = 'You will lose unsaved changes if you reload this page';

    Object.defineProperty(_this, 'navigateMessage', {
        get: function get() {
            return navigateMessage;
        },
        set: function set(value) {
            navigateMessage = value;
        }
    });

    Object.defineProperty(_this, 'reloadMessage', {
        get: function get() {
            return reloadMessage;
        },
        set: function set(value) {
            reloadMessage = value;
        }
    });

    Object.defineProperty(_this, 'useTranslateService', {
        get: function get() {
            return useTranslateService;
        },
        set: function set(value) {
            useTranslateService = !!value;
        }
    });

    Object.defineProperty(_this, 'routeEvent', {
        get: function get() {
            return routeEvent;
        },
        set: function set(value) {
            if (typeof value === 'string') value = [value];
            routeEvent = value;
        }
    });
    Object.defineProperty(_this, 'logEnabled', {
        get: function get() {
            return logEnabled;
        },
        set: function set(value) {
            logEnabled = !!value;
        }
    });

    this.$get = ['$injector', function ($injector) {

        function translateIfAble(message) {
            if ($injector.has('$translate') && useTranslateService) {
                return $injector.get('$translate')(message);
            } else {
                return false;
            }
        }

        var publicInterface = {
            // log function that accepts any number of arguments
            // @see http://stackoverflow.com/a/7942355/1738217
            log: function (_log) {
                function log() {
                    return _log.apply(this, arguments);
                }

                log.toString = function () {
                    return _log.toString();
                };

                return log;
            }(function () {
                if (console.log && logEnabled && arguments.length) {
                    var newarr = [].slice.call(arguments);
                    if (_typeof(console.log) === 'object') {
                        log.apply.call(console.log, console, newarr);
                    } else {
                        console.log.apply(console, newarr);
                    }
                }
            })
        };

        Object.defineProperty(publicInterface, 'useTranslateService', {
            get: function get() {
                return useTranslateService;
            }
        });

        Object.defineProperty(publicInterface, 'reloadMessage', {
            get: function get() {
                return translateIfAble(reloadMessage) || reloadMessage;
            }
        });

        Object.defineProperty(publicInterface, 'navigateMessage', {
            get: function get() {
                return translateIfAble(navigateMessage) || navigateMessage;
            }
        });

        Object.defineProperty(publicInterface, 'routeEvent', {
            get: function get() {
                return routeEvent;
            }
        });

        Object.defineProperty(publicInterface, 'logEnabled', {
            get: function get() {
                return logEnabled;
            }
        });

        return publicInterface;
    }];
}).service('unsavedWarningSharedService', ['$rootScope', 'unsavedWarningsConfig', '$injector', function ($rootScope, unsavedWarningsConfig, $injector) {

    // Controller scopped variables
    var _this = this;
    var allForms = [];
    var areAllFormsClean = true;
    var removeFunctions = [angular.noop];

    // @note only exposed for testing purposes.
    this.allForms = function () {
        return allForms;
    };

    // save shorthand reference to messages
    var messages = {
        navigate: unsavedWarningsConfig.navigateMessage,
        reload: unsavedWarningsConfig.reloadMessage
    };

    // Check all registered forms 
    // if any one is dirty function will return true

    function allFormsClean() {
        areAllFormsClean = true;
        angular.forEach(allForms, function (item, idx) {
            unsavedWarningsConfig.log('Form : ' + item.$name + ' dirty : ' + item.$dirty);
            if (item.$dirty) {
                areAllFormsClean = false;
            }
        });
        return areAllFormsClean; // no dirty forms were found
    }

    // adds form controller to registered forms array
    // this array will be checked when user navigates away from page
    this.init = function (form) {
        if (allForms.length === 0) setup();
        unsavedWarningsConfig.log("Registering form", form);
        allForms.push(form);
    };

    this.removeForm = function (form) {
        var idx = allForms.indexOf(form);

        // this form is not present array
        // @todo needs test coverage 
        if (idx === -1) return;

        allForms.splice(idx, 1);
        unsavedWarningsConfig.log("Removing form from watch list", form);

        if (allForms.length === 0) tearDown();
    };

    function tearDown() {
        unsavedWarningsConfig.log('No more forms, tearing down');
        angular.forEach(removeFunctions, function (fn) {
            fn();
        });
        window.onbeforeunload = null;
    }

    // Function called when user tries to close the window
    this.confirmExit = function () {
        // @todo this could be written a lot cleaner! 
        if (!allFormsClean()) return messages.reload;
        tearDown();
    };

    // bind to window close
    // @todo investigate new method for listening as discovered in previous tests

    function setup() {
        unsavedWarningsConfig.log('Setting up');

        window.onbeforeunload = _this.confirmExit;

        var eventsToWatchFor = unsavedWarningsConfig.routeEvent;

        angular.forEach(eventsToWatchFor, function (aEvent) {
            // calling this function later will unbind this, acting as $off()
            var removeFn = $rootScope.$on(aEvent, function (event, next, current) {
                unsavedWarningsConfig.log("user is moving with " + aEvent);
                // @todo this could be written a lot cleaner! 
                if (!allFormsClean()) {
                    unsavedWarningsConfig.log("a form is dirty");
                    if (!confirm(messages.navigate)) {
                        unsavedWarningsConfig.log("user wants to cancel leaving");
                        event.preventDefault(); // user clicks cancel, wants to stay on page 
                    } else {
                        unsavedWarningsConfig.log("user doesn't care about loosing stuff");
                    }
                } else {
                    unsavedWarningsConfig.log("all forms are clean");
                }
            });
            removeFunctions.push(removeFn);
        });
    }
}]).directive('unsavedWarningClear', ['unsavedWarningSharedService', function (unsavedWarningSharedService) {
    return {
        scope: true,
        require: '^form',
        priority: 3000,
        link: function link(scope, element, attrs, formCtrl) {
            element.bind('click', function (event) {
                formCtrl.$setPristine();
            });
        }
    };
}]).directive('unsavedWarningForm', ['unsavedWarningSharedService', function (unsavedWarningSharedService) {
    return {
        require: 'form',
        link: function link(scope, formElement, attrs, formCtrl) {

            // register this form
            unsavedWarningSharedService.init(formCtrl);

            // bind to form submit, this makes the typical submit button work
            // in addition to the ability to bind to a seperate button which clears warning
            formElement.bind('submit', function (event) {
                if (formCtrl.$valid) {
                    formCtrl.$setPristine();
                }
            });

            // @todo check destroy on clear button too? 
            scope.$on('$destroy', function () {
                unsavedWarningSharedService.removeForm(formCtrl);
            });
        }
    };
}]);

/**
 * --------------------------------------------
 * Lazy model adapted from vitalets
 * @see https://github.com/vitalets/lazy-model/
 * --------------------------------------------
 *
 */
angular.module('lazyModel', []).directive('lazyModel', ['$parse', '$compile', function ($parse, $compile) {
    return {
        restrict: 'A',
        priority: 500,
        terminal: true,
        require: '^form',
        scope: true,
        compile: function compile(elem, attr) {
            // getter and setter for original model
            var ngModelGet = $parse(attr.lazyModel);
            var ngModelSet = ngModelGet.assign;
            // set ng-model to buffer in isolate scope
            elem.attr('ng-model', 'buffer');
            // remove lazy-model attribute to exclude recursion
            elem.removeAttr("lazy-model");
            return {
                pre: function pre(scope, elem) {
                    // initialize buffer value as copy of original model 
                    scope.buffer = ngModelGet(scope.$parent);
                    // compile element with ng-model directive pointing to buffer value   
                    $compile(elem)(scope);
                },
                post: function postLink(scope, elem, attr, formCtrl) {
                    // bind form submit to write back final value from buffer
                    var form = elem.parent();
                    while (form[0].tagName !== 'FORM') {
                        form = form.parent();
                    }
                    form.bind('submit', function () {
                        // form valid - save new value
                        if (formCtrl.$valid) {
                            scope.$apply(function () {
                                ngModelSet(scope.$parent, scope.buffer);
                            });
                        }
                    });
                    form.bind('reset', function (e) {
                        e.preventDefault();
                        scope.$apply(function () {
                            scope.buffer = ngModelGet(scope.$parent);
                        });
                    });
                }
            };
        }
    };
}]);
'use strict';

angular.module('modules.upload-files', []);
angular.module('modules.upload-files').directive('uploadFilesDisplay', function (FileUploadService, UploadsModalService) {
	return {
		restrict: 'E',
		templateUrl: 'app/modules/upload-files/tpls/upload-files-display.html',
		scope: {
			edit: '=',
			files: '='
		},
		controller: function controller($scope) {
			// Defaults
			$scope.files = $scope.files || [];

			$scope.sortableConfig = {
				handle: ".my-handle",
				draggable: ".draggable",
				group: 'files',
				animation: 150,
				onSort: function onSort(event) {
					_.forEach(event.models, function (item, index) {
						// The item does not exist or has an error, remove it
						if (!item || !item.url) {
							event.models.splice(index, 1);
						}
					});
				}
			};
			$scope.uploader = FileUploadService.generalFileUploader();
			$scope.uploader.onCompleteItem = function (item, response, status, headers) {
				var splitType = item.file.name.split('.');
				item.file.type = splitType[splitType.length - 1];
				$scope.files.push(item.file);
			};

			$scope.delete = deleteFile; //function(index)

			//////////////////////////////////////////

			function deleteFile(index) {
				$scope.files.splice(index, 1);
			}
		}
	};
}).directive('uploadedFile', function ($mdDialog) {
	return {
		restrict: 'E',
		templateUrl: 'app/modules/upload-files/tpls/uploaded-file.html',
		controller: function controller($scope) {

			$scope.editFile = editFile; //function(event)

			///////////////////////////////////////////////

			function editFile(event) {
				$mdDialog.show({
					templateUrl: 'app/modules/upload-files/tpls/uploaded-file-edit-modal.html',
					controller: function controller(data, $scope) {
						$scope.data = angular.copy(data);
						$scope.cancel = function () {
							$mdDialog.cancel();
						};
						$scope.delete = function () {
							$mdDialog.hide('delete');
						};
						$scope.save = function () {
							if ($scope.LinkForm.$valid) {
								$mdDialog.hide($scope.data);
							}
						};
					},
					targetEvent: event,
					locals: { data: $scope.file }
				}).then(function (result) {
					if (result == 'delete') {
						$scope.delete($scope.$index);
					} else {
						$scope.file = result;
					}
				});
			}
		}
	};
});
'use strict';

angular.module('modules.uploads', ['modules.upload-files']);
angular.module('modules.uploads').directive('uploadImage', function ($compile, UploadsModalService, $timeout, FileUploadService) {
    /***************************************************************
    This element directive is used to wrap an image element.
      It can be combined with an ng-model and name to create a memory of previous state (using edit directive)
        <upload-image name="ThreadImage" image="thread.image" ng-model="thread.image">
            <img ng-src="{{thread.image}}">
        </upload-image>
      The image url is assigned to the object passed in using [image] attr
      ****************************************************************/
    return {
        restrict: 'E',
        trasclude: 'true',
        scope: {
            image: '=', // The image that will be uploaded, the url will be pass back though this.
            direct: '=?', // true || false - If true, the upload dialog will pop directly without the drag/drop modal
            icon: '=?', // true || false - If false, the upload icon will be hidden
            circle: '=?', // true || false - If true, we add border-radius: 50%
            noOverlay: '=?' // true || false - If true, we don't add a dark overlay
        },
        link: function link(scope, element, attrs) {
            // The image should be the first child
            var image = angular.element(element.children()[0]);
            $timeout(function () {
                if (!scope.noOverlay) {
                    image.addClass('darken-image');
                }
                element.css({ cursor: 'pointer' });
            });

            // Create the child
            var child;
            if (scope.direct) {
                scope.uploader = FileUploadService.uploader();
                scope.uploader.onCompleteItem = function (item, response, status, headers) {
                    if (item.file.url && item.file.url != 'false') {
                        scope.image = item.file.url;
                    }
                };
                child = angular.element('<label class="btn-upload" layout="column" layout-align="center center" ng-class="{\'img-circle\' : circle}" style="overflow: hidden;">' + '<input type="file" accept=".png, .jpg, .jpeg, .gif" class="upload" nv-file-select="" uploader="uploader" />' + '<md-icon ng-show="icon" style="color: #FFF;" class="upload-icon" md-svg-icon="upload"></md-icon>' + '<loading-overlay ng-if="uploader.progress > 0 && uploader.progress < 100" determinate="uploader.progress"></loading-overlay>' + '<loading-overlay ng-if="uploader.progress == 100 && !uploader.queue[uploader.queue.length-1].file.url"></loading-overlay>' + '</label>');
            } else {
                child = angular.element('<md-icon ng-show="icon" style="color: #FFF;" class="upload-icon" md-svg-icon="upload"></md-icon>');
            }

            // Insert it after the input box
            element.append(child);
            // Add it to the compile
            $compile(child)(scope);
            // Add the click event, this will pop the upload image modal and set the image url to scope.image
            element.bind('click', function (event) {
                if (!scope.direct) {
                    UploadsModalService.uploadImageNewModal(event, scope.image).then(function (result) {
                        scope.image = result.url;
                    });
                }
                // Else, pop the upload select directly
            });
        }
    };
}).directive('clickUploadImage', function (UploadsModalService) {
    return {
        restrict: 'A',
        scope: {
            image: '='
        },
        link: function link(scope, element, attrs) {
            element.bind('click', function (event) {
                UploadsModalService.uploadImageNewModal(event).then(function (result) {
                    scope.image = result.url;
                });
            });
        }
    };
}).service('UploadsModalService', function ($mdDialog) {

    this.uploadImageNewModal = function (event, data) {
        /***********************************************************
        This modal will return a promise.
        The uploaded image url will be available using:
          .then(function (result) {
            console.log(result + ' is the image url')
        });
        ************************************************************/
        return $mdDialog.show({
            templateUrl: 'app/modules/uploads/tpls/upload-image-new-modal.html',
            controller: 'UploadImageNewModalCtrl',
            targetEvent: event,
            clickOutsideToClose: true,
            locals: {
                data: data
            }
        });
    };
    this.uploadImagesNewModal = function (event, data) {
        /***********************************************************
        This modal will return a promise.
        The uploaded images  will be available using:
          .then(function (result) {
            console.log(result + ' is the array of image urls')
        });
        ************************************************************/

        return $mdDialog.show({
            templateUrl: 'app/modules/uploads/tpls/upload-images-new-modal.html',
            controller: 'UploadImagesNewModalCtrl',
            targetEvent: event,
            locals: {
                data: data
            }
        });
    };
    this.uploadFiles = function (event, data) {
        /***********************************************************
        This modal will return a promise.
        The uploaded files  will be available using:
          .then(function (result) {
            console.log(result + ' is the array of files')
        });
        ************************************************************/

        return $mdDialog.show({
            templateUrl: 'app/modules/uploads/tpls/upload-files-modal.html',
            controller: 'UploadFilesModalCtrl',
            targetEvent: event,
            clickOutsideToClose: true,
            locals: {
                data: data
            }
        });
    };
}).controller('UploadImageNewModalCtrl', function (data, $scope, $mdDialog, FileUploadService) {
    $scope.currentImage = data;
    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    // Scoped functions
    $scope.remove = remove;

    $scope.uploader = FileUploadService.uploader();
    $scope.uploader.onCompleteItem = function (item, response, status, headers) {
        var image = {
            url: response.url,
            width: response.width,
            height: response.height
        };
        $mdDialog.hide(image);
    };

    /////////////////////////////////

    function remove() {
        $mdDialog.hide({ url: '' });
    }
}).controller('UploadImagesNewModalCtrl', function (data, $scope, $mdDialog, FileUploadService) {
    $scope.images = angular.copy(data);

    $scope.sortableConfig = {
        animation: 150
    };
    $scope.remove = function (index) {
        $scope.images.splice(index, 1);
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.save = function () {
        $mdDialog.hide($scope.images);
    };
    $scope.uploader = FileUploadService.uploader();
    $scope.uploader.onCompleteItem = function (item, response, status, headers) {
        $scope.images.push({ url: item.file.url });
    };
}).controller('UploadFilesModalCtrl', function (data, $scope, $mdDialog, FileUploadService) {
    var files = [];
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.uploader = FileUploadService.generalFileUploader();
    $scope.uploader.onCompleteItem = function (item, response, status, headers) {
        var splitType = item.file.name.split('.');
        item.file.type = splitType[splitType.length - 1];
        files.push(item.file);
        if ($scope.uploader.progress == 100) {
            $mdDialog.hide(files);
        }
    };
}).

//controller('TestCtrl', function ($rootScope, $scope) {
//
//    $scope.files = [
//        {
//            url: '/uploads/upload_b0288c19ac5f29e4bd793cdef14a6c2f.png'
//        }
//    ]
//    $scope.uploadImageModal = function(files, single, crop, shape, imgSize, aspect){
////        $modal.open({
////            templateUrl: 'app/modules/uploads/tpls/crop-imageuploadmodal.html',
////            size: 'md',
////            backdrop: 'static',
////            resolve: {
////                data: function () {
////                    return {
////                        files   : files,
////                        single  : single,
////                        crop    : crop,
////                        shape   : shape,
////                        imgSize : imgSize,
////                        aspect  : aspect,
////                    }
////                }
////            },
////            controller: function($scope, $modalInstance, data){
////                $scope.files  = data.files;
////                $scope.single = data.single;
////                $scope.crop   = data.crop;
////                $scope.shape  = data.shape;
////                $scope.imgSize= data.imgSize;
////                $scope.aspect = data.aspect;
////
////                $scope.closeModal = function () {
////                    $modalInstance.close();
////                }
////                $scope.saveCloseModal = function () {
////                    $modalInstance.close({
////                        files: $scope.files
////                    });
////                }
////            }
////        }).result.then(function (result) {
////            // If the modal was saved
////            if (result) {
////                $scope.files = result.files;
////            }
////        });
//    };
//}).

service('FileUploadService', function (FileUploader, $mdToast, Authentication, $state, $stateParams) {

    this.uploader = function () {
        var uploader = new FileUploader({
            url: '/api/v1/uploads',
            autoUpload: true,
            headers: {
                Authorization: 'Bearer ' + Authentication.getToken()
            },
            formData: [{ state: $state.current.name }, { params: JSON.stringify($stateParams) }]
        });
        uploader.filters.push(imageTypeFilter);
        uploader.filters.push(fileSizeFilter);
        // CALLBACKS
        uploader.onSuccessItem = onSuccessitem;
        uploader.onErrorItem = onErrorItem;
        return uploader;
    };
    this.generalFileUploader = function () {
        var uploader = new FileUploader({
            url: '/api/v1/uploads/files',
            autoUpload: true,
            headers: {
                Authorization: 'Bearer ' + Authentication.getToken()
            },
            formData: [{ state: $state.current.name }, { params: JSON.stringify($state.current.params) }]
        });
        uploader.filters.push(fileSizeFilter);
        // CALLBACKS
        uploader.onSuccessItem = onSuccessitem;
        uploader.onErrorItem = onErrorItem;
        return uploader;
    };
    this.documentFileUploader = function () {
        var uploader = new FileUploader({
            url: '/api/v1/uploads/files',
            autoUpload: true,
            headers: {
                Authorization: 'Bearer ' + Authentication.getToken()
            },
            formData: [{ state: $state.current.name }, { params: JSON.stringify($state.current.params) }]
        });
        uploader.filters.push(documentTypeFilter);
        uploader.filters.push(fileSizeFilter);
        // CALLBACKS
        uploader.onSuccessItem = onSuccessitem;
        uploader.onErrorItem = onErrorItem;
        return uploader;
    };

    this.FileItem = FileUploader.FileItem;

    ////////////////////////////////////////////////////
    var imageTypeFilter = {
        name: 'imageFilter',
        types: '|jpg|png|jpeg|bmp|gif|',
        fn: function fn(item, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            if ('|jpg|jpeg|png|bmp|gif|'.indexOf(type) == -1) {
                $mdToast.show($mdToast.simple().theme('warn').content('We only accept jpg, png, bmp, and gif.'));
                return false;
            } else {
                return true;
            }
        }
    };
    var documentTypeFilter = {
        name: 'documentFilter',
        fn: function fn(item, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            var splitName = item.name.split('.');
            if (splitName[splitName.length - 1] != 'docx') {
                $mdToast.show($mdToast.simple().theme('warn').content('Invalid file. We only accept .docx'));
                return false;
            } else {
                return true;
            }
        }
    };
    var fileSizeFilter = {
        name: 'fileSize',
        fn: function fn(item) {
            if (item.size > 10485760) {
                $mdToast.show($mdToast.simple().theme('warn').content('File too large. Try and keep it under 10MB would ya?'));
                return false;
            } else {
                return true;
            }
        }
    };
    function onAfterAddingFile(item) {
        item.croppedImage = '';
        var reader = new FileReader();
        reader.onload = function (event) {
            item.image = event.target.result;
        };
        reader.readAsDataURL(item._file);
    }
    function onErrorItem(fileItem, response, status, headers) {
        $mdToast.show($mdToast.simple().theme('warn').content('Something went wrong, your file was not uploaded.'));
    }
    function onSuccessitem(fileItem, response, status, headers) {
        fileItem.file.url = response.url;
    }
}).

// Links the Image Cropping Modal to the Profile Picture
service('ImageCropService', function () {
    return { image: '' };
}).controller('CropCtrl', function ($scope, ImageCropService) {

    $scope.myImage = ImageCropService.image;
    $scope.myCroppedImage = '';
    $scope.ImageCropService = ImageCropService;

    $scope.EndCrop = function (data) {
        ImageCropService.image = $scope.myCroppedImage;
    };

    var handleFileSelect = function handleFileSelect(evt) {
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function ($scope) {
                $scope.myImage = evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
});
'use strict';

angular.module('modules.user-subdomain', []);
angular.module('modules.user-subdomain').directive('userSubdomainInput', function () {
    return {
        restrict: 'E',
        scope: {
            displayType: '@?', // '' || 'form' - Changes the display to be a simple form
            username: '=?'
        },
        templateUrl: 'app/modules/user-subdomain/tpls/user-subdomain-input.html',
        controller: 'userSubdomainCtrl'
    };
}).controller('userSubdomainCtrl', function ($scope, $state, $timeout, $mdToast, CoreLibrary, SearchService, EntityService, AuthenticationModalService, Authentication, UserSubdomainService) {
    $scope.checkUsernameExists = checkUsernameExists; // function(username)
    $scope.forms = {};

    $scope.formModel = {
        username: angular.copy($scope.username)
    };

    $scope.submit = function () {
        if ($scope.forms.GetSubdomainForm.subdomain.$valid) {
            // If not logged in, pop register
            if (!Authentication.currentUser.isLoggedIn()) {
                UserSubdomainService.username = $scope.formModel.username;
                var data = {
                    title: 'Sign in to claim',
                    subtitle: 'Your domain will be ' + UserSubdomainService.username + '.stemn.com'
                };
                AuthenticationModalService.login(null, data);
            }
            // Else, save
            else {
                    UserSubdomainService.username = $scope.formModel.username;
                    UserSubdomainService.saveUsername(Authentication.currentUser._id).then(function () {
                        $scope.username = angular.copy($scope.formModel.username);
                        EntityService.updateSuccess();
                        $scope.forms.GetSubdomainForm.$setPristine();
                    });
                }
        } else {
            $mdToast.show($mdToast.simple().theme('warn').content('That domain is not available.'));
        }
    };

    /////////////////////////////////////////////////

    function checkUsernameExists(name) {
        if (name) {
            $scope.formModel.username = CoreLibrary.stubify(name);
            if ($scope.formModel.username) {
                SearchService.search({
                    type: 'user',
                    key: 'stub',
                    value: $scope.formModel.username,
                    match: 'insensitive',
                    published: 'both'
                }).then(function (response) {
                    if (response.data.length === 0) {
                        $scope.forms.GetSubdomainForm.subdomain.$setValidity('nameexists', true);
                    } else {
                        $scope.forms.GetSubdomainForm.subdomain.$setValidity('nameexists', false);
                    }
                });
            }
        }
    }
}).service('UserSubdomainService', function (Restangular, LocalCache, $rootScope) {
    var service = this;
    this.username = ''; // This is where the user's chosen username is stored for later use
    this.saveUsername = saveUsername; // function() This will save the username to the server. The user's id is passed in;

    //////////////////////////////////////////

    function saveUsername(id) {
        // Get the user
        if (service.username) {
            return Restangular.one('users', id).get().then(function (user) {
                user.profile.username = service.username;
                user.stub = service.username;
                // Save the user
                LocalCache.save('user' + 'lg', user);
                $rootScope.$broadcast('user.save');
                return user.put();
            });
        }
    }
});
'use strict';

angular.module('modules.user-widgets', ['modules.checklist', 'modules.feed']);
angular.module('modules.user-widgets').directive('userPortfolioWidget', function ($state, $timeout, $window, OrganisationModalService, UserService, ProjectCreateModalService, UserWidgetService, UserWidgetModalService, FeedService) {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/user-widgets/tpls/user-portfolio-widget.html',
        controller: function controller($scope, Authentication) {}
    };
}).directive('userCompletionWidget', function ($timeout, $window, UserService, ProjectCreateModalService, UserWidgetService, UserWidgetModalService) {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/user-widgets/tpls/user-completion-widget.html',
        scope: {
            displayType: '@?', // banner
            completionPercentage: '=?' // The completion percentage to be passed up the scope.
        },
        controller: function controller($scope, Authentication) {
            getCompletionPercentage();
            $scope.$on("user.save", getCompletionPercentage);
            $scope.checklistModal = UserWidgetModalService.checklist; // function(event)

            ///////////////////////////////////////////////////////////

            function getCompletionPercentage() {
                UserService.getUser(Authentication.currentUser._id, 'lg').then(function (user) {
                    $scope.status = UserWidgetService.getCompletionStatus(user);
                    $scope.completionPercentage = UserWidgetService.getCompletionPercentage();
                });
            }
        }
    };
}).directive('userOrganisationsWidget', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/user-widgets/tpls/user-organisations-widget.html',
        controller: function controller($scope, $state, Authentication, UserService, OrganisationModalService) {
            UserService.getUserOrgs(Authentication.currentUser._id).then(function (results) {
                $scope.organisations = results.data;
            });
            $scope.newOrganisation = function (event) {
                OrganisationModalService.organisationNewModal(event).then(function (result) {
                    $state.go('app.organisation.settings.overview', {
                        stub: result.stub
                    });
                });
            };
        }
    };
}).directive('userProjectsWidget', function () {
    return {
        restrict: 'E',
        scope: {
            query: '=?',
            size: '@?'
        },
        templateUrl: 'app/modules/user-widgets/tpls/user-projects-widget.html',
        controller: function controller($scope, Authentication, HttpQuery) {
            $scope.size = $scope.size || 7;
            $scope.query = HttpQuery({
                url: '/api/v1/search',
                params: {
                    type: 'project',
                    size: $scope.size,
                    sort: 'submitted',
                    select: ['name', 'stub', 'picture'],
                    parentType: 'user',
                    parentId: Authentication.currentUser._id
                }
            });
            $scope.query.more();
        }
    };
}).directive('userRecentWidget', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/user-widgets/tpls/user-recent-widget.html',
        scope: {
            displayType: '@?', // banner
            completionPercentage: '=?' // The completion percentage to be passed up the scope.
        },
        controller: function controller($scope, $http) {
            var page = 1;
            var size = 14;
            getRecentUsers();
            $scope.more = getRecentUsers; // function()

            ///////////////////////////////////////////////////////////

            function getRecentUsers() {
                var weekInMs = 7 * 24 * 60 * 60 * 1000;
                return $http({
                    url: "/api/v1/analytics/activeUsersInPeriod",
                    params: {
                        start: Date.now() - weekInMs,
                        days: 7,
                        repeat: 1,
                        page: page,
                        size: size,
                        picture: true
                    },
                    method: "GET"
                }).then(function (response) {
                    $scope.users = $scope.users || [];
                    if (response.data.length < size) {
                        $scope.noMoreResults = true;
                    }
                    $scope.users = $scope.users.concat(response.data);
                    page++;
                });
            }
        }
    };
}).service('UserWidgetService', function ($mdDialog, ThreadCreateModalService, ProjectCreateModalService) {
    var service = this;
    this.completionStatus = {};
    this.getCompletionStatus = getCompletionStatus; // function(user)
    this.getCompletionPercentage = getCompletionPercentage; // function()

    //////////////////////////////////////////////

    function getCompletionStatus(user) {
        service.completionStatus = [{
            status: user.name ? true : false,
            message: 'Add your name.',
            href: '/users/' + user.stub + '?edit=OverviewForm#name'
        }, {
            status: user.blurb ? true : false,
            message: 'Add a blurb.',
            href: '/users/' + user.stub + '?edit=OverviewForm#blurb'
        }, {
            status: user.picture ? true : false,
            message: 'Upload a profile picture.',
            href: '/users/' + user.stub + '?edit=OverviewForm#picture'
        }, {
            status: user.profile.banner.url ? true : false,
            message: 'Upload a custom image banner.',
            href: '/users/' + user.stub + '?edit=OverviewForm'
        }, {
            //			school     : {
            //				status : user.profile.school,
            //				message: 'Add your education',
            //				click  : ''
            //			},{
            status: user.profile.profileDetails.education[0] && (user.profile.profileDetails.education[0].degree || user.profile.profileDetails.education[0].organisations.length > 0) ? true : false,
            message: 'Add your education.',
            href: '/users/' + user.stub + '?edit=EducationForm#education'
        }, {
            status: user.profile.profileDetails.experience[0] && (user.profile.profileDetails.experience[0].company || user.profile.profileDetails.experience[0].organisations.length > 0) ? true : false,
            message: 'Add your work experience.',
            href: '/users/' + user.stub + '?edit=ExperienceForm#experience'
        }, {
            status: user.profile.profileDetails.summary ? true : false,
            message: 'Add a profile summary.',
            href: '/users/' + user.stub + '?edit=AboutForm#summary'
        }, {
            status: _.some(user.profile.socialLinks) ? true : false,
            message: 'Add links to your website / social media.',
            href: '/users/' + user.stub + '?edit=FooterForm#social'
        }, {
            status: user.numProjects ? true : false,
            message: 'Add a project.',
            click: ProjectCreateModalService.newProject
        }, {
            status: user.numBlogs ? true : false,
            message: 'Add a blog.',
            click: function click(event) {
                ThreadCreateModalService.newThread(event, { type: 'blog' });
            }
        }, {
            status: user.numThreads ? true : false,
            message: 'Add a discussion.',
            click: function click(event) {
                ThreadCreateModalService.newThread(event, { type: 'general' });
            }
        }, {
            status: user.numQuestions ? true : false,
            message: 'Ask a question.',
            click: function click(event) {
                ThreadCreateModalService.newThread(event, { type: 'question' });
            }
        }];
        return service.completionStatus;
    }

    function getCompletionPercentage() {
        var total = 0;
        var truthy = 0;
        _.forEach(service.completionStatus, function (item) {
            if (item.status) {
                truthy++;
            }
            total++;
        });
        return Math.round(truthy / total * 100);
    }
}).service('UserWidgetModalService', function ($mdDialog) {
    this.checklist = function (event) {
        return $mdDialog.show({
            templateUrl: 'app/modules/user-widgets/tpls/user-portfolio-checklist-modal.html',
            targetEvent: event,
            clickOutsideToClose: true,
            controller: function controller($scope, $mdDialog, UserWidgetService) {
                $scope.completionStatus = UserWidgetService.completionStatus;
                $scope.completionPecentage = UserWidgetService.getCompletionPercentage();
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
            }
        });
    };
});
'use strict';

angular.module('modules.users.permissions-edit', []);

angular.module('modules.users.permissions-edit').directive('usersPermissionsEdit', function ($mdDialog, $timeout) {
    return {
        restrict: 'E',
        scope: {
            users: '=',
            saveFn: '&?',
            userPermissions: '=?',
            parent: '=?',
            type: '@?' // project || organisation
        },
        templateUrl: 'app/modules/users/users-permissions-edit/tpls/users-permissions-edit.html',
        controller: function controller($scope, Authentication) {

            var permissions;
            if ($scope.type == 'organisation') {
                permissions = {
                    admin: {
                        value: 'admin',
                        title: 'Administrator',
                        icon: 'settings',
                        description: 'Administrator: Can do everything',
                        descriptionDetailed: 'Can add/remove users. Can change all settings.'
                    },
                    collaborator: {
                        value: 'collaborator',
                        title: 'Collaborator',
                        icon: 'edit',
                        description: 'Collaborator: Can view and edit',
                        descriptionDetailed: 'Can edit images and text. Can\'t invite or change major settings.'
                    }
                };
            } else {
                permissions = {
                    admin: {
                        value: 'admin',
                        title: 'Administrator',
                        icon: 'settings',
                        description: 'Administrator: Can do everything',
                        descriptionDetailed: 'Can add/remove users. Can change settings.'
                    },
                    collaborator: {
                        value: 'collaborator',
                        title: 'Collaborator',
                        icon: 'edit',
                        description: 'Collaborator: Can view and edit',
                        descriptionDetailed: 'Can sync all files. Can view all revisions.'
                    },
                    viewer: {
                        value: 'viewer',
                        title: 'Viewer',
                        icon: 'visibility',
                        description: 'Viewer: Can view but can\'t edit',
                        descriptionDetailed: 'Can comment and can view files.'
                    }
                };
            }

            $scope.permissions = permissions;

            $scope.deleteUser = deleteUser; // function(index)
            $scope.editUser = editUser; // function(event, index)
            $scope.userAddPreProcessFn = userAddPreProcessFn; // function(userResult)

            ///////////////////////
            function userAddPreProcessFn(result) {
                result.permissions = {
                    role: 'admin'
                };
                return result;
            }

            function deleteUser(index) {
                $scope.users.splice(index, 1);
                $timeout($scope.saveFn, 0);
            }
            function editUser(event, index) {
                var user = $scope.users[index];
                $mdDialog.show({
                    templateUrl: 'app/modules/users/users-permissions-edit/tpls/users-permissions-edit-modal.html',
                    controller: function controller($scope, $mdDialog) {
                        $scope.user = angular.copy(user);
                        $scope.cancel = $mdDialog.cancel; // function()
                        $scope.save = function () {
                            $mdDialog.hide($scope.user);
                        };
                        $scope.permissions = permissions;
                    },
                    targetEvent: event
                }).then(function (user) {
                    $scope.users[index] = user;
                    $timeout($scope.saveFn, 0);
                });
            }
        }
    };
});

//            $scope.usersGroups = teamToGroups($scope.users);
//
//            $scope.save = function(){
//                $scope.users = groupsToTeam($scope.usersGroups);
//                $timeout($scope.saveFn, 0);
//            }
//            $scope.$watch('usersGroups', function(){
//                $scope.users = groupsToTeam($scope.usersGroups);
//            }, true)
//
//            $scope.userSortConfig = {
//                group: 'users',
//                animation: 150,
//                handle: '.my-handle'
//            };
//            $scope.userGroupSortConfig = {
//                animation: 150,
//                handle: '.my-handle'
//            };
//            $scope.delete = function(group, index){
//                group.splice(index, 1);
//            }
//            $scope.newGroup = function(){
//                var emptyGroup = {
//                    name    : '',
//                    members : []
//                };
//                $scope.usersGroups.push(emptyGroup);
//            }
//
//            // If empty, add an empty group
//            if($scope.users.length === 0){
//                $scope.newGroup();
//            }
//
//            // adds a 'people groups' data structure onto the project that is a mapping
//            // of the back end's flat team structure so a front end style group structure
//            function teamToGroups(team) {
//
//                var original = {
//                    project : {
//                        team : [{
//                            _id : 'ObjectId',
//                            role : 'String',
//                            owner : 'Boolean',
//                            group : 'String'
//                        }]
//                    }
//                };
//
//                var target = {
//                    project : {
//                        usersGroups : [{
//                            name : 'String',
//                            members : [{
//                                _id : 'ObjectId',
//                                role : 'String',
//                                owner : 'Boolean'
//                            }]
//                        }]
//                    }
//                };
//
//                var usersGroups = [];
//
//                // take the flat team representation and put them into arrays of groups
//                team.forEach(function(member) {
//                    var group = _.find(usersGroups, { name : member.group });
//                    // if there's no group for the given user group, create it
//                    if (!group) {
//                        group = {
//                            name : member.group,
//                            members : []
//                        };
//                        usersGroups.push(group);
//                    }
//                    group.members.push(member);
//                });
//
//                return usersGroups;
//            }
//
//            // maps the front end generated people groups field back to
//            // the back end format of th team field for the project
//            function groupsToTeam(usersGroups) {
//
//                var original = {
//                    project : {
//                        usersGroups : [{
//                            name : 'String',
//                            members : [{
//                                _id : 'ObjectId',
//                                role : 'String',
//                                owner : 'Boolean'
//                            }]
//                        }]
//                    }
//                };
//
//                var target = {
//                    project : {
//                        team : [{
//                            _id : 'ObjectId',
//                            role : 'String',
//                            owner : 'Boolean',
//                            group : 'String'
//                        }]
//                    }
//                };
//
//                var newTeam = [];
//
//                // take the peopleGroup as the true correct data, and rebuild the team from this data
//                usersGroups.forEach(function(group) {
//                    group.members.forEach(function(member) {
//                        member.group = group.name;
//                        newTeam.push(member);
//                    });
//                });
//
//                return newTeam;
//            }
;'use strict';

angular.module('modules.users', ['modules.authentication', 'modules.restangular', 'modules.users.permissions-edit']);

angular.module('modules.users').directive('users', function () {
    return {
        restrict: 'E',
        scope: {
            parentType: '@?',
            parentId: '@?',
            type: '@?'
        },
        templateUrl: 'app/modules/users/tpls/users.html',
        controller: function controller($scope, UserService) {

            var typeInfos = { // The keys match type inputs
                'topProjects': { title: 'Top Projects' },
                'topBloggers': { title: 'Top Bloggers' },
                'topContributors': { title: 'Top Contributors' },
                'project': { title: 'Top Projects' }
            };
            $scope.typeInfo = typeInfos[$scope.type] || typeInfos.topProjects;

            $scope.users = [];
            var page = $scope.users.length ? 2 : 1;
            $scope.query = function () {
                UserService.getUsers({
                    page: page,
                    size: 5,
                    sort: 'numProjects'
                }).then(function (users) {
                    $scope.users = _.union($scope.users, _.compact(_.map(users, function (user) {
                        if (user.blurb) {
                            return user;
                        }
                    })));
                });
                page++;
            };

            $scope.query();
        }
    };
}).directive('userRows', function () {
    return {
        restrict: 'E',
        scope: {
            query: '=?',
            sort: '=?',
            order: '=?',
            criteria: '=?'
        },
        templateUrl: 'app/modules/users/tpls/user-rows.html',
        controller: function controller($scope, UserService, HttpQuery) {
            console.log($scope.criteria);
            $scope.query = HttpQuery({
                url: 'api/v1/search',
                params: {
                    type: 'user',
                    select: ['name', 'blurb', 'stub', 'numProjects', 'picture', 'followers'],
                    size: 24,
                    order: 'dsc',
                    sort: $scope.sort,
                    criteria: $scope.criteria || {}
                }
            });

            // Filters
            $scope.orderFilter = {
                model: $scope.sort,
                reverse: $scope.order == 'asc' ? true : false
            };

            // init
            $scope.query.more();
        }
    };
}).directive('usersGroups', function ($mdDialog, $timeout) {
    return {
        restrict: 'E',
        scope: {
            users: '=',
            saveFn: '&?',
            showEdit: '=?',
            parent: '=?', // the project object - used to pass into userSearch
            edit: '=?', // true || false - change the edit status
            modalCallback: '&?' // Modal callback function

        },
        templateUrl: 'app/modules/users/tpls/users-groups.html',
        controller: function controller($scope) {
            $scope.usersGroups = teamToGroups($scope.users);

            $scope.save = function () {
                $scope.users = groupsToTeam($scope.usersGroups);
                $timeout($scope.saveFn, 0);
            };
            $scope.$watch('usersGroups', function () {
                $scope.users = groupsToTeam($scope.usersGroups);
            }, true);

            $scope.userSortConfig = {
                group: 'users',
                animation: 150,
                handle: '.my-handle'
            };
            $scope.userGroupSortConfig = {
                animation: 150,
                handle: '.my-handle'
            };
            $scope.delete = function (group, index) {
                group.splice(index, 1);
            };
            $scope.newGroup = function () {
                var emptyGroup = {
                    name: '',
                    members: []
                };
                $scope.usersGroups.push(emptyGroup);
            };

            // If empty, add an empty group
            if ($scope.users.length === 0) {
                $scope.newGroup();
            }

            // adds a 'people groups' data structure onto the project that is a mapping
            // of the back end's flat team structure so a front end style group structure
            function teamToGroups(team) {

                var original = {
                    project: {
                        team: [{
                            _id: 'ObjectId',
                            role: 'String',
                            owner: 'Boolean',
                            group: 'String'
                        }]
                    }
                };

                var target = {
                    project: {
                        usersGroups: [{
                            name: 'String',
                            members: [{
                                _id: 'ObjectId',
                                role: 'String',
                                owner: 'Boolean'
                            }]
                        }]
                    }
                };

                var usersGroups = [];

                // take the flat team representation and put them into arrays of groups
                team.forEach(function (member) {
                    var group = _.find(usersGroups, { name: member.group });
                    // if there's no group for the given user group, create it
                    if (!group) {
                        group = {
                            name: member.group,
                            members: []
                        };
                        usersGroups.push(group);
                    }
                    group.members.push(member);
                });

                return usersGroups;
            }

            // maps the front end generated people groups field back to
            // the back end format of th team field for the project
            function groupsToTeam(usersGroups) {

                var original = {
                    project: {
                        usersGroups: [{
                            name: 'String',
                            members: [{
                                _id: 'ObjectId',
                                role: 'String',
                                owner: 'Boolean'
                            }]
                        }]
                    }
                };

                var target = {
                    project: {
                        team: [{
                            _id: 'ObjectId',
                            role: 'String',
                            owner: 'Boolean',
                            group: 'String'
                        }]
                    }
                };

                var newTeam = [];

                // take the peopleGroup as the true correct data, and rebuild the team from this data
                usersGroups.forEach(function (group) {
                    group.members.forEach(function (member) {
                        member.group = group.name;
                        newTeam.push(member);
                    });
                });

                return newTeam;
            }
        }
    };
}).directive('emptyGroup', function () {
    return {
        restrict: 'E',
        scope: {
            deleteFn: '&?'
        },
        templateUrl: 'app/modules/users/tpls/empty-group.html'
    };
}).directive('addRow', function () {
    return {
        restrict: 'E',
        scope: {
            addFn: '&?'
        },
        templateUrl: 'app/modules/users/tpls/add-row.html'
    };
}).directive('personcard', function () {
    return {
        restrict: 'E',
        scope: {
            id: '@?',
            size: '@',
            user: '=?'
        },
        templateUrl: 'app/modules/users/tpls/personcard.html',
        controller: function controller($scope, Authentication, UserService) {
            setBanner();
            if ($scope.id) {
                // Initiate Loading class
                $scope.loading = true;
                UserService.getUser($scope.id, 'md').then(function (user) {
                    $scope.user = user;
                    setBanner();
                    // Set loading to false when user has loaded
                    $scope.loading = false;
                });
            }

            function setBanner() {
                // Set defaults
                if ($scope.user && !$scope.user.profile.banner.url) {
                    $scope.alternateBanner = 'assets/images/banners/space' + $scope.user.profile.banner.gradient + '.jpg';
                }
            }
        }
    };
}).directive('userRowDetailed', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            userId: '@?',
            user: '=?',
            showEdit: '=?',
            buttonText: '@',
            buttonHref: '@',
            job: '=?'
        },
        templateUrl: 'app/modules/users/tpls/user-row-detailed.html',
        controller: function controller($scope, UserService) {
            if ($scope.userId) {
                $scope.loading = true;
                UserService.getUser($scope.userId, 'lg').then(function (user) {
                    $scope.user = user;
                    $scope.loading = false;
                });
            }
            $scope.itemLimit = 2;
            $scope.raiseLimit = function () {
                $scope.itemLimit = 100;
            };
        }
    };
}).directive('userIcon', function () {
    return {
        restrict: 'E',
        scope: {
            userId: '@?',
            user: '=?'
        },
        templateUrl: 'app/modules/users/tpls/user-icon.html',
        controller: function controller($scope, Authentication, UserService) {
            if ($scope.userId) {
                UserService.getUser($scope.userId, 'sm').then(function (user) {
                    $scope.user = user;
                });
            }
        }
    };
}).service('UsersModalService', function ($mdDialog) {
    var service = this;
    this.usersNew = function (event, data) {
        return $mdDialog.show({
            templateUrl: 'app/modules/users/tpls/users-new-modal.html',
            controller: 'UsersNewModalCtrl',
            clickOutsideToClose: true,
            targetEvent: event,
            locals: {
                data: data
            }
        });
    };
}).controller('UsersNewModalCtrl', function (data, $scope, $mdDialog, OrganisationService, $http, $mdToast, Authentication, InviteService) {
    $scope.data = angular.copy(data);

    InviteService.generateInviteCode({
        parentType: data.parentType,
        parentId: data.parentId
    }).then(function (result) {
        $scope.inviteId = result.data._id;
    });

    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.invite = function () {
        if ($scope.NewUserForm.$valid) {
            $http.post('/api/v1/mail/invite/project', {
                email: $scope.data.email,
                parentType: $scope.data.parentType,
                name: $scope.data.name,
                inviteId: $scope.inviteId,
                role: $scope.role,
                group: $scope.data.group
            }).success(function () {
                $mdToast.show($mdToast.simple().content('Great stuff... ' + $scope.data.name + ' was invited to your ' + $scope.data.parentType));
                $mdDialog.hide();
            });
        }
    };
}).service('UserService', function ($http, HttpService, Restangular, LocalCache, $rootScope) {

    this.getUser = getUser; // function(id, select, fresh)
    this.getUserOrgs = getUserOrgs; // function(id)
    this.getUsers = getUsers; // function(data)
    this.updateUser = updateUser; // function(user)

    var endpoint = 'user';

    ///////////////////////////////////

    function getUserOrgs(id) {
        return $http({
            url: '/api/v1/users/' + id + '/organisations',
            method: "GET"
        });
    }

    function getUser(stubOrId, select, fresh) {

        // Default the selectFields
        var selectFields;
        if (select == 'sm') {
            selectFields = ['stub', 'name', 'picture', 'blurb'];
        } else if (select == 'md') {
            selectFields = ['stub', 'name', 'picture', 'blurb', 'profile.banner', 'followers', 'numProjects'];
        } else {
            selectFields = ['*'];
            select = 'lg';
        }

        var getPromise = function getPromise(data) {
            // data - [asfasffsa, asfafsasfasf] - Array of user ids
            return HttpService({
                url: '/api/v1/users',
                method: "GET",
                params: {
                    'select[]': selectFields,
                    'ids[]': data
                }
            });
        };
        return LocalCache.getPackaged(endpoint + select, stubOrId, getPromise, fresh);
    }

    function getUsers(data) {
        return Restangular.all('users').getList(data);
    }
    function updateUser(user) {
        // Save to local cache
        LocalCache.save(endpoint + 'lg', user);
        analytics.track('Profile Save');
        return HttpService({
            url: '/api/v1/users/' + user._id,
            method: "PUT",
            data: user
        }).then(function () {
            $rootScope.$broadcast('user.save', user);
        });
    }
});
'use strict';

angular.module('modules.validation', []);
angular.module('modules.validation').directive('charCount', function ($compile) {
    return {
        restrict: 'A',
        scope: {
            text: '=ngModel',
            maxlength: '=' // Max Length allowed
        },
        link: function link(scope, element, attrs) {
            // Wrap the input box in a div
            element.wrap('<div class="rel-box"></div>');
            // Create the element to display chars remaining
            var sibling = angular.element('<span class="char-count">{{remaining}}</span>');
            // Insert it after the input box
            sibling.insertAfter(element);
            // Add it to the compile
            $compile(sibling)(scope);
        },
        controller: function controller($scope) {
            $scope.$watch('text', function (oldValue, newValue) {
                if ($scope.text) {
                    $scope.remaining = $scope.maxlength - $scope.text.length;
                }
            });
        }
    };
}).directive('easyValidation', function ($compile, $timeout) {
    return {
        restrict: 'A',
        // Takes in 'validation-name'
        require: ['^form', 'ngModel'],
        controller: function controller($scope, $element, $attrs) {
            $timeout(function () {
                var form = $element.inheritedData('$formController');
                var input = $element.inheritedData('$ngModelController');
                var parentElement = $element.parent();
                var errors = [];
                var messages = {};
                // Create a new isolate scope - this will be used for the error message div
                var isolateScope = $scope.$new(true);
                // Set the model to the new isolate scope
                isolateScope.model = input;

                // Insert a div after the input box
                var errorDiv = angular.element('<div class="help-block height-min">{{errormessage}}</div>');
                errorDiv.insertAfter($element);
                $compile(errorDiv)(isolateScope);

                // Watch the model for changes
                // Add and remove the has error class to show current state
                isolateScope.$watch(function () {
                    // If the input has been touched and is invalid, add error class
                    if (input.$invalid && input.touched) {
                        parentElement.addClass('has-error');
                    }
                    // If the input is invalid, remove error class
                    else {
                            parentElement.removeClass('has-error');
                        }
                });

                // TODO - this observe should be replaced, this section is C R A P...
                $attrs.$observe('validationName', function (value) {
                    var name = $attrs.validationName;
                    // Create the messages array object
                    messages = {
                        required: 'Sorry, this is required.',
                        email: 'Sorry, that is not a valid email.',
                        minlength: 'Your ' + name + ' is too short. Min ' + $attrs.ngMinlength + ' characters',
                        maxlength: 'Your ' + name + ' is too long. Max ' + $attrs.ngMaxlength + ' characters',
                        taMinText: 'Your ' + name + ' is too short. Min ' + $attrs.taMinText + ' characters',
                        taMaxText: 'Your ' + name + ' is too long. Max ' + $attrs.taMaxText + ' characters',
                        min: 'Your ' + name + ' is too long. Max ' + $attrs.min + ' characters',
                        max: 'Your ' + name + ' is too long. Max ' + $attrs.max + ' characters'
                    };
                });

                $element.on('click', function () {
                    // Hide the error div
                    errorDiv.addClass('height-min');
                    // Mark the element because it has been touched
                    input.touched = true;
                });
                $element.on('focus', function () {
                    // Hide the error div
                    errorDiv.addClass('height-min');
                    // Mark the element because it has been touched
                    input.touched = true;
                });
                $element.on('blur', function () {
                    // If invalid, add 'has-error' to parent element
                    if (input.$invalid) {
                        // Return an array of all the failed validation methods
                        errors = _.compact(_.map(_.keys(input.$error), function (key) {
                            if (input.$error[key] === true) {
                                return key;
                            }
                        }));
                        parentElement.addClass('has-error');
                        errorDiv.removeClass('height-min');
                        // update the message in the scope
                        isolateScope.$apply(function () {
                            // get the last message from the error array (usually most specific)
                            isolateScope.errormessage = messages[errors[errors.length - 1]];
                        });
                    } else {
                        parentElement.removeClass('has-error');
                        errorDiv.addClass('height-min');
                        isolateScope.$apply(function () {
                            isolateScope.show = false;
                        });
                    }
                });
            }, 0);
        }
    };
});
'use strict';

angular.module('modules.view-cache', []);
angular.module('modules.view-cache');

//directive('viewCache', function ($state, $rootScope) {
//    /***************************************************************
//    [uiView] - string
//    ***************************************************************/
//    return {
//        restrict: 'A',
//        link: function(scope, element, attrs){
//
//            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
//                attrs.uiView = attrs.uiView || undefined; // If uiView attr is '', set it to undefined
//                if(attrs.uiView == getActiveView(toState)){
//                    showView()
//                }
//                else{
//                    hideView()
//                }
//                console.log('to '+getActiveView(toState)+' - '+attrs.uiView)
//            });
//
//            // Hoisted functions -----------------------------
//            function getActiveView(toState){
//                if(toState.views){
//                    return Object.keys(toState.views)[0].split("@")[0];
//                }
//            }
//            function hideView(){
//                element.addClass('hide');
//            }
//            function showView(){
//                element.removeClass('hide');
//            }
//        }
//    };
//});
'use strict';

angular.module('modules.xxhash', []);
angular.module('modules.xxhash').service('XxhashService', function ($window) {
	var XXH = $window.XXH;
	if (!XXH) {
		console.error('XXHash not found!!!');
	}
	return XXH;
});
;'use strict';

var MediumEditorTable;
(function () {
    'use strict';

    function extend(dest, source) {
        var prop;
        dest = dest || {};
        for (prop in source) {
            if (source.hasOwnProperty(prop) && !dest.hasOwnProperty(prop)) {
                dest[prop] = source[prop];
            }
        }
        return dest;
    }

    function getSelectionText(doc) {
        if (doc.getSelection) {
            return doc.getSelection().toString();
        }
        if (doc.selection && doc.selection.type !== 'Control') {
            return doc.selection.createRange().text;
        }
        return '';
    }

    function getSelectionStart(doc) {
        var node = doc.getSelection().anchorNode,
            startNode = node && node.nodeType === 3 ? node.parentNode : node;

        return startNode;
    }

    function placeCaretAtNode(doc, node, before) {
        if (doc.getSelection !== undefined && node) {
            var range = doc.createRange(),
                selection = doc.getSelection();

            if (before) {
                range.setStartBefore(node);
            } else {
                range.setStartAfter(node);
            }

            range.collapse(true);

            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    function isInsideElementOfTag(node, tag) {
        if (!node) {
            return false;
        }

        var parentNode = node.parentNode,
            tagName = parentNode.tagName.toLowerCase();

        while (tagName !== 'body') {
            if (tagName === tag) {
                return true;
            }
            parentNode = parentNode.parentNode;

            if (parentNode && parentNode.tagName) {
                tagName = parentNode.tagName.toLowerCase();
            } else {
                return false;
            }
        }

        return false;
    }

    function getParentOf(el, tagTarget) {
        var tagName = el && el.tagName ? el.tagName.toLowerCase() : false;

        if (!tagName) {
            return false;
        }
        while (tagName && tagName !== 'body') {
            if (tagName === tagTarget) {
                return el;
            }
            el = el.parentNode;
            tagName = el && el.tagName ? el.tagName.toLowerCase() : false;
        }
    }

    function Grid(el, callback, rows, columns) {
        return this.init(el, callback, rows, columns);
    }

    Grid.prototype = {
        init: function init(el, callback, rows, columns) {
            this._root = el;
            this._callback = callback;
            this.rows = rows;
            this.columns = columns;
            return this._render();
        },

        setCurrentCell: function setCurrentCell(cell) {
            this._currentCell = cell;
        },

        markCells: function markCells() {
            [].forEach.call(this._cellsElements, function (el) {
                var cell = {
                    column: parseInt(el.dataset.column, 10),
                    row: parseInt(el.dataset.row, 10)
                },
                    active = this._currentCell && cell.row <= this._currentCell.row && cell.column <= this._currentCell.column;

                if (active === true) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }
            }.bind(this));
        },

        _generateCells: function _generateCells() {
            var row = -1;

            this._cells = [];

            for (var i = 0; i < this.rows * this.columns; i++) {
                var column = i % this.columns;

                if (column === 0) {
                    row++;
                }

                this._cells.push({
                    column: column,
                    row: row,
                    active: false
                });
            }
        },

        _html: function _html() {
            var width = this.columns * COLUMN_WIDTH + BORDER_WIDTH * 2,
                height = this.rows * COLUMN_WIDTH + BORDER_WIDTH * 2,
                html = '<div class="medium-editor-table-builder-grid clearfix" style="width:' + width + 'px;height:' + height + 'px;">';
            html += this._cellsHTML();
            html += '</div>';
            return html;
        },

        _cellsHTML: function _cellsHTML() {
            var html = '';
            this._generateCells();
            this._cells.map(function (cell) {
                html += '<a href="#" class="medium-editor-table-builder-cell' + (cell.active === true ? ' active' : '') + '" ' + 'data-row="' + cell.row + '" data-column="' + cell.column + '">';
                html += '</a>';
            });
            return html;
        },

        _render: function _render() {
            this._root.innerHTML = this._html();
            this._cellsElements = this._root.querySelectorAll('a');
            this._bindEvents();
        },

        _bindEvents: function _bindEvents() {
            [].forEach.call(this._cellsElements, function (el) {
                this._onMouseEnter(el);
                this._onClick(el);
            }.bind(this));
        },

        _onMouseEnter: function _onMouseEnter(el) {
            var self = this,
                timer;

            el.addEventListener('mouseenter', function () {
                clearTimeout(timer);

                var dataset = this.dataset;

                timer = setTimeout(function () {
                    self._currentCell = {
                        column: parseInt(dataset.column, 10),
                        row: parseInt(dataset.row, 10)
                    };
                    self.markCells();
                }, 50);
            });
        },

        _onClick: function _onClick(el) {
            var self = this;
            el.addEventListener('click', function (e) {
                e.preventDefault();
                self._callback(this.dataset.row, this.dataset.column);
            });
        }
    };

    function Builder(options) {
        return this.init(options);
    }

    Builder.prototype = {
        init: function init(options) {
            this.options = options;
            this._doc = options.ownerDocument || document;
            this._root = this._doc.createElement('div');
            this._root.className = 'medium-editor-table-builder';
            this.grid = new Grid(this._root, this.options.onClick, this.options.rows, this.options.columns);

            this._range = null;
            this._toolbar = this._doc.createElement('div');
            this._toolbar.className = 'medium-editor-table-builder-toolbar';

            var spanRow = this._doc.createElement('span');
            spanRow.innerHTML = 'Row:';
            this._toolbar.appendChild(spanRow);
            var addRowBefore = this._doc.createElement('button');
            addRowBefore.title = 'Add row before';
            addRowBefore.innerHTML = '<i class="fa fa-long-arrow-up"></i>';
            addRowBefore.onclick = this.addRow.bind(this, true);
            this._toolbar.appendChild(addRowBefore);

            var addRowAfter = this._doc.createElement('button');
            addRowAfter.title = 'Add row after';
            addRowAfter.innerHTML = '<i class="fa fa-long-arrow-down"></i>';
            addRowAfter.onclick = this.addRow.bind(this, false);
            this._toolbar.appendChild(addRowAfter);

            var remRow = this._doc.createElement('button');
            remRow.title = 'Remove row';
            remRow.innerHTML = '<i class="fa fa-close"></i>';
            remRow.onclick = this.removeRow.bind(this);
            this._toolbar.appendChild(remRow);

            var spanCol = this._doc.createElement('span');
            spanCol.innerHTML = 'Column:';
            this._toolbar.appendChild(spanCol);
            var addColumnBefore = this._doc.createElement('button');
            addColumnBefore.title = 'Add column before';
            addColumnBefore.innerHTML = '<i class="fa fa-long-arrow-left"></i>';
            addColumnBefore.onclick = this.addColumn.bind(this, true);
            this._toolbar.appendChild(addColumnBefore);

            var addColumnAfter = this._doc.createElement('button');
            addColumnAfter.title = 'Add column after';
            addColumnAfter.innerHTML = '<i class="fa fa-long-arrow-right"></i>';
            addColumnAfter.onclick = this.addColumn.bind(this, false);
            this._toolbar.appendChild(addColumnAfter);

            var remColumn = this._doc.createElement('button');
            remColumn.title = 'Remove column';
            remColumn.innerHTML = '<i class="fa fa-close"></i>';
            remColumn.onclick = this.removeColumn.bind(this);
            this._toolbar.appendChild(remColumn);

            var remTable = this._doc.createElement('button');
            remTable.title = 'Remove table';
            remTable.innerHTML = '<i class="fa fa-trash-o"></i>';
            remTable.onclick = this.removeTable.bind(this);
            this._toolbar.appendChild(remTable);

            var grid = this._root.childNodes[0];
            this._root.insertBefore(this._toolbar, grid);
        },

        getElement: function getElement() {
            return this._root;
        },

        hide: function hide() {
            this._root.style.display = '';
            this.grid.setCurrentCell({
                column: -1,
                row: -1
            });
            this.grid.markCells();
        },

        show: function show(left) {
            this._root.style.display = 'block';
            this._root.style.left = left + 'px';
        },

        setEditor: function setEditor(range) {
            this._range = range;
            this._toolbar.style.display = 'block';
        },

        setBuilder: function setBuilder() {
            this._range = null;
            this._toolbar.style.display = 'none';
            var elements = this._doc.getElementsByClassName('medium-editor-table-builder-grid');
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.height = COLUMN_WIDTH * this.rows + BORDER_WIDTH * 2 + 'px';
                elements[i].style.width = COLUMN_WIDTH * this.columns + BORDER_WIDTH * 2 + 'px';
            }
        },

        addRow: function addRow(before, e) {
            e.preventDefault();
            e.stopPropagation();
            var tbody = this._range.parentNode.parentNode,
                tr = this._doc.createElement('tr'),
                td;
            for (var i = 0; i < this._range.parentNode.childNodes.length; i++) {
                td = this._doc.createElement('td');
                td.appendChild(this._doc.createElement('br'));
                tr.appendChild(td);
            }
            if (before !== true && this._range.parentNode.nextSibling) {
                tbody.insertBefore(tr, this._range.parentNode.nextSibling);
            } else if (before === true) {
                tbody.insertBefore(tr, this._range.parentNode);
            } else {
                tbody.appendChild(tr);
            }
            this.options.onClick(0, 0);
        },

        removeRow: function removeRow(e) {
            e.preventDefault();
            e.stopPropagation();
            this._range.parentNode.parentNode.removeChild(this._range.parentNode);
            this.options.onClick(0, 0);
        },

        addColumn: function addColumn(before, e) {
            e.preventDefault();
            e.stopPropagation();
            var cell = Array.prototype.indexOf.call(this._range.parentNode.childNodes, this._range),
                tbody = this._range.parentNode.parentNode,
                td;

            for (var i = 0; i < tbody.childNodes.length; i++) {
                td = this._doc.createElement('td');
                td.appendChild(this._doc.createElement('br'));
                if (before === true) {
                    tbody.childNodes[i].insertBefore(td, tbody.childNodes[i].childNodes[cell]);
                } else if (this._range.parentNode.parentNode.childNodes[i].childNodes[cell].nextSibling) {
                    tbody.childNodes[i].insertBefore(td, tbody.childNodes[i].childNodes[cell].nextSibling);
                } else {
                    tbody.childNodes[i].appendChild(td);
                }
            }

            this.options.onClick(0, 0);
        },

        removeColumn: function removeColumn(e) {
            e.preventDefault();
            e.stopPropagation();
            var cell = Array.prototype.indexOf.call(this._range.parentNode.childNodes, this._range),
                tbody = this._range.parentNode.parentNode,
                rows = tbody.childNodes.length;

            for (var i = 0; i < rows; i++) {
                tbody.childNodes[i].removeChild(tbody.childNodes[i].childNodes[cell]);
            }
            this.options.onClick(0, 0);
        },

        removeTable: function removeTable(e) {
            e.preventDefault();
            e.stopPropagation();
            var cell = Array.prototype.indexOf.call(this._range.parentNode.childNodes, this._range),
                table = this._range.parentNode.parentNode.parentNode;

            table.parentNode.removeChild(table);
            this.options.onClick(0, 0);
        }
    };

    function Table(editor) {
        return this.init(editor);
    }

    var TAB_KEY_CODE = 9;

    Table.prototype = {
        init: function init(editor) {
            this._editor = editor;
            this._doc = this._editor.options.ownerDocument;
            this._bindTabBehavior();
        },

        insert: function insert(rows, cols) {
            var html = this._html(rows, cols);

            this._editor.pasteHTML('<table class="medium-editor-table" id="medium-editor-table"' + ' width="100%">' + '<tbody>' + html + '</tbody>' + '</table>', {
                cleanAttrs: [],
                cleanTags: []
            });

            var table = this._doc.getElementById('medium-editor-table');
            table.removeAttribute('id');
            placeCaretAtNode(this._doc, table.querySelector('td'), true);

            this._editor.checkSelection();
        },

        _html: function _html(rows, cols) {
            var html = '',
                x,
                y,
                text = getSelectionText(this._doc);

            for (x = 0; x <= rows; x++) {
                html += '<tr>';
                for (y = 0; y <= cols; y++) {
                    html += '<td>' + (x === 0 && y === 0 ? text : '<br />') + '</td>';
                }
                html += '</tr>';
            }
            return html;
        },

        _bindTabBehavior: function _bindTabBehavior() {
            var self = this;
            [].forEach.call(this._editor.elements, function (el) {
                el.addEventListener('keydown', function (e) {
                    self._onKeyDown(e);
                });
            });
        },

        _onKeyDown: function _onKeyDown(e) {
            var el = getSelectionStart(this._doc),
                table;

            if (e.which === TAB_KEY_CODE && isInsideElementOfTag(el, 'table')) {
                e.preventDefault();
                e.stopPropagation();
                table = this._getTableElements(el);
                if (e.shiftKey) {
                    this._tabBackwards(el.previousSibling, table.row);
                } else {
                    if (this._isLastCell(el, table.row, table.root)) {
                        this._insertRow(getParentOf(el, 'tbody'), table.row.cells.length);
                    }
                    placeCaretAtNode(this._doc, el);
                }
            }
        },

        _getTableElements: function _getTableElements(el) {
            return {
                cell: getParentOf(el, 'td'),
                row: getParentOf(el, 'tr'),
                root: getParentOf(el, 'table')
            };
        },

        _tabBackwards: function _tabBackwards(el, row) {
            el = el || this._getPreviousRowLastCell(row);
            placeCaretAtNode(this._doc, el, true);
        },

        _insertRow: function _insertRow(tbody, cols) {
            var tr = document.createElement('tr'),
                html = '',
                i;

            for (i = 0; i < cols; i += 1) {
                html += '<td><br /></td>';
            }
            tr.innerHTML = html;
            tbody.appendChild(tr);
        },

        _isLastCell: function _isLastCell(el, row, table) {
            return row.cells.length - 1 === el.cellIndex && table.rows.length - 1 === row.rowIndex;
        },

        _getPreviousRowLastCell: function _getPreviousRowLastCell(row) {
            row = row.previousSibling;
            if (row) {
                return row.cells[row.cells.length - 1];
            }
        }
    };

    var COLUMN_WIDTH = 16,
        BORDER_WIDTH = 1;

    MediumEditorTable = MediumEditor.extensions.form.extend({
        name: 'table',

        aria: 'create table',
        action: 'table',
        contentDefault: 'TBL',
        contentFA: '<i class="fa fa-table"></i>',

        handleClick: function handleClick(event) {
            event.preventDefault();
            event.stopPropagation();

            this[this.isActive() === true ? 'hide' : 'show']();
        },

        hide: function hide() {
            this.setInactive();
            this.builder.hide();
        },

        show: function show() {
            this.setActive();

            var range = MediumEditor.selection.getSelectionRange(this.document);
            if (range.startContainer.nodeName.toLowerCase() === 'td' || range.endContainer.nodeName.toLowerCase() === 'td' || MediumEditor.util.getClosestTag(MediumEditor.selection.getSelectedParentElement(range), 'td')) {
                this.builder.setEditor(MediumEditor.selection.getSelectedParentElement(range));
            } else {
                this.builder.setBuilder();
            }
            this.builder.show(this.button.offsetLeft);
        },

        getForm: function getForm() {
            if (!this.builder) {
                this.builder = new Builder({
                    onClick: function (rows, columns) {
                        if (rows > 0 || columns > 0) {
                            this.table.insert(rows, columns);
                        }
                        this.hide();
                    }.bind(this),
                    ownerDocument: this.document,
                    rows: this.rows || 10,
                    columns: this.columns || 10
                });

                this.table = new Table(this.base);
            }

            return this.builder.getElement();
        }
    });
})();
;'use strict';

angular.module('views.app', ['modules.layout-options', 'modules.horizontal-menu', 'modules.transition-overlay', 'modules.authentication', 'modules.forum', 'modules.overlay-tabs', 'modules.invite', 'modules.analytics']);
angular.module('views.app').config(function ($stateProvider) {
    $stateProvider.state('app', {
        abstract: true,
        sticky: true,
        url: '?id&ref&org&hidebanner&slowscroll&invitecode&inviterole&invitegroup&secret&admin',
        templateUrl: 'app/views/app/app.html',
        resolve: {
            jwt: function jwt(Authentication, $stateParams) {
                // login via the jwt
                if ($stateParams.id) {
                    return Authentication.setToken($stateParams.id, false);
                }
            },
            userdata: function userdata(jwt, Authentication, $stateParams) {
                return Authentication.loadUserData().then(function (userdata) {
                    if ($stateParams.admin === 'false') {
                        userdata.isAdmin = false;
                    }
                    return userdata;
                });
            }
        },
        layout: {},
        menu: {
            main: [{
                label: 'Dashboard',
                sref: 'app.dashboard.projects',
                parent: 'app.dashboard',
                authenticate: 'true'
            }, {
                label: 'Feed',
                sref: 'app.home',
                authenticate: 'false'
            }, {
                label: 'Browse',
                sref: 'app.browse.all',
                parent: 'app.browse',
                authenticate: 'false',
                sub: [{
                    label: 'Projects',
                    sref: 'app.browse.projects'
                }, {
                    label: 'Threads',
                    sref: 'app.browse.threads'
                }, {
                    label: 'Fields',
                    sref: 'app.browse.fields'
                }, {
                    label: 'Organisations',
                    sref: 'app.browse.organisations'
                }, {
                    label: 'Users',
                    sref: 'app.browse.users'
                }, {
                    label: 'Jobs',
                    sref: 'app.browse.jobs',
                    divider: true
                }, {
                    label: 'Map',
                    sref: 'app.map'
                }]
            }],
            more: [{
                label: 'My Job Applications',
                sref: 'app.applications',
                authenticate: true
            }, {
                label: 'Referrals & Prizes',
                sref: 'app.referrals',
                authenticate: true
            }, {
                label: 'Following',
                sref: 'app.following.all',
                divider: true,
                authenticate: true
            }, {
                label: 'About',
                sref: 'app.project.overview({"stub":"stemn"})',
                authenticate: 'false'
            }, {
                label: 'FAQ',
                sref: 'app.faq',
                authenticate: 'false'
            }, {
                label: 'Landing Page',
                sref: 'app.landing.sync',
                authenticate: 'false'
            }]
        },
        authLevel: 'public',
        controller: function controller(userdata, $localStorage, $scope, $timeout, $state, $location, Authentication, LayoutOptions, $mdSidenav, $stateParams, ReferralsService, InviteService) {

            ReferralsService.setRefCode();
            InviteService.setInviteCode();

            // Save the initial state to local storage
            if (!$localStorage.initialState) {
                $localStorage.initialState = {
                    name: $state.current.name,
                    params: $state.params
                };
            }

            $scope.LayoutOptions = LayoutOptions;
            // Material
            $scope.toggleSidenav = function (menuId) {
                $mdSidenav(menuId).toggle();
            };
            // Hack to remove duplicate ui-views
            $timeout(function () {
                var bodyChildren = angular.element(document.body).children();
                _.forEach(bodyChildren, function (child) {
                    if (child.hasAttribute('ui-view')) {
                        if (child.innerHTML.length === 0) {
                            child.remove();
                        }
                    }
                });
            }, 100);
        },
        seo: function seo(resolve) {
            return {
                title: "STEMN - The Largest Community for Space Projects, Questions and Answers",
                picture: "/uploads/upload_05fd16476dd86c21c8d09ae149a0f734.png",
                description: "STEMN is a network connecting the knowledge of the international space community. Showcase your projects, get recognition for your research, and discover what the rest of the community is creating. Let's build space. Together."
            };
        }
    });
});
'use strict';

angular.module('views.applications', []);
angular.module('views.applications').config(function ($stateProvider) {
    $stateProvider.state('app.applications', {
        url: '/applications',
        templateUrl: 'app/views/applications/tpls/applications.html',
        authLevel: 'user',
        seo: function seo(resolve) {
            return {
                title: 'My Applications - STEMN'
            };
        },
        layout: {
            size: 'md',
            footer: false,
            bgColor: 'rgba(0, 0, 0, 0.03)'
        },
        controller: function controller($scope, HttpQuery, Authentication, CoreLibrary, ApplicationStatusService, EntityService) {
            $scope.query = HttpQuery({
                url: 'api/v1/search',
                params: {
                    parentType: 'user',
                    parentId: Authentication.currentUser._id,
                    type: 'application',
                    sort: '_id',
                    size: 10,
                    'select[]': ['*']
                },
                onSuccess: function onSuccess(response) {
                    _.forEach(response, function (item) {
                        var mappedStatus = ApplicationStatusService.getMappedStatus(item.status.state);
                        item.mappedStatusText = ApplicationStatusService.getMappedStatusText(mappedStatus);
                    });
                    setHref(response);
                    return response;
                }
            });
            $scope.query.more();

            /////////////////////////////////////////////////////

            function setHref(feed) {
                _.forEach(feed, function (item) {
                    //                    item.href = CoreLibrary.getHref(item.entityType, item._id);
                    item.href = CoreLibrary.getHref('application', item._id);
                });
            }
        }
    }).state('app.application', {
        url: '/applications/:stub',
        templateUrl: 'app/views/applications/tpls/application.html',
        resolve: {
            entity: function entity(EntityService, $stateParams, $state, $timeout) {
                return EntityService.get('application', $stateParams.stub);
            }
        },
        seo: function seo(resolve) {
            return {
                title: 'Job Application - STEMN'
            };
        },
        layout: {
            size: 'md',
            footer: false
        },
        controller: function controller(entity, $scope, Authentication, EntityService, ApplicationStatusService) {
            $scope.saveApplication = saveApplication; //function
            $scope.entity = entity;
            $scope.mappedStatus = ApplicationStatusService.getMappedStatus($scope.entity.status.state);
            $scope.statusMessage = ApplicationStatusService.getStatusExplanation($scope.mappedStatus, $scope.entity.organisations[0].name);

            $scope.showEdit = $scope.entity.child._id == Authentication.currentUser._id;
            if (!$scope.showEdit) {
                $scope.isAdmin = Authentication.currentUser.isAdmin;
            }

            $scope.ratings = [0, 1, 2, 3, 4, 5];

            //////////////////////////////////

            function saveApplication() {
                return EntityService.update('application', $scope.entity).then(EntityService.updateSuccess);
            }
        }
    });
}).service('ApplicationStatusService', function () {
    var service = this;
    this.getStatuses = getStatuses;
    this.getMappedStatus = getMappedStatus;
    this.getStatusExplanation = getStatusExplanation;
    this.getMappedStatusText = getMappedStatusText;

    //////////////////////////////////////////

    function getMappedStatus(statusModel) {
        var statuses = service.getStatuses();
        var currentStatus = statuses[statusModel];
        return currentStatus.map;
    }

    function getMappedStatusText(mappedStatus) {
        var statusText = {
            pendingReview: 'Pending Review',
            underReview: 'Under Review',
            awaitingUpdate: 'Awaiting Profile Update',
            submitted: 'Submitted',
            rejected: 'Rejected',
            archived: 'Archived'
        };
        return statusText[mappedStatus] || statusText.pendingReview;
    }

    function getStatusExplanation(mappedStatus, companyName) {
        var explanations = {
            pendingReview: 'Your application is <b>Pending Review</b>. A member of the STEMN talent team will be in contact with you in the next few days to polish up your application for free (before it is sent off to ' + companyName + ').',
            underReview: 'Your application is <b>Under Review</b>. You can continue to update your user profile and project portfolio whilst your application is under review.',
            awaitingUpdate: 'Your application is <b>Awaiting Update</b>. Before we can send it through to <b>' + companyName + '</b> you must add additional detail to your project portfolio. Once your updates are complete, your application will be reviewed again.',
            submitted: 'Your application has been <b>Submitted</b> to <b>' + companyName + '</b>. They should contact you directly within the next week if they wish to proceed with an interview.',
            rejected: 'Your application has been <b>Rejected</b>. This is usually because you skills and experience did not match those required for this role.',
            archived: 'Your application has been <b>Archived</b>. Email <b>applications@stemn.com</b> if you want us to re-assess you application'
        };
        return explanations[mappedStatus] || explanations.pendingReview;
    }

    function getStatuses() {
        return {
            pendingReview: {
                model: 'pendingReview',
                name: 'Pending Review',
                nextSteps: ['pendingReview', 'underReview', 'awaitingUpdate', 'readyToSubmit', 'archived', 'processLater'],
                map: 'pendingReview'
            },
            underReview: {
                model: 'underReview',
                name: 'Under Review',
                nextSteps: ['underReview', 'awaitingUpdate', 'readyToSubmit', 'archived', 'processLater'],
                map: 'underReview'
            },
            awaitingUpdate: {
                model: 'awaitingUpdate',
                name: 'Awaiting Profile Update',
                nextSteps: ['awaitingUpdate', 'pendingReview', 'archived'],
                map: 'awaitingUpdate'
            },
            readyToSubmit: {
                model: 'readyToSubmit',
                name: 'Read to Submit',
                nextSteps: ['readyToSubmit', 'submittedToCompany', 'archived'],
                map: 'submitted'
            },
            submittedToCompany: {
                model: 'submittedToCompany',
                name: 'Submitted',
                nextSteps: ['submittedToCompany', 'rejected', 'hired', 'archived'],
                map: 'submitted'
            },
            rejected: {
                model: 'rejected',
                name: 'Rejected',
                nextSteps: ['rejected'],
                map: 'rejected'
            },
            hired: {
                model: 'hired',
                name: 'Hired',
                nextSteps: ['hired', 'archived'],
                map: 'submitted'
            },
            archived: {
                model: 'archived',
                name: 'Archived',
                nextSteps: ['archived'],
                map: 'archived'
            },
            processLater: {
                model: 'processLater',
                name: 'Process Later',
                nextSteps: ['processLater', 'pendingReview'],
                map: 'submitted'
            }
        };
    }
});
'use strict';

angular.module('views.auth', []);
angular.module('views.auth').config(function ($stateProvider) {
    $stateProvider.state('app.auth', {
        url: '/auth',
        templateUrl: 'app/views/auth/tpls/auth.html',
        abstract: true,
        layout: {
            chat: false,
            topBanner: false,
            size: 'md',
            bgColor: 'rgba(0, 0, 0, 0.03)'
        }
    }).state('app.auth.dropbox', {
        url: '/dropbox',
        templateUrl: 'app/views/auth/tpls/auth-dropbox.html',
        controller: function controller($scope, SyncService) {
            $scope.authorize = function () {
                SyncService.authorize('dropbox').then(function (response) {
                    console.log(response);
                });
            };
        }
    }).state('app.auth.google', {
        url: '/google',
        templateUrl: 'app/views/auth/tpls/auth-google.html',
        controller: function controller($scope, SyncService) {
            $scope.authorize = function () {
                SyncService.authorize('google').then(function (response) {
                    console.log(response);
                });
            };
        }
    });
});
'use strict';

angular.module('views.browse.fields', []);
angular.module('views.browse.fields').config(function ($stateProvider) {
    $stateProvider.state('app.browse.fields', {
        url: '/fields?sort&order&q',
        templateUrl: 'app/views/browse/browse-fields/browse-fields.html',
        layout: {
            size: 'lg',
            footer: true
        },
        seo: function seo(resolve) {
            return {
                title: "Browse Engineering and Space Fields - STEMN"
            };
        },
        controller: 'BrowseFieldsViewCtrl',
        data: {
            name: 'Fields'
        }
    });
}).controller('BrowseFieldsViewCtrl', function ($scope, $state, $location, HttpQuery, $stateParams, SearchService, FieldModalService) {

    // Defaults
    $stateParams.sort = $stateParams.sort || 'numProjects';
    $stateParams.order = $stateParams.order || 'dsc';

    // Scoped data
    $scope.newField = newField; // function(event)
    $scope.clearFilter = clearFilter; //function()

    // Query
    $scope.query = HttpQuery({
        url: 'api/v1/search',
        params: {
            type: 'field',
            select: ['name', 'stub', 'numProjects', 'numJobs', 'picture', 'followers'],
            size: 24,
            order: 'dsc',
            sort: $stateParams.sort,
            criteria: {}
        }
    });

    // Filters
    $scope.orderFilter = {
        model: $stateParams.sort,
        reverse: $stateParams.order == 'asc' ? true : false
    };
    $scope.searchFilter = {
        model: '',
        onChange: function onChange() {
            $scope.query.params.criteria.name = $scope.searchFilter.model ? '/' + $scope.searchFilter.model + '/i' : '';
            $scope.query.refresh();
        }
    };

    // Watchers
    $scope.$watch('orderFilter', watchOrderFilter, true);

    // Init
    $scope.query.more();

    //////////////////////////////////////////////

    function newField(event) {
        FieldModalService.fieldNewModal(event).then(function (result) {
            $state.go('app.field.top', {
                stub: result.stub
            });
        });
    }

    function watchOrderFilter() {
        if ($scope.orderFilter.model) {
            $scope.query.params.sort = $scope.orderFilter.model;
            $scope.query.params.order = $scope.orderFilter.reverse ? 'asc' : 'dsc';
            $scope.query.updateQueryParams();
            $scope.query.refresh();
        }
    }

    function clearFilter() {
        $scope.searchFilter.model = '';

        $scope.query.params.criteria = {};
        $scope.query.refresh();
    }
});
'use strict';

angular.module('views.browse.jobs', []);
angular.module('views.browse.jobs').config(function ($stateProvider) {
    $stateProvider.state('app.browse.jobs', {
        url: '/jobs?near[]&sort&order&parentType&parentId',
        templateUrl: 'app/views/browse/browse-jobs/browse-jobs.html',
        layout: {
            size: 'lg',
            footer: true
        },
        resolve: {
            fields: function fields(SearchService) {
                return SearchService.search({
                    type: 'field',
                    page: 1,
                    size: 11,
                    sort: 'numJobs',
                    select: ['name', 'numJobs'],
                    key: 'name'
                }).then(function (response) {
                    return response.data;
                });
            }
        },
        seo: function seo(resolve) {
            return {
                title: "Aerospace Jobs - Simple 2 Click Application - STEMN"
            };
        },
        controller: 'BrowseJobsViewCtrl',
        data: {
            name: 'Jobs'
        }
    });
}).controller('BrowseJobsViewCtrl', function (fields, $scope, $http, $timeout, HttpQuery, NewCreationsService, LocationService, Authentication, JobModalService, QueryParamsService, $stateParams, CoreLibrary) {
    // Init
    LocationService.getLocation().then(function (location) {
        $scope.location = location;
    });

    var maxRating;

    // Filters
    $scope.orderFilter = {
        model: $stateParams.sort || 'organisations[0].name',
        reverse: $stateParams.order ? $stateParams.order == 'asc' ? true : false : 'asc',
        onChange: function onChange(value) {
            delete $scope.query.params['near[]'];
            // If we are sorting by location
            if ($scope.orderFilter.model == 'location[0].name' && $scope.location.latitude && $scope.location.longitude) {
                sortByNear();
            }
            // Else we order by something else
            else {
                    $scope.query.params.sort = $scope.orderFilter.model;
                    $scope.query.params.order = $scope.orderFilter.reverse ? 'asc' : 'dsc';
                    $scope.query.updateQueryParams();
                    $scope.query.refresh();
                }
        }
    };

    // scoped functions
    $scope.create = create; // function()
    $scope.clearFilter = clearFilter; // function()
    $scope.sortByNear = sortByNear; // function()

    // Main Query
    $scope.query = HttpQuery({
        url: '/api/v1/search',
        urlParams: ['near[]', 'sort', 'order', 'parentType', 'parentId'],
        params: {
            type: 'job',
            size: 20,
            key: 'name',
            select: ['name', 'organisation', 'location.name', 'pay', 'jobType', 'level', 'stub', 'organisations'],
            criteria: {}
        }
    });

    if (Authentication.currentUser.isLoggedIn()) {
        $scope.suggestedJobs = true;
        $scope.query.params.skills = Authentication.currentUser._id;
    }

    if ($scope.location && $scope.location.latitude && $scope.location.longitude) {
        $scope.orderFilter.model = 'location[0].name';
        $scope.orderFilter.reverse = false;
        sortByNear();
    } else if (Authentication.currentUser.isLoggedIn()) {
        $scope.orderFilter.model = 'rating';
        $scope.orderFilter.reverse = false;
        $scope.query.params.sort = 'rating';
        $scope.query.params.order = 'dsc';
        $scope.query.more();
    } else {
        $scope.query.params.sort = 'organisations[0].name';
        $scope.query.params.order = 'asc';
        $scope.query.more();
    }

    // Filters
    $scope.searchFilter = {
        model: '',
        onChange: function onChange() {
            $scope.query.params.criteria.organisationName = $scope.searchFilter.model ? '/' + $scope.searchFilter.model + '/i' : '';
            $scope.query.refresh();
        }
    };
    $scope.fieldFilter = {
        current: $stateParams.parentId || '',
        options: fields,
        change: function change(input) {
            $scope.query.params.parentType = 'field';
            $scope.query.params.parentId = input;
            $scope.query.updateQueryParams();
            $scope.query.refresh();
        }
    };

    //////////////////////////////////////////////

    function create(event) {
        JobModalService.createJob(event);
    }
    function sortByNear() {
        delete $scope.query.params.sort;
        delete $scope.query.params.order;
        $scope.query.params['near[]'] = [$scope.location.longitude, $scope.location.latitude];
        $scope.query.updateQueryParams();
        $scope.query.refresh();
    }

    function clearFilter() {
        $scope.searchFilter.model = '';
        $scope.query.params.criteria = {};
        $scope.query.refresh();
    }
});
'use strict';

angular.module('views.browse.organisations', []);
angular.module('views.browse.organisations').config(function ($stateProvider) {
    $stateProvider.state('app.browse.organisations', {
        url: '/organisations?sort&order&q',
        templateUrl: 'app/views/browse/browse-organisations/browse-organisations.html',
        resolve: {
            fields: function fields(SearchService) {
                return SearchService.search({
                    type: 'field',
                    page: 1,
                    size: 11,
                    sort: 'numOrganisations',
                    select: ['name', 'numOrganisations'],
                    key: 'name'
                }).then(function (response) {
                    return response.data;
                });
            }
        },
        layout: {
            size: 'lg',
            footer: true
        },
        seo: function seo(resolve) {
            return {
                title: "Browse Engineering and Space Organisations - STEMN"
            };
        },
        controller: 'BrowseOrganisationsViewCtrl',
        data: {
            name: 'Organisations'
        }
    });
}).controller('BrowseOrganisationsViewCtrl', function (fields, $scope, $state, $location, HttpQuery, $stateParams, SearchService, OrganisationModalService) {

    // Defaults
    $stateParams.sort = $stateParams.sort || 'numProjects';
    $stateParams.order = $stateParams.order || 'dsc';

    // Scoped data
    $scope.fields = fields;
    $scope.newOrganisation = newOrganisation; // function(event)
    $scope.clearFilter = clearFilter; //function()

    // Query
    $scope.query = HttpQuery({
        url: 'api/v1/search',
        params: {
            type: 'organisation',
            select: ['name', 'stub', 'numProjects', 'picture', 'followers'],
            size: 24,
            order: 'dsc',
            sort: $stateParams.sort,
            criteria: {}
        }
    });

    // Filters
    $scope.fieldFilter = {
        current: '',
        options: fields,
        change: function change(input) {
            $scope.query.params.parentType = 'field';
            $scope.query.params.parentId = input;
            $scope.query.updateQueryParams();
            $scope.query.refresh();
        }
    };
    $scope.orderFilter = {
        model: $stateParams.sort,
        reverse: $stateParams.order == 'asc' ? true : false
    };
    $scope.searchFilter = {
        model: '',
        onChange: function onChange() {
            $scope.query.params.criteria.name = $scope.searchFilter.model ? '/' + $scope.searchFilter.model + '/i' : '';
            $scope.query.refresh();
        }
    };

    // Watchers
    $scope.$watch('orderFilter', watchOrderFilter, true);

    // Init
    $scope.query.more();

    //////////////////////////////////////////////

    function newOrganisation(event) {
        OrganisationModalService.organisationNewModal(event).then(function (result) {
            $state.go('app.organisation.settings.overview', {
                stub: result.stub
            });
        });
    }

    function watchOrderFilter() {
        if ($scope.orderFilter.model) {
            $scope.query.params.sort = $scope.orderFilter.model;
            $scope.query.params.order = $scope.orderFilter.reverse ? 'asc' : 'dsc';
            $scope.query.updateQueryParams();
            $scope.query.refresh();
        }
    }

    function clearFilter() {
        $scope.fieldFilter.current = '';
        $scope.query.params.parentId = '';

        $scope.searchFilter.model = '';
        $scope.query.params.criteria.name = '';

        $scope.query.refresh();
    }
});
'use strict';

angular.module('views.browse.projects', []);
angular.module('views.browse.projects').config(function ($stateProvider) {
    $stateProvider.state('app.browse.projects', {
        url: '/projects?page&sort',
        templateUrl: 'app/views/browse/browse-projects/browse-projects.html',
        layout: {
            size: 'md',
            footer: true
        },
        seo: function seo(resolve) {
            return {
                title: "Browse Engineering and Space Projects - STEMN"
            };
        },
        controller: 'BrowseProjectsViewCtrl',
        resolve: {
            fields: function fields(SearchService, $stateParams) {
                return SearchService.search({
                    type: 'field',
                    page: 1,
                    size: 11,
                    sort: 'numProjects',
                    key: 'name'
                }).then(function (response) {
                    return response.data;
                });
            }
        },
        data: {
            name: 'Projects'
        }
    });
}).controller('BrowseProjectsViewCtrl', function (fields, $rootScope, $scope, $state, $location, $stateParams, FeedService) {
    // Scope data
    $scope.fieldFilter = {
        current: '',
        options: fields
    };
    $scope.sortFilter = {
        current: $stateParams.sort || 'updated',
        options: [{
            model: 'views',
            name: 'Views'
        }, {
            model: 'numComments',
            name: 'Comments'
        }, {
            model: 'likes',
            name: 'Likes'
        }, {
            model: 'updated',
            name: 'Updated'
        }]
    };

    //    function changeSort(){
    //        $location.search({
    //            'sort' : $scope.sortFilter.current,
    //            'page' : 1
    //        });
    //    }
});
'use strict';

angular.module('views.browse.threads', []);
angular.module('views.browse.threads').config(function ($stateProvider) {
    $stateProvider.state('app.browse.threads', {
        url: '/threads?sort&order&parentType&parentId&criteria',
        templateUrl: 'app/views/browse/browse-threads/browse-threads.html',
        resolve: {
            fields: function fields(SearchService, $stateParams) {
                return SearchService.search({
                    type: 'field',
                    page: 1,
                    size: 11,
                    sort: 'numThreads',
                    select: ['name', 'numThreads'],
                    key: 'name'
                }).then(function (response) {
                    return response.data;
                });
            }
        },
        seo: function seo(resolve) {
            return {
                title: "Browse Engineering and Threads - STEMN"
            };
        },
        layout: {
            size: 'lg',
            footer: true
        },
        controller: 'BrowseThreadsViewCtrl',
        data: {
            name: 'Threads'
        }
    });
}).controller('BrowseThreadsViewCtrl', function (fields, $scope, $stateParams, FeedService, ThreadCreateModalService, ThreadLabelService) {

    $scope.newThread = ThreadCreateModalService.newThread; //function(event)
    $scope.fieldFilter = {
        current: '',
        options: fields,
        change: function change(input) {
            $scope.query.params.parentType = 'field';
            $scope.query.params.parentId = input;
            $scope.query.updateQueryParams();
            $scope.query.refresh();
        }
    };
    $scope.statusFilter = {
        current: '',
        options: [{
            name: 'All',
            model: ''
        }, {
            name: 'Answered',
            model: 'answered'
        }, {
            name: 'Unanswered',
            model: 'unanswered'
        }],
        change: function change(input) {
            if (input == 'answered') {
                $scope.query.params.criteria.numPosts = ';>1';
            } else if (input == 'unanswered') {
                $scope.query.params.criteria.numPosts = '0';
            } else {
                $scope.query.params.criteria.numPosts = '';
            }
            $scope.query.updateQueryParams();
            $scope.query.refresh();
        }
    };
    $scope.typeFilter = {
        current: '',
        change: function change(input) {
            console.log(input);
            if (input) {
                $scope.query.params.criteria.labels = [input];
            } else {
                $scope.query.params.criteria.labels = [];
            }
            $scope.query.updateQueryParams();
            $scope.query.refresh();
        }
    };

    $scope.typeFilter.options = angular.copy(ThreadLabelService.labels);
    $scope.typeFilter.options.unshift({ label: 'All', model: '' });

    $scope.sortFilter = {
        current: $stateParams.sort || 'updated',
        options: [{
            model: 'views',
            name: 'Views'
        }, {
            model: 'numComments',
            name: 'Replies'
        }, {
            model: 'likes',
            name: 'Likes'
        }, {
            model: 'updated',
            name: 'Updated'
        }]
    };
});
'use strict';

angular.module('views.browse.users', []);
angular.module('views.browse.users').config(function ($stateProvider) {
    $stateProvider.state('app.browse.users', {
        url: '/people?page&sort',
        templateUrl: 'app/views/browse/browse-users/browse-users.html',
        resolve: {
            educationOrgs: function educationOrgs(SearchService) {
                return SearchService.search({
                    type: 'organisation',
                    page: 1,
                    size: 11,
                    sort: 'numEducations',
                    select: ['name', 'numEducations'],
                    key: 'name'
                }).then(function (response) {
                    return response.data;
                });
            }
        },
        layout: {
            size: 'lg',
            footer: true
        },
        seo: function seo(resolve) {
            return {
                title: "Browse Users interested in Aerospace and Enigneering - STEMN"
            };
        },
        controller: 'BrowseUsersViewCtrl',
        data: {
            name: 'Users'
        }
    });
}).controller('BrowseUsersViewCtrl', function (educationOrgs, $scope, $state, $location, HttpQuery, $stateParams, SearchService, OrganisationModalService) {

    // Defaults
    $stateParams.sort = $stateParams.sort || 'numProjects';
    $stateParams.order = $stateParams.order || 'dsc';

    // Scoped data
    $scope.sort = $stateParams.sort;
    $scope.clearFilter = clearFilter; //function()

    // Filters
    $scope.searchFilter = {
        model: '',
        onChange: function onChange() {
            $scope.query.params.criteria.name = $scope.searchFilter.model ? '/' + $scope.searchFilter.model + '/i' : '';
            $scope.query.refresh();
        }
    };
    $scope.educationFilter = {
        current: '',
        options: educationOrgs,
        change: function change(input) {
            $scope.query.params.criteria['profile.profileDetails.education.organisations'] = this.current;
            $scope.query.updateQueryParams();
            $scope.query.refresh();
        }
    };

    //////////////////////////////////////////////

    function clearFilter() {
        $scope.searchFilter.model = '';
        $scope.query.params.criteria = {};

        $scope.query.refresh();
    }
});
'use strict';

angular.module('views.browse', ['modules.pagination', 'modules.organisations', 'modules.jobs', 'modules.location', 'views.browse.organisations', 'views.browse.projects', 'views.browse.fields', 'views.browse.jobs', 'views.browse.threads', 'views.browse.users']);
angular.module('views.browse').config(function ($stateProvider) {
    $stateProvider.state('app.browse', {
        url: '/browse',
        templateUrl: 'app/views/browse/browse.html',
        abstract: true
    }).state('app.browse.all', {
        url: '/',
        templateUrl: 'app/views/browse/browse-all.html',
        layout: {
            size: 'md',
            footer: true
        },
        seo: function seo(resolve) {
            return {
                title: "Browse Projects, Questions and Organisations - STEMN"
            };
        }
    });
}).directive('fieldsFilter', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/views/browse/tpls/fields-filter.html',
        replace: true,
        scope: {
            filter: '='
        },
        controller: function controller($scope) {
            $scope.select = select; //function(id)

            $scope.filter = $scope.filter || {};

            function select(id) {
                $scope.filter.current = id;
            }
        }
    };
});
'use strict';

angular.module('views.careers', []);
angular.module('views.careers').config(function ($stateProvider) {
    $stateProvider.state('app.careers', {
        url: '/careers?tab',
        params: {
            tab: 'leader'
        },
        templateUrl: 'app/views/careers/careers.html',
        controller: function controller($rootScope, $scope, $state, Authentication, $mdToast) {
            $scope.tab = $state.params.tab;

            $scope.authenticate = function (provider) {
                $scope.loading = true;
                Authentication.authenticate(provider).then(function (response) {
                    $mdToast.show($mdToast.simple().content('We now have your Linkedin profile. Please email us your other info.'));
                    $scope.loading = false;
                }).catch(function (response) {
                    $mdToast.show($mdToast.simple().theme('warn').content('We couldn\'t log you in: ' + (response.error || response.data.message || response.data)));
                    $scope.loading = false;
                });
            };
        },
        seo: function seo(resolve) {
            return {
                title: "Join our team - Careers at STEMN",
                description: "We are always looking for great leaders and developers. If you think you have what it takes, apply here."
            };
        }
    });
});
'use strict';

angular.module('views.compare', []);
angular.module('views.compare').config(function ($stateProvider) {
    $stateProvider.state('app.compare', {
        url: '/compare/:projectStub?path1&path2&children1&children2&type',
        sticky: true,
        resolve: {
            project: function project($stateParams, EntityService, $timeout, $state) {
                return EntityService.get('project', $stateParams.projectStub, 'sm').catch(function (error) {
                    $timeout(function () {
                        $state.go('app.404', null, { location: false });
                    });
                    return error;
                });
            },
            previousState: function previousState($state) {
                return {
                    name: $state.current.name,
                    params: $state.params
                };
            },
            fileMeta1: function fileMeta1(SyncService, $stateParams, SyncUrlService) {
                var parsedChildren = SyncUrlService.parseChildren($stateParams.children1);
                var parsedPath = SyncUrlService.parsePath($stateParams.path1);
                return SyncService.metadataVirtual($stateParams.projectStub, parsedPath, parsedChildren);
            },
            fileMeta2: function fileMeta2(SyncService, $stateParams, SyncUrlService) {
                if ($stateParams.path2) {
                    var parsedChildren = SyncUrlService.parseChildren($stateParams.children2);
                    var parsedPath = SyncUrlService.parsePath($stateParams.path2);
                    return SyncService.metadataVirtual($stateParams.projectStub, parsedPath, parsedChildren);
                }
            },
            userPermissions: function userPermissions(userdata, project, PermissionsService, $stateParams) {
                return PermissionsService.permissionRedirect({
                    userdata: userdata,
                    entity: project,
                    level: project.permissions.projectType == 'public' ? 'public' : 'viewer',
                    secret: $stateParams.secret
                });
            }
        },
        templateUrl: 'app/views/compare/tpls/compare.html',
        controller: 'CompareViewCtrl',
        layout: {
            size: 'md',
            hideOverflow: true,
            topBanner: false,
            horizontalMenu: false,
            chat: false
        },
        seo: function seo(resolve) {
            return {
                title: ' Compare - ' + resolve.fileMeta1.name + ' - ' + resolve.project.name
            };
        }
    });
}).controller('CompareViewCtrl', function (project, previousState, fileMeta1, fileMeta2, $scope, $location, $state, $timeout, $stateParams, SyncFileSelectService, SyncUtilService, SyncUrlService, SyncService) {
    $scope.project = project;

    $scope.slider = { width: 50 };
    $scope.compareType = $stateParams.type || 'sideBySide';

    $scope.closeCompare = closeCompare; // function()
    $scope.setCompareType = setCompareType; // function(compareType)
    $scope.previewers = [];

    init();

    /////////////////////////////////////////////////////////

    function init() {
        $scope.fileMeta1 = fileMeta1;
        $scope.fileMeta2 = fileMeta2;

        if ($scope.fileMeta1.provider == 'drive') {
            SyncService.getPath($scope.fileMeta1.path, $scope.project.stub).then(function (response) {
                response.shift(0);
                response.push({
                    path: fileMeta1.id,
                    name: fileMeta1.name
                });
                $scope.breadCrumbs = response;
            });
        } else {
            $scope.breadCrumbs = SyncUtilService.getCrumbs($scope.fileMeta1.path);
            if ($scope.fileMeta1.virtualChildren) {
                $scope.breadCrumbs.push({ name: $scope.fileMeta1.name });
            }
        }

        $scope.previewer1 = {
            number: '1',
            enabled: $scope.fileMeta1 ? true : false
        };
        $scope.previewer2 = {
            number: '2',
            enabled: $scope.fileMeta2 ? true : false
        };
        $scope.provider = $scope.fileMeta1.provider;
        $scope.parentFolder = $scope.fileMeta1.parentFolder;

        $timeout(function () {
            // Timeout so previewer type exists
            $scope.compareModes = SyncUtilService.getCompareModes($scope.previewer1.type, $scope.previewer2.type);
        });
    }

    function setCompareType(compareType) {
        $state.current.reloadOnSearch = false;
        $scope.compareType = compareType;
        $location.search('type', compareType);
        $timeout(function () {
            $state.current.reloadOnSearch = undefined;
        });
        if ($scope.previewer1.center) {
            $timeout($scope.previewer1.center);
        }
        if ($scope.previewer2.center) {
            $timeout($scope.previewer2.center);
        }
    }

    function closeCompare() {
        if (previousState.name && previousState.params && previousState.name != 'app.compare' && previousState.name != 'app.preview') {
            $state.go(previousState.name, previousState.params);
        } else {
            $state.go('app.project.files', {
                stub: project.stub,
                path: $scope.fileMeta1.parentFolder || $scope.fileMeta2.parentFolder || ''
            });
        }
    }
}).directive('compareSlider', function ($timeout, $document) {
    return {
        restrict: 'A',
        scope: {
            compareSlider: '='
        },
        link: function link(scope, element) {

            var dragWidth, xPosition, containerOffset, minLeft, maxLeft, containerWidth;
            var dragElement = angular.element(element[0].querySelector('.handle'));
            var containerElement = element;

            $document.on("mouseup vmouseup", onMouseUp);
            dragElement.on("mousedown vmousedown", onMouseDown);
            scope.$on('$destroy', onDestroy);

            ///////////////

            function onMouseUp(e) {
                dragElement.parents().off("mousemove vmousemove", onDrag);
                dragElement.removeClass('active');
                containerElement.removeClass('active');
            }

            function onMouseDown(e) {
                dragWidth = dragElement.outerWidth();
                xPosition = dragElement.offset().left + dragWidth - e.pageX;
                containerOffset = containerElement.offset().left;
                containerWidth = containerElement.outerWidth();
                minLeft = containerOffset + 10;
                maxLeft = containerOffset + containerWidth - dragWidth - 10;
                dragElement.addClass('active');
                containerElement.addClass('active');
                dragElement.parents().on("mousemove vmousemove", onDrag);
                e.preventDefault();
            }

            function onDrag(e) {
                var leftValue = e.pageX + xPosition - dragWidth;

                //constrain the draggable element to move inside its container
                if (leftValue < minLeft) {
                    leftValue = minLeft;
                } else if (leftValue > maxLeft) {
                    leftValue = maxLeft;
                }
                var widthValue = (leftValue + dragWidth / 2 - containerOffset) * 100 / containerWidth;
                scope.compareSlider = widthValue;
                scope.$apply();
            }

            function onDestroy() {
                $document.off("mouseup vmouseup", onMouseUp);
                dragElement.off("mousedown vmousedown", onMouseDown);
                dragElement.parents().off("mousemove vmousemove", onDrag);
            }
        }
    };
}).directive('compareWindow', function () {
    return {
        restrict: 'E',
        scope: {
            project: '=',
            fileMeta: '=',
            previewer: '=',
            compareType: '=',

            provider: '=',
            parentFolder: '='
        },
        templateUrl: 'app/views/compare/tpls/compare-window.html',
        controller: function controller($scope, SyncFileSelectService, $location, SyncUrlService, SyncUtilService, $stateParams, $state, SyncService, $timeout) {
            $scope.selectFile = selectFile; // function()
            $scope.openFileFolder = SyncUtilService.openFileFolder; //function()

            init();

            /////////////////////////////////////

            function init() {
                if ($scope.fileMeta) {
                    SyncService.revisionsDeep($scope.fileMeta).then(function (response) {
                        $scope.fileMeta = response;
                    });
                }
            }

            function selectFile(event) {
                SyncFileSelectService.select(event, { provider: $scope.provider, project: $scope.project, path: $scope.parentFolder }).then(function (response) {
                    $state.current.reloadOnSearch = false;
                    $location.search('path' + $scope.previewer.number, SyncUrlService.getPath(response));
                    var childPath;
                    if (response.virtualChildren) {
                        childPath = SyncUrlService.getChildPath(response.virtualChildren);
                    }
                    $location.search('children' + $scope.previewer.number, childPath);
                    $scope.fileMeta = response;
                    init();
                    $scope.previewer.enabled = true;
                    $timeout(function () {
                        $state.current.reloadOnSearch = undefined;
                    });
                });
            }
        }
    };
}).directive('compareHeader', function () {
    return {
        restrict: 'E',
        //        replace: true,
        scope: {
            fileMeta: '=',
            previewer: '='
        },
        templateUrl: 'app/views/compare/tpls/compare-header.html',
        controller: function controller($scope, SyncFileSelectService, $location, SyncUrlService, SyncUtilService, $stateParams, $state, SyncService, $timeout) {
            $scope.closeWindow = closeWindow; // function()
            $scope.openFileFolder = SyncUtilService.openFileFolder; //function()

            /////////////////////////////////////


            function closeWindow() {
                $state.current.reloadOnSearch = false;
                $scope.previewer.enabled = false;
                if ($scope.previewer.number != '1') {
                    $location.search('path' + $scope.previewer.number, undefined);
                    $location.search('children' + $scope.previewer.number, undefined);
                }
                $timeout(function () {
                    $state.current.reloadOnSearch = undefined;
                });
            }
        }
    };
}).directive('compareRevisionTimeline', function () {
    return {
        restrict: 'E',
        scope: {
            fileMeta: '=',
            previewer: '='
        },
        templateUrl: 'app/views/compare/tpls/compare-revision-timeline.html',
        controller: function controller($scope, SyncFileSelectService, $location, SyncUrlService, $stateParams, $state, SyncService, $timeout) {
            $scope.revisionChange = revisionChange; //function()

            /////////////////////////////////////

            function revisionChange(fileMetaString, revisionMeta) {
                $scope.fileMeta = _.extend($scope.fileMeta, revisionMeta, true);
                $state.current.reloadOnSearch = false;

                var childPath = SyncUrlService.getChildPath($scope.fileMeta.virtualChildren);
                $location.search('path' + $scope.previewer.number, SyncUrlService.getPath($scope.fileMeta));
                if (childPath) {
                    $location.search('children' + $scope.previewer.number, childPath);
                }
                if ($scope.previewer.render) {
                    $timeout($scope.previewer.render);
                }
                $timeout(function () {
                    $state.current.reloadOnSearch = undefined;
                });
            }
        }
    };
});
'use strict';

angular.module('views.contact', []);
angular.module('views.contact').config(function ($stateProvider) {
    $stateProvider.state('app.contact', {
        url: '/contact',
        templateUrl: 'app/views/contact/contact.html',
        controller: 'ContactFormCtrl',
        layout: {
            footer: true
        },
        seo: function seo(resolve) {
            return {
                title: "Get in touch - Contact STEMN"
            };
        }
    });
}).controller('ContactFormCtrl', function ($scope, $rootScope, $http, $timeout, $mdToast) {
    $scope.contact = {};
    $scope.forms = {};
    $scope.submitContactForm = function () {
        if ($scope.forms.contactForm.$valid) {
            $http.post('/api/v1/mail/contact', $scope.contact).then(function (response) {
                $mdToast.show($mdToast.simple().content("Your message has been sent, we'll get back to you ASAP."));
                $scope.contact = {};
            }).catch(function () {
                $mdToast.show($mdToast.simple().theme('warn').content("Something went wrong... We could't send the message."));
            });
        }
    };
});
'use strict';

angular.module('views.create', []);
angular.module('views.create').config(function ($stateProvider) {
    $stateProvider.state('app.create', {
        url: '/create',
        abstract: true
    }).state('app.create.something', {
        url: '',
        dialog: true, // when true, dialogs will not close on state load.
        onEnter: function onEnter(NewCreationsService, $state) {
            NewCreationsService.createModal().catch(function (response) {
                $state.go('app.home');
            });
        }
    }).state('app.create.project', {
        url: '/project',
        dialog: true, // when true, dialogs will not close on state load.
        onEnter: function onEnter(ProjectCreateModalService, $state) {
            ProjectCreateModalService.newProject().catch(function (response) {
                $state.go('app.home');
            });
        }
    }).state('app.create.question', {
        url: '/question',
        dialog: true, // when true, dialogs will not close on state load.
        onEnter: function onEnter(ThreadCreateModalService, $state) {
            ThreadCreateModalService.newThread(event, { type: 'question' }).catch(function (response) {
                $state.go('app.home');
            });
        }
    }).state('app.create.general', {
        url: '/general',
        dialog: true, // when true, dialogs will not close on state load.
        onEnter: function onEnter(ThreadCreateModalService, $state) {
            ThreadCreateModalService.newThread(event, { type: 'general' }).catch(function (response) {
                $state.go('app.home');
            });
        }
    }).state('app.create.blog', {
        url: '/blog',
        dialog: true, // when true, dialogs will not close on state load.
        onEnter: function onEnter(ThreadCreateModalService, $state) {
            ThreadCreateModalService.newThread(null, { type: 'blog' }).catch(function (response) {
                $state.go('app.home');
            });
        }
    });
});
'use strict';

angular.module('views.creations', []);
angular.module('views.creations').config(function ($stateProvider) {
    $stateProvider.state('app.creations', {
        url: '/creations',
        abstract: true,
        authLevel: 'user',
        sticky: true,
        templateUrl: 'app/views/creations/tpls/creations.html',
        controller: function controller($scope, $rootScope, $state, NewCreationsService, Authentication, CoreLibrary) {

            // Data -----------------------------------------------------
            $scope.user = Authentication.currentUser;
            $scope.$state = $state;

            // Tabs ------------------------------------------------------
            $scope.tabs = [{
                label: 'All',
                sref: 'app.creations.all'
            }, {
                label: 'Published',
                sref: 'app.creations.published'
            }, {
                label: 'Drafts',
                sref: 'app.creations.drafts'
            }];
        },
        layout: {
            size: 'md',
            footer: false,
            bgColor: 'rgba(0, 0, 0, 0.03)'
        },
        seo: function seo(resolve) {
            return {
                title: 'Your Creations - STEMN',
                description: "Find your blogs, questions, discussions and projects. Everything you have created is here!"
            };
        }
    }).state('app.creations.all', {
        url: '',
        sticky: true,
        views: {
            'all': {
                templateUrl: 'app/views/creations/tpls/creations-all.html'
            }
        }
    }).state('app.creations.drafts', {
        url: '/drafts',
        sticky: true,
        views: {
            'drafts': {
                templateUrl: 'app/views/creations/tpls/creations-drafts.html'

            }
        }
    }).state('app.creations.published', {
        url: '/published',
        sticky: true,
        views: {
            'published': {
                templateUrl: 'app/views/creations/tpls/creations-published.html'
            }
        }
    });
}).directive('myCreations', function ($timeout, $state) {
    return {
        restrict: 'E',
        scope: {
            published: '@' // true || false || 'both' - true behavior defaults
        },
        templateUrl: 'app/views/creations/tpls/my-creations.html',
        controller: function controller($scope, FeedService, Authentication, CoreLibrary, ThreadService, ProjectService, $location, HttpQuery, EntityService) {
            $scope.message = getMessage();

            $scope.query = HttpQuery({
                url: '/api/v1/search',
                params: {
                    types: ['job', 'project', 'thread'],
                    size: 20,
                    sort: 'updated',
                    key: 'name',
                    select: ['name', 'stub', 'entityType', 'type', 'updated', 'published', 'likes', 'numPosts', 'numComments'],
                    parentType: 'user',
                    published: $scope.published,
                    parentId: Authentication.currentUser._id
                },
                onSuccess: function onSuccess(results) {
                    setTypeText(results);
                    setNames(results);
                    setHref(results);
                    return results;
                }
            });
            $scope.query.more();

            // Functions
            $scope.deleteCreation = deleteCreation; // function(id, type)
            $scope.edit = edit; // function(item)

            ///////////////////////////////////////////////////////
            function setTypeText(feed) {
                _.forEach(feed, function (item) {
                    if (item.type) {
                        if (item.type == 'project') {
                            item.typeText = 'Project';
                        } else if (item.type == 'blog') {
                            item.typeText = 'Blog';
                        } else if (item.type == 'general') {
                            item.typeText = 'discussion';
                        } else {
                            item.typeText = 'question';
                        }
                    } else {
                        item.typeText = item.entityType;
                    }
                });
            }
            function getMessage() {
                var message;
                if ($scope.published == 'false') {
                    message = '<p>You have no drafts.</p>';
                } else if ($scope.published == 'true') {
                    message = '<p>You haven’t published anything yet.</p>' + '<p>Your projects/questions/blogs will not appear on your profile or in search results until it has been published. Only people with the link can view a your work if it is unpublished.</p>';
                } else {
                    message = '<p>You haven’t published anything yet.</p>';
                }
                return message;
            }

            function setNames(feed) {
                _.forEach(feed, function (item) {
                    // If it has no name
                    if (!item.name) {
                        item.name = item.published ? 'Untitled ' + item.entityType : 'Unpublished ' + item.entityType;
                    } else {
                        item.name = item.published ? item.name : item.name + ' (Unpublished)';
                    }
                });
            }
            function setHref(feed) {
                _.forEach(feed, function (item) {
                    item.href = CoreLibrary.getHref(item.type || item.entityType, item.stub || item._id);
                });
            }

            function deleteCreation(id, type) {
                if (type == 'project') {
                    ProjectService.deleteProject(id);
                } else if (type == 'job') {
                    EntityService.remove('job', id);
                } else {
                    ThreadService.deleteThread(id);
                }

                // Find the index of the creation we want to delete
                var index = _.findIndex($scope.query.results, function (item) {
                    return item._id == id;
                });
                // Splice it from the feed array
                $scope.query.results.splice(index, 1);
            }

            function edit(item) {
                // Set the form so we begin edit automatically
                var form;
                if (item.entityType == 'project') {
                    $state.go('app.project.settings.options', { stub: item.stub || item._id });
                } else if (item.entityType == 'thread') {
                    $state.go('app.thread.edit', { stub: item.stub || item._id });
                } else {
                    if (item.entityType == 'job') {
                        form = 'JobForm';
                    }
                    $location.url(item.href + '?edit=' + form);
                }
            }
        }
    };
});
'use strict';

angular.module('views.dashboard', []);
angular.module('views.dashboard').config(function ($stateProvider) {
    $stateProvider.state('app.dashboard', {
        url: '/dashboard',
        abstract: true,
        authLevel: 'user',
        templateUrl: 'app/views/dashboard/tpls/dashboard.html',
        controller: function controller($scope) {

            // Tabs ------------------------------------------------------
            $scope.tabs = [{
                label: 'My Projects',
                sref: 'app.dashboard.projects'
            }, {
                label: 'Change Log',
                sref: 'app.dashboard.feed'
            }];
        },
        layout: {
            size: 'md',
            footer: false,
            bgColor: 'rgba(0, 0, 0, 0.03)'
        },
        seo: function seo(resolve) {
            return {
                title: 'Your Dashboard - STEMN'
            };
        }
    }).state('app.dashboard.projects', {
        url: '',
        templateUrl: 'app/views/dashboard/tpls/dashboard-projects.html',
        controller: function controller($scope, HttpQuery, Authentication) {
            $scope.query = HttpQuery({
                url: '/api/v1/search',
                params: {
                    type: 'project',
                    size: 20,
                    sort: 'updated',
                    key: 'name',
                    select: ['name', 'stub', 'entityType', 'type', 'updated', 'published', 'likes', 'numPosts', 'numComments', 'permissions.projectType'],
                    parentType: 'user',
                    published: 'both',
                    parentId: Authentication.currentUser._id
                },
                onSuccess: function onSuccess(results) {
                    return results;
                }
            });
            $scope.query.more();
        }
    }).state('app.dashboard.feed', {
        url: '/feed',
        templateUrl: 'app/views/dashboard/tpls/dashboard-feed.html'
    });
});
'use strict';

angular.module('views.error', ['modules.layout-options']);
angular.module('views.error').config(function ($stateProvider) {
    $stateProvider.state('app.verify', {
        url: '/verify?id',
        resolve: {
            jwt: function jwt(Authentication, $stateParams) {
                // login via the jwt
                if ($stateParams.id) {
                    return Authentication.setToken($stateParams.id, false);
                }
            },
            verify: function verify($http, $stateParams, jwt, Authentication) {
                return $http.get('/api/v1/account/verify').then(function (response) {
                    // reload the current user to get the latest data after verification
                    Authentication.currentUser.verified = !!response.data.success;
                    return response.data;
                });
            }
        },
        templateUrl: 'app/views/error/error.html',
        controller: 'VerifyCtrl',
        layout: {
            size: 'md',
            bgColor: 'rgba(0, 0, 0, 0.03)'
        }
    }).state('app.404', {
        url: '/404',
        controller: '404PageCtrl',
        templateUrl: 'app/views/error/error.html',
        seo: function seo(resolve) {
            return {
                title: "Lost in Space - STEMN"
            };
        },
        layout: {
            size: 'md',
            bgColor: 'rgba(0, 0, 0, 0.03)'
        }
    }).state('app.permissions', {
        url: '/permissions',
        controller: 'ErrorPermissionsCtrl',
        templateUrl: 'app/views/error/error.html',
        layout: {
            size: 'md',
            bgColor: 'rgba(0, 0, 0, 0.03)'
        }
    }).state('app.admin-only', {
        url: '/admin-only',
        controller: 'AdminOnlyCtrl',
        templateUrl: 'app/views/error/error.html',
        layout: {
            size: 'md',
            bgColor: 'rgba(0, 0, 0, 0.03)'
        }
    });
}).controller('VerifyCtrl', function ($rootScope, $scope, verify, LayoutOptions) {
    if (verify.success) {
        $scope.title = "SUCCESS!";
        $scope.description = "Your account is fully verified.";
        $scope.buttontext = "Head to your news feed";
    } else {
        $scope.title = "OOPS, SOMETHING WENT WRONG";
        $scope.description = "Something went wrong. Your user ID does not exist. If this keeps occuring, please contact us.";
        $scope.buttontext = "Head back to base";
        $scope.image = "assets/images/TransFull-Rect-600.png";
    }
}).controller('404PageCtrl', function ($scope, $rootScope) {
    $scope.title = "LOST IN SPACE";
    $scope.description = "It looks like the page your were looking for is gone.";
    $scope.buttontext = "Head back to base";
    $scope.image = "assets/images/TransFull-Rect-600.png";
}).controller('ErrorPermissionsCtrl', function ($scope, $rootScope) {
    $scope.title = "CAN'T SHOW YOU THAT";
    $scope.description = "You don't have the right permissions to see this.";
    $scope.buttontext = "Head back to base";
}).controller('AdminOnlyCtrl', function ($scope, $rootScope) {
    $scope.title = "SORRY, ADMINS ONLY";
    $scope.description = "This is where we keep our secrets.";
    $scope.buttontext = "Get outa here";
});
'use strict';

angular.module('views.faq', []);
angular.module('views.faq').config(function ($stateProvider) {
    $stateProvider.state('app.faq', {
        url: '/faq',
        templateUrl: 'app/views/faq/faq.html',
        controller: function controller($scope, $rootScope, NewCreationsService) {
            $scope.newSomething = NewCreationsService.createModal; // function($event)
        },
        seo: function seo(resolve) {
            return {
                title: "FAQs - STEMN"
            };
        }
    });
});
'use strict';

angular.module('views.field', ['modules.fields']);

angular.module('views.field').config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when("/fields/:stub", "/fields/:stub/projects");

    $stateProvider.state('app.field', {
        url: '/fields/:stub?projectview&location',
        sticky: true,
        templateUrl: 'app/views/field/field.html',
        resolve: {
            field: function field(FieldService, $stateParams) {
                return FieldService.getField($stateParams.stub).then(function (field) {
                    return field;
                });
            }
        },
        abstract: true,
        controller: 'FieldViewCtrl',
        seo: function seo(resolve) {
            return {
                title: resolve.field.name + 'Field - STEMN',
                picture: resolve.field.banner.url,
                description: resolve.field.blurb
            };
        },
        layout: {
            size: 'md',
            footer: true
        }
    }).state('app.field.top', {
        url: '/top',
        templateUrl: 'app/views/field/tpls/field-top.html',
        seo: function seo(resolve) {
            return {
                title: 'Top ' + resolve.field.name + ' Projects, Questions and Organisations - STEMN'
            };
        }
    }).state('app.field.threads', {
        url: '/threads',
        templateUrl: 'app/views/field/tpls/field-threads.html',
        data: {
            name: 'forum'
        },
        seo: function seo(resolve) {
            return {
                title: resolve.field.name + ' Forum - Questions and Discussions - STEMN'
            };
        }
    }).state('app.field.blogs', {
        url: '/blogs',
        templateUrl: 'app/views/field/tpls/field-blogs.html',
        data: {
            name: 'updates'
        },
        seo: function seo(resolve) {
            return {
                title: 'Latest ' + resolve.field.name + ' Blogs and Project updates - STEMN'
            };
        }
    }).state('app.field.projects', {
        url: '/projects',
        templateUrl: 'app/views/field/tpls/field-project.html',
        data: {
            name: 'projects'
        },
        seo: function seo(resolve) {
            return {
                title: 'Latest ' + resolve.field.name + ' Projects - STEMN'
            };
        }
    }).state('app.field.jobs', {
        url: '/jobs',
        templateUrl: 'app/views/field/tpls/field-jobs.html',
        data: {
            name: 'jobs'
        },
        seo: function seo(resolve) {
            return {
                title: resolve.field.name + ' Jobs and careers - STEMN'
            };
        }
    }).state('app.field.organisations', {
        url: '/organisations',
        templateUrl: 'app/views/field/tpls/field-organisations.html',
        data: {
            name: 'organisations'
        },
        seo: function seo(resolve) {
            return {
                title: resolve.field.name + ' Organisations and Companies - STEMN'
            };
        }
    });
    //    state('app.field.people', {
    //        url: '/people',
    //        templateUrl: 'app/views/field/tpls/field-people.html',
    //        controller: 'FieldSubViewCtrl'
    //    })
}).controller('FieldViewCtrl', function ($scope, $rootScope, $state, field, FieldService, CoreLibrary, HttpService, PublishService) {
    $scope.field = field;
    $scope.showEdit = true;
    $scope.save = function () {
        FieldService.updateField($scope.field);
    };
    $scope.deleteField = function () {
        FieldService.deleteField($scope.field._id).then(function () {
            $state.go('app.browse.fields');
        });
    };
    $scope.editStub = editStub;

    /////////////////////////////

    function editStub(event) {
        PublishService.selectStubModal(event, $scope.field).then(function (stub) {
            $scope.field.stub = stub;
            $scope.save();
        });
    }
});
'use strict';

angular.module('views.following', ['modules.following']);
angular.module('views.following').config(function ($stateProvider) {
    $stateProvider.state('app.following', {
        url: '/following',
        abstract: 'true',
        authLevel: 'user',
        template: '<ui-view></ui-view>',
        layout: {
            size: 'sm',
            footer: true
        }
    }).state('app.following.all', {
        url: '',
        templateUrl: 'app/views/following/tpls/following-all.html'
    }).state('app.following.fields', {
        url: '/fields',
        templateUrl: 'app/views/following/tpls/following.html',
        controller: function controller($scope) {
            $scope.type = 'field';
            $scope.title = 'Fields';
        }
    }).state('app.following.organisations', {
        url: '/organisations',
        templateUrl: 'app/views/following/tpls/following.html',
        controller: function controller($scope) {
            $scope.type = 'organisation';
            $scope.title = 'Organisations';
        }

    }).state('app.following.projects', {
        url: '/projects',
        templateUrl: 'app/views/following/tpls/following.html',
        controller: function controller($scope) {
            $scope.type = 'project';
            $scope.title = 'Projects';
        }
    }).state('app.following.threads', {
        url: '/threads',
        templateUrl: 'app/views/following/tpls/following.html',
        controller: function controller($scope) {
            $scope.type = 'thread';
            $scope.title = 'Blogs and Questions';
        }
    }).state('app.following.users', {
        url: '/users',
        templateUrl: 'app/views/following/tpls/following.html',
        controller: function controller($scope) {
            $scope.type = 'user';
            $scope.title = 'Users';
        }
    });
});
'use strict';

angular.module('views.home', []);
angular.module('views.home').config(function ($stateProvider) {
    $stateProvider.state('app.home', {
        url: '/?type&projectview&location',
        //        resolve: {
        //            userdata: function (userdata) {
        //                return userdata;
        //            },
        //        },
        templateUrl: 'app/views/home/home.html',
        controller: 'HomeViewCtrl',
        layout: {
            //            chat: false,
            topBanner: false,
            bgColor: 'rgba(0, 0, 0, 0.03)',
            size: 'md'
        },
        seo: function seo(resolve) {
            return {
                title: "STEMN - The Largest Community for Space Projects, Questions and Answers",
                description: "STEMN is a network connecting the knowledge of the international space community. Showcase your projects, get recognition for your research, and discover what the rest of the community is creating. Let's build space. Together."
            };
        }
    });
}).controller('HomeViewCtrl', function (OnboardingService, $mdToast, FooterService, $scope, $state, Authentication, NewCreationsService, UserService, HttpQuery, EntityService) {

    // Scoped Data
    $scope.footerItems = FooterService.items;
    $scope.currentUser = Authentication.currentUser;

    // Scoped function
    $scope.newSomething = NewCreationsService.createModal; // function($event)
    $scope.learnMore = OnboardingService.goToLanding; // function()
    $scope.authenticate = authenticate; // function(provider)

    UserService.getUser(Authentication.currentUser._id, 'lg').then(function (user) {
        $scope.user = user;

        $scope.peopleQuery = HttpQuery({
            url: '/api/v1/users/' + user._id + '/peopleYouMayKnow',
            params: {
                size: 4
            },
            requerySize: 12,
            onSuccess: function onSuccess(results) {
                // Remove self
                _.forEach(results, function (result) {
                    EntityService.get('user', result._id, 'sm').then(function (user) {
                        result.user = user;
                    });
                });

                return results;
            }
        });
        $scope.peopleQuery.more();
    });
    var randomLetter = String.fromCharCode(97 + new Date().getHours()); // Character code of a = 97, will get a letter from A - W
    $scope.jobQuery = HttpQuery({
        url: '/api/v1/search',
        params: {
            type: 'job',
            size: 3,
            key: 'name',
            select: ['name', 'stub', 'organisations'],
            sort: 'numApplications',
            criteria: {
                name: '/' + randomLetter + '/i'
            }
        }
    });
    $scope.jobQuery.more();

    // If the user is not authenticated send them to landing (if they haven't been there already)
    // If they have location state params, dont redirect
    if (!Authentication.currentUser.isLoggedIn() && !OnboardingService.beenLanding) {
        OnboardingService.goToLanding();
    }

    ////////////////////////////////////////////////

    function authenticate(provider) {
        Authentication.authenticate(provider).then(function (response) {
            $mdToast.show($mdToast.simple().content('You can now log in to this account using ' + provider + '!'));
        }).catch(function (response) {
            $mdToast.show($mdToast.simple().theme('warn').content('Oops... ' + response.data.message || response.data));
        });
    }
});
'use strict';

angular.module('views.index', [
    //    'views.index.jobs'
]);
angular.module('views.index').config(function ($stateProvider) {
    $stateProvider.state('app.index', {
        url: '/explore',
        template: '<ui-view></ui-view>',
        layout: {
            size: 'md',
            footer: true
        }
    }).state('app.jobsIndex', {
        url: '/explore/jobs',
        templateUrl: 'app/views/index/tpls/jobs-index.html',
        resolve: {
            fields: function fields(SearchService) {
                return SearchService.search({
                    type: 'field',
                    page: 1,
                    size: 40,
                    sort: 'numJobs',
                    select: ['name', 'stub', 'picture'],
                    key: 'name'
                }).then(function (response) {
                    return response.data;
                });
            }
        },
        controller: function controller(fields, $scope, LocationService) {
            $scope.fields = fields;
        },
        seo: function seo(resolve) {
            return {
                title: "Explore Jobs by Fields Category - STEMN",
                description: "Find a jobs that interest you. Explore jobs near you in Science, Engineering and Aerospace."
            };
        },
        layout: {
            size: 'md',
            footer: true
        }
    }).state('app.jobsQuery', {
        url: '/browse-jobs/:field?locations',
        templateUrl: 'app/views/index/tpls/jobs-query-field.html',
        resolve: {
            field: function field(SearchService, $stateParams) {
                return SearchService.search({
                    key: 'stub',
                    type: 'field',
                    size: 1,
                    value: $stateParams.field,
                    'select[]': ['name', 'stub']
                }).then(function (response) {
                    return response.data[0];
                });
            }
        },
        controller: function controller(field, $scope, $http, $stateParams, $state, $timeout) {
            $scope.field = field;

            $http({
                method: 'GET',
                url: 'api/v1/jobs/locations',
                params: {
                    size: 10
                }
            }).then(function (response) {
                console.log(response);
                $scope.locations = response.data;
            });

            // Function to scope
            $scope.assignStateParams = assignStateParams;

            assignStateParams();

            //////////////////////////////

            function assignStateParams() {
                $timeout(function () {
                    $scope.locationsPage = parseInt($state.params.locations || 1);
                    $scope.locationsLimit = $scope.locationsPage * 10 - 1;
                });
            }

            //            $http({
            //                method : 'GET',
            //                url    : 'https://maps.googleapis.com/maps/api/place/photo',
            //                params : {
            //                    maxwidth:400,
            //                    photorefrence: 'CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU',
            //                    key: 'AIzaSyAR4w1kCzux3l-vTEardxTOZ4tXRM4df_k'
            //                }
            //            }).then(function (response) {
            //                console.log(response);
            //            });
        },
        seo: function seo(resolve) {
            return {
                title: "Explore " + resolve.field.name + " Jobs - STEMN",
                picture: resolve.field.picture
            };
        },
        layout: {
            size: 'md',
            footer: true
        }
    }).state('app.jobsQuery.location', {
        url: '/:location',
        templateUrl: 'app/views/index/tpls/jobs-query-field-location.html',
        resolve: {
            location: function location(LocationService, $stateParams) {
                return LocationService.geoCode($stateParams.location).then(function (response) {
                    return response[0];
                });
            }
        },
        controller: function controller(location, field, $scope) {
            $scope.field = field;
            $scope.location = location;
        },
        seo: function seo(resolve) {
            return {
                title: "Explore " + resolve.field.name + " Jobs and Careers in " + resolve.location.components[0].long_name + " - STEMN",
                picture: resolve.field.picture
            };
        }
    });
});
'use strict';

angular.module('views.job', ['modules.jobs']);
angular.module('views.job').config(function ($stateProvider) {
    $stateProvider.state('app.job', {
        url: '/jobs/:stub?edit',
        templateUrl: 'app/views/job/tpls/job.html',
        controller: 'JobViewCtrl',
        seo: function seo(resolve) {
            return {
                title: resolve.entity.name + ' - STEMN' || 'Untitled Job',
                picture: resolve.entity.organisation ? resolve.entity.organisation[0].picture || '' : '',
                description: resolve.entity.blurb
            };
        },
        resolve: {
            entity: function entity(userdata, $timeout, $state, $stateParams, EntityService) {
                return EntityService.get('job', $stateParams.stub).catch(function (error) {
                    $timeout(function () {
                        $state.go('app.404', null, { location: false });
                    });
                });
            }
        },
        layout: {
            size: 'md',
            footer: true
        }
    });
}).controller('JobViewCtrl', function (entity, $scope, $state, $document, $timeout, $http, $mdToast, Authentication, HighlightElement, LayoutOptions, JobModalService, CoreLibrary, ApplicationService, PublishService, EntityService) {
    $scope.forms = {};
    $scope.entity = initEntity(entity);
    $scope.user = Authentication.currentUser;

    $scope.userCanEdit = _.any(entity.owners, function (member) {
        return Authentication.currentUser._id === member;
    }) || Authentication.currentUser.isAdmin;
    $scope.showEdit = $scope.userCanEdit;

    if (!$scope.entity.published && $scope.userCanEdit) {
        $timeout(function () {
            $scope.forms.JobForm.$edit();
        });
    }

    $scope.jobTypes = ['Full-time', 'Part-time', 'Casual', 'Internship', 'Volunteer', 'Temporary'];
    $scope.visas = ['Available', 'Not Available', 'Not Applicable', 'No - Must be citizen'];
    $scope.currency = CoreLibrary.getCurrencies();

    // Scoped functions
    $scope.save = save; // function()
    $scope.publish = publish; // function()
    $scope.deleteJob = deleteJob; // function()
    $scope.editFn = editFn; // function()
    $scope.endEditFn = endEditFn; // function()
    $scope.createJob = JobModalService.createJob; // function(event)
    $scope.formatDate = formatDate; // function(date)
    $scope.checkSourceValid = checkSourceValid; // function()


    ///////////////////////////////////////////////////////////////

    function checkSourceValid() {
        if ($scope.entity.sourceUrl && $scope.entity.sourceKnownString) {
            $http({
                method: 'GET',
                url: '/api/v1/sync/download/sourceCheck',
                params: {
                    url: $scope.entity.sourceUrl,
                    string: $scope.entity.sourceKnownString
                }
            }).then(function (response) {
                if (response.data.found) {
                    $mdToast.show($mdToast.simple().content('Job source is valid'));
                } else {
                    failToaster();
                }
            }).catch(failToaster);
        } else {
            failToaster();
        }

        function failToaster() {
            $mdToast.show($mdToast.simple().content('Source Check failed').theme('warn'));
        }
    }

    function initEntity(entity) {
        // Format Dates
        entity.deadline = formatDate(entity.deadline);
        return entity;
    }

    function formatDate(date) {
        if (date) {
            date = new Date(date);
        } else {
            date = '';
        }
        return date;
    }

    function editFn() {
        LayoutOptions.footer.hideFooter = true;
    }
    function endEditFn() {
        LayoutOptions.footer.hideFooter = false;
    }
    function save() {
        $scope.entity.updated = Date.now();
        return EntityService.update('job', $scope.entity).then(function (response) {
            $scope.entity = initEntity(response);
        });
    }
    function deleteJob() {
        EntityService.remove('job', $scope.entity._id).then(function () {
            history.back();
        });
    }
    function publish(event) {
        // Check if we can publish
        // If we can't find any that are missing, we can publish
        if (!_.find($scope.requiredFields, 'missing')) {
            PublishService.selectStubModal(event, $scope.entity, $scope.entity.organisations[0].name + '-').then(function (stub) {
                $scope.entity.stub = stub;
                $scope.entity.updated = Date.now();
                var entityCopy = _.clone($scope.entity, true);
                entityCopy.published = true;
                EntityService.update('job', entityCopy).then(function (response) {
                    $scope.forms.JobForm.$endEdit();
                    $scope.entity = initEntity(response);
                    $mdToast.show($mdToast.simple().content('Your job listing has been published. It will now be public.'));
                    // Go to the new named entity after the edit finishes
                    $timeout(function () {
                        $state.go('app.job', { stub: response.stub });
                    }, 0);
                });
            });
        } else {
            $scope.publishAttempted = true;
            $document.scrollTopAnimated(0);
            PublishService.missingFieldsToast($scope.forms.JobForm);
        }
    }

    $scope.requiredFields = [{
        model: 'name',
        condition: function condition(entity) {
            return !!entity.name;
        },
        title: 'You must add a job name. <a ng-click="field.click()">Click here to add one.</a>',
        click: function click() {
            HighlightElement.scrollHighlightElement('nameEdit', { background: true, offset: 100 });
        }
    }, {
        model: 'fields',
        condition: function condition(entity) {
            return entity.fields.length > 0;
        },
        title: 'You have not added any related fields <a ng-click="field.click()">Add field tags.</a>',
        click: function click() {
            HighlightElement.scrollHighlightElement('fieldsEdit', { background: true, offset: 100 });
        }
    }, {
        model: 'location',
        condition: function condition(entity) {
            return entity.location.length > 0;
        },
        title: 'You have not added a location yet. <a ng-click="field.click()">Click here to add one.</a>',
        click: function click() {
            HighlightElement.scrollHighlightElement('locationEdit', { background: true, offset: 100 });
        }
    }, {
        model: 'description',
        condition: function condition(entity) {
            return entity.description && entity.description.length > 10;
        },
        title: 'You must have a job description. <a ng-click="field.click()">Click here.</a>',
        click: function click() {
            HighlightElement.scrollHighlightElement('descriptionEdit', { background: true, offset: 100 });
        }
    }];
});
'use strict';

angular.module('views.landing.community', []);
angular.module('views.landing.community').config(function ($stateProvider) {
    $stateProvider.state('app.landing.community', {
        url: '/community',
        templateUrl: 'app/views/landing/landing-community/tpls/landing-community.html',
        controller: function controller($scope, $timeout, $interval) {},
        seo: function seo() {
            return {
                title: "Open-Source Community - STEMN"
            };
        },
        layout: {
            size: 'md',
            sidebar: false,
            footer: true,
            topBanner: false
        }
    });
});
'use strict';

angular.module('views.landing.jobs', []);
angular.module('views.landing.jobs').config(function ($stateProvider) {
    $stateProvider.state('app.landing.jobs', {
        url: '/jobs',
        templateUrl: 'app/views/landing/landing-jobs/tpls/landing-jobs.html',
        controller: function controller(OnboardingService) {
            OnboardingService.beenLanding = true;
        },
        seo: function seo() {
            return {
                title: "Aerospace Jobs - Simple 2 Click Application - STEMN"
            };
        },
        layout: {
            size: 'md',
            sidebar: false,
            footer: true,
            topBanner: false
        }
    });
});
'use strict';

angular.module('views.landing.pricing', []);
angular.module('views.landing.pricing').config(function ($stateProvider) {
    $stateProvider.state('app.landing.pricing', {
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
            size: 'md',
            sidebar: false,
            footer: true,
            topBanner: false
        }
    });
});
'use strict';

angular.module('views.landing.recruiting', []);
angular.module('views.landing.recruiting').config(function ($stateProvider) {
    $stateProvider.state('app.landing.recruiting', {
        url: '/recruiting',
        templateUrl: 'app/views/landing/landing-recruiting/landing-recruiting.html',
        controller: function controller($scope, OnboardingService, AuthenticationModalService) {
            OnboardingService.beenLanding = true;
            $scope.loginRecruit = AuthenticationModalService.loginRecruit; // function(event)
        },
        seo: function seo() {
            return {
                title: "For Employers - Recruit the world's best scientists and engineers - STEMN"
            };
        },
        layout: {
            size: 'md',
            sidebar: false,
            footer: true,
            topBanner: false
        }
    });
});
'use strict';

angular.module('views.landing.sync', []);
angular.module('views.landing.sync').config(function ($stateProvider) {
    $stateProvider.state('app.landing.sync', {
        url: '',
        templateUrl: 'app/views/landing/landing-sync/tpls/landing-sync.html',
        controller: function controller($scope, $timeout, $interval) {
            $scope.slider = {
                width: 50
            };

            animateSlider();
            $interval(animateSlider, 10000);

            /////////////////////

            function animateSlider() {
                $timeout(function () {
                    $scope.slider.width = 100;
                }, 1000);
                $timeout(function () {
                    $scope.slider.width = 0;
                }, 2000);
                $timeout(function () {
                    $scope.slider.width = 50;
                }, 3000);
            }
        },
        layout: {
            size: 'md',
            sidebar: false,
            footer: true,
            topBanner: false
        }
    });
}).directive('landingTimeline', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/views/landing/landing-sync/tpls/landing-timeline.html',
        controller: function controller($scope) {

            $scope.iconMap = {
                fileUpdate: 'editor:mode_edit',
                fileCreate: 'content:add',
                projectUpdate: 'editor:mode_edit',
                comment: 'editor:mode_comment',
                invite: 'social:person_add'
            };
            $scope.colorMap = {
                fileUpdate: '#FDC852',
                fileCreate: '#46B7DF',
                projectUpdate: '#FDC852',
                comment: '#8CC04D',
                invite: '#ED7274'
            };

            var time = new Date().getTime();

            $scope.timeline = [{
                timestamp: time,
                event: 'fileUpdate',
                user: {
                    name: 'Emily Richard',
                    picture: 'assets/images/landing/sync/faces/face (2).jpg'
                },
                html: 'Created a new version. V.5'
            }, {
                timestamp: time - 1000 * 60 * 60 * 3.67,
                event: 'invite',
                user: {
                    name: 'Dan Cooper',
                    picture: 'assets/images/landing/sync/faces/face (5).jpg'
                },
                html: 'Was added to this project by <span class="text-green">@SarahCullen</span>'
            }, {
                timestamp: time - 1000 * 60 * 60 * 42.98,
                event: 'comment',
                user: {
                    name: 'Jon Davis',
                    picture: 'assets/images/landing/sync/faces/face (4).jpg'
                },
                html: 'Done. It\'s ready to go! <span class="text-green">@LucasArmstrong</span>'
            }, {
                timestamp: time - 1000 * 60 * 60 * 48.13,
                event: 'projectUpdate',
                user: {
                    name: 'Sarah Cullen',
                    picture: 'assets/images/landing/sync/faces/face (3).jpg'
                },
                html: 'Updated this project.'
            }, {
                timestamp: time - 1000 * 60 * 60 * 52.13,
                event: 'comment',
                user: {
                    name: 'Lucas Armstrong',
                    picture: 'assets/images/landing/sync/faces/face (1).jpg'
                },
                html: '<span class="text-green">@JonDavis</span> can you reduce the tolerences by 1mm for manufacture?'
            }];
        }
    };
});
'use strict';

angular.module('views.landing', ['views.landing.jobs', 'views.landing.recruiting', 'views.landing.pricing', 'views.landing.sync', 'views.landing.community', 'modules.authentication', 'modules.layout-options', 'modules.user-subdomain', 'modules.carousel']);
angular.module('views.landing').config(function ($stateProvider) {
    $stateProvider.state('app.landing', {
        abstract: true,
        url: '/landing',
        templateUrl: 'app/views/landing/landing.html',
        controller: 'LandingViewCtrl',
        layout: {
            horizontalMenu: false,
            topBanner: false
        },
        seo: function seo(resolve) {
            return {
                title: 'Welcome to STEMN - Connecting the Aerospace Community'
            };
        }
    });
}).controller('LandingViewCtrl', function ($scope, $state, Authentication, AuthenticationModalService, OnboardingService, $mdSidenav) {
    OnboardingService.beenLanding = true;

    $scope.toggleMenu = toggleMenu;
    $scope.login = function (event, state) {
        if (!Authentication.currentUser.isLoggedIn()) {
            AuthenticationModalService.login(event);
        } else {
            $state.go(state || 'app.home');
        }
    };

    $scope.menu = [{
        label: 'Sync',
        sref: 'app.landing.sync'
    }, {
        label: 'Community',
        sref: 'app.landing.community'
    }];

    /////////////////////

    function toggleMenu() {
        $mdSidenav('landing').toggle().then(function () {});
    }
}).directive('particles', function ($window) {
    /*****************************************
    Make sure to pass in an id on the element
    <particles id="stars-1"></particles>
    /****************************************/
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="particleJs"></div>',
        link: function link(scope, element, attrs, fn) {
            var options = {
                "particles": {
                    "number": {
                        "value": 200,
                        "density": {
                            "enable": true,
                            "value_area": 600
                        }
                    },
                    "color": {
                        "value": "#ffffff"
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 5
                        },
                        "image": {
                            "src": "",
                            "width": 180,
                            "height": 240
                        }
                    },
                    "opacity": {
                        "value": 1,
                        "random": true,
                        "anim": {
                            "enable": true,
                            "speed": 1,
                            "opacity_min": 0,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": 2,
                        "random": true,
                        "anim": {
                            "enable": false,
                            "speed": 4,
                            "size_min": 0.3,
                            "sync": false
                        }
                    },
                    "line_linked": {
                        "enable": false,
                        "distance": 150,
                        "color": "#ffffff",
                        "opacity": 0.05,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 0.5,
                        "direction": "none",
                        "random": false,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                        "attract": {
                            "enable": false,
                            "rotateX": 600,
                            "rotateY": 600
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "grab"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "repulse"
                        },
                        "resize": true
                    },
                    "modes": {
                        "grab": {
                            "distance": 80,
                            "line_linked": {
                                "opacity": 0.5
                            }
                        },
                        "bubble": {
                            "distance": 50,
                            "size": 0,
                            "duration": 2,
                            "opacity": 0,
                            "speed": 3
                        },
                        "repulse": {
                            "distance": 200,
                            "duration": 0.4
                        },
                        "push": {
                            "particles_nb": 10
                        },
                        "remove": {
                            "particles_nb": 2
                        }
                    }
                },
                "retina_detect": true
            };

            if (attrs.altDisplay) {
                options = {
                    "particles": {
                        "number": {
                            "value": 80,
                            "density": {
                                "enable": true,
                                "value_area": 800
                            }
                        },
                        "color": {
                            "value": "#d8d8d8"
                        },
                        "shape": {
                            "type": "circle",
                            "stroke": {
                                "width": 0,
                                "color": "#000000"
                            },
                            "polygon": {
                                "nb_sides": 5
                            },
                            "image": {
                                "src": "img/github.svg",
                                "width": 100,
                                "height": 100
                            }
                        },
                        "opacity": {
                            "value": 0.5,
                            "random": false,
                            "anim": {
                                "enable": false,
                                "speed": 1,
                                "opacity_min": 0.1,
                                "sync": false
                            }
                        },
                        "size": {
                            "value": 3,
                            "random": true,
                            "anim": {
                                "enable": false,
                                "speed": 40,
                                "size_min": 0.1,
                                "sync": false
                            }
                        },
                        "line_linked": {
                            "enable": true,
                            "distance": 150,
                            "color": "#b4b4b4",
                            "opacity": 0.4,
                            "width": 1
                        },
                        "move": {
                            "enable": true,
                            "speed": 3,
                            "direction": "none",
                            "random": false,
                            "straight": false,
                            "out_mode": "out",
                            "bounce": false,
                            "attract": {
                                "enable": false,
                                "rotateX": 600,
                                "rotateY": 1200
                            }
                        }
                    },
                    "interactivity": {
                        "detect_on": "canvas",
                        "events": {
                            "onhover": {
                                "enable": true,
                                "mode": "grab"
                            },
                            "onclick": {
                                "enable": true,
                                "mode": "push"
                            },
                            "resize": true
                        },
                        "modes": {
                            "grab": {
                                "distance": 400,
                                "line_linked": {
                                    "opacity": 1
                                }
                            },
                            "bubble": {
                                "distance": 400,
                                "size": 40,
                                "duration": 2,
                                "opacity": 8,
                                "speed": 3
                            },
                            "repulse": {
                                "distance": 159.84015984015983,
                                "duration": 0.4
                            },
                            "push": {
                                "particles_nb": 4
                            },
                            "remove": {
                                "particles_nb": 2
                            }
                        }
                    },
                    "retina_detect": true
                };
            }

            if (attrs.noInteractive) {
                options.interactivity.events.onhover.enable = false;
                options.interactivity.events.onclick.enable = false;
                options.particles.move.speed = 0.5;
            }

            $window.particlesJS(attrs.id, options);
        }
    };
});
'use strict';

angular.module('views.login', ['modules.authentication']);
angular.module('views.login').config(function ($stateProvider) {
    $stateProvider.state('app.login', {
        url: '/login',
        dialog: true,
        onEnter: function onEnter(AuthenticationModalService, $state, $timeout) {
            $timeout(function () {
                $state.go('app.home').then(function () {
                    $timeout(AuthenticationModalService.login, 1000);
                });
            }, 1);
        }
    });
});
'use strict';

angular.module('views.map', ['modules.mapbox', 'modules.maps', 'ngGeolocation', 'modules.prompt-overlay']);
angular.module('views.map').config(function ($stateProvider) {
    $stateProvider.state('app.map', {
        url: '/map?type&c',
        templateUrl: 'app/views/map/tpls/map.html',
        controller: 'MapViewCtrl',
        layout: {
            size: 'lg',
            horizontalMenu: false,
            topBanner: false,
            chat: false
        }
    });
}).controller('MapViewCtrl', function ($scope, Authentication, SearchService, CoreLibrary, $timeout, LayoutOptions, $geolocation, $location, $state, OrganisationModalService) {
    // Initialise Map objects
    var map, markerLayer;
    var mapCenter = [30, 0];
    var zoom = 4;

    // Formatting
    LayoutOptions.header.landing = true;
    $state.current.reloadOnSearch = false;

    // Initialise Query
    $scope.query = {
        type: 'project'
    };

    setDisplayLimit();
    processStateParams();

    $scope.setType = setType; //function(type)
    $scope.panToMarker = panToMarker; //function([lat,lng])
    $scope.geolocate = geolocate; //function()
    $scope.newOrganisation = newOrganisation; //function(event)
    $scope.$state = $state;
    $scope.$watch('$state.params', processStateParams); //Process Params whenever they change

    $scope.callback = function (mapboxMap) {
        map = mapboxMap;
        markerLayer = L.geoJson().addTo(map);
        markerLayer.on('mouseover', changeZIndex);
        var southWest = L.latLng(40.712, -74.227),
            northEast = L.latLng(40.774, -74.125),
            bounds = L.latLngBounds(southWest, northEast);
        map.zoomControl.removeFrom(map); // Remove zoom control
        map.setView(mapCenter, zoom); // Center Map
        getResults(); //initialise to get data
        map.on('move', _.debounce(getResults, 150));
        markerLayer.on('layeradd', function (e) {
            var marker = e.layer;
            var feature = marker.feature;
            marker.setIcon(L.icon(feature.properties.icon));
        });
    };

    ////////////////////////////////////////////////////////

    function getResults() {
        var _bounds = map.getBounds();
        var bounds = {
            northeast: {
                latitude: _bounds._northEast.lat,
                longitude: _bounds._northEast.lng
            },
            southwest: {
                latitude: _bounds._southWest.lat,
                longitude: _bounds._southWest.lng
            }
        };
        SearchService.search({
            type: $scope.query.type,
            location: bounds,
            select: ['_id', 'location', 'picture', 'name', 'blurb', 'stub'],
            size: 50
        }).then(function (response) {
            var currentIds = _.map(markerLayer._layers, 'feature.properties.id');

            // Determine which marks are new (they don't yet exist on the map)
            var newData = [];
            _.forEach(response.data, function (marker) {
                if (currentIds.indexOf(marker._id) === -1) {
                    // If it does not exist, we need to add it to the geoJson
                    newData.push(marker);
                }
            });
            var newGeoJson = toGeoJson(newData, $scope.query.type);
            markerLayer.addData(newGeoJson);
            setCenterUrlParam();

            // Remove
            markerLayer.eachLayer(function (layer) {
                var content = '<div class="marker-title">' + layer.feature.properties.title + '<\/div>' + '<div class="marker-description">' + CoreLibrary.stringTruncate(layer.feature.properties.description, 140) + '<\/div>' + '<a class="text-green capitalise" href="' + CoreLibrary.getHref(layer.feature.properties.type, layer.feature.properties.stub) + '">Go To ' + layer.feature.properties.type + '<\/a>';
                layer.bindPopup(content);
            });

            // Assign to scope
            $scope.results = $scope.results || [];
            CoreLibrary.assignArray($scope.results, response.data, '_id');
        });
    }

    function toGeoJson(results, type) {
        var geoJson = [];
        _.forEach(results, function (item) {
            var cropParam = type == 'project' ? '&crop=true' : '';
            geoJson.push({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": addLocationNoise(item._id, item.location[0].coords)
                },
                "properties": {
                    "id": item._id,
                    "stub": item.stub,
                    "title": item.name,
                    "type": type,
                    "description": item.blurb,
                    "icon": {
                        "iconId": 'marker-asffsafas',
                        "iconUrl": (item.picture || "/assets/images/default/user-1.png") + '?size=thumb' + cropParam,
                        "iconSize": [50, 50], // size of the icon
                        "iconAnchor": [25, 25], // point of the icon which will correspond to marker's location
                        "popupAnchor": [0, -25], // point from which the popup should open relative to the iconAnchor
                        "className": "marker"
                    }
                }
            });
        });
        return geoJson;
    }

    function getEntityUrl(stub, type) {}

    function addLocationNoise(id, coords) {
        // Generate offset from the last 4 characters of hexadecimal id from -1 to +1
        var offset1 = (parseInt(id.substr(20, 4), 16) / Math.pow(16, 4) - 0.5) * 2;
        var offset2 = (parseInt(id.substr(16, 4), 16) / Math.pow(16, 4) - 0.5) * 2;
        return [coords[1] + offset1 / 2000, coords[0] + offset2 / 2000];
    }

    function geolocate() {
        $geolocation.getCurrentPosition({
            timeout: 60000,
            enableHighAccuracy: true
        }).then(function (position) {

            L.circle([position.coords.latitude, position.coords.longitude], position.coords.accuracy, {
                color: '#136AEC',
                fillColor: '#136AEC',
                fillOpacity: 0.15,
                weight: 1,
                opacity: 0.5
            }).addTo(map);

            L.circleMarker([position.coords.latitude, position.coords.longitude], {
                color: '#136AEC',
                fillColor: '#136AEC',
                fillOpacity: 1,
                weight: 2,
                opacity: 0.9,
                radius: 5
            }).addTo(map);
            //            var userIcon = L.icon({
            //                iconUrl: Authentication.currentUser.picture,
            //                iconSize: [50, 50],
            //                iconAnchor: [25, 25],
            //                popupAnchor: [0, -25],
            //                className  : "marker"
            //            });
            //            L.marker([position.coords.latitude, position.coords.longitude], {icon: userIcon}).addTo(map);

            mapCenter = [position.coords.latitude, position.coords.longitude];
            zoom = 13;
            if (map) {
                map.setView(mapCenter, zoom);
            }
        });
    }
    function panToMarker(latlng, id) {
        markerLayer.eachLayer(function (marker) {
            if (marker.feature.properties.id === id) {
                changeZIndex(marker._icon);
                marker.openPopup();
            }
        });

        map.setView(latlng, 15);
    }

    function setType(type) {
        $scope.query.type = type;
        markerLayer.clearLayers();
        getResults();
    }

    var markerZIndex = 1000;
    function changeZIndex(eventOrElement) {
        var markerEl = eventOrElement.layer ? angular.element(eventOrElement.layer._icon) : angular.element(eventOrElement);
        markerEl.css({
            'z-index': markerZIndex
        });
        markerZIndex++; //Iterate z-index
    }

    function processStateParams() {
        var validTypes = ['project', 'organisation', 'job'];
        if (validTypes.indexOf($state.params.type) != -1) {
            $scope.query.type = $state.params.type;
        }
        if ($state.params.c) {
            var splitCenter = $state.params.c.split(':');
            mapCenter = [splitCenter[0], splitCenter[1]];
            zoom = splitCenter[2];
            if (map) {
                map.setView(mapCenter, zoom); // Center Map
            }
        }
    }
    function setDisplayLimit() {
        // Sets a number of results so they full approx half the screen
        var resultHeight = 105;
        var windowHeight = window.innerHeight;
        $scope.displayLimit = Math.floor(windowHeight * 0.5 / resultHeight);
    }

    var changeCounter = 0;
    function setCenterUrlParam() {
        // Dont set in first change
        if (changeCounter >= 1) {
            var center = map.getCenter();
            var centerString = center.lat + ':' + center.lng + ':' + map.getZoom();
            $location.search('c', centerString);
        }
        changeCounter++;
    }

    function newOrganisation(event) {
        OrganisationModalService.organisationNewModal(event).then(function (result) {
            $state.go('app.organisation.settings.overview', {
                stub: result.stub
            });
        });
    }
});
'use strict';

angular.module('views.notifications', []);
angular.module('views.notifications').config(function ($stateProvider) {
    $stateProvider.state('app.notifications', {
        url: '/notifications',
        abstract: true,
        templateUrl: 'app/views/notifications/notifications.html',
        controller: function controller($scope) {
            $scope.tabs = [{
                label: 'All',
                sref: 'app.notifications.all'
            }, {
                label: 'Invites',
                sref: 'app.notifications.invites'
            }, {
                label: 'Job Applications',
                sref: 'app.notifications.applications'
            }];
        },
        layout: {
            size: 'md',
            bgColor: 'rgba(0, 0, 0, 0.03)'
        },
        seo: function seo(resolve) {
            return {
                title: "Notifications - STEMN"
            };
        }
    }).state('app.notifications.all', {
        url: '',
        sticky: true,
        views: {
            'all': {
                templateUrl: 'app/views/notifications/notifications-all.html'
            }
        }
    }).state('app.notifications.invites', {
        url: '/invites',
        views: {
            'invites': {
                templateUrl: 'app/views/notifications/notifications-invites.html'
            }
        }
    }).state('app.notifications.applications', {
        url: '/applications',
        views: {
            'applications': {
                templateUrl: 'app/views/notifications/notifications-applications.html'
            }
        }
    });
}).directive('notificationCards', function () {
    return {
        restrict: 'E',
        scope: {
            query: '=',
            type: '=?'
        },
        templateUrl: 'app/views/notifications/tpls/notification-cards.html',
        controller: function controller($scope, NotificationService, HttpQuery) {
            $scope.query = HttpQuery({
                url: 'api/v1/notifications',
                params: {
                    size: 20,
                    order: 'timestamp',
                    criteria: {
                        type: $scope.type
                    }
                },
                onSuccess: function onSuccess(results) {
                    _.forEach(results, function (notification) {
                        notification.text = NotificationService.notificationText[notification.type];
                    });
                    return results;
                }
            });
            $scope.query.more();
        }
    };
});
'use strict';

angular.module('views.onboarding.select', []);
angular.module('views.onboarding.select').config(function ($stateProvider) {
    $stateProvider.state('app.onboarding.select', {
        url: '',
        templateUrl: 'app/views/onboarding/onboarding-select/tpls/onboarding-select.html',
        controller: 'OnboardingSelectViewCtrl'
    });
}).controller('OnboardingSelectViewCtrl', function ($scope, $state) {});
'use strict';

angular.module('views.onboarding.sync', []);
angular.module('views.onboarding.sync').config(function ($stateProvider) {
    $stateProvider.state('app.onboarding.sync', {
        abstract: true,
        url: '/sync',
        templateUrl: 'app/views/onboarding/onboarding-sync/tpls/onboarding-sync.html',
        controller: 'OnboardingSyncViewCtrl',
        resolve: {
            user: function user(userdata, UserService, Authentication) {
                return UserService.getUser(userdata._id, 'lg').then(function (user) {
                    return user;
                });
            }
        }
    }).state('app.onboarding.sync.intro', {
        url: '',
        templateUrl: 'app/views/onboarding/onboarding-sync/tpls/onboarding-sync-intro.html',
        controller: 'OnboardingSyncIntroViewCtrl'
    }).state('app.onboarding.sync.account', {
        url: '/account',
        templateUrl: 'app/views/onboarding/onboarding-sync/tpls/onboarding-sync-account.html',
        controller: 'OnboardingSyncAccountViewCtrl'
    });
}).controller('OnboardingSyncViewCtrl', function (user, userdata, $scope, $state, UserService, SettingsService, Authentication) {
    $scope.forms = {};
    $scope.user = user;
    $scope.currentUser = userdata;
    $scope.tabs = ['app.onboarding.sync.intro', 'app.onboarding.sync.account'];

    $scope.steps = {
        'app.onboarding.sync.intro': {
            label: 'About You',
            sref: 'app.onboarding.sync.intro',
            nextText: 'Next: Sync Account',
            clickFn: function clickFn() {
                $state.go(this.sref);
            },
            nextFn: function nextFn() {
                $state.go('app.onboarding.sync.account');
            }
        },
        'app.onboarding.sync.account': {
            label: 'Sync Account',
            sref: 'app.onboarding.sync.account',
            nextText: 'Go to Dashboard',
            clickFn: function clickFn() {
                $state.go(this.sref);
            },
            nextFn: function nextFn() {
                saveUser();
                SettingsService.getSettings().then(function (settings) {
                    // Save that we have now done onboarding
                    settings.messages.userOnboarding = false;
                    settings.save();
                });
                $state.go('app.dashboard.projects');
            }
        }
    };

    /////////////////////////////

    function saveUser() {
        return UserService.updateUser($scope.user);
    }
}).controller('OnboardingSyncIntroViewCtrl', function ($scope, Authentication, $mdToast, UserService, $state) {

    $scope.linkedinImport = linkedinImport;

    ///////////////////////////

    function linkedinImport() {
        $scope.linkedinLoading = true;
        Authentication.authenticate('linkedin').then(function (response) {
            $mdToast.show($mdToast.simple().content('You accounts are linked and info imported'));
            $scope.linkedinImported = true;
            $scope.linkedinLoading = false;
            getUserData();
        }).catch(function (response) {
            $mdToast.show($mdToast.simple().theme('warn').content('Couldn\'t do it... ' + response.data.message || response.data));
            $scope.linkedinLoading = false;
        });
    }

    function getUserData() {
        UserService.getUser(Authentication.currentUser._id, 'lg').then(function (user) {
            $scope.user = user;
        });
    }
}).controller('OnboardingSyncAccountViewCtrl', function ($scope, SyncService) {
    $scope.syncAuthorize = syncAuthorize; //function()

    function syncAuthorize(provider) {
        $scope.syncAuthLoading = true;
        SyncService.authorize(provider).then(function (response) {
            $scope.syncAuthLoading = false;
        }).catch(function () {
            $scope.syncAuthLoading = false;
        });
    }
});
'use strict';

angular.module('views.onboarding', ['views.onboarding.select', 'views.onboarding.sync']);
angular.module('views.onboarding').config(function ($stateProvider) {
    $stateProvider.state('app.onboarding', {
        url: '/onboarding',
        abstract: true,
        templateUrl: 'app/views/onboarding/tpls/onboarding.html',
        controller: 'OnboardingViewCtrl',
        authLevel: 'user', // Auth level does not seem to work on abstract states
        layout: {
            horizontalMenu: false,
            topBanner: false,
            size: 'md',
            bgColor: 'rgba(0, 0, 0, 0.03)'
        }
    });
}).controller('OnboardingViewCtrl', function ($scope, $state) {});
'use strict';

angular.module('views.open', []);
angular.module('views.open').config(function ($stateProvider) {
    $stateProvider.state('app.open', {
        url: '/open',
        menu: {
            main: [],
            more: []
        },
        controller: function controller($scope, AuthenticationModalService, Authentication, $state) {
            $scope.login = function (event, state) {
                if (!Authentication.currentUser.isLoggedIn()) {
                    AuthenticationModalService.login(event);
                } else {
                    $state.go(state || 'app.home');
                }
            };
        },
        templateUrl: 'app/views/open/open.html',
        layout: {
            chat: false,
            topBanner: false
        },
        seo: function seo(resolve) {
            return {
                title: "Open-Source Science & Engineering - STEMN "
            };
        }
    });
});
'use strict';

angular.module('views.organisation.settings', []);

angular.module('views.organisation.settings').config(function ($stateProvider) {
    $stateProvider.state('app.organisation.settings', {
        url: '/settings',
        templateUrl: 'app/views/organisation/organisation-settings/tpls/organisation-settings.html',
        layout: {
            bgColor: 'rgba(0, 0, 0, 0.03)',
            footer: false
        },
        resolve: {
            userPermissions: function userPermissions(userdata, organisation, PermissionsService, $stateParams) {
                return PermissionsService.permissionRedirect({
                    userdata: userdata,
                    entity: organisation,
                    level: 'collaborator',
                    secret: $stateParams.secret
                });
            }
        },
        seo: function seo(resolve) {
            return {
                title: 'Settings - ' + resolve.organisation.name + ' - STEMN'
            };
        },
        abstract: true,
        controller: 'OrganisationSettingsViewCtrl'
    }).state('app.organisation.settings.overview', {
        url: '',
        templateUrl: 'app/views/organisation/organisation-settings/tpls/organisation-settings-overview.html'
    }).state('app.organisation.settings.team', {
        url: '/team',
        templateUrl: 'app/views/organisation/organisation-settings/tpls/organisation-settings-team.html'
    }).state('app.organisation.settings.tags', {
        url: '/tags',
        templateUrl: 'app/views/organisation/organisation-settings/tpls/organisation-settings-tags.html'
    });
}).controller('OrganisationSettingsViewCtrl', function (userPermissions, $scope, OrganisationService, UploadsModalService, $timeout) {
    $scope.userPermissions = userPermissions;
    $scope.forms = {};
    $scope.tabs = [{
        label: 'General',
        sref: 'app.organisation.settings.overview'
    }, {
        label: 'Tags',
        sref: 'app.organisation.settings.tags'
    }, {
        label: 'Team & Permissions',
        sref: 'app.organisation.settings.team'
    }];

    $scope.saveOrganisation = saveOrganisation;
    $scope.editGallery = editGallery;

    ///////////////

    function saveOrganisation() {
        return OrganisationService.updateOrganisation($scope.organisation);
    }

    function editGallery(event) {
        UploadsModalService.uploadImagesNewModal(event, $scope.organisation.gallery).then(function (results) {
            $scope.organisation.gallery = results;
            $timeout($scope.saveOrganisation, 1);
        });
    }
});
'use strict';

angular.module('views.organisation', ['views.organisation.settings', 'modules.organisations', 'modules.contributors', 'modules.request-ownership']);
angular.module('views.organisation').config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.
    // Map default
    when("/org/:stub", "/org/:stub/overview").
    // Map creations
    //    when("/org/:stub/projects", "/org/:stub/creations/projects").
    //    when("/org/:stub/top",      "/org/:stub/creations/top").
    //    when("/org/:stub/threads",  "/org/:stub/creations/threads").
    //    when("/org/:stub/blogs",    "/org/:stub/creations/blogs").
    when("/org/:stub/people", "/org/:stub/people/contributors").
    // Map organisation to org (for jackson)
    when("/organisations/:stub", "/org/:stub");

    $stateProvider.state('app.organisation', {
        url: '/org/:stub?projectview&location&edit&showEdit',
        abstract: true,
        templateUrl: 'app/views/organisation/organisation.html',
        resolve: {
            organisation: function organisation(OrganisationService, $stateParams) {
                return OrganisationService.getOrganisation($stateParams.stub).then(function (organisation) {
                    return organisation;
                });
            },
            userPermissions: function userPermissions(userdata, organisation, PermissionsService, $stateParams) {
                return PermissionsService.permissionRedirect({
                    userdata: userdata,
                    entity: organisation,
                    level: 'public',
                    secret: $stateParams.secret
                });
            }
        },
        controller: 'OrganisationViewCtrl',
        seo: function seo(resolve) {
            return {
                title: resolve.organisation.name + ' Organisation - STEMN',
                picture: resolve.organisation.picture,
                description: resolve.organisation.blurb
            };
        },
        layout: {
            size: 'md',
            footer: true
        }
    }).state('app.organisation.overview', {
        url: '/overview',
        sticky: true,
        templateUrl: 'app/views/organisation/tpls/organisation-overview.html',
        controller: 'OrganisationOverviewCtrl',
        layout: {
            size: 'lg',
            footer: true
        }
    }).state('app.organisation.applications', {
        url: '/applications',
        sticky: true,
        templateUrl: 'app/views/organisation/tpls/organisation-applications.html',
        controller: 'OrganisationOverviewCtrl'
    }).state('app.organisation.people', {
        url: '/people',
        sticky: true,
        abstract: true,
        templateUrl: 'app/views/organisation/tpls/organisation-people.html',
        controller: function controller($scope, CoreLibrary) {
            $scope.tabs = [{
                label: CoreLibrary.pluralise($scope.organisation.numContributors, 'Contributor'),
                sref: 'app.organisation.people.contributors'
            }, {
                label: CoreLibrary.pluralise($scope.organisation.followers, 'Follower'),
                sref: 'app.organisation.people.followers'
            }, {
                label: ($scope.organisation.numEducations || 0) + ' Alumni',
                sref: 'app.organisation.people.alumni'
            }];
        }
    }).state('app.organisation.people.followers', {
        url: '/followers',
        templateUrl: 'app/views/organisation/tpls/organisation-followers.html',
        seo: function seo(resolve) {
            return {
                title: 'Followers of the ' + resolve.organisation.name + ' Organisation - STEMN'
            };
        },
        data: {
            name: 'Followers'
        }
    }).state('app.organisation.people.contributors', {
        url: '/contributors',
        templateUrl: 'app/views/organisation/tpls/organisation-contributors.html',
        seo: function seo(resolve) {
            return {
                title: 'People Contributing to the ' + resolve.organisation.name + ' Organisation - STEMN'
            };
        },
        data: {
            name: 'Contributors'
        }
    }).state('app.organisation.people.alumni', {
        url: '/alumni',
        templateUrl: 'app/views/organisation/tpls/organisation-alumni.html',
        seo: function seo(resolve) {
            return {
                title: 'People that went to ' + resolve.organisation.name + ' Organisation - STEMN'
            };
        },
        data: {
            name: 'Alumni'
        }
    }).state('app.organisation.jobs', {
        url: '/jobs',
        sticky: true,
        templateUrl: 'app/views/organisation/tpls/organisation-jobs.html',
        seo: function seo(resolve) {
            return {
                title: 'Jobs openings at ' + resolve.organisation.name + ' - STEMN'
            };
        },
        data: {
            name: 'Jobs'
        }
    }).state('app.organisation.projects', {
        url: '/projects',
        sticky: true,
        templateUrl: 'app/views/organisation/tpls/organisation-projects.html',
        seo: function seo(resolve) {
            return {
                title: 'Projects Created by the ' + resolve.organisation.name + ' Organisation - STEMN'
            };
        },
        data: {
            name: 'Projects'
        }
    }).state('app.organisation.forum', {
        url: '/forum',
        sticky: true,
        templateUrl: 'app/views/organisation/tpls/organisation-forum.html',
        seo: function seo(resolve) {
            return {
                title: 'Questions and Answers from the ' + resolve.organisation.name + ' Organisation - STEMN'
            };
        },
        data: {
            name: 'Forum'
        }
    }).state('app.organisation.blogs', {
        url: '/blogs',
        sticky: true,
        templateUrl: 'app/views/organisation/tpls/organisation-blogs.html',
        seo: function seo(resolve) {
            return {
                title: 'Blogs and Updates from the ' + resolve.organisation.name + ' Organisation - STEMN'
            };
        },
        data: {
            name: 'Updates'
        }
    });
}).controller('OrganisationOverviewCtrl', function (organisation, $scope, OrganisationService, FeedService, RelatedService) {
    getProjects();
    getRelated(1);

    ////////////////////////////////////////////////////////////////////////

    function getProjects() {
        FeedService.getFeed({
            parentType: 'organisation',
            parentId: organisation._id,
            type: 'projects',
            sort: 'submitted',
            size: 10,
            page: 1,
            published: true
        }).then(function (feed) {
            $scope.projects = feed;
        });
    }

    function getRelated(page) {
        RelatedService.getRelated({
            parentType: 'organisation',
            parentId: organisation._id,
            type: 'organisation',
            page: page,
            size: 6
        }).then(function (related) {
            $scope.related = related;
        });
    }
}).controller('OrganisationViewCtrl', function (userPermissions, $scope, $rootScope, $state, $stateParams, Authentication, OrganisationService, JobModalService, ThreadCreateModalService, CoreLibrary, organisation, MenuItems, ProjectCreateModalService) {
    $scope.userPermissions = userPermissions;
    $scope.organisation = organisation;
    $scope.newProject = newProject; //function(event)
    $scope.newThread = newThread; //function(event, type)
    $scope.newJob = JobModalService.createJob; //function(event)

    $scope.userCanEdit = $scope.userPermissions.isMin('collaborator');
    $scope.showEdit = $scope.userCanEdit;

    $scope.numContributorsString = CoreLibrary.pluralise($scope.organisation.numContributors, 'Creator');

    // Tabs ------------------------------------------------------
    $scope.tabs = [{
        label: 'Overview',
        sref: 'app.organisation.overview'
    }, {
        label: CoreLibrary.pluralise($scope.organisation.numThreads || 0, 'Discussion'),
        sref: 'app.organisation.forum'
    }, {
        label: CoreLibrary.pluralise($scope.organisation.numProjects || 0, 'Project'),
        sref: 'app.organisation.projects'
    }, {
        label: CoreLibrary.pluralise($scope.organisation.numBlogs || 0, 'Blog'),
        sref: 'app.organisation.blogs'
    }, {
        label: CoreLibrary.pluralise($scope.organisation.numJobs, 'Job'),
        sref: 'app.organisation.jobs'
    }, {
        label: CoreLibrary.pluralise($scope.organisation.numContributors + $scope.organisation.followers + ($scope.organisation.numEducations || 0), 'People'),
        sref: 'app.organisation.people.contributors'
    }];

    //////////////////////////////////////////////////

    function newProject(event) {
        ProjectCreateModalService.newProject(event, {
            organisations: [organisation]
        });
    }
    function newThread(event, type) {
        ThreadCreateModalService.newThread(event, {
            type: type || 'question',
            organisations: [organisation]
        });
    }
});
'use strict';

angular.module('views.partners', []);
angular.module('views.partners').config(function ($stateProvider) {
	$stateProvider.state('app.partners', {
		url: '/partners',
		templateUrl: 'app/views/partners/partners.html',
		controller: function controller($scope, $rootScope) {
			$scope.partners = [{
				name: 'AmericaSpace',
				desc: "AmericaSpace is a spaceflight news media outlet based out of Austin, Texas, with our staff of writers & photographers spread out across the country's many NASA centers and launch sites. We work hard to deliver the latest news & imagery to our viewers, with numerous aerospace journalists, photojournalists & experts from within the aerospace industry providing in-depth content on a daily basis.",
				url: '/org/americaspace/overview',
				image: 'AmericaSpace.png',
				links: {
					facebook: "AmericaSpace.org/timeline",
					linkedin: "company/americaspace",
					twitter: "americaspace",
					website: "www.americaspace.com/",
					youtube: "user/AmericaSpace"
				}
			}, {
				name: 'AYAA',
				desc: "The Australian Youth Aerospace Association (AYAA) is a not-for-profit organisation managed by student volunteers and young professionals, who have the objective of promoting education, awareness and involvement in the aerospace industry to young Australians.",
				url: '/org/australian-youth-aerospace-association-ayaa/overview',
				image: 'AYAA.jpg',
				links: {
					facebook: "YouthAeroAssoc",
					website: "ayaa.com.au"
				}
			}, {
				name: 'SGAC',
				desc: "The Space Generation Advisory Council (SGAC) works on the international, national and local level to link together university students and young professionals. SGAC has thousands of members in over 100 countries around the world.",
				url: '/org/space-generation-advisory-council-sgac/overview',
				image: 'SGAC.jpg',
				links: {
					facebook: "spacegeneration",
					linkedin: "company/space-generation-advisory-council",
					twitter: "sgac",
					website: "spacegeneration.org/",
					youtube: "user/spacegeneration"
				}
			}, {
				name: 'The University Of Sydney',
				desc: "The University of Sydney is an Australian public university in Sydney. Founded in 1850, it is Australia's first university and is regarded as one of its most prestigious, ranked as the world's 27th most reputable university.",
				url: '/org/the-university-of-sydney-usyd/overview',
				image: 'Usyd.jpg',
				links: {
					facebook: "sydneyuni",
					website: "sydney.edu.au/",
					twitter: "Sydney_Uni"
				}
			}, {
				name: 'SEDS - SJSU',
				desc: "SEDS is an international organization whose primary goal is to promote the exploration of space through projects, education, and outreach. At SEDS SJSU, we specifically focus on project and technology development that will extend humanity’s reach into space.",
				url: '/org/seds-san-jose-state-university-sjsu/overview',
				image: 'seds-sjsu.jpg',
				links: {
					facebook: "sedssjsu",
					website: "seds-sjsu.org"
				}
			}];
		},
		layout: {
			footer: true
		},
		seo: function seo(resolve) {
			return {
				title: "Become a Partner and Help the Mission - STEMN "
			};
		}
	});
});
'use strict';

angular.module('views.password-reset', []);
angular.module('views.password-reset').config(function ($stateProvider) {
    $stateProvider.state('password-reset', {
        url: '/password-reset?id&token',
        templateUrl: 'app/views/password-reset/password-reset.html',
        resolve: {
            jwt: function jwt(Authentication, $stateParams) {
                // login via the jwt
                if ($stateParams.id) {
                    return Authentication.setToken($stateParams.id, false);
                }
            }
        },
        controller: function controller(jwt, $stateParams, $scope, $state, $mdToast, SettingsService) {
            $scope.password = {};
            $scope.updatePassword = function () {
                if ($scope.password.newPassword !== $scope.password.confirmPassword) {
                    $mdToast.show($mdToast.simple().theme('warn').content('The passwords you entered don\'t match!'));
                } else {
                    SettingsService.updatePassword($scope.password.oldPassword, $scope.password.newPassword, $stateParams.token).then(function () {
                        // error case is handled by restangular intercepter
                        $mdToast.show($mdToast.simple().content('Great, your password has been updated.'));
                        $state.go('app.home');
                    });
                }
            };
        },
        seo: function seo(resolve) {
            return {
                title: "Change and Reset your Password - STEMN"
            };
        }
    });
});
'use strict';

angular.module('views.preview', []);
angular.module('views.preview').config(function ($stateProvider) {
    $stateProvider.state('app.preview', {
        url: '/preview/:projectStub/:path?edit&children',
        sticky: true,
        resolve: {
            project: function project($stateParams, EntityService, $timeout, $state) {
                return EntityService.get('project', $stateParams.projectStub, 'sm').catch(function (error) {
                    $timeout(function () {
                        $state.go('app.404', null, { location: false });
                    });
                    return error;
                });
            },
            previousState: function previousState($state) {
                return {
                    name: $state.current.name,
                    params: $state.params
                };
            },
            fileMeta: function fileMeta(SyncService, SyncUtilService, $stateParams, $q, SyncUrlService) {
                var parsedChildren = SyncUrlService.parseChildren($stateParams.children);
                var parsedPath = SyncUrlService.parsePath($stateParams.path);
                return SyncService.metadataVirtual($stateParams.projectStub, parsedPath, parsedChildren);
            },
            userPermissions: function userPermissions(userdata, project, PermissionsService, $stateParams) {
                return PermissionsService.permissionRedirect({
                    userdata: userdata,
                    entity: project,
                    level: project.permissions.projectType == 'public' ? 'public' : 'viewer',
                    secret: $stateParams.secret
                });
            }
        },
        templateUrl: 'app/views/preview/preview.html',
        controller: function controller(userPermissions, project, fileMeta, previousState, $scope, $state, $timeout, $stateParams, SyncService, SyncUtilService, $location, SyncUrlService, PreviewEmbedService) {

            $scope.userPermissions = userPermissions;
            $scope.path = $stateParams.path;
            $scope.project = project;
            $scope.fileMeta = fileMeta;

            $scope.previewer = {};
            $scope.previewer.edit = $scope.userPermissions.isMin('collaborator') && $stateParams.edit == 'true' ? true : false;

            // Functions
            $scope.closePreview = closePreview; //function(path, projectStub, type);
            $scope.revisionChange = revisionChange; //function(revison);
            $scope.saveFile = saveFile; //function(revison);
            $scope.saveAndExit = saveAndExit; //function(revison);
            $scope.openFileFolder = SyncUtilService.openFileFolder; //function()
            $scope.compare = compare; //function(compareType)
            $scope.toggleLayer = toggleLayer; //function()
            $scope.embed = PreviewEmbedService.modal; //function(event, fileMeta)
            $scope.goFullscreen = function () {
                $scope.fullscreen = $scope.fullscreen || {};
                $scope.fullscreen.active = !$scope.fullscreen.active;
            };
            $scope.sidebar = {
                show: false
            };

            // Get breadcrumbs
            if ($scope.fileMeta.provider == 'drive') {
                SyncService.getPath($scope.fileMeta.path, $scope.project.stub).then(function (response) {
                    response.shift(0);
                    $scope.breadCrumbs = response;
                    if ($stateParams.children) {
                        $scope.breadCrumbs.push({ name: $scope.fileMeta.name });
                    }
                });
            } else {
                $scope.breadCrumbs = SyncUtilService.getCrumbs($scope.fileMeta.path);
                if ($stateParams.children) {
                    $scope.breadCrumbs.push({ name: $scope.fileMeta.name });
                }
            }

            // Get revisions
            SyncService.revisionsDeep($scope.fileMeta).then(function (revisions) {
                $scope.fileMeta = revisions;

                $scope.timeline = [];
                _.forEach($scope.fileMeta.revisions, function (revision, index) {
                    if (revision.revDecimal == 1) {
                        $scope.timeline.push({
                            event: 'create',
                            timestamp: revision.client_modified,
                            details: {
                                name: revision.name,
                                path: revision.path,
                                parentProject: $scope.fileMeta.parentProject,
                                pathRev: SyncUrlService.getPath(revision),
                                childrenRev: SyncUrlService.getChildPath(revision.virtualChildren),
                                sharing_info: revision.sharing_info
                            }
                        });
                    } else {
                        $scope.timeline.push({
                            event: 'update',
                            timestamp: revision.client_modified,
                            details: {
                                rev: revision.rev,
                                revDecimal: revision.revDecimal,
                                path: revision.path,
                                parentProject: $scope.fileMeta.parentProject,
                                pathRev: SyncUrlService.getPath(revision),
                                childrenRev: SyncUrlService.getChildPath(revision.virtualChildren),
                                sizeDiff: $scope.fileMeta.revisions[index].size - $scope.fileMeta.revisions[index - 1].size, // how many extra bytes
                                sharing_info: revision.sharing_info
                            }
                        });
                    }
                });
            });

            // Get virtual file parent
            if (SyncUtilService.isGerber($scope.fileMeta.fileType)) {
                SyncService.list($stateParams.projectStub, $scope.fileMeta.parentFolder).then(function (response) {
                    $scope.fileMeta.virtualParent = _.find(response.data.entries, function (item) {
                        return _.find(item.virtualChildren, 'name', $scope.fileMeta.name);
                    });
                });
            }

            //            $scope.tabs = [
            //                {
            //                    label: 'Timeline',
            //                    clickFn: function(){
            //                        $scope.activeTab = this.label;
            //                    }
            //                },
            //                {
            //                    label: 'Meta',
            //                    clickFn: function(){
            //                        $scope.activeTab = this.label;
            //                    }
            //                }
            //            ];
            //            $scope.activeTab = 'Timeline';

            //////////////////////////////////

            function toggleLayer(layer) {
                $timeout(function () {
                    var matchingLayer = _.find($scope.previewer.instance.layers, 'name', layer.name);
                    if (matchingLayer) {
                        matchingLayer.enabled = layer.enabled;
                        $scope.previewer.instance.repaint = 0;
                    }
                });
            }

            function compare(compareType) {
                $state.go('app.compare', {
                    projectStub: $stateParams.projectStub,
                    path1: SyncUrlService.getPath($scope.fileMeta),
                    children1: SyncUrlService.getChildPath($scope.fileMeta.virtualChildren),
                    type: compareType
                });
            }

            function saveFile() {
                return SyncService.upload($scope.project.stub, $scope.fileMeta.path, { revision: $scope.fileMeta.rev }, $scope.previewer.fileData).then(function (response) {
                    $scope.previewer.edit = false;
                    return response;
                });
            }

            function saveAndExit() {
                $scope.savePending = true;
                return SyncService.upload($scope.project.stub, $scope.fileMeta.path, { revision: $scope.fileMeta.rev }, $scope.previewer.fileData).then(function (response) {
                    closePreview();
                });
            }

            function revisionChange(revisionMeta) {
                $scope.fileMeta = _.extend($scope.fileMeta, revisionMeta, true);
                var childPath = SyncUrlService.getChildPath($scope.fileMeta.virtualChildren);
                $state.go('app.preview', {
                    path: SyncUrlService.getPath($scope.fileMeta),
                    children: childPath
                });

                if ($scope.previewer.render) {
                    $timeout($scope.previewer.render);
                }
            }

            function closePreview() {
                if (previousState.name && previousState.params && previousState.name != 'app.preview' && previousState.name != 'app.compare') {
                    $state.go(previousState.name, previousState.params);
                } else {
                    $state.go('app.project.files', {
                        stub: project.stub,
                        path: $scope.fileMeta.parentFolder || ''
                    });
                }
            }
        },
        menu: {
            main: [],
            more: []
        },
        layout: {
            size: 'md',
            hideOverflow: true,
            topBanner: false,
            horizontalMenu: false,
            chat: false
        },
        seo: function seo(resolve) {
            return {
                title: resolve.fileMeta.name + ' - ' + resolve.project.name
            };
        }
    });
});
'use strict';

angular.module('views.privacy', []);
angular.module('views.privacy').config(function ($stateProvider) {
    $stateProvider.state('app.privacy', {
        url: '/privacy',
        templateUrl: 'app/views/privacy/privacy.html',
        controller: function controller($rootScope) {},
        layout: {
            footer: true
        },
        seo: function seo(resolve) {
            return {
                title: "Privacy Policy - STEMN"
            };
        }
    });
});
'use strict';

angular.module('views.project.files', []);
angular.module('views.project.files').config(function ($stateProvider) {
    $stateProvider.state('app.project.files', {
        url: '/files/*path?query',
        templateUrl: 'app/views/project/project-files/tpls/project-files.html',
        layout: {
            size: 'md',
            bgColor: 'rgba(0, 0, 0, 0.03)'
        },
        resolve: {
            files: function files(project, $stateParams, SyncService, $timeout, $state, SyncUtilService) {
                if (project.remote.connected) {
                    return SyncService.list($stateParams.stub, $stateParams.path).then(function (response) {
                        // Add the preview Type
                        _.forEach(response.data.entries, function (item) {
                            item.previewType = SyncUtilService.getViewerType(item.fileType, project.remote.provider);
                        });
                        return response;
                    }).catch(catchError);
                } else {
                    return [];
                }

                ////////////////////////

                function catchError(error) {
                    $timeout(function () {
                        $state.go('app.404', null, { location: false });
                    });
                    return error;
                }
            },
            matches: function matches($stateParams, SyncService, $timeout, $state) {
                if ($stateParams.query && $stateParams.query.length > 0) {
                    return SyncService.search($stateParams.stub, $stateParams.path, { query: $stateParams.query });
                }
            }

        },
        seo: function seo(resolve) {
            return {
                title: 'Files - ' + resolve.project.name + ' - STEMN'
            };
        },
        controller: 'ProjectFilesViewCtrl'
    });
}).controller('ProjectFilesViewCtrl', function (files, matches, project, $scope, $stateParams, $timeout, $state, $location, SyncService, SyncUtilService, Authentication) {
    // Params and Resolve
    $scope.path = $stateParams.path || '';
    $scope.project = project;
    $scope.currentUser = Authentication.currentUser;

    // Init ------------
    // Assign files
    if (files && files.data) {
        $scope.files = files.data.entries;
    }
    // If we are searching
    if ($stateParams.query && $stateParams.query.length > 0) {
        $scope.searchActive = true;
        $scope.searchString = $stateParams.query;
        $scope.matches = matches.data.matches;
    }

    if (project.remote.provider == 'drive') {
        if (!$scope.path) {
            $scope.breadCrumbs = [];
        } else {
            SyncService.getPath($scope.path, $scope.project.stub, project.remote.root.id).then(function (response) {
                response.shift(0);
                $scope.breadCrumbs = response;
            });
        }
    } else {
        $scope.breadCrumbs = SyncUtilService.getCrumbs($scope.path);
    }

    var debounceTimeout;
    var debounceTimeoutTime = 100;

    $scope.openFileFolder = SyncUtilService.openFileFolder; //function(path, projectStub, type)
    $scope.search = search; //function(searchString)
    $scope.toggleSearch = toggleSearch; //function()
    $scope.syncAuthorize = syncAuthorize; //function(provider)
    $scope.remoteLink = remoteLink; //function(provider)
    $scope.createFolder = createFolder;
    $scope.refreshList = refreshList;
    ///////////////////////////

    function refreshList() {
        $scope.loading = true;
        return SyncService.list($stateParams.stub, $scope.path).then(function (response) {
            $scope.loading = false;
            $scope.files = response.data.entries;
        });
    }

    function createFolder() {
        SyncService.createFolder($scope.project.stub, $scope.path + 'XXXXXXXXXXXXXXXXXXXXXXXXXX').then(function (response) {
            console.log(response.data);
        });
    }

    function syncAuthorize(provider) {
        $scope.syncAuthLoading = true;
        SyncService.authorize(provider).then(function (response) {
            $scope.syncAuthLoading = false;
        }).catch(function () {
            $scope.syncAuthLoading = false;
        });
    }

    function remoteLink(event, provider) {
        SyncService.remoteLink(event, $scope.project.stub, provider, $scope.project.name).then(function (response) {
            _.extend($scope.project.remote, response.data);
            $state.go($state.current, {}, { reload: true }); // Reload to get the file resolve
        });
    }

    function toggleSearch() {
        $scope.searchActive = !$scope.searchActive;
        if (!$scope.searchActive) {
            $state.current.reloadOnSearch = false;
            $location.search('query', null);
            $timeout(function () {
                $state.current.reloadOnSearch = undefined;
            });
            $scope.searchString = '';
            $scope.matches = [];
        }
    }

    function search(searchString) {
        $timeout.cancel(debounceTimeout);
        debounceTimeout = $timeout(function () {
            $state.current.reloadOnSearch = false;
            $location.search('query', searchString);
            $timeout(function () {
                $state.current.reloadOnSearch = undefined;
            });
            SyncService.search($scope.project.stub, $scope.path, { query: searchString }).then(function (response) {
                $scope.matches = response.data.matches;
            });
        }, debounceTimeoutTime);
    }
});
'use strict';

angular.module('views.project.settings', []);

angular.module('views.project.settings').config(function ($stateProvider) {
    $stateProvider.state('app.project.settings', {
        url: '/settings',
        templateUrl: 'app/views/project/project-settings/tpls/project-settings.html',
        layout: {
            bgColor: 'rgba(0, 0, 0, 0.03)'
        },
        resolve: {
            userPermissions: function userPermissions(userdata, project, PermissionsService, $stateParams) {
                return PermissionsService.permissionRedirect({
                    userdata: userdata,
                    entity: project,
                    level: 'collaborator',
                    secret: $stateParams.secret
                });
            }
        },
        seo: function seo(resolve) {
            return {
                title: 'Settings - ' + resolve.project.name + ' - STEMN'
            };
        },
        abstract: true,
        controller: 'ProjectSettingsViewCtrl'
    }).state('app.project.settings.options', {
        url: '',
        templateUrl: 'app/views/project/project-settings/tpls/project-settings-options.html'
    }).state('app.project.settings.team', {
        url: '/team',
        templateUrl: 'app/views/project/project-settings/tpls/project-settings-team.html'
    }).state('app.project.settings.tags', {
        url: '/tags',
        templateUrl: 'app/views/project/project-settings/tpls/project-settings-tags.html'
    }).state('app.project.settings.sync', {
        url: '/sync',
        templateUrl: 'app/views/project/project-settings/tpls/project-settings-sync.html',
        controller: 'ProjectSettingsSyncCtrl'
    }).state('app.project.settings.sections', {
        url: '/sections',
        templateUrl: 'app/views/project/project-settings/tpls/project-settings-sections.html',
        controller: 'ProjectSectionsSyncCtrl'
    });
}).controller('ProjectSettingsSyncCtrl', function (SyncService, $scope) {
    $scope.remoteLink = remoteLink;
    $scope.remoteUnlink = remoteUnlink;

    if ($scope.project.remote.connected) {
        initMeta();
    }

    ////////////////////////////

    function initMeta() {
        $scope.ownerInfo = { loading: true };
        SyncService.ownerInfo($scope.project.stub, '').then(function (response) {
            $scope.ownerInfo.data = response;
            $scope.ownerInfo.loading = false;
        });
        if ($scope.project.remote.provider == 'drive') {
            SyncService.getPath($scope.project.remote.root.id, $scope.project.stub, '', true).then(function (response) {
                var pathArray = _.map(response, 'name');
                pathArray.shift();
                $scope.project.remote.root.path = pathArray.join('/');
            });
        }
    }

    function remoteLink(event, provider) {
        SyncService.remoteLink(event, $scope.project.stub, provider, $scope.project.name).then(function (response) {
            _.extend($scope.project.remote, response.data);
            initMeta();
        });
    }
    function remoteUnlink(provider) {
        SyncService.remoteUnlink($scope.project.stub, provider).then(function (response) {
            $scope.project.remote = {};
        });
    }
}).controller('ProjectSectionsSyncCtrl', function ($scope) {
    $scope.editorOptions = {
        realtime: false,
        contained: true
    };
}).controller('ProjectSettingsViewCtrl', function (project, $scope, $state, $timeout, HighlightElement, EntityService, LicenseData, SyncService, CoreLibrary, PublishService, ProjectService, $mdToast, Authentication, SocialModalService, $document) {
    $scope.project = project;
    $scope.forms = {};

    $scope.tabs = [{
        label: 'General',
        sref: 'app.project.settings.options'
    }, {
        label: 'Project Details',
        sref: 'app.project.settings.sections'
    }, {
        label: 'Tags',
        sref: 'app.project.settings.tags'
    }, {
        label: 'Files & Sync',
        sref: 'app.project.settings.sync'
    }, {
        label: 'Team & Permissions',
        sref: 'app.project.settings.team'
    }];

    $scope.deleteProject = deleteProject; // function()
    $scope.saveProject = saveProject; // function()
    $scope.backToProject = backToProject; // function()
    $scope.publish = publish; // function(event)

    // Secret Url
    newSecretUrl();
    if (!project.permissions.secret) {
        newSecretUrl();
    }
    $scope.newSecretUrl = newSecretUrl;

    //////////////////////////////////

    function publish(event) {
        PublishService.selectStubModal(event, $scope.project).then(function (stub) {
            $scope.project.stub = stub;
            $scope.project.updated = Date.now();
            var projectCopy = _.clone($scope.project, true);
            projectCopy.published = true;
            ProjectService.updateProject(projectCopy).then(function (response) {
                $scope.project.published = true;
                $mdToast.show($mdToast.simple().content('Your project has been published. It will now be public.'));
                console.log(response);
                SocialModalService.sharePrompt(event, { entity: 'project' }).then(function () {
                    $state.go('app.project.overview', { stub: stub });
                }).catch(function () {
                    $state.go('app.project.overview', { stub: stub });
                });
            });
        });
    }

    function newSecretUrl() {
        var secret = CoreLibrary.getUuid();
        $scope.project.permissions.secret = secret;
        $scope.secretUrl = location.origin + '/projects/' + project.stub + '?secret=' + secret;
        saveProject();
    }

    function saveProject() {
        return EntityService.update('project', $scope.project);
    }
    function backToProject() {
        $state.go('app.project.overview');
    }

    function deleteProject() {
        EntityService.remove('project', $scope.project._id).then(function () {
            $state.go('app.dashboard.projects');
        });
    }
});
'use strict';

angular.module('views.project.threads', []);
angular.module('views.project.threads').config(function ($stateProvider) {
    $stateProvider.state('app.project.threads', {
        url: '/threads',
        templateUrl: 'app/views/project/project-threads/tpls/project-threads.html',
        layout: {
            bgColor: 'rgba(0, 0, 0, 0)'
        },
        seo: function seo(resolve) {
            return {
                title: 'Questions - ' + resolve.project.name + ' - STEMN'
            };
        },
        controller: 'ProjectThreadsViewCtrl'
    });
}).controller('ProjectThreadsViewCtrl', function (project, $scope, ThreadCreateModalService) {
    $scope.project = project;
    $scope.newThread = newThread;

    ////////////////////////////////////

    function newThread(event, type) {
        ThreadCreateModalService.newThread(event, {
            type: type || 'question',
            projects: [project]
        });
    }
});
'use strict';

angular.module('views.project.wiki', []);
angular.module('views.project.wiki').config(function ($stateProvider) {
    $stateProvider.state('app.project.wiki', {
        url: '/wiki',
        templateUrl: 'app/views/project/project-wiki/tpls/project-wiki.html',
        layout: {
            size: 'sm',
            bgColor: 'rgba(0, 0, 0, 0.03)'
        },
        resolve: {},
        seo: function seo(resolve) {
            return {
                title: 'Wiki - ' + resolve.project.name + ' - STEMN'
            };
        },
        controller: 'ProjectWikiViewCtrl'
    });
}).controller('ProjectWikiViewCtrl', function (project, $scope) {
    // Params and Resolve
    $scope.project = project;

    $scope.editorOptions = {
        realtime: false,
        contained: false
    };
});
'use strict';

angular.module('views.project', ['views.project.files', 'views.project.wiki', 'views.project.threads', 'views.project.settings', 'modules.project', 'modules.publish', 'modules.filters', 'modules.missing-fields', 'modules.scroll-highlight']);
angular.module('views.project').config(function ($stateProvider) {
    $stateProvider.state('app.project', {
        abstract: true,
        url: '/projects/:stub?edit&reply',
        templateUrl: 'app/views/project/tpls/project.html',
        controller: 'ProjectViewCtrl',
        resolve: {
            project: function project(userdata, ProjectService, $stateParams, PublishService, $state, $timeout, $q) {
                // userdata required
                return ProjectService.getProject($stateParams.stub).catch(function (project) {
                    $timeout(function () {
                        $state.go('app.404', null, { location: false });
                    });
                });
            },
            userPermissions: function userPermissions(userdata, project, PermissionsService, $stateParams) {
                return PermissionsService.permissionRedirect({
                    userdata: userdata,
                    entity: project,
                    level: project.permissions.projectType == 'public' ? 'public' : 'viewer',
                    secret: $stateParams.secret
                });
            }
        },
        layout: {
            size: 'md'
        },
        seo: function seo(resolve) {
            return {
                title: resolve.project.name ? resolve.project.name + ' - STEMN' : 'Untitled Project - STEMN',
                picture: resolve.project.picture,
                description: resolve.project.blurb
            };
        }
    }).state('app.project.overview', {
        url: '',
        sticky: true,
        overlay: false,
        templateUrl: 'app/views/project/tpls/project-overview.html'
    }).state('app.project.about', {
        url: '/about',
        templateUrl: 'app/views/project/tpls/project-about.html',
        layout: {
            bgColor: 'rgba(0, 0, 0, 0.03)'
        },
        seo: function seo(resolve) {
            return {
                title: 'About ' + resolve.project.name + ' - STEMN'
            };
        }
    }).state('app.project.blogs', {
        url: '/blog',
        templateUrl: 'app/views/project/tpls/project-blog.html',
        layout: {
            bgColor: 'rgba(0, 0, 0, 0.03)'
        },
        seo: function seo(resolve) {
            return {
                title: 'Updates - ' + resolve.project.name + ' - STEMN'
            };
        }
    });
}).controller('ProjectViewCtrl', function (userPermissions, $scope, $document, $timeout, $state, $http, project, Authentication, ProjectStatusData, UsersModalService, SocialModalService, HighlightElement, CoreLibrary, LicenseData, $dynamicFooter, $mdToast, ProjectService, PublishService) {
    // Interface Initialisation -----------------------------------
    //True if user's project, false is someone else's
    $scope.userCanEdit = userPermissions.isMin('collaborator');
    $scope.userPermissions = userPermissions;

    $scope.showEdit = $scope.userCanEdit;

    // Tabs ------------------------------------------------------
    $scope.tabs = [{
        label: 'Overview',
        sref: 'app.project.overview'
    }, {
        label: 'Files',
        sref: 'app.project.files',
        isHidden: function isHidden() {
            return !project.remote.provider && !$scope.showEdit;
        }
    }, {
        label: CoreLibrary.pluralise(project.numThreads, 'Thread'),
        sref: 'app.project.threads'
    }];
    $scope.$watch(function () {
        $scope.currentTab = CoreLibrary.getCurrentTab($scope.tabs);
    });

    // Data ------------------------------------------------------
    $scope.project = project;

    // Scoped Functions
    $scope.isSectionContent = isSectionContent; //function()

    $scope.editorOptions = {
        realtime: false,
        contained: true
    };

    $scope.editExpands = {
        details: false
    };

    $scope.toc = {
        content: [],
        prepend: [{
            id: 'entityTitle',
            level: 'H1',
            label: $scope.project.name
        }],
        append: [{
            id: 'responses',
            level: 'H2',
            label: 'Comments'
        }]
    };

    // Function --------------------------------------------------

    function isSectionContent() {
        return _.any($scope.project.sectionData.sectionOrder, function (sectionId) {
            return $scope.project.sectionData.sections[sectionId] && $scope.project.sectionData.sections[sectionId].content && $scope.project.sectionData.sections[sectionId].content.length > 10;
        });
    }

    // Project Status
    $scope.projectStatuses = ProjectStatusData;
    $scope.$watch('project.status', function () {
        $scope.status = _.find($scope.projectStatuses, { 'value': $scope.project.status });
    });

    $scope.licenses = LicenseData.licenses;
    $scope.$watch('project.license', function () {
        $scope.license = _.find($scope.licenses, { 'type': $scope.project.license });
    });
}).directive('projectThumbs', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            editorSections: '=',
            images: '=?' // Images object to be passed up to parent scope
        },
        templateUrl: 'app/views/project/tpls/project-thumbs.html',
        controller: function controller($scope) {
            $scope.images = parseImages($scope.editorSections);

            //////////////

            function parseImages(sectionData) {
                var images = [];
                _.forEach(sectionData.sections, function (section) {
                    if (section.type == 'image') {
                        images.push(section);
                    }
                });
                return images;
            }
        }
    };
});
'use strict';

angular.module('views.referrals', []);
angular.module('views.referrals').config(function ($stateProvider) {
    $stateProvider.state('app.referrals', {
        url: '/referrals',
        templateUrl: 'app/views/referrals/referrals.html',
        controller: function controller($scope, HttpQuery, Authentication) {
            $scope.user = Authentication.currentUser;
            $scope.query = HttpQuery({
                url: '/api/v1/referrals/' + $scope.user.ref
            });
            $scope.query.more();
        },
        authLevel: 'user',
        layout: {
            size: 'md',
            footer: true
        },
        seo: function seo(resolve) {
            return {
                title: "Refer your friends, Win awesome prizes! - STEMN "
            };
        }
    });
});
'use strict';

angular.module('views.scholarship', []);
angular.module('views.scholarship').config(function ($stateProvider) {
    $stateProvider.state('app.scholarship-aerofutures', {
        url: '/aerofutures',
        templateUrl: 'app/views/scholarships/aerofutures',
        controller: function controller($rootScope) {
            $rootScope.page.title = 'AeroFutures Scholarship - STEMN';
        }
    });
});
//angular.module('views.search', []);
//angular.module('views.search').
//
//config(function ($stateProvider) {
//    $stateProvider.
//    state('app.search', {
//        url: '/search',
//        templateUrl: 'app/views/search/search.html',
//        resolve: {
//            users: function (UserService) {
//                return UserService.getUsers({
//                    page: 1,
//                    size: 1000
//                }).then(function (users) {
//                    return _.map(users, function (user) {
//                        return user
//                    });
//                });
//            }
//        },
//        controller: 'SearchViewCtrl'
//    });
//}).
//
//controller('SearchViewCtrl', function ($scope, $filter, users) {
////    console.log(_.map(_.countBy(_.pluck(users, 'name')), function(user) {
////        console.log(user);
////    }));
//    $scope.filtersOrder = ['networks','location','projects', 'followers', 'score']
//    $scope.filters = {
//        networks : {
//            title : 'Networks',
//            open  : true,
//            type  : 'radio',
//            items : [{
//                label  : 'All',
//                number : 22
//            },{
//                label  : 'Yes',
//                number : 15
//            },{
//                label  : 'No',
//                number : 6
//            }]
//        },
//        location  : {
//            title : 'Location',
//            open  : true,
//            type  : 'checkbox',
//            items : [{
//                label  : 'Tiancum',
//                number : 11
//            },{
//                label  : 'Jacob',
//                number : 11
//            },{
//                label  : 'Enos',
//                number : 11
//            }]
//        },
//        projects :{
//            title  : 'Projects',
//            path   : 'numProjects',
//            open   : true,
//            type   : 'slider',
//            slider : {
//                min      : 0,
//                max      : 60,
//                prefix   : '',
//                postfix  : ' years',
//            }
//        },
//        score :{
//            title  : 'Stemn Score',
//            path   : '',
//            open   : true,
//            type   : 'slider',
//            slider : {
//                min      : 0,
//                max      : 100,
//                prefix   : '',
//                postfix  : '',
//            }
//        },
//        followers  :{
//            title  : 'Followers',
//            path   : 'followers',
//            open   : true,
//            type   : 'slider',
//            slider : {
//                min      : 0,
//                max      : 100,
//                prefix   : '',
//                postfix  : '',
//            }
//    }};
//
//    $scope.rawResults = users;
//    console.log($scope.rawResults)
////    var names = _.countBy(_.compact(_.pluck(users, 'name')));
////    $scope.filters[1].items = _.map(_.keys(names), function(name) {
////        return {
////            label  : name,
////            number : names[name]
////        }
////    });
//
//    $scope.query = {
//        filter   : {},
//        radio    : {
//            projects : 'All'
//        },
//        range    : {
//            projects : {
//                min  : 0,
//                max  : 50
//            },
//            followers : {
//                min  : 0,
//                max  : 100
//            }},
//        orderBy  : {
//            name : 'age',
//            down : false
//        }
//    }
//
//    /* Useful Functions */
//    $scope.clearQuery = function (){
//        $scope.query = {};
//        $scope.applyQuery();
//    }
//
//    $scope.applyQuery = function (){
//        console.log('apply query!!')
//        $scope.results = $scope.rawResults;
//        // Filter by range
//        $scope.results = $scope.filterRange($scope.results);
//        // Filter by checkbox
//        $scope.results = $scope.filterCheckbox($scope.results);
//        // Filter by radio
//        $scope.results = $scope.filterRadio($scope.results);
//        // Order Results
//        $scope.results = $filter('orderBy')($scope.results, $scope.query.orderBy.name, $scope.query.orderBy.down);
//        $scope.resultsNum = $scope.results.length;
//    };
//
//
//    /* Filters */
//    $scope.filterRange = function (filterData) {
//        // Iterates over the range filters object.
//        // If there are multiple filters, data must satisfy all (AND condition)
//        _.each($scope.query.range, function(rangeFilter, rangeFilterField){
//            // Determine the path to filter
//            var path = $scope.filters[rangeFilterField].path;
//            // Filter the data
//            filterData = _.filter(filterData, function(data) {
//                return data[path] >= rangeFilter.min && data[path] <= rangeFilter.max;
//            });
//        });
//        return filterData
//    };
//
//    $scope.filterRadio = function (filterData) {
//        _.each($scope.query.radio, function(filterValue, filterField){
//            if (filterValue != 'All'){
//                filterData = _.filter(filterData, function(data) {
//                    return data[filterField] == filterValue;
//                });
//            }
//        });
//        return filterData
//    };
//
//    $scope.filterCheckbox = function (filterData) {
//        var result = [];
//        // if there are filters to be applied, filter, otherwise return original data
//        if (_.keys($scope.query.check).length) {
//            _.each(filterData, function(item) {
//                _.each($scope.query.check, function(filterValues, filterField){
//                    var filters = _.compact(_.map(filterValues, function(value, key) {
//                        return value ? key : false;
//                    }));
//
//                    if (filters.length) {
//                        // return data that matches the filters
//                        _.each(filters, function(filter) {
//                            if (item[filterField] == filter) {
//                                result.push(item);
//                            }
//                        });
//                    } else {
//                        // nothing to be filtered, return original
//                        result = filterData;
//                    }
//                });
//            });
//        } else {
//            result = filterData;
//        }
//        return result;
//    };
//
//    // Watch the query. Apply it on change
//    $scope.$watch('query', function(oldValue, newValue) {
//        $scope.applyQuery();
//    }, true);
//
//    $scope.deleteFilterLabel = function(property){
//        delete $scope.query.filter[property];
//    }
//
//});
"use strict";
'use strict';

angular.module('views.security', []);
angular.module('views.security').config(function ($stateProvider) {
    $stateProvider.state('app.security', {
        url: '/security',
        templateUrl: 'app/views/security/security.html',
        layout: {
            footer: true
        },
        seo: function seo(resolve) {
            return {
                title: "Security - STEMN"
            };
        }
    });
});
'use strict';

angular.module('views.search', ['modules.site-search']);
angular.module('views.search').config(function ($stateProvider) {
    $stateProvider.state('app.search', {
        abstract: true,
        url: '/search?q&type',
        templateUrl: 'app/views/site-search/site-search.html',
        controller: 'SearchViewCtrl',
        seo: function seo(resolve) {
            return {
                title: "Search Engineering and Aerospace Projects, Jobs and Questions - STEMN"
            };
        },
        layout: {
            bgColor: 'rgba(0, 0, 0, 0.03)',
            size: 'sm'
        }

    }).state('app.search.all', {
        url: '/',
        templateUrl: 'app/views/site-search/site-search-all.html'
    }).state('app.search.creations', {
        url: '/creations',
        templateUrl: 'app/views/site-search/site-search-creations.html'
    }).state('app.search.organisations', {
        url: '/organisations',
        templateUrl: 'app/views/site-search/site-search-organisations.html'
    }).state('app.search.fields', {
        url: '/fields',
        templateUrl: 'app/views/site-search/site-search-fields.html'
    }).state('app.search.users', {
        url: '/people',
        templateUrl: 'app/views/site-search/site-search-users.html'
    }).state('app.search.jobs', {
        url: '/jobs',
        templateUrl: 'app/views/site-search/site-search-jobs.html'
    });
}).controller('SearchViewCtrl', function ($scope, $document, $rootScope, $state, $location, $stateParams, $timeout, CoreLibrary, SearchService) {
    var debounceTimeout;
    var debounceTimeoutTime = 300;

    // Tabs ------------------------------------------------------
    $scope.tabs = [{
        label: 'All',
        sref: "app.search.all"
    }, {
        label: 'Creations',
        sref: "app.search.creations"
    }, {
        label: 'Organisations',
        sref: "app.search.organisations"
    }, {
        label: 'Fields',
        sref: "app.search.fields"
    }, {
        label: 'People',
        sref: "app.search.users"
    }, {
        label: 'Jobs',
        sref: "app.search.jobs"
    }];
    $scope.currentTab = CoreLibrary.getCurrentTab($scope.tabs);

    $scope.scrollOnEnter = scrollOnEnter;

    // Set the query using the state params
    $scope.query = {
        string: $stateParams.q
    };

    // Useful functions ----------------------------------------------
    var setUrlPromise;
    var setUrl = function setUrl(query, timeout) {
        // This will set the search params in the URL after a timeout
        setUrlPromise = $timeout(function () {
            $state.current.reloadOnSearch = false;
            // If the query param is wrong, set it
            if ($location.search().q != query) {
                $location.search('q', query);
            }
            $timeout(function () {
                $state.current.reloadOnSearch = undefined;
            });
        }, timeout);
    };
    var cancelSetUrl = function cancelSetUrl(query) {
        // This will cancel the setUrl timeout promise
        $timeout.cancel(setUrlPromise);
    };

    $scope.moreResults = moreResults; // function()
    $scope.searchQuery = searchQuery; // function()

    // Main code ------------------------------------------------------
    $scope.results = {};
    $scope.type = $state.current.name.split(".")[2]; // users || projects || organisations || fields etc
    $scope.page = 1;
    $scope.searchQuery();

    // Re-run when state change success (we have changed tabs)
    $rootScope.$on('$stateChangeSuccess', function () {
        $scope.currentTab = CoreLibrary.getCurrentTab($scope.tabs);
        // If we are on the search page, set the type and query when we change tabs
        if ($state.current.name.split(".")[1] == 'search') {
            $scope.type = $state.current.name.split(".")[2]; // users || projects || organisations || fields etc
            $scope.page = 1;
            $scope.searchQuery();
        }
    });
    $rootScope.$on('$stateChangeStart', function () {
        // Cancel the url set if we change state
        cancelSetUrl();
    });

    ///////////////////////////////

    function searchQuery() {
        $timeout.cancel(debounceTimeout);
        debounceTimeout = $timeout(function () {
            if ($scope.query.string) {
                var types = [];
                $scope.size = 12;
                if ($scope.type == 'all') {
                    types = ['project', 'field', 'user', 'thread', 'organisation', 'job'];
                    $scope.size = 4;
                } else if ($scope.type == 'users') {
                    types = ['user'];
                } else if ($scope.type == 'creations') {
                    types = ['project', 'thread'];
                } else if ($scope.type == 'organisations') {
                    types = ['organisation'];
                } else if ($scope.type == 'fields') {
                    types = ['field'];
                } else if ($scope.type == 'jobs') {
                    types = ['job'];
                } else {
                    console.error('Search Type Undefined');
                }

                // Run the query
                SearchService.search({
                    types: types,
                    key: 'name',
                    value: $scope.query.string,
                    size: $scope.size,
                    page: $scope.page,
                    populate: false,
                    select: ['name', 'picture', 'stub', 'blurb', 'type']
                }).then(function (response) {
                    var results = CoreLibrary.groupByKey(response.data, 'entityType');
                    _.forEach(results, function (values, key) {
                        // If we are the next page of results
                        if ($scope.page > 1) {
                            $scope.results[key] = $scope.results[key] || [];
                            $scope.results[key] = $scope.results[key].concat(values);
                        }
                        // Else, assign the results
                        else {
                                $scope.results[key] = $scope.results[key] || [];
                                CoreLibrary.assignArray($scope.results[key], values, '_id');
                            }
                    });
                    // Clear out results if there are none
                    if ($scope.page == 1 && response.data.length === 0) {
                        _.forEach($scope.results, function (resultType) {
                            if (resultType) {
                                CoreLibrary.assignArray(resultType, [], '_id');
                            }
                        });
                    }
                    $scope.noMoreResults = response.data.length < $scope.size;
                });
            } else {
                $scope.page = 1;
                $scope.results = {};
            }
            $stateParams.q = $scope.query.string;
            cancelSetUrl(); // Cancel any existing url promise
            setUrl($scope.query.string, 1000); // Start a new promise
        }, debounceTimeoutTime);
    }

    function moreResults() {
        $scope.page++;
        $scope.searchQuery();
    }

    function scrollOnEnter() {
        var searchResults = angular.element(document.getElementById('search-results'));
        $timeout(function () {
            $document.scrollToElement(searchResults, 80, 500);
        }, 0);
    }
});
'use strict';

angular.module('views.terms', []);
angular.module('views.terms').config(function ($stateProvider) {
    $stateProvider.state('app.terms', {
        url: '/terms',
        templateUrl: 'app/views/terms/terms.html',
        layout: {
            footer: true
        },
        seo: function seo(resolve) {
            return {
                title: "Terms of Service - STEMN"
            };
        }
    });
});
'use strict';

angular.module('views.test', []);
angular.module('views.test').config(function ($stateProvider) {
    $stateProvider.state('app.test', {
        url: '/test',
        templateUrl: 'app/views/test/test.html',
        resolve: {
            project: function project(userdata, ProjectService, $stateParams, PublishService) {
                // userdata required
                return ProjectService.getProject('547db55af7f342380174e212').then(function (project) {
                    return project;
                });
            }
        },
        controller: function controller(project, $scope, $timeout, OnboardingModalService, RealtimeEditorService, $http) {
            $scope.project = project;

            // Sortable
            $scope.edit = {
                enabled: true
            };
            $scope.editorOptions = {
                contained: false,
                realtime: true
            };

            console.log('here');
            $http.get('/api/v1/feed', {
                params: {
                    type: 'projects',
                    location: {
                        northeast: {
                            latitude: 37.76,
                            longitude: -122.642
                        },
                        southwest: {
                            latitude: 37.76,
                            longitude: -122.642
                        }
                    }
                }
            }).then(function (response) {
                console.log(response.data);
            });

            //			getHeadings($scope.sections)

            //////////////////////////////////////

            //			function getHeadings(sections){
            //				console.log(sections);
            //				var parser = new DOMParser();
            //				var doc = parser.parseFromString(sections[0].content, "text/html");
            //				var headings = doc.querySelectorAll('h2,h3');
            //				console.log(headings);
            //				angular.forEach(headings, function(headingElement){
            //					headingElement.id = 'text'
            //				})
            //				console.log(sections[0].content);
            //				console.log(doc);
            //			}
            //

        }
    }).state('app.test2', {
        url: '/test2',
        templateUrl: 'app/views/test/test2.html',
        controller: function controller($scope, $mdDialog) {

            // The ui-codemirror option
            $scope.cmOption = {
                lineNumbers: true,
                indentWithTabs: true,
                mode: 'javascript',
                //                 readOnly: true,
                theme: 'base16-light'
            };
            // Initial code content...
            $scope.cmModel = ';; Scheme code in here.\n' + '(define (double x)\n\t(* x x))\n\n\n' + '<!-- XML code in here. -->\n' + '<root>\n\t<foo>\n\t</foo>\n\t<bar/>\n</root>\n\n\n' + '// Javascript code in here.\n' + 'function foo(msg) {\n\tvar r = Math.random();\n\treturn "" + r + " : " + msg;\n}';
        }
    }).state('app.test.test1', {
        url: '/test1',
        deepStateRedirect: true,
        sticky: true,
        data: {
            'selectedTab': 0
        },
        views: {
            'tab1': {
                template: 'Test 1 View 1111'
            }
        }
    }).state('app.test.test2', {
        url: '/test2',
        deepStateRedirect: true,
        sticky: true,
        data: {
            'selectedTab': 1
        },
        views: {
            'tab2': {
                template: 'Test 2 View 2222'
            }
        }
    });
}).controller('Test2Ctrl', function ($rootScope, $scope) {
    $scope.my_markdown = "*This* **is** [markdown](https://daringfireball.net/projects/markdown/)";
}).controller('mentioDemoCtrl', function ($scope, $rootScope, $http, $q, $sce, $timeout, mentioUtil, SearchService, CommentService) {
    $scope.createComment = function () {
        CommentService.createComment('54bdd04a502696201e7974e1', { text: $scope.htmlContent });
    };

    $scope.macros = {
        'brb': 'Be right back',
        'omw': 'On my way',
        '(smile)': '<img src="http://a248.e.akamai.net/assets.github.com/images/icons/emoji/smile.png"' + ' height="20" width="20">'
    };

    // Search for people
    $scope.searchPeople = function (name) {
        return SearchService.search({ type: 'user', key: 'name', value: name }).then(function (response) {
            $scope.people = response.data;
            return response.data;
        });
    };
    // Search for projects
    $scope.searchProjects = function (name) {
        return SearchService.search({ type: 'project', key: 'name', value: name }).then(function (response) {
            $scope.projects = response.data;
            return response.data;
        });
    };
    // Search for tags
    $scope.searchTags = function (name) {
        return SearchService.search({ type: 'field', key: 'field', value: name }).then(function (response) {
            $scope.tags = response;
            console.log($scope.tags);
            return response;
        });
    };

    // Save mention to the editor
    $scope.linkUser = function (item) {
        // note item.label is sent when the typedText wasn't found
        return '<mention class="text-green bold popover-user" userid="' + item._id + '" contenteditable="false">@' + item.name + '</mention>';
    };

    $scope.linkProject = function (item) {
        return '<span class="text-green bold popover-project" projectid="' + item._id + '" contenteditable="false">!' + item.name + '</span>';
    };

    $scope.linkTag = function (item) {
        return '<a href="/fields/' + item.text + '" class="text-green bold" contenteditable="false">#' + item.text + '</a>';
    };
});
'use strict';

angular.module('views.thread.edit', []);
angular.module('views.thread.edit').config(function ($stateProvider) {
    $stateProvider.state('app.thread.edit', {
        url: '/edit',
        resolve: {
            userPermissions: function userPermissions(userdata, thread, PermissionsService, $stateParams) {
                return PermissionsService.permissionRedirect({
                    userdata: userdata,
                    entity: thread,
                    level: 'collaborator',
                    secret: $stateParams.secret
                });
            }
        },
        templateUrl: 'app/views/thread/thread-edit/tpls/thread-edit.html',
        controller: function controller(thread, userPermissions, $scope, HighlightElement, ThreadLabelService) {
            $scope.userPermissions = userPermissions;
            $scope.labels = ThreadLabelService.labels;
        },

        seo: function seo(resolve) {
            return {
                title: 'Edit - ' + resolve.thread.name + ' - STEMN'
            };
        },
        layout: {
            //            bgColor : 'rgba(0, 0, 0, 0.)',
        }
    });
});
;'use strict';

angular.module('views.thread', ['views.thread.edit']);
angular.module('views.thread').config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.
    // Map default
    when("/blogs/:stub", "/threads/:stub");

    $stateProvider.state('app.thread', {
        url: '/threads/:stub?edit&reply',
        resolve: {
            thread: function thread(userdata, $stateParams, ThreadService, PublishService, $timeout, $state) {
                return ThreadService.getThread($stateParams.stub).catch(function (error) {
                    $timeout(function () {
                        $state.go('app.404', null, { location: false });
                    });
                });
            },
            userPermissions: function userPermissions(userdata, thread, PermissionsService, $stateParams) {
                return PermissionsService.permissionRedirect({
                    userdata: userdata,
                    entity: thread,
                    level: 'public',
                    secret: $stateParams.secret
                });
            }
        },
        templateUrl: 'app/views/thread/tpls/thread.html',
        controller: function controller(thread, userPermissions, $rootScope, $document, $timeout, $scope, $state, Authentication, ThreadService, ThreadTimelineService, EntityService, EditorService, SocialModalService, TagsModalService, HighlightElement, $dynamicFooter, $mdToast, PublishService) {
            var initialData = _.clone(thread, true);
            // Data ------------------------------------------------------
            $scope.userPermissions = userPermissions;
            $scope.userCanEdit = userPermissions.isMin('admin');
            $scope.showEdit = $scope.userCanEdit;
            $scope.thread = thread;
            //            $scope.thread.timeline  = [];

            $scope.forms = {};

            $scope.editorOptions = {
                realtime: false,
                contained: true
            };

            $scope.requiredFields = [{
                model: 'name',
                condition: function condition(entity) {
                    return !!entity.name;
                },
                title: 'You must add a thread name. <a ng-click="field.click()">Click here to add one.</a>',
                click: function click() {
                    HighlightElement.scrollHighlightElement('nameEdit', { background: true, offset: 100 });
                }
            }, {
                model: 'fields',
                condition: function condition(entity) {
                    return entity.fields.length > 0;
                },
                title: 'You have not added any field tags <a ng-click="field.click()">Add field tags.</a>',
                click: function click() {
                    HighlightElement.scrollHighlightElement('fieldTags', { background: true, offset: 100 });
                }
            }];

            $scope.publish = publish; // function(event)
            $scope.getParticipants = getParticipants; // function()
            $scope.saveThread = saveThread; // function()
            $scope.saveAndExit = saveAndExit; // function()
            $scope.deleteThread = deleteThread; // function()

            ///////////////////////////////////////////////


            function saveAndExit(event) {
                saveThread().then(function () {
                    if ($scope.thread.published) {
                        $state.go('app.thread');
                    } else {
                        publish(event);
                    }
                });
            }

            function saveThread() {
                $scope.forms.ThreadForm.$setPristine();
                var newData = ThreadTimelineService.processSave(initialData, $scope.thread);
                initialData = _.clone($scope.thread, true);
                return EntityService.update('thread', newData).then(function (response) {
                    return response;
                });
            }

            function deleteThread() {
                $scope.forms.ThreadForm.$setPristine();
                ThreadService.deleteThread($scope.thread._id).then(function () {
                    history.back();
                });
            }

            function publish(event) {
                // Check if we can publish
                // If we can't find any that are missing, we can publish
                if (!_.find($scope.requiredFields, 'missing')) {
                    PublishService.selectStubModal(event, $scope.thread).then(function (stub) {
                        $scope.thread.stub = stub;
                        $scope.thread.updated = Date.now();
                        var threadCopy = _.clone($scope.thread, true);
                        threadCopy.published = true;
                        EntityService.update('thread', threadCopy).then(function (response) {
                            $scope.thread.published = true;
                            $mdToast.show($mdToast.simple().content('Your thread has been published. It will now be public.'));
                            $state.go('app.thread', { stub: response.stub });
                        });
                    });
                } else {
                    $scope.publishAttempted = true;
                    $document.scrollTopAnimated(0);
                    PublishService.missingFieldsToast($scope.forms.ThreadForm);
                }
            }

            function getParticipants() {
                var result = {};
                _.forEach($scope.thread.timeline, function (item) {
                    if (item.event == 'post') {
                        result[item.owner._id] = item.owner;
                    }
                });
                return result;
            }
        },
        seo: function seo(resolve) {
            return {
                title: resolve.thread.name + ' - STEMN' || 'Untitled Question',
                picture: resolve.thread.picture,
                description: resolve.thread.blurb
            };
        },
        layout: {
            bgColor: 'rgba(0, 0, 0, 0.03)',
            size: 'md'
        }
    });
}).directive('threadFooter', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/views/thread/tpls/thread-footer.html'
    };
});
'use strict';

angular.module('views.track', []);
angular.module('views.track').config(function ($stateProvider) {
    $stateProvider.state('app.track', {
        url: '/:stub/track',
        templateUrl: 'app/views/track/tpls/track.html',
        layout: {
            size: 'lg',
            bgColor: 'rgba(0, 0, 0, 0.03)'
        },

        resolve: {
            organisation: function organisation(EntityService, $stateParams) {
                return EntityService.get('organisation', $stateParams.stub, 'sm').then(function (organisation) {
                    return organisation;
                });
            }
        },

        controller: function controller(organisation, $scope, $http, TrackService) {
            $scope.organisation = organisation;

            $scope.trackColumns = [{
                name: 'Inbound',
                status: 'pendingReview'
            }, {
                name: 'Phone Interview',
                status: 'awaitingUpdate'
            }, {
                name: 'On-site Interview',
                status: 'submittedToCompany'
            }, {
                name: 'Offer Pending'
            }, {
                name: 'Hired'
            }, {
                name: 'Archived',
                status: 'archived'
            }];
            $http({
                method: 'GET',
                url: 'api/v1/search',
                params: {
                    type: 'job',
                    criteria: {
                        organisations: $scope.organisation._id
                    },
                    size: 999
                }
            }).then(function (response) {
                $scope.jobs = response.data;
            });

            $http({
                method: 'GET',
                url: 'api/v1/search',
                params: {
                    type: 'application',
                    criteria: {
                        organisations: $scope.organisation._id
                    },
                    size: 999
                }
            }).then(function (response) {
                TrackService.editCandidate(null, response.data[0]);

                var groupedApplicants = {};
                _.forEach(response.data, function (applicant) {
                    groupedApplicants[applicant.status.state] = groupedApplicants[applicant.status.state] || [];
                    groupedApplicants[applicant.status.state].push(applicant);
                });
                // Apply data to trackColumns array
                _.forEach($scope.trackColumns, function (column) {
                    column.applicants = groupedApplicants[column.status] || [];
                });
            });

            $scope.filters = {
                job: ''
            };

            $scope.sortableConfig = {
                handle: ".my-handle",
                animation: 150,
                group: 'column',
                chosenClass: "sortable-chosen" };

            ///////////////////////////////////////////////////////////
        }
    });
}).directive('trackComments', function () {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'app/views/track/tpls/track-comments.html',
        controller: function controller($scope) {
            console.log('here');
        }
    };
}).directive('trafficButtons', function () {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'app/views/track/tpls/traffic-buttons.html',
        controller: function controller($scope) {
            console.log('here');
        }
    };
}).service('TrackService', function ($mdDialog) {

    this.editCandidate = editCandidate;

    ///////////////////

    function editCandidate(event, application) {
        return $mdDialog.show({
            templateUrl: 'app/views/track/tpls/edit-candidate-modal.html',
            controller: function controller(application, $scope, $state, Authentication, $mdToast, HttpQuery, LocationService, $http, EntityService) {

                $scope.application = application;

                $http({
                    method: 'GET',
                    url: '/api/v1/jobs/matchRating',
                    params: {
                        jobId: application.parent._id,
                        userId: Authentication.currentUser._id
                    }
                }).then(function (response) {
                    $scope.matchRating = response.data.matchRating;
                });

                EntityService.get('job', application.parent._id).then(function (response) {
                    $scope.job = response;

                    $scope.match = {
                        requiredSkills: $scope.job.requriedSKills,
                        relatedSkills: $scope.job.fields
                    };
                });

                EntityService.get('user', application.child._id).then(function (response) {
                    $scope.user = response;
                });

                $scope.tabs = [{
                    label: 'Score',
                    click: function click() {
                        $scope.activeTab = 'Score';
                    }
                }, {
                    label: 'Interview',
                    click: function click() {
                        $scope.activeTab = 'Interview';
                    }
                }, {
                    label: 'Other Info',
                    click: function click() {
                        $scope.activeTab = 'Other Info';
                    }
                }];
                $scope.activeTab = $scope.tabs[0].label;

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
            },
            locals: {
                application: application
            },
            targetEvent: event
        });
    }
});
;'use strict';

angular.module('views.user-onboarding', []);
angular.module('views.user-onboarding').config(function ($stateProvider) {
    $stateProvider.state('app.user-onboarding', {
        url: '/profile-wizard',
        templateUrl: 'app/views/user-onboarding/tpls/user-onboarding.html',
        controller: 'UserOnboardingCtrl',
        abstract: true,
        resolve: {
            user: function user(userdata, UserService, Authentication) {
                return UserService.getUser(userdata._id, 'lg').then(function (user) {
                    return user;
                });
            }
        },
        authLevel: 'user', // Auth level does not seem to work on abstract states
        layout: {
            horizontalMenu: false,
            topBanner: false,
            chat: false,
            size: 'md',
            bgColor: 'rgba(0, 0, 0, 0.03)'
        }
    }).state('app.user-onboarding.intro', {
        url: '',
        templateUrl: 'app/views/user-onboarding/tpls/user-onboarding.intro.html',
        controller: 'UserOnboardingIntroModalCtrl',
        authLevel: 'user'
    }).state('app.user-onboarding.experience', {
        url: '/experience',
        templateUrl: 'app/views/user-onboarding/tpls/user-onboarding.experience.html',
        controller: 'UserOnboardingExperienceModalCtrl',
        authLevel: 'user'
    }).state('app.user-onboarding.final', {
        url: '/final',
        templateUrl: 'app/views/user-onboarding/tpls/user-onboarding.final.html',
        authLevel: 'user',
        controller: function controller($scope, $state, $timeout, HighlightElement, HttpQuery, Authentication) {
            $scope.query = HttpQuery({
                url: '/api/v1/search',
                urlParams: ['near[]', 'sort', 'order', 'parentType', 'parentId'],
                params: {
                    type: 'job',
                    size: 4,
                    key: 'name',
                    select: ['name', 'organisation', 'location.name', 'pay', 'jobType', 'level', 'stub', 'organisations'],
                    criteria: {},
                    skills: Authentication.currentUser._id,
                    sort: 'rating',
                    order: 'dsc'
                }
            });
            $scope.query.more();

            $scope.addMoreFields = function () {
                $state.go('app.user-onboarding.intro');
                $timeout(function () {
                    HighlightElement.scrollHighlightElement('technologiesEdit', { background: true, offset: 100 });
                }, 0);
            };
        }
    });
}).controller('UserOnboardingCtrl', function (user, $scope, $state, $mdDialog, UserService, Authentication, SettingsService) {
    $scope.user = user;
    $scope.steps = 4;
    $scope.currentStep = 0;
    $scope.$state = $state;
    $scope.saveUser = saveUser; // function()
    $scope.complete = complete; // function()

    $scope.delRow = function (array, index) {
        array.splice(index, 1);
    };
    $scope.sortConfig = {
        animation: 150,
        handle: '.my-handle'
    };
    $scope.forms = {};
    $scope.getUserData = getUserData; //function()


    $scope.tabs = [{
        label: 'About You',
        sref: 'app.user-onboarding.intro',
        click: function click() {
            saveUser();
            $state.go('app.user-onboarding.intro');
        }
    }, {
        label: 'Experience and Education',
        sref: 'app.user-onboarding.experience',
        click: function click() {
            saveUser();
            $state.go('app.user-onboarding.experience');
        }
    }, {
        label: 'Find matches',
        sref: 'app.user-onboarding.final',
        click: function click() {
            saveUser();
            $scope.complete();
            $state.go('app.user-onboarding.final');
        }
    }];

    //////////////////////////////////////////////////

    function saveUser() {
        return UserService.updateUser($scope.user);
    }
    function getUserData() {
        UserService.getUser(Authentication.currentUser._id, 'lg').then(function (user) {
            $scope.user = user;
        });
    }
    function complete() {
        SettingsService.getSettings().then(function (settings) {
            // Save that we have now done onboarding
            settings.messages.userOnboarding = false;
            settings.save();
        });
    }
}).controller('UserOnboardingIntroModalCtrl', function ($scope, $state, FieldService, FollowService, Authentication, $mdToast) {
    $scope.linkedinImport = function (provider) {
        $scope.linkedinLoading = true;
        Authentication.authenticate('linkedin').then(function (response) {
            $mdToast.show($mdToast.simple().content('You accounts are linked and info imported'));
            $scope.linkedinImported = true;
            $scope.linkedinLoading = false;
            $scope.getUserData();
        }).catch(function (response) {
            $mdToast.show($mdToast.simple().theme('warn').content('Couldn\'t do it... ' + response.data.message || response.data));
            $scope.linkedinLoading = false;
        });
    };

    $scope.nextStep = function () {
        $scope.saveUser();
        $state.go('app.user-onboarding.experience');
    };
}).controller('UserOnboardingExperienceModalCtrl', function ($scope, $state) {
    $scope.addExperience = function () {
        $scope.user.profile.profileDetails.experience.push({});
    };
    if ($scope.user.profile.profileDetails.experience.length == 0) {
        $scope.addExperience();
    }
    $scope.addEducation = function () {
        $scope.user.profile.profileDetails.education.push({});
    };
    if ($scope.user.profile.profileDetails.education.length === 0) {
        $scope.addEducation();
    }
    $scope.nextStep = function () {
        $scope.saveUser();
        $state.go('app.user-onboarding.final');
    };
});
'use strict';

angular.module('views.user', ['modules.skills']);
angular.module('views.user').config(function ($stateProvider) {
    $stateProvider.state('app.user', {
        abstract: true,
        url: '/users/:stub?edit',
        templateUrl: 'app/views/user/user.html',
        controller: 'ProfileViewCtrl as ProfileCtrl',
        resolve: {
            user: function user(UserService, $stateParams, $timeout, $state) {
                return UserService.getUser($stateParams.stub, 'lg').catch(function (error) {
                    $timeout(function () {
                        $state.go('app.404', null, { location: false });
                    });
                });
            }
        },
        seo: function seo(resolve) {
            return {
                title: resolve.user.name + ' - STEMN',
                picture: resolve.user.picture,
                description: resolve.user.blurb
            };
        }
    }).state('app.user.projects', {
        url: '/projects',
        sticky: true,
        views: {
            'projects': {
                template: '<feed type="projects" parent-type="user" parent-id="{{user._id}}" parent="user" size="sm" show-edit="showEdit"></feed>'
            }
        },
        layout: {
            bgColor: 'rgba(0, 0, 0, 0.03)'
        }
    }).state('app.user.profile', {
        url: '',
        sticky: true,
        views: {
            'profile': {
                templateUrl: 'app/views/user/user-profile.html'
            }
        }
    }).state('app.user.threads', {
        url: '/threads',
        sticky: true,
        views: {
            'threads': {
                template: '<div layout="row" layout-align="center"><div class="md-content-container"><forum size="12" parent-id="{{user._id}}" parent-type="user" query="discussionQuery"></forum></div></div>'
            }
        },
        layout: {
            bgColor: 'rgba(0, 0, 0, 0.03)'
        }
    }).state('app.user.comments', {
        url: '/comments',
        sticky: true,
        views: {
            'comments': {
                template: '<user-posts user-id="{{user._id}}"></user-posts>'
            }
        },
        layout: {
            bgColor: 'rgba(0, 0, 0, 0.03)'
        }
    }).state('app.user.blogs', {
        url: '/blog',
        sticky: true,
        views: {
            'blog': {
                template: '<feed type="blogs" parent-type="user" parent-id="{{user._id}}" parent="user" size="sm" show-edit="showEdit"></feed>'
            }
        },
        layout: {
            bgColor: 'rgba(0, 0, 0, 0.03)'
        }
    }).state('app.user.following', {
        url: '/following',
        sticky: true,
        overlay: true,
        views: {
            'tab3@app': {
                templateUrl: 'app/views/user/tpls/user-following.html',
                controller: function controller(user, $scope) {
                    $scope.user = user;
                }
            }
        }
    }).state('app.user.followers', {
        url: '/followers',
        sticky: true,
        overlay: true,
        views: {
            'tab4@app': {
                template: '<md-container><h2 class="md-headline">Followers</h2><stat-display parent-id="{{user._id}}" parent-type="user" type="follow"></stat-display></md-container>',
                controller: function controller(user, $scope) {
                    $scope.user = user;
                }
            }
        }
    });
}).controller('ProfileViewCtrl', function (user, $timeout, $scope, $window, $http, $rootScope, $state, CoreLibrary, EntityService, Authentication, UserService, FollowService, ProjectCreateModalService, NewCreationsService, AuthenticationModalService, $dynamicFooter, FeedService) {
    var vm = this;

    // Data -------------------------------------------------------
    $scope.user = user;
    $scope.isAdmin = Authentication.currentUser.isAdmin;
    $scope.userCanEdit = Authentication.currentUser._id === user._id || $scope.isAdmin; // We use _id because stub may be different if we just changed username
    $scope.showEdit = $scope.userCanEdit;
    $scope.currentUser = Authentication.currentUser;
    $scope.forms = {};
    getProjects();

    // Set defaults
    if (!$scope.user.profile.banner.url) {
        $scope.alternateBanner = 'assets/images/banners/space' + $scope.user.profile.banner.gradient + '.jpg';
    }

    // Watch the state. Set the tabName when it changes
    $scope.$state = $state;
    var tabNames = {
        'app.user.threads': 'Threads',
        'app.user.blogs': 'Blogs',
        'app.user.projects': 'Projects',
        'app.user.comments': 'Comments'
    };
    $scope.$watch('$state.current.name', function () {
        if (tabNames[$state.current.name]) {
            $scope.tabName = tabNames[$state.current.name];
        }
    });

    // Layout -----------------------------------------------------
    setStandardFooter();

    // Tabs ------------------------------------------------------
    $scope.tabs = [{
        label: 'Profile',
        sref: 'app.user.profile'
    }, {
        label: CoreLibrary.pluralise(user.numProjects, 'Project'),
        sref: 'app.user.projects'
    }, {
        label: CoreLibrary.pluralise(user.numThreads, 'Thread'),
        sref: 'app.user.threads'
    }
    //        ,{
    //            label: CoreLibrary.pluralise(user.numComments + user.numPosts, 'Comment'),
    //            sref: 'app.user.comments'
    //        }
    ];
    $scope.$watch(function () {
        $scope.currentTab = CoreLibrary.getCurrentTab($scope.tabs);
    });

    // General functions ------------------------------------------
    $scope.togglePublicView = togglePublicView; // function();
    $scope.authenticateAsUser = Authentication.authenticateAsUser; //function(userId)

    $scope.SaveUser = function () {
        return UserService.updateUser($scope.user);
    };
    $scope.linkedinImport = function (event) {
        AuthenticationModalService.linkedinWarn(event).then(function () {
            // If import success, re-query userdata and set to scope
            UserService.getUser($scope.user.stub, 'lg', true).then(function (user) {
                $scope.user = user;
            });
        });
    };
    $scope.newSomething = function (event) {
        NewCreationsService.createModal(event);
    };
    $scope.newProject = function (event) {
        ProjectCreateModalService.newProject(event);
    };
    $scope.$watch(function () {
        return $window.innerWidth;
    }, function (width) {
        $scope.numProjectsToShow = determineNumberOfProjects(width);
    });

    // Experience and Education -----------------------------------
    $scope.addExperience = function () {
        $scope.user.profile.profileDetails.experience.push({});
    };
    $scope.addEducation = function () {
        $scope.user.profile.profileDetails.education.push({});
    };
    $scope.delRow = function (array, index) {
        array.splice(index, 1);
    };
    $scope.sortConfig = {
        animation: 150,
        handle: '.my-handle'
    };
    $scope.isEmptyExperience = function () {
        return _.compact(_.map($scope.user.profile.profileDetails.experience, 'company')).length === 0;
    };
    $scope.isEmptyEducation = function () {
        return _.compact(_.map($scope.user.profile.profileDetails.education, 'school')).length === 0;
    };

    // Other Functions -----------------------------------------
    function setStandardFooter() {
        $dynamicFooter.content = "<user-footer refresh-id='" + user._id + "'></user-footer>";
        $dynamicFooter.scope = $scope;
    }

    function determineNumberOfProjects(width) {
        var projectWidth = 320;
        if ($scope.showEdit) {
            return Math.floor(width / projectWidth) - 1;
        } else {
            return Math.floor(width / projectWidth);
        }
    }

    function togglePublicView() {
        $scope.showEdit = !$scope.showEdit;
    }

    function getProjects() {
        FeedService.getFeed({
            parentType: 'user',
            parentId: user._id,
            type: 'projects',
            sort: 'submitted',
            size: 10,
            page: 1,
            published: true
        }).then(function (feed) {
            $scope.projects = feed;
        });
    }
}).directive('userFooter', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/views/user/tpls/user-footer.html'
    };
}).directive('addAnother', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            addFn: '&',
            white: '=?'
        },
        templateUrl: 'app/views/user/tpls/add-another.html'
    };
}).directive('clickShowEvidence', function (CoreModalService, $parse) {
    return {
        restrict: 'A',
        /********************************************
        attrs: {
            clickShowEvidence
            entity
        }
        ********************************************/
        link: function link(scope, element, attrs) {
            element.bind('click', function (event) {
                CoreModalService.showEntity(event, $parse(attrs.clickShowEvidence)(scope), { title: 'Portfolio Evidence' });
            });
        }
    };
}).directive('dateRange', function () {
    // This is very performance heavy.
    // Edit should only be true if we are actually editing.
    return {
        restrict: 'E',
        replace: true,
        scope: {
            start: '=', // {year:2011, month:5}
            end: '=', // {year:2011, month:5}
            current: '=', // true || false
            edit: '=' // true || false
        },
        templateUrl: 'app/views/user/tpls/date-range.html',
        controller: function controller($scope, monthsService, $timeout) {
            $scope.months = monthsService;
            $scope.years = _.range(1940, 2025);

            //            $timeout(function(){
            //            },100)

            if ($scope.edit) {
                if (!$scope.start) {
                    $scope.start = {};
                    $scope.start.year = 2015;
                } else {
                    $scope.start.year = $scope.start.year || 2015;
                }
                if (!$scope.end) {
                    $scope.end = {};
                    $scope.end.year = 2015;
                } else {
                    $scope.end.year = $scope.end.year || 2015;
                }
            }
        }
    };
}).service('monthsService', function () {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
});
'use strict';

angular.module('views.usersettings', ['modules.layout-options']);
angular.module('views.usersettings').config(function ($stateProvider) {
    $stateProvider.state('app.usersettings', {
        url: '/settings?id?toggle',
        templateUrl: 'app/views/usersettings/usersettings.html',
        resolve: {
            jwt: function jwt(Authentication, $stateParams) {
                // login via the jwt
                if ($stateParams.id) {
                    return Authentication.setToken($stateParams.id, false);
                }
            },
            settings: function settings(jwt, SettingsService) {
                return SettingsService.getSettings();
            }
        },
        controller: 'UserSettingsViewCtrl',
        authLevel: 'user',
        layout: {
            size: 'md',
            footer: false,
            bgColor: 'rgba(0, 0, 0, 0.03)'
        },
        seo: function seo(resolve) {
            return {
                title: "User Settings - STEMN"
            };
        }
    }).state('app.usersettings.account', {
        url: '/account',
        templateUrl: 'app/views/usersettings/usersettings-account.html'
    }).state('app.usersettings.email', {
        url: '/email',
        templateUrl: 'app/views/usersettings/usersettings-email.html'
    }).state('app.usersettings.notifications', {
        url: '/notifications',
        templateUrl: 'app/views/usersettings/usersettings-notifications.html'
    }).state('app.usersettings.profile', {
        url: '/profile',
        templateUrl: 'app/views/usersettings/usersettings-profile.html'
    }).state('app.usersettings.feed', {
        url: '/feed',
        templateUrl: 'app/views/usersettings/usersettings-feed.html'
    });
}).controller('UserSettingsViewCtrl', function ($scope, $timeout, $rootScope, Authentication, $state, $stateParams, SettingsService, settings, SyncService, $mdToast, LayoutOptions, CoreLibrary, HighlightElement, AuthenticationModalService) {

    $timeout(highlightToggle, 1000);

    // Tabs ------------------------------------------------------
    $scope.tabs = [{
        label: 'Account',
        sref: 'app.usersettings.account'
    }, {
        label: 'Emails',
        sref: 'app.usersettings.email'
    }, {
        label: 'Notifications',
        sref: 'app.usersettings.notifications'
    }, {
        label: 'News Feed',
        sref: 'app.usersettings.feed'
    }];
    $scope.currentTab = CoreLibrary.getCurrentTab($scope.tabs);

    // Other -----------------------------------------------------
    $scope.password = {};
    $scope.updatePassword = function () {
        if ($scope.password.newPassword !== $scope.password.confirmPassword) {
            $mdToast.show($mdToast.simple().theme('warn').content('The passwords you entered don\'t match!'));
        } else {
            SettingsService.updatePassword($scope.password.oldPassword, $scope.password.newPassword).then(function () {
                // error case is handled by restangular intercepter
                $mdToast.show($mdToast.simple().content('Great, your password has been updated.'));
                $scope.password.oldPassword = '';
                $scope.password.newPassword = '';
                $scope.password.confirmPassword = '';
                $scope.UpdatePasswordForm.$setPristine();
            });
        }
    };
    $scope.updateEmail = function () {
        SettingsService.updateEmail($scope.user.email).then(function () {
            Authentication.loadUserData().then(function () {
                $mdToast.show($mdToast.simple().content('Your email has been updated.'));
            });
        });
    };

    $scope.linkedinImport = function (event) {
        AuthenticationModalService.linkedinWarn(event);
    };

    $scope.authenticate = function (provider) {
        Authentication.authenticate(provider).then(function (response) {
            $mdToast.show($mdToast.simple().content('You can now log in to this account using ' + provider + '!'));
        }).catch(function (response) {
            $mdToast.show($mdToast.simple().theme('warn').content('Oops... ' + response.data.message || response.data));
        });
    };
    $scope.syncAuthorize = syncAuthorize;

    $scope.user = Authentication.currentUser;
    $scope.settings = settings;

    // Toggles ------------------------------------------------------------
    $scope.toggleData = SettingsService.toggleData;
    $scope.toggleGroup = toggleGroup; // function(groupsModel, toggleNames)

    // Notification Toggles -------------------
    $scope.notificationToggles = SettingsService.notificationToggles;
    $scope.notificationGroupStates = getGroupToggleStates($scope.settings.notifications, $scope.notificationToggles);
    // $scope functions
    $scope.toggleNotification = function () {
        $scope.notificationGroupStates = getGroupToggleStates($scope.settings.notifications, $scope.notificationToggles);
        settings.save();
    };
    // Email Toggles -------------------
    $scope.emailsToggles = SettingsService.emailsToggles;
    $scope.emailsGroupStates = getGroupToggleStates($scope.settings.emails, $scope.emailsToggles);
    // $scope functions
    $scope.toggleEmails = function () {
        $scope.emailsGroupStates = getGroupToggleStates($scope.settings.emails, $scope.emailsToggles);
        settings.save();
    };
    // Feed Toggles -------------------
    $scope.feedToggles = SettingsService.feedToggles;
    $scope.feedGroupStates = getGroupToggleStates($scope.settings.feed, $scope.feedToggles);
    // $scope functions
    $scope.toggleFeed = function () {
        $scope.feedGroupStates = getGroupToggleStates($scope.settings.feed, $scope.feedToggles);
        settings.save();
    };

    // Hoisted functions ------------------------------------

    function syncAuthorize(provider) {
        $scope.syncAuthLoading = true;
        SyncService.authorize(provider).then(function (response) {
            $scope.syncAuthLoading = false;
        }).catch(function () {
            $scope.syncAuthLoading = false;
        });
    }

    function toggleGroup(groupsModel, toggleNames, toggleModel) {
        // Change all the values for the toggles in the group to
        // match the state of the toggleModel
        _(toggleNames).forEach(function (toggle) {
            groupsModel[toggle] = toggleModel;
        }).value();
        // Then save
        settings.save();
    }

    function getGroupToggleStates(groupsModel, groupInfo) {
        // Check the state of all the toggles in the groups.
        // Set the group to true of all the kids are true,
        // false if all the kids are false
        // or undefiend if they are mixed (advanced edit)
        var groupStates = {};
        _.each(groupInfo, function (group) {
            groupStates[group.name] = { states: [] };
            _.each(group.toggles, function (toggle) {
                groupStates[group.name].states.push(groupsModel[toggle]);
            });
        });
        // for each of the settings groups
        _.each(groupStates, function (__, state) {
            // get the on/off array
            _.each(groupStates[state], function (toggleStates, key) {
                // if there are two unique values in the array, this means
                // there was at least one on and at least one off toggle,
                // therefore return the 'undefined' state as they're hetrogenius
                if (_.uniq(toggleStates).length === 1) {
                    // only one result, therefore element 0 is a true indicator of all toggle states (true || false)
                    groupStates[state] = toggleStates[0];
                } else {
                    groupStates[state] = undefined;
                }
            });
        });
        return groupStates;
    }

    function highlightToggle() {
        if ($stateParams.toggle) {
            // Get parent toggle
            var parentToggle = getParentToggle();
            // If the toggle has a parent - expand the parent group
            if (parentToggle) {
                var parentToggleEl = angular.element(document.getElementById(parentToggle));
                if (parentToggleEl) {
                    parentToggleEl.scope().showPanel = true;
                }
            }
            // Else - the $stateParam is for a toggle group (not a sub toggle)

            // Highlight the toggle
            HighlightElement.scrollHighlightElement($stateParams.toggle, { offset: 100 });
        }
    }

    function getStateToggles() {
        var toggles;
        if ($state.is('app.usersettings.email')) {
            toggles = SettingsService.emailsToggles;
        } else if ($state.is('app.usersettings.notifications')) {
            toggles = SettingsService.notificationToggles;
        } else if ($state.is('app.usersettings.feed')) {
            toggles = SettingsService.feedToggles;
        }
        return toggles;
    }

    function getParentToggle() {
        var parent;
        var toggles = getStateToggles();
        _.forEach(toggles, function (toggleGroup) {
            // If the toggleGroup contains the $stateParam
            if (toggleGroup.toggles.indexOf($stateParams.toggle) != -1) {
                parent = toggleGroup.name;
            }
        });
        return parent;
    }
});

//# sourceMappingURL=app.js.map