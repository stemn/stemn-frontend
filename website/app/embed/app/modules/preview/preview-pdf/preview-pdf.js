angular.module('modules.preview.pdf', []);

angular.module('modules.preview.pdf').
directive('previewPdf', function ($window) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            fileUrl : '@',
        },
        templateUrl: 'app/modules/preview/preview-pdf/tpls/preview-pdf.html',
        controller: function($scope){
            $scope.loading = true;
            window.pdfLoadCompleteCallback = function(){
                $scope.loading = false;
                $scope.$apply();
            }
        }
    };
});
