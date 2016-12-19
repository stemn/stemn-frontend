angular.module('modules.sync.folder-select', [
]);
angular.module('modules.sync.folder-select').

directive('syncFolderSelect', function (RecursionHelper) {
    return {
        restrict: 'E',
        scope:{
            provider: '@', // 'dropbox' || 'drive'
            item: '=',
            open: '=?',
            selected: '=',
            loading: '=?'
        },
        templateUrl: 'app/modules/sync/sync-folder-select/tpls/sync-folder-select.html',
        compile: function(element) {
            return RecursionHelper.compile(element);
        },
        controller: function ($scope, SyncUtilService, SyncService, $stateParams) {
            $scope.selected  = $scope.selected || {};
            $scope.item      = $scope.item || {};
            $scope.item.path = $scope.item.path || '';

            // Functions
            $scope.toggle = toggle; //function(path)
            $scope.select = select; //function(item)

            if($scope.open){
                toggle($scope.item.path)
                $scope.$watch('item', function(){
                    assignLevel($scope.item, 0)
                }, true)
            }

            function assignLevel(item, level){
                level = level + 1;

                if(item && item.children){
                    _.forEach(item.children, function(child){
                        child.level = level - 1;
                        assignLevel(child, level);
                    })
                }

            }

            ///////////////////////////

            function toggle(path){
                if(!$scope.item.children){
                    $scope.loading.status = true;
                    SyncService.explorePrivate($scope.provider, path).then(function(response){
                        $scope.loading.status = false;
                        $scope.item.children = response.data.entries;
                        $scope.item.showChildren = true;
                    })
                }
                else{
                    $scope.item.showChildren = !$scope.item.showChildren;
                }
            }
            function select(item){
                $scope.selected.id   = item.id;
                $scope.selected.path = item.path;
                $scope.selected.name = item.name;
            }

        }
    };
}).

service('SyncFolderSelectService', function ($mdDialog) {
    this.select = select; //function()

    /////////////////////////////////////

    function select(event, data){
        /************************************************
        data = {
            provider: 'dropbox' || 'drive',
            projectName: project name
        }
        ************************************************/
        return $mdDialog.show({
            templateUrl: 'app/modules/sync/sync-folder-select/tpls/sync-folder-select-modal.html',
            controller: function($scope, $mdDialog, CoreLibrary){
                $scope.selected    = {};
                $scope.loading     = {};
                $scope.provider    = data.provider;
                $scope.projectName = CoreLibrary.stubify(data.projectName);

                $scope.folder   = {type: 'new'}; // Default select mod
                $scope.cancel   = $mdDialog.cancel; // function()
                $scope.save     = function(){
                    if($scope.folder == 'new'){
                        $scope.selected = {};
                    }
                    $mdDialog.hide($scope.selected)
                }
            },
            targetEvent: event
        })
    }
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
