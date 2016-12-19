angular.module('modules.charts.charts-growth', []);
angular.module('modules.charts.charts-growth').

directive('chartsUserGrowth', function ($http) {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/charts/tpls/charts-user-growth.html',
        scope: {

            // Detailed API
            type: '@',
            title: '@',
            yAxis: '@',
            divisor: '@'
        },

        controller: function ($scope, CoreLibrary, CoreModalService, GrowthChartService, $mdDialog, HttpService) {

            var currrentTime = new Date().getTime();
            $scope.resolutionObject = CoreLibrary.getResolutionObject();

            $scope.showChartsSelectModal = showChartsSelectModal;

            function showChartsSelectModal(event) {
                GrowthChartService.selectModal(event, $scope.query.params).then(function (response) {
                    console.log(response.from);
                    $scope.query.params = _.extend($scope.query.params, response)
                    console.log($scope.query.params.from);
                });
            }

            initialise();

            ////////////////////////////////////////////

            function getDetails(bar){
                HttpService({
                    method: 'GET',
                    url: 'api/v1/analytics/growth',
                    params: {
                        from: bar.data.x,
                        to: bar.data.x + $scope.query.params.timeResolution,
                        type: bar.data.key,
                        format: 'events',
                    },
                }).then(function(response){
                    response = CoreLibrary.keyedArrayToObject(response.values, response.key);
                    CoreModalService.showEntity(null, response);
                })
            }

            function initialise() {
                // Assign functions to scope
                $scope.refreshData = getData; // function()

                $scope.loading = true;

                $scope.options = GrowthChartService.getChartOptions(getDetails, null, null);
                // If y-axis label is passed through, set it
                if ($scope.yAxis) {
                    $scope.options.chart.yAxis.axisLabel = $scope.yAxis;
                }

                // Create query
                $scope.query = {
                    method: 'GET',
                    url: 'api/v1/analytics/growth',
                    params: {
                        from: currrentTime - 12 * CoreLibrary.resolutionToMs('week'),
                        to: currrentTime,
                        timeResolution: CoreLibrary.resolutionToMs('week')
                    },
                };

                $scope.$watch('query', getData, true);
            }

            //////////// DATA /////////////

            function getData() {
                //                getFromTime();
                $scope.loading = true;
                $http({
                    url: $scope.query.url,
                    method: 'GET',
                    params: $scope.query.params
                }).then(assignData);
            }

            function assignData(response) {
                $scope.loading = false;
                if ($scope.type === "bar") {
                    $scope.data = [
                        {
                            key: 'New',
                            type: "bar",
                            yAxis: 1,
                            values: sortxyData(response.data.signups)
                        }, {
                            key: 'Churned',
                            type: "bar",
                            yAxis: 1,
                            values: sortxyData(response.data.churned)
                        }, {
                            key: 'Resurrected',
                            type: "bar",
                            yAxis: 1,
                            values: sortxyData(response.data.resurrected)
                        }
                    ]
                    var maxValue = findMax(response.data.signups) + findMax(response.data.resurrected);
                    var minValue = findMin(response.data.churned);
                    $scope.options = GrowthChartService.getChartOptions(null, minValue, maxValue);

                } else if ($scope.type === "line") {
                    $scope.data = [
                        {
                            key: 'Quick Ratio',
                            type: "line",
                            yAxis: 1,
                            values: sortxyData(response.data.quickratio)
                        }, {
                            key: 'Retention Rate',
                            type: "line",
                            yAxis: 1,
                            values: sortxyData(response.data.retained)
                        }
                    ]
                    $scope.maxValue = findMax(response.data.quickratio)
                    $scope.minValue = 0;
                    $scope.options = GrowthChartService.getChartOptions(null, $scope.minValue, $scope.maxValue);
                }

                function sortxyData(array) {
                    return _.map(array, function (data) {
                        return {
                            x: data[0],
                            y: data[1]
                        }
                    })
                }

                function findMax(array) {
                    var maxNum = -Infinity;
                    _.map(array, function (data) {
                        if (data[1] > maxNum){
                            maxNum = data[1];
                        }
                    })
                    return maxNum
                }

                function findMin(array) {
                    var minNum = Infinity;
                    _.map(array, function (data) {
                        if (data[1] < minNum){
                            minNum = data[1];
                        }
                    })
                    return minNum
                }

                function setChartMaxMin(max, min) {
                    if ($scope.type === "bar") {
                        $scope.options.chart.yDomain1 = [

                        ];
                    }
                }
            }
        }
    }
}).

service('GrowthChartService', function ($mdDialog, CoreLibrary) {

    this.selectModal = selectModal;
    this.getChartOptions = getChartOptions;

    function selectModal(event, options) {
        return $mdDialog.show({
            templateUrl: 'app/modules/charts/tpls/charts-select-modal-growth.html',
            controller: function ($scope, $mdDialog, CoreLibrary) {
                $scope.resolutionObject = CoreLibrary.getResolutionObject();
                $scope.selectedChartTime = angular.copy(options) || {};
                $scope.selectedChartOptions = angular.copy(options) || {};
                //                console.log($scope.selectedChartOptions);
                $scope.selectedChartTime.to = new Date($scope.selectedChartTime.to);
                $scope.selectedChartTime.from = new Date($scope.selectedChartTime.from);
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
                $scope.save = function () {
                    $scope.selectedChartOptions.from = $scope.selectedChartTime.from.getTime();
                    $scope.selectedChartOptions.to = $scope.selectedChartTime.to.getTime();
                    $mdDialog.hide($scope.selectedChartOptions);
                };
            },
            targetEvent: event,
            clickOutsideToClose: true,
        });
    }

    ///////////// OPTIONS ////////////

    function getChartOptions(clickFn, minValue, maxValue) {
        return {
            chart: {
                type: 'multiChart',
                height: 425,
                margin: {
                    top: 30,
                    right: 60,
                    bottom: 50,
                    left: 70
                },
                bars1: {
                    stacked: true,
                    dispatch: {
                        elementClick: clickFn
                    },
                },
                yDomain1: [minValue, maxValue],
                color: d3.scale.category10().range(),
                useInteractiveGuideline: true,
                duration: 500,
                xAxis: {
                    showMaxMin: false,
                    tickFormat: function (d) {
                        return d3.time.format('%x')(new Date(d));
                    }
                },
                yAxis1: {
                    tickFormat: function (d) {
                        return d3.format(',.2f')(d);
                    }
                },
                yAxis2: {
                    tickFormat: function (d) {
                        return d3.format(',.2f')(d);
                    }
                },
                tooltip: {
                    headerFormatter: function (d) {
                        return d3.time.format('%x')(new Date(d));
                    }
                },
                interpolate: 'linear',
            }
        }
    }
})
