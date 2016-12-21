angular.module('modules.preview.files', []);
angular.module('modules.preview.files').
directive('previewFiles', function ($window) {
    return {
        restrict: 'E',
        scope: {
            project    : '=',
            viewerType : '=',
            fileMeta   : '=',
            previewer  : '=?',
        },
        controller : function($scope, SyncUtilService){
            $scope.previewer = $scope.previewer || {};
            $scope.previewer.type   = SyncUtilService.getViewerType($scope.fileMeta.fileType, $scope.fileMeta.provider);

            $scope.hostDomain   = window.location.hostname;
        },
        template: require('./tpls/preview-files.html'),
    };
});
