angular.module('modules.analytics', [
    'modules.idle',
    'modules.location',
    'modules.analytics.segment'
]);
angular.module('modules.analytics').

run(function ($rootScope, AnalyticsService, $interval, $localStorage, $timeout, IdleService) {
    var numStates = 0;
    var refresh   = false;
    var timeAtLoad = new Date().getTime();

    // If we were in the site in the last minute this is a refresh
    if(timeAtLoad - $localStorage.lastOpenTime <= (60*1000)){
        refresh = true;
    }

    // Save the lastOpenTime to local storage every 5 seconds
    $interval(function(){
        $localStorage.lastOpenTime = new Date().getTime();
    }, 5000)

    $rootScope.$on('$stateChangeSuccess', sendStateChangeEvents);
    window.onbeforeunload = closingCode;

    $rootScope.$on('Idle.active', function() {
        AnalyticsService.sendEvent({
            eventType  : 'state-active',
        })
    });

    $rootScope.$on('Idle.inactive', function() {
        AnalyticsService.sendEvent({
            eventType  : 'state-inactive',
        })
    });

    ///////////////////////////////////////////////////////

    function closingCode(){
        AnalyticsService.sendEvent({
            eventType  : 'state-close',
        })
       return null;
    }

    function sendStateChangeEvents(event, toState, toParams, fromState, fromParams){
        if(numStates === 0 && !refresh){
            var data = {
                eventType  : 'state-initialise',
                state      : toState.name,
                params     : toParams,
                url        : window.location.pathname,
            }
            // Timeout for 2s so page can fully load
            $timeout(function(){
                AnalyticsService.getMetaInfo().then(function(meta){
                    _.assign(data, meta)
                    AnalyticsService.sendEvent(data)
                })
            },2000)
        }
        else if (numStates === 0 && refresh){
            AnalyticsService.sendEvent({
                eventType  : 'state-refresh',
                state      : toState.name,
                params     : toParams,
                url        : window.location.pathname,
            })
        }
        else{
            AnalyticsService.sendEvent({
                eventType  : 'state-change',
                state      : toState.name,
                params     : toParams,
                url        : window.location.pathname,
            })
        }
        numStates++
    }
}).

service('AnalyticsService', function (CoreLibrary, FunctionLibrary, $localStorage, $http, $q, LocationService) {
    var service = this;

    this.sendEvent      = sendEvent;
    this.getMetaInfo    = getMetaInfo;

    ///////////////////////////////////////////////
    var metaInfo;
    var previousEventId;

    function getMetaInfo(){
        var deferred = $q.defer();
        // If we already have calculated the meta info
        if(metaInfo){
            deferred.resolve(metaInfo)
        }
        else{
            var data = {
                referrer   : document.referrer.split('/')[2],
                resolution : getScreenSize(),
                userAgent  : navigator.userAgent
            }
            LocationService.getLocation().then(function (location) {
                data.location = location;
                metaInfo = data; // Save to service memory
                deferred.resolve(data);
            }).catch(function(err){
                metaInfo = data; // Save to service memory
                deferred.resolve(data);
            })
        }
        return deferred.promise;
    }

    function sendEvent(data){
        var newEventId  = CoreLibrary.getUuid();
        var prevEventId = previousEventId;
        previousEventId = newEventId; // Save the id in memory for the next request
        if(!FunctionLibrary.isCrawler()){
            return $http.post('/api/v1/events', {
                deviceId        : getDeviceId(),                          // objectId
                eventId         : newEventId,                             // objectId
                previousEventId : prevEventId,                            // objectId
                eventType       : data.eventType,                         // string
                url             : data.url,                               // string
                state           : data.state,                             // string
                params          : CoreLibrary.compactObject(data.params), // {stub: ?}
                referrer        : data.referrer,                          // string
                resolution      : data.resolution,                        // {width: ?, height: ?},
                userAgent       : data.userAgent                          // string
            })
        }
    }
    function getDeviceId(){
        // Set User Uuid if it does not exist
        if(!$localStorage.deviceId || !CoreLibrary.isObjectId($localStorage.deviceId)){
            $localStorage.deviceId = CoreLibrary.getUuid();
        }
        return $localStorage.deviceId
    }

    function getScreenSize(){
        var
        w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0];
        return {
            width  : w.innerWidth || e.clientWidth || g.clientWidth,
            height : w.innerHeight|| e.clientHeight|| g.clientHeight,
        }
    }
});
