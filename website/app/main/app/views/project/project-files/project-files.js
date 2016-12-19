angular.module('views.project.files', [
]);
angular.module('views.project.files').

config(function ($stateProvider) {
    $stateProvider.
    state('app.project.files', {
        url: '/files/*path?query',
        templateUrl: 'app/views/project/project-files/tpls/project-files.html',
        layout: {
            size: 'md',
            bgColor: 'rgba(0, 0, 0, 0.03)'
        },
        resolve: {
            files: function(project, $stateParams, SyncService, $timeout, $state, SyncUtilService){
                if(project.remote.connected){
                    return SyncService.list($stateParams.stub, $stateParams.path)
                    .then(function(response){
                        // Add the preview Type
                        _.forEach(response.data.entries, function(item){
                            item.previewType = SyncUtilService.getViewerType(item.fileType, project.remote.provider);
                        })
                        return response
                    })
                    .catch(catchError)
                }
                else{
                    return []
                }

                ////////////////////////

                function catchError(error){
                     $timeout(function(){
                        $state.go('app.404', null, {location: false});
                    })
                    return error
                }
            },
            matches: function($stateParams, SyncService, $timeout, $state){
                if($stateParams.query && $stateParams.query.length > 0){
                    return SyncService.search($stateParams.stub, $stateParams.path, {query: $stateParams.query})
                }
            },

        },
        seo: function(resolve){
            return {
                title       : 'Files - ' + resolve.project.name + ' - STEMN',
            }
        },
        controller: 'ProjectFilesViewCtrl'
    })
}).

controller('ProjectFilesViewCtrl',function (files, matches, project, $scope, $stateParams, $timeout, $state, $location, SyncService, SyncUtilService, Authentication) {
    // Params and Resolve
    $scope.path    = $stateParams.path || '';
    $scope.project = project;
    $scope.currentUser = Authentication.currentUser;

    // Init ------------
    // Assign files
    if(files && files.data){
        $scope.files   = files.data.entries;
    }
    // If we are searching
    if($stateParams.query && $stateParams.query.length>0){
        $scope.searchActive = true;
        $scope.searchString = $stateParams.query;
        $scope.matches      = matches.data.matches;
    }

    if(project.remote.provider == 'drive'){
        if(!$scope.path){$scope.breadCrumbs = []}
        else{
            SyncService.getPath($scope.path, $scope.project.stub, project.remote.root.id).then(function(response){
                response.shift(0);
                $scope.breadCrumbs = response
            })
        }
    }
    else{
        $scope.breadCrumbs = SyncUtilService.getCrumbs($scope.path);
    }



    var debounceTimeout;
    var debounceTimeoutTime = 100;

    $scope.openFileFolder = SyncUtilService.openFileFolder; //function(path, projectStub, type)
    $scope.search = search; //function(searchString)
    $scope.toggleSearch = toggleSearch; //function()
    $scope.syncAuthorize  = syncAuthorize; //function(provider)
    $scope.remoteLink     = remoteLink;    //function(provider)
    $scope.createFolder   = createFolder;
    $scope.refreshList    = refreshList;
    ///////////////////////////

    function refreshList(){
        $scope.loading = true;
        return SyncService.list($stateParams.stub, $scope.path).then(function(response){
            $scope.loading = false;
            $scope.files   = response.data.entries;
        })

    }

    function createFolder(){
        SyncService.createFolder($scope.project.stub, $scope.path + 'XXXXXXXXXXXXXXXXXXXXXXXXXX').then(function(response){
            console.log(response.data);
        })
    }

    function syncAuthorize(provider){
        $scope.syncAuthLoading = true;
        SyncService.authorize(provider).then(function(response){
            $scope.syncAuthLoading = false;
        }).catch(function(){$scope.syncAuthLoading = false;})
    }

    function remoteLink(event, provider){
        SyncService.remoteLink(event, $scope.project.stub, provider, $scope.project.name).then(function(response){
            _.extend($scope.project.remote, response.data);
            $state.go($state.current, {}, {reload: true}); // Reload to get the file resolve
        })
    }

    function toggleSearch(){
        $scope.searchActive = !$scope.searchActive;
        if(!$scope.searchActive){
            $state.current.reloadOnSearch = false;
            $location.search('query', null);
            $timeout(function () {
                $state.current.reloadOnSearch = undefined;
            });
            $scope.searchString = '';
            $scope.matches      = [];
        }
    }

    function search(searchString){
        $timeout.cancel(debounceTimeout);
        debounceTimeout = $timeout(function(){
            $state.current.reloadOnSearch = false;
            $location.search('query', searchString);
            $timeout(function () {
                $state.current.reloadOnSearch = undefined;
            });
            SyncService.search($scope.project.stub, $scope.path, {query: searchString}).then(function(response){
                $scope.matches = response.data.matches;
            });
        }, debounceTimeoutTime)
    }
});
