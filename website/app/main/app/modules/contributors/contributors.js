angular.module('modules.contributors', [
]);
angular.module('modules.contributors').

directive('contributors', function () {
    return {
        restrict: 'E',
        scope: {
            parentType : '@', // organisation
            parentId   : '@',
        },
        controller: function($scope, ContributorsService){
            $scope.more = more; //function()
            $scope.results = [];

            //////////////////////////////////////

            var page = 1, size = 15;
            function more(){
                ContributorsService.getContributors({
                    parentType : $scope.parentType,
                    parentId   : $scope.parentId,
                    page       : page,
                    size       : size,
                }).then(function(results){
                    $scope.results =  _.uniq($scope.results.concat(results.data))
                    if(results.data < size){
                        $scope.loading = true;
                        $scope.noMoreResults = true;
                    }
                    else{
                        page ++
                        $scope.loading = false;
                    }
                })
            }
        },
        templateUrl: 'app/modules/contributors/tpls/contributors.html'
    };
}).
service('ContributorsService', function ($http) {
    this.getContributors = getContributors;

    //////////////////////////////////////

    function getContributors(data){
        return $http({
            url: 'api/v1/contributors',
            method: "GET",
            params: {
                parentType : data.parentType,
                parentId   : data.parentId,
                page       : data.page,
                size       : data.size,
            }
         });
    }
});
