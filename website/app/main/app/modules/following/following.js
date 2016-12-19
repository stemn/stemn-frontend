angular.module('modules.following', []);
angular.module('modules.following').

directive('followingDetailed', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/following/tpls/following-detailed.html',
        scope: {
            type   : '@', // field || organisation || project || user || thread
            userId : '@',
            size   : '@',
            hideMore : '@',    // true || false
            moreFn   : '=?',   // more function that can be called from the parent
            showDivider : '=?' // true || false (default) - when true, the title divider will be shown
        },
        controller: function(FollowService, Authentication, $scope, HttpQuery){
            $scope.page = 0;
            $scope.size   = $scope.size || 20;
            $scope.userId = $scope.userId || Authentication.currentUser._id;
            $scope.showEdit = $scope.userId == Authentication.currentUser._id;
            $scope.typeInfo = getTypeDetails($scope.type);

            $scope.query = HttpQuery({
                url   : 'api/v1/users/'+$scope.userId+'/following',
                params: {
                    type : $scope.type,
                    page : $scope.page,
                    size : $scope.size,
                },
                requerySize : 20
            });
            $scope.query.results = [{loading: true},{loading: true},{loading: true}];
            $scope.query.more();

            //////////////////////////////////////////

            function getTypeDetails(type){
                var details = {
                    field : {
                        typeTitle  : 'Fields',
                        followSome : 'app.browse.fields'
                    },
                    organisation : {
                        typeTitle  : 'Organisations',
                        followSome : 'app.browse.organisations'
                    },
                    project : {
                        typeTitle  : 'Projects',
                        followSome : 'app.browse.projects'
                    },
                    user : {
                        typeTitle  : 'Users',
                        followSome : 'app.browse.users'
                    },
                    thread : {
                        typeTitle  : 'Threads',
                        followSome : 'app.browse.threads'
                    },
                }
                return details[type]
            }
        }
    };
});
