angular.module('modules.preview.pcb', []);

angular.module('modules.preview.pcb').
directive('previewPcb', function ($window) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            fileUrl : '@',
            previewer: '=?'
        },
        templateUrl: 'app/modules/preview/preview-pcb/tpls/preview-pcb.html',
        controller: function($scope, LazyLoadingService, $element, $timeout, PanZoomService, ViewPcbService){

            var ViewEEInstance;
            var canvasElement;
            var panZoomInstance;

            $scope.previewer.render = initPreview;
            $scope.previewer.center = reset;
            initPreview()


            function initPreview(){
                console.log('INIT');
                onDestroy();
                $scope.loading = true;
                loadPackages().then(init)
            }

            function init(){
                var url = $scope.fileUrl;
                canvasElement = $element[0].querySelector(".canvas");
                ViewEEInstance = ViewPcbService.register(canvasElement);
                ViewEEInstance.loadURL(url, function(){
                    $scope.loading = false;
                    $scope.$apply();
                });
                ViewEEInstance.drawCallback = function(){
                    $scope.loading = false;
                    $scope.$apply();
                    // Add Zoom Pan after draw is complete
                    addPanZoom()
                }

                $scope.flipBoard = flipBoard; //function()
                $scope.reset     = reset; //function()
            }
            $scope.$on('$destroy', onDestroy);

            ////////////////////////////////

            function loadPackages(){
                return LazyLoadingService.load([
                    {src : window.rootHostDomain + '/assets/js/viewee/js/utils/object-assign.js'},
                    {src : window.rootHostDomain + '/assets/js/viewee/js/utils/minivents.js'},
                    {src : window.rootHostDomain + '/assets/js/viewee/js/utils/htmlel.js'},
                    {src : window.rootHostDomain + '/assets/js/viewee/js/parsers/eagle_xml_parser.js'},
                    {src : window.rootHostDomain + '/assets/js/viewee/js/parsers/kicad_pcb_parser.js'},
                    {src : window.rootHostDomain + '/assets/js/viewee/js/parsers/geda_parser.js'},
                    {src : window.rootHostDomain + '/assets/js/viewee/js/renderers/renderer.js'},
                    {src : window.rootHostDomain + '/assets/js/viewee/js/renderers/canvas_renderer.js'},
                    {src : window.rootHostDomain + '/assets/js/viewee/js/renderers/svg_renderer.js'},
                    {src : window.rootHostDomain + '/assets/js/viewee/js/viewee.js'},
                    {src : window.rootHostDomain + '/assets/js/viewee/js/pan-zoom/svg-pan-zoom.js'},
//                    {src : window.rootHostDomain + '/fonts/ocr-a/fonts.css'}
                ])
            }

            function addPanZoom(){
                panZoomInstance = PanZoomService.register(canvasElement, {
                    zoomScaleSensitivity: 0.4,
                    minZoom: 0.1,
                    maxZoom: 20,
                    onZoom: function(zoom){
                        _.forEach(PanZoomService.activeInstances, function(instance){
                            if(instance.id != panZoomInstance.id){
                                instance.zoom(zoom)
                            }
                        })
                    },
                    onPan: function(pan){
                        _.forEach(PanZoomService.activeInstances, function(instance){
                            if(instance.id != panZoomInstance.id){
                                instance.pan(pan)
                            }
                        })
                    }
                });
            }

            function onDestroy(){
                PanZoomService.deregister(panZoomInstance);
                ViewPcbService.deregister(ViewEEInstance);
            }

            function flipBoard(){
                $scope.flipped = !$scope.flipped;
                _.forEach(ViewPcbService.activeInstances, function(instance){
                    instance.setBoardFlipped($scope.flipped);
                })
            }

            function reset(){
//                _.forEach(ViewPcbService.activeInstances, function(instance){
//                    instance.redraw();
//                })

                _.forEach(PanZoomService.activeInstances, function(instance){
                    instance.resize();
                    instance.fit();
                    instance.center();
                    console.log(instance.getSizes());
                })
            }
        }
    };
}).

service('ViewPcbService', function ($window, CoreLibrary) {
    var service = this;
    this.activeInstances = [];
    this.register = register;
    this.deregister = deregister;

    //////////////////////////////////////////

    function register(element){
        var id = CoreLibrary.getUuid();
        var instance = new window.ViewEEPCB(element);
        instance.id = id;
        service.activeInstances.push(instance);
        return instance;
    }

    function deregister(instance){
        if(instance){
            service.activeInstances.splice(_.findIndex(service.activeInstances, 'id', instance.id),1);
        }
    }
}).

service('PanZoomService', function ($window, CoreLibrary) {
    var service = this;
    this.activeInstances = [];
    this.register = register;
    this.deregister = deregister;

    //////////////////////////////////////////

    function register(element, options){
        var id = CoreLibrary.getUuid();
        var instance = window.svgPanZoom(element, options);
        instance.id = id;
        service.activeInstances.push(instance);
        return instance;
    }

    function deregister(instance){
        if(instance){
            service.activeInstances.splice(_.findIndex(service.activeInstances, 'id', instance.id),1);
            instance.destroy();
        }
    }
});

