angular.module('modules.jobs', [
]);
angular.module('modules.jobs').

directive('jobRows', function () {
    return {
        restrict : 'E',
		scope    : {
			parentType : '@',
			parentId   : '@'
		},
        controller: function($scope, HttpQuery){
            $scope.query = HttpQuery({
                url: '/api/v1/search',
                params: {
                    type       : 'job',
                    size       : 20,
                    sort       : 'date',
                    order      : 'dsc',
                    parentType : $scope.parentType,
                    parentId   : $scope.parentId,
                    select: ['name', 'stub', 'numApplications']
                },
                onSuccess: function(results){
                    console.log(results);
                    return results
                }
            });

            $scope.query.more();
        },
        templateUrl: 'app/modules/jobs/tpls/job-rows.html'
    };
});
