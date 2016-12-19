angular.module('modules.preview.cad', []);
angular.module('modules.preview.cad').

directive('previewAutodesk', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/preview/preview-cad/tpls/autodesk-preview.html',
        scope: {
            project: '=',
            fileMeta: '=',
            previewer: '='
        },
        controller: function ($element, $scope, $http, $timeout, AutoDeskService, $window, SyncService, $q, $interval) {
            var checkStatusInterval;
            $scope.previewer = $scope.previewer || {};
            $scope.$on('$destroy', onDestroy);
            $scope.status = 'pending';

            if(AutoDeskService.isWebGlSupported()){
                $q.all([
                    SyncService.render($scope.project.stub, $scope.fileMeta.path),
                    AutoDeskService.load(),
                    AutoDeskService.authenticate()
                ]).then(initAutodeskPreview);
            }
            else{
                $scope.status = 'disabled';
            }

            ///////////////////////////////////////////////

            function onDestroy(){
                $interval.cancel(checkStatusInterval)
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
        },
    };
}).

directive('autodeskElement', function () {
    return {
        restrict: 'E',
        scope: {
            urn64: '@?',
            token: '@?'

        },
        controller: function ($element, $scope, $timeout) {

            var viewerEl = $element[0];
            var oDocument = null,
                oViewer = null;
            var oViewables = null,
                oViews3D = null,
                oViews2D = null;
            var options = {
                'document': $scope.urn64,
                'accessToken': $scope.token,
                'env': 'AutodeskProduction'
            };



            oViewer = new window.Autodesk.Viewing.Private.GuiViewer3D(viewerEl, {}); // With toolbar
//            console.log();
//            $timeout(function(){
//                console.log('fit');
//                oViewer.utilities.fitToView();
//            }, 5000)

            window.Autodesk.Viewing.Initializer(options, function () {
                oViewer.initialize();
                loadDocument(oViewer, options);
            });


            ////////////////////////////////

            function loadDocument(viewer, options) {
                if (options.document.substring(0, 4) === 'urn:'){
                    options.document = options.document.substring(4);
                }
                window.Autodesk.Viewing.Document.load('urn:' + options.document, onLoadCallback, onErrorCallback);
            }

            function onLoadCallback(doc){
                console.log(window.Autodesk);
                oDocument = doc;
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
                    oViewer.load(doc.getViewablePath(oViews3D[0]));
                }
                else if (oViews2D.length > 0){
                    oViewer.load(doc.getViewablePath(oViews2D[0]));
                }
//                else{
//                    $mdToast.show($mdToast.simple().theme('warn').content('Error: No views found'));
//                }
            }

            function onErrorCallback(errorMsg){
//                $mdToast.show($mdToast.simple().theme('warn').content('Error: '+errorMsg));
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
        }]).then(function(modules){
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
});
