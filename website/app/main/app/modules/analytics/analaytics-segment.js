angular.module('modules.analytics.segment', [
]);
angular.module('modules.analytics.segment').


directive('analyticsTrack', function (SegmentAnalytics, $state) {
    return {
        restrict: 'A',
        link : function(scope, element, attrs){
            element.bind('click', function (event) {
                SegmentAnalytics.track(attrs.analyticsTrack, {
                    category: $state.current.name || undefined,
                    label: attrs.analyticsLabel || undefined
                });
            });
        }
    }
}).

service('SegmentAnalytics', function ($state) {
    this.track = function(data, attrs){
        if(window.analytics && window.analytics.track){
            analytics.track(data, attrs)
        }
        else{
            console.error('Analytics Blocked')
        }
    }
}).

service('FacebookAnalytics', function ($state) {
    this.track = function(event){
        if(window.fbq){
            window.fbq('track', event);
        }
        else{
            console.error('Analytics Blocked')
        }
    }
}).

service('TwitterAnalytics', function () {
    this.trackSignup = function(){
        if(window.twttr && window.twttr.conversion && window.twttr.conversion.trackPid){
            window.twttr.conversion.trackPid('nuo3n', { tw_sale_amount: 0, tw_order_quantity: 0 });
        }
        else{
            console.error('Analytics Blocked')
        }
    }
});
