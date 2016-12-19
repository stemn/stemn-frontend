angular.module('modules.charts', [
    'modules.charts.charts-time-bar',
    'modules.charts.charts-retention',
    'modules.charts.charts-growth',
]);
angular.module('modules.charts').

config(function ($compileProvider) {
    // Allow blobs in hrefs for the 'downloadChartData' directive
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
}).

directive('downloadChartData', function ($compile) {
    /**********************************************
    Converts JSON data to a blob and allows it to be downlaoded as a CSV file.
    **********************************************/
    return {
        restrict: 'A',
        replace: true,
        template: '<a class="md-button" download="stemn-graph-data.csv" ng-href="{{ url }}"><ng-md-icon icon="file_download" style="fill: white"></ng-md-icon></a>',
        scope: {
            data: '='
        },
        link: function (scope, element, attrs) {
            scope.$watch('data', function () {
                if (scope.data) {
                    scope.url = getUrl(scope.data);
                }
            });

            ///////////////////////////////

            function getUrl(data) {
                var content = JSONtoCSV(scope.data);
                var blob = new Blob([content], {
                    type: 'text/plain'
                });
                return (window.URL || window.webkitURL).createObjectURL(blob);

                ////////////////////////

                function JSONtoCSV(object) {
                    var buildData = function buildData(x) {
                        return '\n' + getEpoch(x.values) + getDate(x.values) + getTime(x.values) + x.key + ',' + getUnits(x.values);
                    };
                    var getEpoch = function getEpoch(x) {
                        return 'RawTime,' + x.map(function (y) {
                            return y[0];
                        }).join(',') + '\n';
                    };
                    var getDate = function getDate(x) {
                        return 'Date,' + x.map(function (y) {
                            return new Date(y[0]);
                        }).map(function (y) {
                            return y.getDate() + '/' + y.getMonth() + '/' + y.getFullYear();
                        }).join(',') + '\n';
                    };
                    var getTime = function getTime(x) {
                        return 'Time,' + x.map(function (y) {
                            return new Date(y[0]);
                        }).map(function (y) {
                            return y.getHours() + ':' + y.getMinutes();
                        }).join(',') + '\n';
                    };
                    var getUnits = function getUnits(x) {
                        return x.map(function (y) {
                            return y[1];
                        }).join(',') + '\n';
                    };
                    if (Array.isArray(object)) {
                        return object.reduce(function (prev, curr) {
                            return prev + buildData(curr);
                        }, '');
                    } else {
                        return buildData(object);
                    }
                }
            }
        }
    };
}).

service('ChartService', function ($mdDialog, CoreLibrary) {
    this.getChartOptions = getChartOptions;     // function() - Returns all the time chart options
    this.getDivisorOptions = getDivisorOptions; // function() - Returns all the divisor options
    this.selectModal = selectModal;             // function(event, options) - returns a promise with the selected options

    /////////////////////////////////////////////////

    function getDivisorOptions() {
        return {
            current: '',
            options: [
                {
                    model: 'timeOnSite',
                    title: 'Time On Site'
                    }, {
                    model: 'timeOnState',
                    title: 'Time On State'
                    }, {
                    model: 'statesVisited',
                    title: 'States Visited'
                    }, {
                    model: 'activeUsers',
                    title: 'Active Users'
                    }, {
                    model: 'visits',
                    title: 'Visits'
                    }, {
                    model: 'uniqueSiteVisits',
                    title: 'Unique Site Visits'
                    }, {
                    model: 'projects',
                    title: 'Projects'
                    }, {
                    model: 'threads',
                    title: 'Threads'
                    }, {
                    model: 'posts',
                    title: 'Posts'
                    }, {
                    model: 'organisations',
                    title: 'Organisations'
                    }, {
                    model: 'cumulative-users',
                    title: 'Cumulative Users'
                    }
                ]
        };
    }

    function getChartOptions(chartStyle, clickFn) {
        var options = {
            multiBar: {
                "chart": {
                    "type": 'multiBarChart',
                    "clipEdge": true,
                    "duration": 500,
                    "stacked": true,
                    multibar: {
                        dispatch: {
                            elementClick: clickFn
                        },
                    },
                }
            },
            historicalBar: {
                chart: {
                    type: 'historicalBarChart',
                    showValues: true,
                    valueFormat: function (d) {
                        return d3.format(',.1f')(d);
                    },
                    transitionDuration: 500,
                    bars: {
                        dispatch: {
                            elementClick: clickFn
                        },
                    },
                    tooltip: {
                        keyFormatter: function(d) {
                            return d3.time.format("%d %B")(new Date(d));
                        }
                    },
//                    zoom: {
//                        enabled: true,
//                        scaleExtent: [1, 10],
//                        useFixedDomain: false,
//                        useNiceScale: false,
//                        horizontalOff: false,
//                        verticalOff: true,
//                        unzoomEventType: 'dblclick.zoom'
//                    },
                }
            }
        }
        var selectedOptions = options[chartStyle];

        // Assign the standard options
        var standardOptions = {
            chart: {
                height: 350,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 70,
                    left: 50
                },
                xAxis: {
                    tickFormat: function (d) {
                        return d3.time.format("%d/%m/%Y")(new Date(d))
                    },
                    rotateLabels: 50,
                    showMaxMin: false
                },
                yAxis: {
                    axisLabelDistance: -10,
                    tickFormat: function (d){
                        return d3.format(',.2f')(d);
                    }
                },
                x: function (d) {
                    return d[0];
                },
                y: function (d) {
                    return d[1];
                }
            }
        };
        selectedOptions = _.merge(selectedOptions, standardOptions)
        return selectedOptions;
    }

    function selectModal(event, options) {
        return $mdDialog.show({
            templateUrl: 'app/modules/charts/tpls/charts-select-modal.html',
            controller: function ($scope, $mdDialog, ChartService, CoreLibrary) {
                $scope.resolutionObject = CoreLibrary.getResolutionObject();
                $scope.selectedChartTime = angular.copy(options) || {};
                $scope.selectedChartOptions = angular.copy(options) || {};
                $scope.selectedChartTime.to   = new Date($scope.selectedChartTime.to);
                $scope.selectedChartTime.from = new Date($scope.selectedChartTime.from);
                $scope.divisorOptions = ChartService.getDivisorOptions();
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
});
