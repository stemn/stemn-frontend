angular.module('modules.scroll-highlight', []);
angular.module('modules.scroll-highlight').

run(function ($rootScope, $location, $timeout, HighlightElement, $document, $stateParams) {
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        // Scroll to anchor hash
        // TODO - This scroll has a timeout which is a race condition with DOM load

		// SlowScroll State Param will force anchor to be slow
		var speed, timeout

        // If no preview state, timeout is long, otherwise, short
		if($stateParams.slowscroll){
			speed   = 5000;
		}else{
			speed   = 500;
		}
        timeout = !fromState.name ? 3000 : 100;
        if($location.hash()){
            $timeout(function (){
                HighlightElement.scrollHighlightElement($location.hash(), {speed : speed, background: true})
            }, timeout)

        }
    });
}).

directive('scrollHighlight', function (HighlightElement) {
    // takes in attr 'scrollHighlight' and scrolls to the element with that id
    return {
        restrict: 'A',
        link : function(scope, element, attrs){
            element.bind('click', function (event) {
                var element = HighlightElement.scrollHighlightElement(attrs.scrollHighlight, {background: true});
            });
        }
    }
}).

service('HighlightElement', function($timeout, $document, $stateParams) {
    // These functions highlight elements - typically used with Anchor links
    this.outline = outline;
    this.background = background;
    this.scrollHighlightElement = scrollHighlightElement;

    var self = this;


    /////////////////////////////////////////

    function scrollHighlightElement(elementId, options){
        /**************************
        options: {
            speed: the scroll speed
            background: true || false (defaults to bg+outline)
            offset: offset height (dont include px)
        }
        **************************/
        // defaults
        options = options || {};
        options.speed  = options.speed  || 500;
        options.offset = options.offset || 64;

        var anchorElement = angular.element(document.getElementById(elementId));
        if(anchorElement[0]){
            $document.scrollToElement(anchorElement, options.offset, options.speed).then(function(){
                if($stateParams.slowscroll){
                    $document.scrollTopAnimated(0, options.speed/3)
                }
                else if(options.background){
                    self.background(anchorElement)
                }
                else{
                    self.outline(anchorElement)
                }
            });
            return anchorElement
        }
    }

    function outline(highlightElement){
        // Outlines the element with yellow and then fades it out
        $timeout(function(){highlightElement.css({outline       : '10px solid rgba(255, 255, 214, 0)'})}, 0   );
        $timeout(function(){highlightElement.css({transition    : 'all 0.5s linear'                  })}, 100 );
        $timeout(function(){highlightElement.css({outline       : '10px solid rgba(255, 255, 214, 1)'})}, 500 );
        $timeout(function(){highlightElement.css({background    : 'rgb(255, 255, 214)'   		     })}, 500 );
        $timeout(function(){highlightElement.css({background    : ''  						         })}, 2000);
        $timeout(function(){highlightElement.css({outline       : '10px solid rgba(255, 255, 214, 0)'})}, 2000);
        $timeout(function(){highlightElement.css({outline       : ''                                 })}, 3000);
        $timeout(function(){highlightElement.css({transition    : ''                                 })}, 3000 );
    }
    function background(highlightElement){
        // Outlines the element with yellow and then fades it out
        $timeout(function(){highlightElement.css({transition    : 'all 0.5s linear'                  })}, 0 );
        $timeout(function(){highlightElement.css({background    : 'rgb(255, 255, 214)'   		     })}, 400 );
        $timeout(function(){highlightElement.css({background    : ''   		                         })}, 2000 );
        $timeout(function(){highlightElement.css({transition    : ''   		                         })}, 3000 );
    }

});
