import './st-multi-select.scss';

angular.module('modules.st-multi-select', [
]);
angular.module('modules.st-multi-select').

directive('stSelectOption', function () {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            active: '=',
            ngModel: '=',
            value: '@?'
        },
        template: require('./tpls/st-select-option.html'),
        controller: function($scope){
            $scope.ngModel = $scope.ngModel || [];
            $scope.active  = $scope.ngModel.indexOf($scope.value) != -1;

            $scope.select = function(){
                var index = $scope.ngModel.indexOf($scope.value);
                $scope.active = !$scope.active;
                if(index == -1 && $scope.active){ // If it doesnt exist and it should, add it.
                    $scope.ngModel.push($scope.value)
                }
                else if(index != -1 && !$scope.active){ // If it shouldnt exist, remove it
                    $scope.ngModel.splice(index, 1)
                }
            }
        }
    };
});
