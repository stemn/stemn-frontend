angular.module('views.preview', [
])

angular.module('views.preview').
config(function($stateProvider){
    $stateProvider.state('app.preview', {
        url: '/preview/:projectStub/:pathRev?children',
        templateUrl: 'app/views/preview/preview.tpl.html',
        controller: 'PreviewViewCtrl',
        data: {
            pageTitle: 'Preview',
            viewClass: 'preview'
        },
        resolve: {
            project: function($stateParams, $http){
                return $http({
                    method: 'GET',
                    url: 'api/v1/projects/' + $stateParams.projectStub,
                    params:{
                        select : ['stub', 'name', 'picture', 'blurb', 'permissions', 'team']
                    }
                }).then(function(response){
                    return response.data
                })
            },
            fileMeta: function (SyncService, SyncUtilService, $stateParams, SyncUrlService) {
                var parsedChildren = SyncUrlService.parseChildren($stateParams.children);
                var parsedPath     = SyncUrlService.parsePath($stateParams.pathRev);
                return SyncService.metadataVirtual($stateParams.projectStub, parsedPath, parsedChildren)
            },
        },
    });
});
