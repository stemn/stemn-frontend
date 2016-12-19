angular.module('modules.states', [
]);

angular.module('modules.states').

service('StatesService', function($q){
    this.get = function(state){
        // Return state info in the same format as the other APIs
        var states = {
            name : state,
            type : 'state',
            stub : state
        };
        return $q.when(states)
    }
}).

directive('nestedView', function (CoreService, RecursionHelper, $http) {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/states/nested-view.html',
        scope: {
            data: '=',
            evaluate: '=', // true || false - if true we initiate the call
            groupByParams: '=' // true || false - if true we initiate the call
        },
        compile: function(element) {
            // Use the compile function from the RecursionHelper,
            // And return the linking function(s) which it returns
            return RecursionHelper.compile(element);
        },
        controller: function($scope){
            $scope.toggleShowChildren = toggleShowChildren;
            $scope.page = 1;

            if($scope.evaluate){
                $scope.toggleShowChildren();
            }
            ///////////////////////////////////

            function toggleShowChildren(){
                var size = 20;
                $scope.data.showChildren = !$scope.data.showChildren;
                $http({
                    url: '/api/v1/analytics/nextAppState',
                    method: "GET",
                    params: {
                        state         : $scope.data.name,
                        size          : $scope.page * size,
                        groupByParams : $scope.groupByParams,
                    }
                }).then(function(response){
                    _.forEach(response.data.children, function(child){
                        // Add percentage
                        child.percentage = (child.number/response.data.total*100).toFixed(2);
                    })
                    $scope.page ++
                    _.extend($scope.data, response.data);
                })
            }
        }
    };
}).


factory('RecursionHelper', function($compile){
    return {
        /**
         * Manually compiles the element, fixing the recursion loop.
         * @param element
         * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
         * @returns An object containing the linking functions.
         */
        compile: function(element, link){
            // Normalize the link parameter
            if(angular.isFunction(link)){
                link = { post: link };
            }

            // Break the recursion loop by removing the contents
            var contents = element.contents().remove();
            var compiledContents;
            return {
                pre: (link && link.pre) ? link.pre : null,
                /**
                 * Compiles and re-adds the contents
                 */
                post: function(scope, element){
                    // Compile the contents
                    if(!compiledContents){
                        compiledContents = $compile(contents);
                    }
                    // Re-add the compiled contents to the element
                    compiledContents(scope, function(clone){
                        element.append(clone);
                    });

                    // Call the post-linking function, if any
                    if(link && link.post){
                        link.post.apply(null, arguments);
                    }
                }
            };
        }
    };
});
