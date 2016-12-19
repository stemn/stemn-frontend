angular.module('modules.pagination', []);
angular.module('modules.pagination').

directive('loadMore', function () {
    return {
        restrict: 'E',
        replace : true,
        scope : {
            page    : '=?',
            loading : '=?', // true || false - Represents the state of loading
            loadFn  : '&?'
        },
        templateUrl: 'app/modules/pagination/tpls/load-more.html',
        controller: function($scope, $state){
            $scope.loading = false;
            $scope.loadMore = function(){
                $scope.loadFn()
            }
        }

    };
}).

directive('simplePagination', function () {
    return {
        restrict: 'E',
        replace : true,
        templateUrl: 'app/modules/pagination/tpls/simple-pagination.html',
        scope: {
            noMoreResults : '=?',
            page          : '=?',
        },
        controller: function($scope, $stateParams, $location){
            // Else we are using state params
            if (!$scope.page){
                $scope.page = $stateParams.page || 1;
            }
            $scope.prev = function(){
                $scope.page --
            }
            $scope.next = function(){
                $scope.page ++
            }
            $scope.nextPage = parseInt($scope.page) + 1;
            $scope.prevPage = parseInt($scope.page) - 1;
        }

    };
})
