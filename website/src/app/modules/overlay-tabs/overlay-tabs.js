import './overlay-tabs.scss';

angular.module('modules.overlay-tabs', []);
angular.module('modules.overlay-tabs').

directive('overlayViews', function () {
    return {
        restrict: 'E',
        transclude: true,
        template: '<fade-overlay ng-click="back()" ng-show="showOverlay"></fade-overlay><div ng-transclude></div>',
        controller: function($scope, $element, $rootScope, ActiveOverlaysService, $state, $timeout, $window, LayoutOptions){

            $scope.back = function(){
                $state.go(ActiveOverlaysService.underlay.name, ActiveOverlaysService.underlay.params)
            }

            var disablePromise

            function enable(){
                $timeout.cancel(disablePromise)
                $scope.showOverlay = true;
				$element.addClass('enabled');
//                $timeout(function(){ // This is in timeout because it defaults to false on state change
//					LayoutOptions.body.hideOverflow = true;
//				},1)

            }
            function disable(){
                $scope.showOverlay = false;
//				LayoutOptions.body.disableScroll = false;
                disablePromise = $timeout(function(){
                    $element.removeClass('enabled');
                }, 1000)
            }

            $rootScope.$on('$stateChangeSuccess', function () {
                // If there is an active underlay, and we are on an overlay page, we enable
                if(ActiveOverlaysService.underlay && $state.current.overlay){
                    enable();
                }
                // Else, we disable
                else{
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
}).

directive('overlay', function ($state, $rootScope, $timeout, $compile, ActiveOverlaysService) {
    return {
        restrict: 'E',
        transclude: true,
        scope:{
            ngHide : '=', // Used to show/hide the content
            view   : '@'  // The name of the contained ui-view
        },
        template: '<md-content><div ng-transclude></div></md-content>',
        link: function(scope, element, attrs, ctrl){

            $rootScope.$on('$stateChangeSuccess', checkFunction);
			checkFunction();

			function checkFunction(){
			    // If this view matches the current state, show it!
                if(ActiveOverlaysService.activeView == scope.view){
                    scope.ngHide = false;
                    // If the state is an overlay, enable the overlay
                    if($state.current.overlay){
                        element.addClass('enabled');
                        element.attr('layout-offset-top-banner', true);
                    }
                    else{
                        element.removeClass('enabled')
                        element.attr('layout-offset-top-banner', '');
                    }
                }
                // If this view is the active underlay...
                else if(ActiveOverlaysService.underlay.viewname == scope.view){
                    // If the state is an overlay, show the underlay
                    if($state.current.overlay){scope.ngHide = false;}
                    // Else, hide the underlay
                    else{scope.ngHide = true;}
                    // In any case, it is an underlay so remove enabled class
                    element.removeClass('enabled');
                    element.attr('layout-offset-top-banner', '');
                }
                // Else, this view is NOT active and is NOT the underlay
                else{
                    // Hide it!
                    scope.ngHide = true;
                }
			}
        }
    };
}).

service('ActiveOverlaysService', function ($rootScope, $stickyState, $state, $stateParams, $previousState) {

    // Api description ------------------------------------------------
    var ret = {
        activeView : '', // string representing the current view - eg. 'tab1'
        underlay   : {}  // object for the current underlay state
    }

    // Functions -------------------------------------------------------
    function checkForNewUnderlay(){
        // This function will search sticky states for a potential underlay state.
        // If it finds one, it will set it and the state params. Else it will set underlay to false.

        // Get the inactive sticky states, reverse the array so most recently active is first.
        var inactiveStates = _.map($stickyState.getInactiveStates(),'self').reverse();
        // Find the first underlay (state with overlay false)
        var underlay       = _.find(inactiveStates, function(state){
            return !state.overlay
        });
        // If there is an underlay, set it
        if(underlay){
            ret.underlay          = underlay;
            ret.underlay.params   = $stateParams;
            // If the underlay has a view, set the viewname
            if(underlay.views){
                ret.underlay.viewname = Object.keys(underlay.views)[0].split("@")[0];
            }
        }
        // Else, set underlay to false because there is none
        else{
            ret.underlay        = false;
        }
    }
    function getActiveView(){
        /// This function will set activeView to the currently active view.
        if($state.current.views){
            // Get the current view
            ret.activeView = Object.keys($state.current.views)[0].split("@")[0];
        }
        // Else, the active view is a standard ui-view
        else{
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

