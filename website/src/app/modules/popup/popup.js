import './popup.scss';

angular.module('modules.popup', []);
angular.module('modules.popup').

directive('popup', function ($timeout, $window, $compile, $rootScope, $document) {
    // This directive create a popup and appends it to the document.body
    return {
        restrict: 'A',
        scope: {
            popupContent     : '@',
            popupWidth       : '@?',
            popupFixedBottom : '=?', // ture || false, This sets the popup to be fixed at the bottom of the screen (for footer)
        },
        link: function(scope, element, attrs) {
            // Intiate promises
            var showTimeout;     // The show  timeout object
            var hideTimeout;     // The close timeout object

            // Initiate variables
            var popup = {};      // The popup object
            var delayOpen = 400; // The delay before pop
            popup.width = scope.popupWidth || 300;
            // Initate functions
            var show = function(){
                popup.position = getPosition();
                popup.element  = popup.element ? popup.element : createPopup(); // get the popup element, else, create it
                setPosition(popup.element, popup.position); // position the popup
                scope.show = true; // show the popup
                scope.$apply();
            }

            var hide = function(){
                scope.show = false;
                scope.$apply();
            }

            var setPosition = function(element, position){
            // Set the css for the new position
                element.css({
                    'top'      : position.top,
                    'left'     : position.left,
                    'width'    : popup.width,
                })
                if(scope.popupFixedBottom){
                    // If fixed at the bottom of the screen, we define vertical position
                    element.css({
                        'top'      : '',
                        'bottom'   : '50px',
                        'position' : 'fixed',
                    })
                }
            }

            var createPopup = function(){
            // This create the popup element and appends it to the body
            // It also compiles the element relative to the scope
                // Create the popup element
                var popupTpl = angular.element('<div class="popup" ng-show="show">'+scope.popupContent+'</div>');
                // Compile the popup element
                $compile(popupTpl)(scope);
                // Bind the hover functions
                bindOpenTrigger(popupTpl);
                bindCloseTrigger(popupTpl);
                // Append element to body
                angular.element(document.body).append(popupTpl);
                return popupTpl;
            }

            var getPosition = function(){
            // This function outputs the left and top positions of the popup
            // it does this by inspecting the location of the calling element
            // it corrects for crashes when the screen is too small
                var windowEl       = angular.element($window); // Get window element
                var scrollPosition = windowEl.scrollTop();     // Get scroll position
                var boundingRect   = element[0].getBoundingClientRect();
                var hCenter        = boundingRect.left + boundingRect.width/2;
                var popupLeft      = hCenter - popup.width/2;
                var popupRight     = hCenter + popup.width/2;

                if ( popupLeft < 0){ // Crash left
                    return {
                        left : 15,
                        top  : boundingRect.bottom + scrollPosition
                    }
                }
                else if ( popupRight > $window.innerWidth ){ // Crash right
                    return {
                        left : $window.innerWidth - popup.width - 15,
                        top  : boundingRect.bottom + scrollPosition
                    }
                }
                else {
                    return {
                        left : popupLeft,
                        top  : boundingRect.bottom + scrollPosition
                    }
                }
            }
            // Show the popup when the mouse enters the area
            var bindOpenTrigger = function(element){
                element.bind('mouseenter', function(){
                    $timeout.cancel(hideTimeout);      // Cancel the hide
                    showTimeout = $timeout(show, delayOpen);
                })
            }

            // Cancel the Show Timeout of the mouse leaves the hover area
            var bindCloseTrigger = function(element){
                element.bind('mouseleave', function(){
                    $timeout.cancel(showTimeout);      // Cancel the show
                    hideTimeout = $timeout(hide, 50);
                })
            }

            // Bind the calling element
            bindOpenTrigger(element);
            bindCloseTrigger(element);

            // Remove the popups after a state change
            $rootScope.$on('$stateChangeSuccess', function () {
                $timeout.cancel(showTimeout);      // Cancel the show
                if(popup.element){
                    popup.element.remove()
                }
            })
        }
    };
}).


