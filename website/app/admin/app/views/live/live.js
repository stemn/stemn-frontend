angular.module('views.live', []);
angular.module('views.live').

config(function ($stateProvider) {
    $stateProvider.state('app.live', {
        url: "/live",
        templateUrl: "app/views/live/live.html",
        controller: 'LiveViewCtrl'
    });
}).

controller('LiveViewCtrl', function ($scope, LogService, CoreService) {
    $scope.getLogs = getLogs; //function()
    $scope.page = 1;

    $scope.filter = {
        events : [{
            name   : 'thread-create',
            status : true
        },{
            name   : 'project-create',
            status : true
        },{
            name   : 'organisation-create',
            status : true
        },{
            name   : 'post-create',
            status : true
        },{
            name   : 'comment-create',
            status : true
        }],
        noFakes    : {
            name   : 'Filter Fake Accounts',
            status : true,
        },
    }

    $scope.$watch('filter', function(){
        getLogs(1)
    }, true)



    ///////////////////////////////////////////////////////////

    function getEventsArray(eventsObject){
        var eventsArray = [];
        _.forEach(eventsObject, function(event){
            if(event.status){
                eventsArray.push(event.name)
            }
        })
        return eventsArray;
    }

    var size = 30;
    function getLogs(page){
        $scope.loading = true;
        LogService.getLogs({
            fields : {
                event : { $in : getEventsArray($scope.filter.events) }
            },
            exists : {
                event : true
            },
            select : 'parentType parentId entityType entityId event requestUser timestamp',
            page : page,
            size : 30
        }).then(function(logs) {
            if(page == 1){$scope.logs = []}
            if(logs.length == size){
                $scope.loading = false;
                $scope.page ++
            }
            // Filter to remove fakes
            if($scope.filter.noFakes.status){
                logs = _.filter(logs, function(log) {
                    return CoreService.isFakeUser(log.requestUser)
                });
            }
            // Apply to scope
            $scope.logs = $scope.logs.concat(logs);

        });
    }
});
