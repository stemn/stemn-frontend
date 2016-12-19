angular.module('modules.preview.gerber', []);

angular.module('modules.preview.gerber').
directive('previewGerber', function ($window) {
    return {
        restrict: 'E',
        scope: {
            fileMeta: '=?',
            previewer: '=?'
        },
        templateUrl: 'app/modules/preview/preview-gerber/tpls/preview-gerber.html',
        controller: function($scope, WebGerberService, LazyLoadingService, $element, $http, $q, SyncService, SyncUtilService, $timeout){
            var webGerberInstance, gerberFile = {};

            $scope.previewer.render = initPreview;
            $scope.previewer.center = center;
            initPreview()

            // Scoped functions
            $scope.toggleLayer = toggleLayer; //function(layer)
            $scope.flip        = flip; //function()
            $scope.center      = center; //function()

            $scope.$on('$destroy', onDestroy);

            ////////////////////////////////

            function initPreview(){
                onDestroy();
                $scope.loading = true;
                if($scope.fileMeta.virtualChildren){
                    _.forEach($scope.fileMeta.virtualChildren, function(child){
                        child.enabled = true;
                    })
                    $q.all([loadPackages(), loadFiles()]).then(function(response){
                        gerberFile = response[1];
                        init()
                    })
                }
                else{
                    $q.all([loadPackages(), loadFile($scope.fileMeta.name, $scope.fileMeta.downloadUrl)]).then(function(response){
                        gerberFile = [response[1]];
                        init()
                    })
                }
            }

            function toggleLayer(layer){
                $timeout(function(){
                    _.forEach(WebGerberService.activeInstances, function(instance){
                        var matchingLayer = _.find(instance.layers, 'name', layer.name);
                        if(matchingLayer){
                            matchingLayer.enabled = layer.enabled;
                            instance.repaint = 0;
                        }
                    })
                },1)
            }

            function init(){
                webGerberInstance = WebGerberService.register();
                $scope.previewer.instance = webGerberInstance;

                webGerberInstance.callbacks = {
                    renderStart : function(){
                    },
                    renderComplete : function(){
                        $scope.loading = false;
                    }
                }

                $scope.layers = _.map(gerberFile, webGerberInstance.parse);

                // Pop Error messages and remove bad layers
                _.forEachRight($scope.layers, function(layer, index){
                    if(layer.error){
                        toast(layer.error);
                        $scope.layers.splice(index, 1);
                    }
                    else if(layer.isGerber && layer.cmds.length === 0){
                        toast('Could not parse file.');
                        $scope.layers.splice(index, 1);
                    }
                });

                // If we still have layers, display them
                if($scope.layers.length > 0){
                    // Push on the back layer if it is a pcb/brd file
                    if(!$scope.layers[0].isGerber){
                        $scope.layers[0].side = 2;
                        var backLayer = _.clone($scope.layers[0], true);
                        backLayer.boardFlipped = true;
                        backLayer.side = 1;
                        $scope.layers.push(backLayer);
                    }

                    webGerberInstance.init($scope.layers, $element[0].querySelector(".canvas-parent"), WebGerberService.activeInstances);
                    // Flip the board if we only have bottom layers
                    if(!_.find($scope.layers, 'side', 2)){
                        flip(true);
                    }
                }
                else{
                    $scope.previewer.type = 'other';
                }
            }

            function loadFiles(){
                return $q.all(_.map($scope.fileMeta.virtualChildren, function(file){
                    return loadFile(file.name, file.downloadUrl)
                }))
            }

            function loadFile(name, downloadUrl){
                return $http({
                    method: 'GET',
                    url:  downloadUrl
                }).then(function(response){
                    var result = {
                        name: name,
                        data: response.data
                    };
                    return result
                })
            }

            function loadPackages(){
                return LazyLoadingService.load([
                    {src : window.rootHostDomain + '/assets/js/gerber/js/thr51.min.js'},
                    {src : window.rootHostDomain + '/assets/js/gerber/js/ObjectControls.js'},
                    {src : window.rootHostDomain + '/assets/js/gerber/js/webGerber.js'},
                    {src : window.rootHostDomain + '/assets/js/gerber/js/parse/gerber.js'},
                    {src : window.rootHostDomain + '/assets/js/gerber/js/parse/eagle.js'},
                    {src : window.rootHostDomain + '/assets/js/gerber/js/render/viewee-generic.js'},
                    {src : window.rootHostDomain + '/assets/js/gerber/js/render/gerber.js'},
                    {src : window.rootHostDomain + '/assets/js/gerber/js/render/viewee-canvas.js'},
                    {src : window.rootHostDomain + '/assets/js/gerber/js/viewee.js'},
                ])
            }

            function toast(message){
                console.log(message);
            }

            function onDestroy(){
                WebGerberService.deregister(webGerberInstance);
            }

            function center(){
                _.forEach(WebGerberService.activeInstances, function(instance){
                    instance.center();
                })
            }
            function flip(status){
                $scope.flipped = status ? status : !$scope.flipped;
                _.forEach(WebGerberService.activeInstances, function(instance){
                    instance.flip($scope.flipped);
                })
            }
        }
    }
}).

service('WebGerberService', function(CoreLibrary){
    var service = this;

    this.activeInstances = [];
    this.register = register;
    this.deregister = deregister;

    ////////////////////////

    function register(){
        var id = CoreLibrary.getUuid();
        var instance = window.webGerber();
        instance.id = id;
        service.activeInstances.push(instance);
        return instance;
    }
    function deregister(instance){
        if(instance){
            instance.destroy();
            service.activeInstances.splice(_.findIndex(service.activeInstances, 'id', instance.id),1);
        }
    }
});
