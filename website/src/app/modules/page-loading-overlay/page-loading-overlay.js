import './page-loading-overlay.scss';

angular.module('modules.page-loading-overlay', [
    'modules.loadbar'
]);

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

angular.module('modules.page-loading-overlay').

directive('pageLoadingOverlay', function ($timeout, $document, $rootScope, cfpLoadingBar) {
    return {
        restrict: 'E',
        link : function (scope, element, attr){
            var removeTimeout, loading, count = 1;
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

            function removeOverlay(timeoutDelay){
                element.addClass('animate')
                $timeout( function(){
					element.remove();
					window.prerenderReady = true; // Shitty thing so prerender.io works
				},800); // The CSS animation takes  800ms
            }
        }
    };
});
