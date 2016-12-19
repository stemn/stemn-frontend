angular.module('modules.lazy-loading', [
]);
angular.module('modules.lazy-loading').

directive('blurLoad', function ($timeout, $window, LazyLoadingService) {
    return {
        restrict: 'E',
		link: function(scope, element, attrs){
            var $body   = angular.element(document.body);
            var windowEl = angular.element($window);
            var scaleParam = attrs.bgSrc.split('?').length==1 ? '?scale=auto': '&scale=auto';

            var imgSmall = new Image();
            imgSmall.className  = "placeholder";
            imgSmall.src = attrs.bgSrc + scaleParam;
            element.append(imgSmall);
            setWidth();

            var imgLarge;
            windowEl.on('scroll', onScroll);
            scope.$on('$destroy', onDestroy);
            onScroll();

            //////////////////////////////////////////////////

            function onScroll() {
				if(LazyLoadingService.isElementInViewport(element[0])){
                    if(!imgLarge){
                        imgLarge = new Image();
                        imgLarge.className  = "large";
                        imgLarge.src = attrs.bgSrc;
                        element.append(imgLarge);
                        imgLarge.onload = function () {
                            imgLarge.className  = "large show";
                            windowEl.off('scroll', onScroll);
                        };
                    }
                }
            }

            function onDestroy() {
				windowEl.off('scroll', onScroll);
			}

            function setWidth(){
                if(attrs.bgWidth){
                    if(parseInt(attrs.bgWidth)<=parseInt(attrs.bgMaxWidth)){
                        angular.element(element).css({width: attrs.bgWidth+'px'})
                    }
                    else{
                        angular.element(element).css({'width': attrs.bgMaxWidth+'px'})
                    }
                }
                else if(attrs.bgWidth){
                     angular.element(element).css({width: attrs.bgMaxWidth+'px'})
                }
            }
   		}
    };
}).
directive('blurLoadBg', function ($timeout, $window, LazyLoadingService) {
    return {
        restrict: 'A',
		link: function(scope, element, attrs){
            var windowEl = angular.element($window);

            var scaleParam = attrs.bgSrc.split('?').length==1 ? '?scale=auto': '&scale=auto';
            element.addClass('blur-load-bg');
            var placeholder = element.clone();
            placeholder.css({'background-image':'url('+attrs.bgSrc + scaleParam});
            placeholder.addClass('placeholder');
            element.append(placeholder);


            var imgLarge;
            windowEl.on('scroll', onScroll);
            scope.$on('$destroy', onDestroy);
            onScroll();

            //////////////////////////////////////////////////

            function onScroll() {
				if(LazyLoadingService.isElementInViewport(element[0])){
                    if(!imgLarge){
                        imgLarge = new Image();
                        imgLarge.src = attrs.bgSrc;
                        imgLarge.onload = function () {
                            placeholder.css({'opacity' : '0'});
                            element.css({'background-image':'url('+attrs.bgSrc+')'});
                            windowEl.off('scroll', onScroll);
                            $timeout(function(){
                                placeholder.remove()
                            }, 3000)
                        };
                    }
                }
            }

            function onDestroy() {
				windowEl.off('scroll', onScroll);
			}

   		}
    };
}).

directive('imageOnLoad', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                scope.$apply(attrs.imageOnLoad);
            });
            element.bind('error', function(){
            });
        }
    };
}).

service('LazyLoadingService', function($document, $q, $window){
    var service = this;

    this.isElementInViewport = isElementInViewport; // function(element[0])
    this.load = load;
    this.registeredResources = {};

    ////////////////////////////

    function load(items) {
        var promiseArray = [];
        _.forEach(items, function(item){
            // If the src is not yet registered, register it
            if(!service.registeredResources[item.src]){
                var queryParamsIndex = item.src.indexOf('?');
                var srcSplit;
                if(queryParamsIndex > 0){
                    srcSplit = item.src.substring(0, item.src.indexOf('?')).split('.');
                }
                else{
                    srcSplit = item.src.split('.');
                }
                var fileType = item.type || srcSplit[srcSplit.length-1];
                if(fileType == 'js'){
                    promiseArray.push(loadScript(item.src, item.global))
                }
                else if(fileType == 'css'){
                    promiseArray.push(loadStyles(item.src))
                }
                else{
                    console.error('Unsupported file type');
                }
            }
            // Else, if it is not true, it is loading and the promise is assigned
            else if(service.registeredResources[item.src] !== true){
                promiseArray.push(service.registeredResources[item.src])
            }
        })
        return $q.all(promiseArray)
    }

    function loadStyles(srcUrl){
        var deferred = $q.defer();
        service.registeredResources[srcUrl] = deferred.promise;

        var callback = function() {
            service.registeredResources[srcUrl] = true;
            deferred.resolve('Styles Loaded');
        }
        var linkTag = $document[0].createElement('link');
        linkTag.href = srcUrl;
        linkTag.rel = 'stylesheet';
        linkTag.type = 'text/css';
        linkTag.onreadystatechange = function() {
            if (this.readyState == 'complete') {
                callback();
            }
        }
        linkTag.onload = callback;
        $document[0].getElementsByTagName('head')[0].appendChild(linkTag);
        return deferred.promise;
    }

    function loadScript(srcUrl, globalName){
        var deferred = $q.defer();
        service.registeredResources[srcUrl] = deferred.promise;

        var callback = function() {
            service.registeredResources[srcUrl] = true;
            if($window[globalName]){
                deferred.resolve($window[globalName]);
            }
            else{
                deferred.resolve('Js Loaded');
            }
        }
        var scriptTag = $document[0].createElement('script');
        scriptTag.type  = "text/javascript";
        scriptTag.async = true;
        scriptTag.src   = srcUrl;
        scriptTag.onreadystatechange = function() {
            if (this.readyState == 'complete') {
                callback();
            }
        }
        scriptTag.onload = callback;
        $document[0].getElementsByTagName('body')[0].appendChild(scriptTag);
        return deferred.promise;
    }

    function isElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight)
        )
    }

})