directive('popup', function (PopupService, $timeout) {
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
        link: function(scope, element, attrs) {
            var popupEl;   // The popup element is assigned to this once it has been created
            var contentEl; // The content element
            var targetEl = element.parent();

            // Remove the element from the DOM
            // It will be inserted when the popup is created
            element.detach();

            $timeout(function(){
                bindTrigger('target') // bind the trigger to the target el
            },100)


            // Destroy the popup
            scope.$on('$destroy', function(){
                PopupService.destroy(popupEl);
            });

            ///////////////////////////////////////////////////////////////////

            function showFn(){
                // If the popup does not exist, create it.
                if(!popupEl){create()}
                scope.showPopup = true;
                $timeout(function(){
                    PopupService.position({
                        popupEl   : popupEl,
                        targetEl  : targetEl[0],
                        side      : attrs.popupSide || 'right',
                        type      : attrs.popupPosition || 'start',
                        arrow     : 'true',
                        padding   : attrs.popupPadding,
                    });
                })
                scope.$apply();
            }
            function create(){
                popupEl = PopupService.create({
                    scope: scope
                })
                contentEl = angular.element(popupEl[0].querySelector('.popup-content'));
                contentEl.append(element);
                bindTrigger('popup') // Bind the triggers to the popup
            }

            function bindTrigger(triggerToBind){
                // triggerToBind = 'target' || 'popup'
                PopupService.bindTrigger({
                    popupEl   : popupEl,
                    targetEl  : targetEl,
                    trigger   : 'hover',
                    scope     : scope,
                    showFn    : showFn,
                    hideFn    : hideFn,
                    delayOpen : 10
                }, triggerToBind)
            }

            function hideFn(){
                scope.showPopup = false;
                scope.$apply();
            }

        }
    };
}).

directive('popupTooltip', function (PopupService, $timeout) {
    return {
        restrict: 'A',
        scope: {
            popupTooltip : '@',
            // Attrs:
            // popupPadding  - '10px 0 0 0' padding string
            // popupPosition - start || center || end
            // popupSide     - top || right || bottom || left
        },
        link: function(scope, element, attrs) {

            var popupEl = PopupService.create({
                template: '<div class="tooltip-popup">'+scope.popupTooltip+'</div>',
                scope: scope
            })

            $timeout(function(){
                PopupService.bindTrigger({
                    popupEl   : popupEl,
                    targetEl  : element,
                    trigger   : 'hover',
                    scope     : scope,
                    showFn    : showFn,
                    hideFn    : hideFn
                })
            },100)

            function showFn(){
                scope.showPopup = true;
                $timeout(function(){
                    PopupService.position({
                        popupEl  : popupEl,
                        targetEl : element[0],
                        side     : attrs.popupSide || 'right',
                        type     : attrs.popupPosition || 'start',
                        arrow    : 'true',
                        padding  : attrs.popupPadding
                    });
                })
                scope.$apply();
            }
            function hideFn(){
                scope.showPopup = false;
                scope.$apply();
            }
            scope.$on('$destroy', function(){
                PopupService.destroy(popupEl);
            });
        }
    };
}).


