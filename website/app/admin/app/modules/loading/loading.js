angular.module('modules.loading', [
]);
angular.module('modules.loading').

directive('loadingOverlay', function () {
    return {
        restrict : 'E',
        replace  : true,
        transclude: true,
		scope    : {
			determinate : '=?', // value || if no value we assume indeterminate
		},
        template :
        '<div class="loading-overlay" layout="column" layout-align="center center">'+
            '<md-progress-circular style="margin: 5px 0;" ng-if="!determinate" class="md-accent" md-mode="indeterminate"></md-progress-circular>'+
            '<md-progress-circular style="margin: 5px 0;" ng-if="determinate"  class="md-accent" md-mode="determinate" value="{{determinate}}"></md-progress-circular>'+
            '<div class="text-lightgrey" ng-transclude></div>'+
        '</div>'
    };
});
