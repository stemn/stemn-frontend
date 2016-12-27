import './row-views.scss';

angular.module('modules.row-views', [
]);
angular.module('modules.row-views').

directive('userRow', function () {
    return {
        restrict: 'E',
        scope: {
            itemId   : '@?',
            data     : '=?',
            showEdit : '=?',
            deleteFn : '&?'
        },
        controller: function($scope, UserService){
            if($scope.itemId){
                $scope.loading = true;
                UserService.getUser($scope.itemId, 'sm').then(function(result){
                    $scope.data = result;
                    $scope.loading = false;
                })
            }
        },
        template: require('./tpls/user-row.html')
    };
}).

directive('fieldRow', function () {
    return {
        restrict: 'E',
        scope: {
            data     : '=',
        },
        template: require('./tpls/field-row.html')
    };
}).

directive('organisationRow', function () {
    return {
        restrict: 'E',
        scope: {
            data     : '=',
            showEdit : '=?',
            showRole : '=?',
            deleteFn : '&?',
        },
        template: require('./tpls/organisation-row.html')
    };
}).


directive('rowView', function () {
    return {
        restrict: 'E',
        scope: {
            data     : '=',
        },
        template: require('./tpls/row-view.html'),
        controller : function($scope, EntityService, CoreLibrary){
            $scope.data = angular.copy($scope.data); // Clone the data so $scope.data.loading is not saved in the parent scope
            // Set avatar Type
            setAvatarType()

            // If no name, blurb and not already loading, get the entity
            if(!$scope.data.name && !$scope.data.blurb && !$scope.data.loading){
                $scope.data.loading = true;

                EntityService.get($scope.data.entityType, $scope.data._id, 'sm').then(function(response){
                    $scope.data = response;
                    $scope.data.loading = false;
                    setHref();
                });
            }
            else{
                setHref();
            }

            /////////////////////////////////////////

            function setHref(){
                $scope.data.href = CoreLibrary.getHref($scope.data.type || $scope.data.entityType, $scope.data.stub || $scope.data._id);
            }

            function setAvatarType(){
                if($scope.data.entityType == 'user'){
                    $scope.avatarType = 'avatar-circle';
                }
                else if($scope.data.entityType == 'organisation' || $scope.data.entityType == 'job'){
                    $scope.avatarType = 'avatar-square-contain';
                }
                else{
                    $scope.avatarType = 'avatar-square-cover';
                }
            }


        }
    };
}).

directive('loadingRow', function () {
    return {
        restrict: 'E',
        replace: true,
        template: require('./tpls/loading-row.html')
    };
});
