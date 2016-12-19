angular.module('modules.charts.charts-retention', []);
angular.module('modules.charts.charts-retention').

directive('chartsUserRetention', function ($http) {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/charts/tpls/charts-user-retention.html',
        scope: {
            type   : '@',
            title  : '@',
            yAxis  : '@',
            divisor: '@'
        },
        controller: function ($scope, CoreLibrary, CoreModalService, RetentionChartService, $mdDialog) {

            var currentTime = new Date().getTime();
            var weekInMs = CoreLibrary.resolutionToMs('week');
            var resolutionObject = CoreLibrary.getResolutionObject();

            // Create query
            $scope.query = {
                method: 'GET',
                url: 'api/v1/analytics/retention',
                params: {
                    signupFrom: currentTime - 8 * CoreLibrary.resolutionToMs('week'),
                    signupTo: currentTime,
                    duration: weekInMs,
                    repeat: 8,
                    segregate: [
                        { numProjects : 1 },
                        { numThreads : 1 },
                    ],
                },
            };

            // Set graph options
            $scope.options = RetentionChartService.getChartOptions();
            $scope.options.chart.xAxis.axisLabel = msToTimeUnit($scope.query.params.duration);

            // Functions and watches
            $scope.$watch('query', getData, true); // Watch the query - get new data when it changes
            $scope.showChartsSelectModal = showChartsSelectModal; // function(event)

            /////////////////////////////////////////////////////////////////////

            function showChartsSelectModal(event) {
                RetentionChartService.selectModal(event, $scope.query.params).then(function (response) {
                    $scope.query.params = _.extend($scope.query.params, response)
                });
            }

            function msToTimeUnit(ms) {
                return resolutionObject.filter(function(time) {
                    return time.value == ms;
                })[0].name;
            }

            function getData(){
                $http($scope.query).then(function (response) {
                    $scope.data = response.data;
                });
            }
        }
    };
}).

service('RetentionChartService', function ($mdDialog, CoreLibrary) {
    this.getSegregateOptions = getSegregateOptions;
    this.selectModal = selectModal;                 // function(event, options) - returns a promise with the selected options
    this.getChartOptions = getChartOptions;         // function() - returns the chart options

    /////////////////////////////////////////////////

    function getSegregateOptions() {
        return {
            current: '',
            options: [
                {
                model: 'numProjects',
                title: 'Projects'
                }, {
                model: 'numThreads',
                title: 'Threads'
                }
            ]
        };
    }

    function selectModal(event, options) {
        return $mdDialog.show({
            templateUrl: 'app/modules/charts/tpls/charts-select-modal-retention.html',
            controller: function ($scope, $mdDialog, RetentionChartService, CoreLibrary) {
                $scope.resolutionObject = CoreLibrary.getResolutionObject();
                $scope.selectedChartTime = angular.copy(options) || {};
                $scope.selectedChartOptions = angular.copy(options) || {};
//                console.log($scope.selectedChartOptions);
                $scope.selectedChartTime.signupTo = new Date($scope.selectedChartTime.signupTo);
                $scope.selectedChartTime.signupFrom = new Date($scope.selectedChartTime.signupFrom);
                $scope.segregateOptions = RetentionChartService.getSegregateOptions();
                $scope.addItemType = $scope.segregateOptions.options[0].model;
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
                $scope.save = function () {
                    $scope.selectedChartOptions.signupFrom = $scope.selectedChartTime.signupFrom.getTime();
                    $scope.selectedChartOptions.signupTo = $scope.selectedChartTime.signupTo.getTime();
                    $mdDialog.hide($scope.selectedChartOptions);
                };
                $scope.addItem = function () {
                    var obj = {};
                    obj[$scope.addItemType] = { $eq : 1 };
                    $scope.selectedChartOptions.segregate.push(obj);
                };
                $scope.removeItem = function (index) {
                    $scope.selectedChartOptions.segregate.splice(index, 1);
                };
                $scope.getTitleFromModel = function (model) {
                    return $scope.segregateOptions.options.filter(function (item) {
                        return item.model === model;
                    })[0].title;
                };
                $scope.getKey = function (segregate) {
                    return Object.keys(segregate)[0];
                };
            },
            targetEvent: event,
            clickOutsideToClose: true,
        });
    }

    function getChartOptions(){
        return {
            chart: {
                type: 'stackedAreaChart',
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 40
                },
                x: function (d) {
                    return d[0];
                },
                y: function (d) {
                    return d[1];
                },
                useVoronoi: false,
                clipEdge: true,
                duration: 100,
                useInteractiveGuideline: true,
                xAxis: {
                    showMaxMin: false,
                    tickFormat: function (d) {
                        return d3.format(',d')(d);
                    },
                },
                yAxis: {
                    tickFormat: function (d) {
                        return d3.format(',.2f')(d);
                    }
                },
            }
        };
    }
});
