import './preview-cad.scss';
angular.module('modules.preview.cad', []);
angular.module('modules.preview.cad').

directive('previewAutodesk', function () {
    return {
        restrict: 'E',
        template: require('./tpls/autodesk-preview.html'),
        scope: {
            project: '=',
            fileMeta: '=',
            previewer: '='
        },
        controller: function ($element, $scope, $http, $timeout, $mdToast, AutoDeskService, $window, SyncService, $q, $interval) {
            var checkStatusInterval;
            $scope.previewer.render = initPreview;
            initPreview()

            ///////////////////////////////////////////////

            function initPreview(){
                $scope.status = 'pending';
                $scope.initialiseAutodesk = false;

                onDestroy();
                if(AutoDeskService.isWebGlSupported()){
                    return loadPackages().then(initAutodeskPreview);
                }
                else{
                    $scope.status = 'disabled';
                }
            }

            function loadPackages(){
                return $q.all([
                    SyncService.render($scope.project.stub, $scope.fileMeta.path, {revision: $scope.fileMeta.rev}),
                    AutoDeskService.load(),
                    AutoDeskService.authenticate()
                ])
            }

            function onDestroy(){
                $interval.cancel(checkStatusInterval);
            }

            function initAutodeskPreview(responses){
                $scope.urn64    = responses[0].data.urn;
                $scope.token    = responses[2].data.token;
                checkStatusInterval = $interval(checkStatus, 700);

                ///////////////////////////////////////

                function checkStatus(){
                    AutoDeskService.getViewStatus($scope.urn64).then(function(response){
                        $scope.status = response.data.status;
                        if($scope.status == 'success'){
                            $scope.initialiseAutodesk = true;
                            $interval.cancel(checkStatusInterval)
                        }
                        else if($scope.status == 'failed'){
                            $interval.cancel(checkStatusInterval)
                        }
                    })
                }
            }

            $scope.$on('$destroy', onDestroy);
        },
    };
}).

directive('autodeskElement', function () {
    return {
        restrict: 'E',
        scope: {
            previewer: '=?',
            urn64: '@?',
            token: '@?'

        },
        controller: function ($element, $scope, $mdToast, $timeout, $interval, AutoDeskInstanceService) {
            $scope.previewer = $scope.previewer || {};

            var viewerEl = $element[0];
            var oDocument = null,
                viewerInstance = null;
            var oViewables = null,
                oViews3D = null,
                oViews2D = null;
            var options = {
                'document': $scope.urn64,
                'accessToken': $scope.token,
                'env': 'AutodeskProduction'
            };

            $scope.$on('$destroy', onDestroy);
            $scope.previewer.center = center;


            viewerInstance = AutoDeskInstanceService.register(viewerEl); // With toolbar

            window.Autodesk.Viewing.Initializer(options, function () {
                viewerInstance.initialize();
                loadDocument(viewerInstance, options);
            });


            ////////////////////////////////

            function center(){
                if(viewerInstance){
                    console.log('center');
                    viewerInstance.resize()
                }
            }

            function loadDocument(viewer, options) {
                if (options.document.substring(0, 4) === 'urn:'){
                    options.document = options.document.substring(4);
                }
                window.Autodesk.Viewing.Document.load('urn:' + options.document, onLoadCallback, onErrorCallback);
            }

            function onLoadCallback(doc){
                // Get all the 3D and 2D views (but keep in separate arrays so we can differentiate in the UI)
                oViews3D = window.Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
                    'type': 'geometry',
                    'role': '3d'
                }, true);
                oViews2D = window.Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
                    'type': 'geometry',
                    'role': '2d'
                }, true);

                // Load up first a 3D view by default
                if (oViews3D.length > 0){
                    viewerInstance.load(doc.getViewablePath(oViews3D[0]));
                }
                else if (oViews2D.length > 0){
                    viewerInstance.load(doc.getViewablePath(oViews2D[0]));
                }
                else{
                    $mdToast.show($mdToast.simple().theme('warn').content('Error: No views found'));
                }
            }

            function onErrorCallback(errorMsg){
                $mdToast.show($mdToast.simple().theme('warn').content('Error: '+errorMsg));
            }

            function onDestroy(){
                AutoDeskInstanceService.deregister(viewerInstance);
            }
        },
    };
}).




service('autodeskInterceptor', function ($q) {
    return {
        request: function (config) {
            // This function will be updated after token is known
            return config;
        },
    };
}).

