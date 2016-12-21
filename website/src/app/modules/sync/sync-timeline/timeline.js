import './timeline.scss';

angular.module('modules.sync.timeline', [
]);
angular.module('modules.sync.timeline').



directive('syncTimeline', function () {
    return {
        restrict: 'E',
        scope:{
            timeline: '='
        },
        templateUrl: 'app/modules/sync/sync-timeline/tpls/timeline.html',
        controller: function ($scope) {
            $scope.iconMap = {
                update : 'editor:mode_edit',
                create : 'content:add',
            }
        }
    };
});
