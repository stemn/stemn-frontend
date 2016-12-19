
angular.module('modules.sync.list-widget', [
]);
angular.module('modules.sync.list-widget').


directive('syncListWidget', function () {
    return {
        restrict: 'E',
        scope: {
            project: '=',
            path: '@'
        },
        templateUrl: 'app/modules/sync/sync-list-widget/tpls/sync-list-widget.html',
        controller: function ($scope, SyncService, SyncUtilService) {
            $scope.loading = true;
            $scope.openFileFolder = SyncUtilService.openFileFolder; //function(path, projectStub, type)
            SyncService.list($scope.project.stub, $scope.path || '').then(function(response){
                $scope.loading = false;
                $scope.items = response.data.entries;
            })
//            SyncService.fileStats($scope.project.stub, $scope.path || '').then(function(response){
//                console.log(response);
//            })
        }
    };
});