config(function($httpProvider) {
    $httpProvider.interceptors.push('autodeskInterceptor');
}).

service('AutoDeskService', function ($http, LazyLoadingService, autodeskInterceptor) {
    var service = this;


    this.load             = load;
    this.accessToken      = '';
    this.authenticate     = authenticate;
    this.getViewStatus    = getViewStatus;
    this.isWebGlSupported = isWebGlSupported;

    authenticate();
    // Update interceptor
    autodeskInterceptor.request = function(config){
        if (config.url.indexOf('autodesk.com') != -1) {
            config.headers.Authorization = 'Bearer ' + service.accessToken;
        }
        return config;
    };

    ////////////////////////////////////////

    function load(){
        return LazyLoadingService.load([{
            global : 'Autodesk',
            src    : 'https://developer.api.autodesk.com/viewingservice/v1/viewers/viewer3D.min.js'
        },{
            src    : 'https://developer.api.autodesk.com/viewingservice/v1/viewers/style.min.css'
        },{
            src    : 'https://developer.api.autodesk.com/viewingservice/v1/viewers/three.min.js'
        },{
            src    : 'https://developer.api.autodesk.com/viewingservice/v1/viewers/lmvworker.min.js'
        },]).then(function(modules){
            return modules[0]
        })
    }
//            src    : 'assets/js/autodesk/css/style.min.css'

    function authenticate(){
        return $http({
            method: 'POST',
            url: 'api/v1/auth/autodesk',
        }).then(function(response){
            service.accessToken = response.data.token;
            return response
        })
    }

    function getViewStatus(urn64){
        return $http({
            method: 'GET',
            url: 'https://developer.api.autodesk.com/viewingservice/v1/'+urn64+'/status',
        })
    }

    function isWebGlSupported(return_context) {
        if (!!window.WebGLRenderingContext) {
            var canvas = document.createElement("canvas"),
                 names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
               context = false;

            for(var i=0;i<4;i++) {
                try {
                    context = canvas.getContext(names[i]);
                    if (context && typeof context.getParameter == "function") {
                        // WebGL is enabled
                        if (return_context) {
                            // return WebGL object if the function's argument is present
                            return {name:names[i], gl:context};
                        }
                        // else, return just true
                        return true;
                    }
                } catch(e) {}
            }

            // WebGL is supported, but disabled
            return false;
        }

        // WebGL not supported
        return false;
    }
}).


service('AutoDeskInstanceService', function(CoreLibrary, $interval, $timeout, $document){
    var service = this;

    this.activeInstances = [];
    this.register = register;
    this.deregister = deregister;

    var oldState     = {viewport: { eye: [1]}};
    var filter       = {viewport: true};
    var syncIsActive = false;

    ////////////////////////

    function onMove(){
        if(service.activeInstances && service.activeInstances.length > 1){
            var newState;
            var oldInstances = [];
            _.forEach(service.activeInstances, function(instance){
                if(instance.viewerState){
                    var possibleNewState = instance.getState(filter);
                    // If the state is different, this is the new state!
                    if(possibleNewState.viewport.eye[0] != oldState.viewport.eye[0]){
                        newState = possibleNewState;
                    }
                    else{
                        oldInstances.push(instance);
                    }
                }
            });

            // If there is a new state, update the old instances
            if(newState){
                if(oldInstances.length > 0){
                    _.forEach(oldInstances, function(instance){
                        instance.restoreState(newState, filter, true)
                    })
                }
                oldState = newState;
            }
        }
    }

    function register(viewerEl){
        var id = CoreLibrary.getUuid();
        var instance = new window.Autodesk.Viewing.Private.GuiViewer3D(viewerEl, {});
        instance.id = id;
        service.activeInstances.push(instance);
        if(service.activeInstances.length > 1 && !syncIsActive){
            syncIsActive = true;
            $document.on('mousemove vmousemove mousewheel click mousedown DOMMouseScroll scroll', onMove);
        }
        return instance;
    }
    function deregister(instance){
        if(instance){
            service.activeInstances.splice(_.findIndex(service.activeInstances, 'id', instance.id),1);
            if(service.activeInstances.length < 2 && syncIsActive){
                syncIsActive = false;
                $document.off('mousemove vmousemove mousewheel click mousedown DOMMouseScroll scroll', onMove);
            }
            instance.finish();
        }
    }
});



