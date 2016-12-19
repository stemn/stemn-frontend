angular.module('modules.preview.code', []);
angular.module('modules.preview.code').
directive('previewCode', function ($window) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            project   : '=',
            fileMeta  : '=',
            previewer : '=?',
        },
        controller : function($scope, CodeMirrorService, LazyLoadingService, SyncService){

            $scope.previewer.render = initPreview;
            initPreview();

            ////////////////////////
            function initPreview(){
                $scope.loading = true;
                SyncService.download($scope.fileMeta.downloadUrl).then(function(response){
                    $scope.loading = false;
                    $scope.previewer.fileData = response.data;
                })
                $scope.optionsView = {
                    indentWithTabs: true,
                    readOnly: true,
                    dragDrop: false,
                    lineWrapping: true,
                    lineNumbers: true,
                    onLoad: function(cmEditor){
                        $scope.cmEditor = cmEditor;
                        var modeName = window.CodeMirror.findModeByFileName($scope.fileMeta.name).mode;
                        CodeMirrorService.changeCodeMode(cmEditor, modeName);
                    }
                };
                $scope.optionsEdit = {
                    indentWithTabs: true,
                    readOnly: false,
                    dragDrop: false,
                    lineWrapping: true,
                    lineNumbers: true,
                    onLoad: function(cmEditor){
                        $scope.cmEditor = cmEditor;
                        var modeName = window.CodeMirror.findModeByFileName($scope.fileMeta.name).mode;
                        CodeMirrorService.changeCodeMode(cmEditor, modeName);
                    }
                };
            }


        },
        templateUrl: 'app/modules/preview/preview-code/tpls/preview-code.html',
    };
});