service('PopupService', function($compile, $timeout, $rootScope){
    var service = this;

    this.create      = create;
    this.destroy     = destroy;
    this.position    = position;
    this.show        = show;
    this.bindTrigger = bindTrigger;
    this.hide        = hide;
    var $window      = angular.element(window);

    //////////////////////////////////

    function create(data){
        /***********************
        This is used to initialse the popup element

        data: {
            template : 'Template String - <div></div>',
            hover    : true || false - will enabled hover binds
            scope    : angular scope
        }
        **********************/
        var popupEl = angular.element('<div class="popup" ng-show="showPopup"><div class="popup-arrow"></div><div class="popup-content">'+(data.template || '')+'</div></div>')
        angular.element(document.body).append(popupEl);
        $compile(popupEl)(data.scope);
        return popupEl;
    }
    function bindTrigger(data, triggerToBind){

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
        if(data.trigger == 'hover'){
            var delayOpen  = data.delayOpen || 400;
            var delayClose = 50;

            if(triggerToBind == 'target'){
                bindOpenTrigger (data.targetEl, data.scope, delayOpen,  data.showFn);
                bindCloseTrigger(data.targetEl, data.scope, delayClose, data.hideFn);
            }
            else if (triggerToBind == 'popup'){
                bindOpenTrigger (data.popupEl,  data.scope, delayOpen,  data.showFn);
                bindCloseTrigger(data.popupEl,  data.scope, delayClose, data.hideFn);
            }
            else{
                bindOpenTrigger (data.targetEl, data.scope, delayOpen,  data.showFn);
                bindOpenTrigger (data.popupEl,  data.scope, delayOpen,  data.showFn);
                bindCloseTrigger(data.targetEl, data.scope, delayClose, data.hideFn);
                bindCloseTrigger(data.popupEl,  data.scope, delayClose, data.hideFn);
            }


            $rootScope.$on('$stateChangeSuccess', function () {
                $timeout.cancel(data.scope.popupShowTimeout);      // Cancel the show
                if(data.popupEl){
                    data.scope.showPopup = false;
                }
            })

        }
    }
    function destroy(popupEl){
        if(popupEl){
            popupEl.remove();
        }
    }
    function position(data){
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

        positionArrow(data)

        var targetBoundingRect = data.targetEl.getBoundingClientRect();
        var targetBottom       = targetBoundingRect.bottom;
        var targetLeft         = targetBoundingRect.left;
        var targetWidth        = targetBoundingRect.width;
        var targetHeight       = targetBoundingRect.height;
        var middleBoundary     = (targetBoundingRect.left + targetBoundingRect.right) / 2;
        var pageXOffset        = window.pageXOffset;           // Window scrollbar x direction
        var pageYOffset        = window.pageYOffset;           // Window scrollbar y direction
        var windowWidth        = window.innerWidth;            // Width of the window
        var popupWidth         = data.popupEl[0].offsetWidth;  // Width of the popup
        var popupHeight        = data.popupEl.outerHeight(true); // Height of the popup

        var left, top;

        if(data.side == 'bottom' || data.side == 'top'){
            if(data.type == 'start'){
                left = pageXOffset + targetLeft;
            }
            else if(data.type == 'end'){
                left = pageXOffset + targetLeft + targetWidth - popupWidth;
            }
            else if(data.type == 'center'){
                left = pageXOffset + targetLeft + targetWidth/2 - popupWidth/2;
            }
        }
        else if(data.side == 'right' || data.side == 'left'){
            if(data.type == 'start'){
                top = pageYOffset + targetBottom - targetHeight;
            }
            else if(data.type == 'end'){
                top = pageYOffset + targetBottom;
            }
            else if(data.type == 'center'){
                top = pageYOffset + targetBottom - targetHeight/2 - popupHeight/2;
            }
        }
        // Side positions
        if(data.side == 'right'){
            left = pageXOffset + targetLeft + targetWidth;
        }
        else if(data.side == 'left'){
            left = pageXOffset + targetLeft;
        }
        else if(data.side == 'bottom'){
            top  = pageYOffset + targetBottom;
        }
        else if(data.side == 'top'){
            top  = pageYOffset + targetBottom - targetHeight - popupHeight;
        }


        // If crash: right||left and we have side: right||left, change to side: top
        if(data.side == 'left' || data.side == 'right'){
            if(left+popupWidth >= windowWidth || left <= 0){ // If crash right || left
                // Set side to bottom
                data.side = 'bottom';
                data.arrow = false;
                data.padding = '';
                service.position(data);
                return // Recalc position
            }
        }
        else{
            // Lock the popup to the left/right if side: bottom || top
            if(left+popupWidth >= windowWidth){ // If crash right
                left = windowWidth - popupWidth - lockPadding;
                positionArrow(data, true); //reposition arrow after crash
            }
            else if(left<=0){ // If crash left
                left = lockPadding;
                positionArrow(data, true); //reposition arrow after crash
            }
        }

        data.popupEl.css({
            'top'     : top  + 'px',
            'left'    : left + 'px',
            'margin'  : data.padding
        });
    }

    function positionArrow(data, crashed){
        /***********************
        data: {
            popupEl  : element
            side     : left || right || bottom || top
            type     : start || end || center
            arrow    : true || false
        }
        **********************/

        var left, right, top, bottom, arrowCss = {}, popupCss = {}
        var width = 10;
        var widthPx = '-5px';
        var marginPx = '7px';
        var arrowEl = angular.element(data.popupEl[0].querySelector('.popup-arrow'));

        // If data is not enabled
        if(data.arrow && !crashed){
            if(data.side == 'bottom' || data.side == 'top'){
                if(data.type == 'start'){
                    arrowCss.left = '2px';
                }
                else if(data.type == 'end'){
                    arrowCss.right = '2px'
                }
                else if(data.type == 'center'){
                    arrowCss.left = '50%';
                    arrowCss['margin-left'] = -width/2+'px'
                }
            }
            else if(data.side == 'right' || data.side == 'left'){
                if(data.type == 'start'){
                    arrowCss.top = '2px';
                }
                else if(data.type == 'end'){
                    arrowCss.bottom = '2px'
                }
                else if(data.type == 'center'){
                    arrowCss.top = '50%';
                    arrowCss['margin-top'] = -width/2+'px'
                }
            }

            // Normalise any remaining margin styles (these are left over if we crash and change side)
            popupCss['margin-top']    = '0px';
            popupCss['margin-right']  = '0px';
            popupCss['margin-bottom'] = '0px';
            popupCss['margin-left']   = '0px';

            // Side positions
            if(data.side == 'right'){
                arrowCss.left = widthPx;
                popupCss['margin-left'] = marginPx;
            }
            else if(data.side == 'left'){
                arrowCss.right = widthPx;
                popupCss['margin-right'] = marginPx;
            }
            else if(data.side == 'bottom'){
                arrowCss.top  = widthPx;
                popupCss['margin-top'] = marginPx;
            }
            else if(data.side == 'top'){
                arrowCss.bottom = widthPx;
                popupCss['margin-bottom'] = marginPx
            }
        }
        else if(crashed){
            // If we have crashed
            var targetBoundingRect = data.targetEl.getBoundingClientRect();
            var targetCenterFromRight = window.innerWidth - (targetBoundingRect.left + targetBoundingRect.width/2);
            arrowCss.right = targetCenterFromRight - 15;
            arrowCss.left = 'auto';
        }
        else{
            arrowCss.opacity = 0;
        }
        arrowEl.css(arrowCss);
        data.popupEl.css(popupCss);

    }


    function show(scope){
        if(!scope.popupCloseClick){getCloseClick(scope)};
        $window.off('mousedown', scope.popupCloseClick);
        $window.on('mousedown',  scope.popupCloseClick);
        scope.showPopup = true;
    }

    function hide(scope){
        $window.off('mousedown', scope.popupCloseClick);
        scope.showPopup = false;
    }

    function getCloseClick(scope){
        scope.popupCloseClick = function(event){
            var element = event.target;
            if(angular.element(element).hasClass('popup')){
                return
            }
            else{
                var editorSectionElement = angular.element(element).parents('.popup')[0];
                if(!editorSectionElement){
                    hide(scope);
                }
                else{
                    return
                }
            }
        }
    }

    function bindOpenTrigger(element, scope, delayOpen, triggerFn){
        // Delay the open
        element.bind('mouseenter', function(){
            $timeout.cancel(scope.popupHideTimeout); // Cancel the hide
            scope.popupShowTimeout = $timeout(function(){
                triggerFn()
            }, delayOpen);
        })
    }

    function bindCloseTrigger(element, scope, delayClose, triggerFn){
        // Cancel the Show Timeout of the mouse leaves the hover area
        element.bind('mouseleave', function(){
            $timeout.cancel(scope.popupShowTimeout);  // Cancel the show
            scope.popupHideTimeout = $timeout(function(){
                triggerFn()
            }, delayClose);
        })
    }

})
