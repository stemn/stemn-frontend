angular.module('modules.logs', [
]);

angular.module('modules.logs').

service('LogService', function (Restangular, $http) {
	this.getLogs = function (criteria) {
        return $http({
            url: "api/v1/logs",
            method: "GET",
            params: criteria
        })
	}
    this.getStateHistory = function (params) {
        return $http({
            url: "api/v1/analytics/stateHistory",
            method: "GET",
            params: params
        })
    }
}).

directive('displayLogs', function (CoreService) {
    return {
        restrict: 'E',
        scope: {
            entityId   : '@',
        },
        templateUrl: 'app/modules/logs/tpls/display-logs.html',
        controller: function ($scope, LogService, $http, CoreLibrary) {
            var page = 1;
            $scope.logs = [];
            $scope.getLogs = getLogs;
            $scope.getLogs(); // Initialise


            /////////////////////////////////

            function getLogs(){
                if(!$scope.noMoreResults){
                    $scope.loading = true;
                    LogService.getLogs({
                        fields : {
                            requestUser : $scope.entityId,
                            event : { $nin : ['get-notifications', 'feed-all', 'search'] }
                        },
                        exists : {
                            event : true
                        },
                        select : ['parentType', 'parentId', 'entityType', 'entityId', 'event', 'requestUser'],
                        page : page,
                        size : 10
                    }).then(function(logs) {
                        logs = logs.data;
                        if (logs.length === 0){$scope.noMoreResults = true;}
                        $scope.logs = $scope.logs.concat(logs);
                        $scope.loading = false;
                        page++;
                    });
                }
            }
		}
    };
}).

directive('displayStateHistory', function (CoreService) {
    return {
        restrict: 'E',
        scope: {
            entityId   : '@',
        },
        templateUrl: 'app/modules/logs/tpls/display-state-history.html',
        controller: function ($scope, LogService, $http, CoreLibrary) {
            var currrentTime = new Date().getTime();
            var page = 1;
            $scope.logs = [];
            $scope.getLogs = getLogs;
            $scope.getLogs(); // Initialise


            /////////////////////////////////
            function getLogs(){
                if(!$scope.noMoreResults){
                    $scope.loading = true;
                    LogService.getStateHistory({
                        user : $scope.entityId,
                        page : page,
                        size : 10
                    }).then(function(response) {
                        // Add the date by decoding the id
                        _.forEach(response.data, function(log){
                            log.date = CoreLibrary.getDateFromId(log._id);
                        })
                        if (response.data.length === 0){$scope.noMoreResults = true;}
                        $scope.logs = $scope.logs.concat(response.data);
                        $scope.loading = false;
                        page++;
                    });
                }
            }
		}
    };
});
