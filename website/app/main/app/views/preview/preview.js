angular.module('views.preview', [
]);
angular.module('views.preview').

config(function ($stateProvider) {
    $stateProvider.
    state('app.preview', {
        url: '/preview/:projectStub/:path?edit&children',
        sticky: true,
        resolve: {
            project: function($stateParams, EntityService, $timeout, $state){
                return EntityService.get('project', $stateParams.projectStub, 'sm').
                catch(function(error){
                    $timeout(function(){
                        $state.go('app.404', null, {location: false});
                    })
                    return error
                })
            },
            previousState: function ($state) {
                return {
                    name: $state.current.name,
                    params: $state.params,
                };
            },
            fileMeta: function (SyncService, SyncUtilService, $stateParams, $q, SyncUrlService) {
                var parsedChildren = SyncUrlService.parseChildren($stateParams.children);
                var parsedPath     = SyncUrlService.parsePath($stateParams.path);
                return SyncService.metadataVirtual($stateParams.projectStub, parsedPath, parsedChildren)
            },
            userPermissions: function(userdata, project, PermissionsService, $stateParams){
                return PermissionsService.permissionRedirect({
                    userdata : userdata,
                    entity   : project,
                    level    : project.permissions.projectType == 'public' ? 'public' : 'viewer',
                    secret   : $stateParams.secret
                })
            },
        },
        templateUrl: 'app/views/preview/preview.html',
        controller: function (userPermissions, project, fileMeta, previousState, $scope, $state, $timeout, $stateParams, SyncService, SyncUtilService, $location, SyncUrlService, PreviewEmbedService) {

            $scope.userPermissions = userPermissions;
            $scope.path            = $stateParams.path;
            $scope.project         = project;
            $scope.fileMeta        = fileMeta;

            $scope.previewer = {};
            $scope.previewer.edit = ($scope.userPermissions.isMin('collaborator') && $stateParams.edit == 'true') ? true : false;

            // Functions
            $scope.closePreview   = closePreview; //function(path, projectStub, type);
            $scope.revisionChange = revisionChange; //function(revison);
            $scope.saveFile = saveFile; //function(revison);
            $scope.saveAndExit = saveAndExit; //function(revison);
            $scope.openFileFolder = SyncUtilService.openFileFolder; //function()
            $scope.compare = compare; //function(compareType)
            $scope.toggleLayer = toggleLayer; //function()
            $scope.embed = PreviewEmbedService.modal; //function(event, fileMeta)
            $scope.goFullscreen = function () {
                $scope.fullscreen = $scope.fullscreen || {};
                $scope.fullscreen.active = !$scope.fullscreen.active;
            }
            $scope.sidebar = {
                show: false
            }
            
            // Get breadcrumbs
            if($scope.fileMeta.provider == 'drive'){
                SyncService.getPath($scope.fileMeta.path, $scope.project.stub).then(function(response){
                    response.shift(0);
                    $scope.breadCrumbs = response
                    if($stateParams.children){
                        $scope.breadCrumbs.push({name: $scope.fileMeta.name})
                    }
                })
            }
            else{
                $scope.breadCrumbs = SyncUtilService.getCrumbs($scope.fileMeta.path);
                if($stateParams.children){
                    $scope.breadCrumbs.push({name: $scope.fileMeta.name})
                }
            }

            // Get revisions
            SyncService.revisionsDeep($scope.fileMeta).then(function(revisions){
                $scope.fileMeta = revisions;

                $scope.timeline = [];
                _.forEach($scope.fileMeta.revisions, function(revision, index){
                    if(revision.revDecimal == 1){
                        $scope.timeline.push({
                            event            : 'create',
                            timestamp        : revision.client_modified,
                            details          : {
                                name         : revision.name,
                                path         : revision.path,
                                parentProject: $scope.fileMeta.parentProject,
                                pathRev      : SyncUrlService.getPath(revision),
                                childrenRev  : SyncUrlService.getChildPath(revision.virtualChildren),
                                sharing_info : revision.sharing_info
                            }
                        })
                    }
                    else{
                        $scope.timeline.push({
                            event            : 'update',
                            timestamp        : revision.client_modified,
                            details          : {
                                rev          : revision.rev,
                                revDecimal   : revision.revDecimal,
                                path         : revision.path,
                                parentProject: $scope.fileMeta.parentProject,
                                pathRev      : SyncUrlService.getPath(revision),
                                childrenRev  : SyncUrlService.getChildPath(revision.virtualChildren),
                                sizeDiff     : $scope.fileMeta.revisions[index].size - $scope.fileMeta.revisions[index-1].size, // how many extra bytes
                                sharing_info : revision.sharing_info
                            }
                        })

                    }

                })
            })
            
            // Get virtual file parent
            if(SyncUtilService.isGerber($scope.fileMeta.fileType)){
                SyncService.list($stateParams.projectStub, $scope.fileMeta.parentFolder).then(function(response){
                    $scope.fileMeta.virtualParent = _.find(response.data.entries, function(item){
                        return _.find(item.virtualChildren, 'name', $scope.fileMeta.name)
                    })
                })
            }



//            $scope.tabs = [
//                {
//                    label: 'Timeline',
//                    clickFn: function(){
//                        $scope.activeTab = this.label;
//                    }
//                },
//                {
//                    label: 'Meta',
//                    clickFn: function(){
//                        $scope.activeTab = this.label;
//                    }
//                }
//            ];
//            $scope.activeTab = 'Timeline';

            //////////////////////////////////

            function toggleLayer(layer){
                $timeout(function(){
                    var matchingLayer = _.find($scope.previewer.instance.layers, 'name', layer.name);
                    if(matchingLayer){
                        matchingLayer.enabled = layer.enabled;
                        $scope.previewer.instance.repaint = 0;
                    }
                })
            }

            function compare(compareType){
                $state.go('app.compare', {
                    projectStub: $stateParams.projectStub,
                    path1: SyncUrlService.getPath($scope.fileMeta),
                    children1: SyncUrlService.getChildPath($scope.fileMeta.virtualChildren),
                    type: compareType
                })

            }

            function saveFile(){
                return SyncService.upload($scope.project.stub, $scope.fileMeta.path, {revision: $scope.fileMeta.rev}, $scope.previewer.fileData).then(function(response){
                    $scope.previewer.edit = false;
                    return response
                });
            }

            function saveAndExit(){
                $scope.savePending = true;
                return SyncService.upload($scope.project.stub, $scope.fileMeta.path, {revision: $scope.fileMeta.rev}, $scope.previewer.fileData).then(function(response){
                    closePreview()
                });
            }

            function revisionChange(revisionMeta){
                $scope.fileMeta = _.extend($scope.fileMeta, revisionMeta, true);
                var childPath = SyncUrlService.getChildPath($scope.fileMeta.virtualChildren);
                $state.go('app.preview', {
                    path: SyncUrlService.getPath($scope.fileMeta),
                    children: childPath
                });


                if($scope.previewer.render){
                    $timeout($scope.previewer.render);
                }
            }

            function closePreview(){
                if(previousState.name && previousState.params && previousState.name != 'app.preview' && previousState.name != 'app.compare'){
                    $state.go(previousState.name, previousState.params)
                }
                else{
                    $state.go('app.project.files', {
                        stub: project.stub,
                        path: $scope.fileMeta.parentFolder || ''
                    })
                }
            }
        },
        menu: {
            main : [],
            more : []
        },
        layout: {
            size: 'md',
            hideOverflow: true,
            topBanner: false,
            horizontalMenu: false,
            chat: false,
        },
        seo: function(resolve){
            return {
                title       : resolve.fileMeta.name + ' - ' + resolve.project.name,
            }
        }
    });
});
