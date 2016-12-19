angular.module('modules.timeline', []);
angular.module('modules.timeline').

directive('timeline', function ($rootScope) {
    return {
        restrict: 'E',
        scope:{
            user: '@'
        },
        templateUrl : 'app/modules/timeline/tpls/timeline.html',
        controller : function ($scope, $http){
            $http({
                method: 'GET',
                url: 'api/v1/analytics/signupActionHistory',
                params: {
                    user: $scope.user
                }
            }).then(function(response){
                var data = response.data[0];
                var startTime = new Date(data.start).getTime();
                var endTime   = new Date(data.end).getTime();
                var duration  = endTime - startTime;

                $scope.items = _.map(data.entities, function(item){
                    var eventTime = new Date(item.created).getTime();
                    return {
                        _id        : item._id,
                        created    : item.created,
                        entityType : item.entityType,
                        xPosition  : ((eventTime - startTime) / duration ) * 100
                    }
                })
            })
        }
    };
});
