import './compare.scss';

angular.module('views.compare', [
]);
angular.module('views.compare').

config(function ($stateProvider) {
    $stateProvider.
    state('app.compare', {
        url: '/compare/:projectStub?path1&path2&children1&children2&type',
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
            fileMeta1: function (SyncService, $stateParams, SyncUrlService) {
                var parsedChildren = SyncUrlService.parseChildren($stateParams.children1);
                var parsedPath     = SyncUrlService.parsePath($stateParams.path1);
                return SyncService.metadataVirtual($stateParams.projectStub, parsedPath, parsedChildren)
            },
            fileMeta2: function (SyncService, $stateParams, SyncUrlService) {
                if($stateParams.path2){
                    var parsedChildren = SyncUrlService.parseChildren($stateParams.children2);
                    var parsedPath     = SyncUrlService.parsePath($stateParams.path2);
                    return SyncService.metadataVirtual($stateParams.projectStub, parsedPath, parsedChildren)
                }
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
        template: require('./tpls/compare.html'),
        controller: 'CompareViewCtrl',
        layout: {
            size: 'md',
            hideOverflow: true,
            topBanner: false,
            horizontalMenu: false,
            chat: false,
        },
        seo: function(resolve){
            return {
                title       : ' Compare - ' + resolve.fileMeta1.name + ' - ' + resolve.project.name,
            }
        }
    });
}).

controller('CompareViewCtrl', function(project, previousState, fileMeta1, fileMeta2, $scope, $location, $state, $timeout, $stateParams, SyncFileSelectService, SyncUtilService, SyncUrlService, SyncService){
    $scope.project   = project;

    $scope.slider={width: 50};
    $scope.compareType = $stateParams.type || 'sideBySide' ;

    $scope.closeCompare   = closeCompare;   // function()
    $scope.setCompareType = setCompareType; // function(compareType)
    $scope.previewers = [];

    init();

    /////////////////////////////////////////////////////////

    function init(){
        $scope.fileMeta1 = fileMeta1;
        $scope.fileMeta2 = fileMeta2;

        if($scope.fileMeta1.provider == 'drive'){
            SyncService.getPath($scope.fileMeta1.path, $scope.project.stub).then(function(response){
                response.shift(0);
                response.push({
                    path: fileMeta1.id,
                    name: fileMeta1.name
                })
                $scope.breadCrumbs = response
            })
        }
        else{
            $scope.breadCrumbs = SyncUtilService.getCrumbs($scope.fileMeta1.path);
            if($scope.fileMeta1.virtualChildren){
                $scope.breadCrumbs.push({name: $scope.fileMeta1.name})
            }
        }

        $scope.previewer1 = {
            number  : '1',
            enabled : $scope.fileMeta1 ? true : false
        };
        $scope.previewer2 = {
            number  : '2',
            enabled : $scope.fileMeta2 ? true : false
        };
        $scope.provider = $scope.fileMeta1.provider;
        $scope.parentFolder = $scope.fileMeta1.parentFolder;

        $timeout(function(){
            // Timeout so previewer type exists
            $scope.compareModes = SyncUtilService.getCompareModes($scope.previewer1.type, $scope.previewer2.type);
        })
    }

    function setCompareType(compareType){
        $state.current.reloadOnSearch = false;
        $scope.compareType = compareType;
        $location.search('type', compareType);
        $timeout(function () {$state.current.reloadOnSearch = undefined;});
        if($scope.previewer1.center){
            $timeout($scope.previewer1.center);
        }
        if($scope.previewer2.center){
            $timeout($scope.previewer2.center);
        }
    }

    function closeCompare(){
        if(previousState.name && previousState.params && previousState.name != 'app.compare' && previousState.name != 'app.preview'){
            $state.go(previousState.name, previousState.params)
        }
        else{
            $state.go('app.project.files', {
                stub: project.stub,
                path: $scope.fileMeta1.parentFolder || $scope.fileMeta2.parentFolder || ''
            })
        }
    }
}).

directive('compareSlider', function($timeout, $document) {
	return {
		restrict: 'A',
        scope: {
            compareSlider: '='
        },
        link: function(scope, element){

            var dragWidth, xPosition, containerOffset, minLeft, maxLeft, containerWidth;
            var dragElement = angular.element(element[0].querySelector('.handle'));
            var containerElement = element;

            $document.on("mouseup vmouseup", onMouseUp)
            dragElement.on("mousedown vmousedown", onMouseDown)
            scope.$on('$destroy', onDestroy)

            ///////////////

            function onMouseUp(e){
                dragElement.parents().off("mousemove vmousemove", onDrag)
                dragElement.removeClass('active');
                containerElement.removeClass('active');
            }

            function onMouseDown(e){
                dragWidth = dragElement.outerWidth();
                xPosition = dragElement.offset().left + dragWidth - e.pageX;
                containerOffset = containerElement.offset().left;
                containerWidth = containerElement.outerWidth();
                minLeft = containerOffset + 10;
                maxLeft = containerOffset + containerWidth - dragWidth - 10;
                dragElement.addClass('active');
                containerElement.addClass('active');
                dragElement.parents().on("mousemove vmousemove", onDrag)
                e.preventDefault();
            }

            function onDrag(e){
                var leftValue = e.pageX + xPosition - dragWidth;

                //constrain the draggable element to move inside its container
                if(leftValue < minLeft ) {
                    leftValue = minLeft;
                } else if ( leftValue > maxLeft) {
                    leftValue = maxLeft;
                }
                var widthValue = (leftValue + dragWidth/2 - containerOffset)*100/containerWidth;
                scope.compareSlider = widthValue;
                scope.$apply();
            }

            function onDestroy(){
                $document.off("mouseup vmouseup", onMouseUp);
                dragElement.off("mousedown vmousedown", onMouseDown)
                dragElement.parents().off("mousemove vmousemove", onDrag)
            }
        }
	};
}).

directive('compareWindow', function() {
	return {
		restrict: 'E',
        scope: {
            project : '=',
            fileMeta: '=',
            previewer: '=',
            compareType: '=',

            provider: '=',
            parentFolder: '='
        },
        template: require('./tpls/compare-window.html'),
        controller: function($scope, SyncFileSelectService, $location, SyncUrlService, SyncUtilService, $stateParams, $state, SyncService, $timeout){
            $scope.selectFile  = selectFile;      // function()
            $scope.openFileFolder = SyncUtilService.openFileFolder; //function()

            init();

            /////////////////////////////////////

            function init(){
                if($scope.fileMeta){
                    SyncService.revisionsDeep($scope.fileMeta).then(function(response){
                        $scope.fileMeta = response;
                    })
                }
            }

            function selectFile(event){
                SyncFileSelectService.select(event, {provider: $scope.provider, project: $scope.project, path: $scope.parentFolder}).then(function(response){
                    $state.current.reloadOnSearch = false;
                    $location.search('path'+$scope.previewer.number, SyncUrlService.getPath(response));
                    var childPath
                    if(response.virtualChildren){
                        childPath = SyncUrlService.getChildPath(response.virtualChildren);
                    }
                    $location.search('children'+$scope.previewer.number, childPath);
                    $scope.fileMeta = response;
                    init();
                    $scope.previewer.enabled = true;
                    $timeout(function () {$state.current.reloadOnSearch = undefined;});
                })
            }
        }
	};
}).

directive('compareHeader', function() {
	return {
		restrict: 'E',
//        replace: true,
        scope: {
            fileMeta: '=',
            previewer: '=',
        },
        template: require('./tpls/compare-header.html'),
        controller: function($scope, SyncFileSelectService, $location, SyncUrlService, SyncUtilService, $stateParams, $state, SyncService, $timeout){
            $scope.closeWindow = closeWindow;     // function()
            $scope.openFileFolder = SyncUtilService.openFileFolder; //function()

            /////////////////////////////////////


            function closeWindow(){
                $state.current.reloadOnSearch = false;
                $scope.previewer.enabled = false;
                if($scope.previewer.number != '1'){
                    $location.search('path'+$scope.previewer.number, undefined);
                    $location.search('children'+$scope.previewer.number, undefined);
                }
                $timeout(function () {$state.current.reloadOnSearch = undefined;});
            }

        }
	};
}).

directive('compareRevisionTimeline', function() {
	return {
		restrict: 'E',
        scope: {
            fileMeta: '=',
            previewer: '=',
        },
        template: require('./tpls/compare-revision-timeline.html'),
        controller: function($scope, SyncFileSelectService, $location, SyncUrlService, $stateParams, $state, SyncService, $timeout){
            $scope.revisionChange = revisionChange;     //function()

            /////////////////////////////////////

            function revisionChange(fileMetaString, revisionMeta){
                $scope.fileMeta = _.extend($scope.fileMeta, revisionMeta, true);
                $state.current.reloadOnSearch = false;

                var childPath = SyncUrlService.getChildPath($scope.fileMeta.virtualChildren);
                $location.search('path'+$scope.previewer.number, SyncUrlService.getPath($scope.fileMeta));
                if(childPath){
                    $location.search('children'+$scope.previewer.number, childPath);
                }
                if($scope.previewer.render){
                    $timeout($scope.previewer.render);
                }
                $timeout(function () {$state.current.reloadOnSearch = undefined;});
            }
        }
	};
});
