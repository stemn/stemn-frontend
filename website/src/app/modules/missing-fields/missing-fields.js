import './missing-fields.scss';

angular.module('modules.missing-fields', [
]);
angular.module('modules.missing-fields').


directive('missingFields', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            entity         : '=', // The entity to inspect for missing fields
            requiredFields : '=',
            form           : '=?' // The form which form.$completed will be assigned when there are no missing fields
            /*****************************
                requiredFields : [
                    {
                        condition: function(entity){function that returns true}
                        title: 'There is no name. <a ng-click="field.click()">Click here to add a name.</a>'
                    }
                ]
            *****************************/
        },
        controller: function($scope){
            $scope.$watch(function(){
                if($scope.form){
                    $scope.form.$completed = !_.find($scope.requiredFields, 'missing');
                }

                _.forEach($scope.requiredFields, function(field){
                    field.missing = !field.condition($scope.entity)
                })
            })
        },
        template: require('./tpls/missing-fields.html'),
    };
});
