angular.module('views.preview-github')
.controller('PreviewGithubViewCtrl', function ($scope, $stateParams) {
//    $scope.project   = project;
//    $scope.fileMeta  = fileMeta;
    console.log($stateParams.path);
    $scope.fileMeta = {};

    var nameSplit = $stateParams.path.split('/');
    var fileTypeSplit = $stateParams.path.split('.');

    $scope.fileMeta.fileType    = fileTypeSplit[fileTypeSplit.length - 1];
    $scope.fileMeta.name        = nameSplit[nameSplit.length - 1];
    $scope.fileMeta.downloadUrl = $stateParams.path;

    $scope.previewer = {
        enabled: true
    };
});
