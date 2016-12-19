angular.module('views.thread.edit', [
]);
angular.module('views.thread.edit').

config(function ($stateProvider) {
    $stateProvider.
    state('app.thread.edit', {
        url: '/edit',
        resolve: {
            userPermissions: function(userdata, thread, PermissionsService, $stateParams){
                return PermissionsService.permissionRedirect({
                    userdata : userdata,
                    entity   : thread,
                    level    : 'collaborator',
                    secret   : $stateParams.secret
                })
            },
        },
        templateUrl: 'app/views/thread/thread-edit/tpls/thread-edit.html',
        controller: function(thread, userPermissions, $scope, HighlightElement, ThreadLabelService){
            $scope.userPermissions = userPermissions;
            $scope.labels = ThreadLabelService.labels;
        },

        seo: function(resolve){
            return {
                title       : 'Edit - ' + resolve.thread.name + ' - STEMN',
            }
        },
        layout: {
//            bgColor : 'rgba(0, 0, 0, 0.)',
        }
    });
})

