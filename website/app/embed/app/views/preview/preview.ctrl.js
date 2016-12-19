angular.module('views.preview')
.controller('PreviewViewCtrl', function (project, fileMeta, $scope) {
    $scope.project   = project;
    $scope.fileMeta  = fileMeta;
    $scope.previewer = {
        enabled: true
    };
});
