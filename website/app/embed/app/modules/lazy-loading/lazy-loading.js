angular.module('modules.lazy-loading', [
]);
angular.module('modules.lazy-loading').

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
    this.load                = load;
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

})
