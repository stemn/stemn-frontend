angular.module('modules.sync.file-select', [
]);
angular.module('modules.sync.file-select').

directive('syncFileSelect', function (RecursionHelper) {
    return {
        restrict: 'E',
        scope:{
            path: '=',
            project: '=',
            provider: '=',
            selected: '=',
        },
        templateUrl: 'app/modules/sync/sync-file-select/tpls/sync-file-select.html',
        controller: function ($scope, SyncUtilService, SyncService, $stateParams) {
            $scope.select = select; //function(item)
            $scope.selected = $scope.selected || {};

            list($scope.path);
            ///////////////////////////

            function getCrumbs(){
                // Get breadcrumbs
                if($scope.provider == 'drive'){
                    SyncService.getPath($scope.path, $scope.project.stub).then(function(response){
                        $scope.breadCrumbs = response
                    })
                }
                else{
                    $scope.breadCrumbs = SyncUtilService.getCrumbs($scope.path);
                }
            }

            function list(path){
                $scope.path = path || '';
                $scope.selected = {};
                getCrumbs();
                $scope.loading = true;
                SyncService.list($scope.project.stub, $scope.path).then(function(response){
                    $scope.files = response.data.entries;
                    $scope.loading = false;
                })
            }
            function select(item){
                if(item['.tag'] == 'folder'){
                    list(item.path)
                }
                else{
                    $scope.selected = item;
                }

            }
        }
    };
}).

service('SyncFileSelectService', function ($mdDialog) {
    this.select = select; //function()

    /////////////////////////////////////

    function select(event, data){
        /************************************************
        data = {
            provider: 'dropbox' || 'drive',
            project: project,
            path: startin path
        }
        ************************************************/
        return $mdDialog.show({
            templateUrl: 'app/modules/sync/sync-file-select/tpls/sync-file-select-modal.html',
            controller: function($scope, $mdDialog, CoreLibrary){
                $scope.project  = data.project;
                $scope.provider = data.provider;
                $scope.path     = data.path;
                $scope.selected = {};
                $scope.cancel   = $mdDialog.cancel; // function()
                $scope.save = function(){
                    $mdDialog.hide($scope.selected)
                }
            },
            targetEvent: event
        })
    }
});
