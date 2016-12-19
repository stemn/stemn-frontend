angular.module('modules.charts.charts-time-bar', []);
angular.module('modules.charts.charts-time-bar').

directive('chartsTimeBar', function (HttpService) {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/charts/tpls/charts-time-bar.html',
        scope: {
            chartType: '@',
            userId: '@',
            state: '@',
            stateParams: '@',
            chartStyle: '@',

            // Detailed API
            type    : '@',
            title   : '@',
            yAxis   : '@',
            divisor : '@',
            percent : '=?' // true || false - if true, all data is multiplied by 100
        },
        controller: function ($scope, CoreLibrary, CoreModalService, ChartService, $mdDialog) {
            // Get data
            var currrentTime = new Date().getTime();
            $scope.resolutionObject = CoreLibrary.getResolutionObject();
            // Assign functions to scope
            $scope.showChartsSelectModal = showChartsSelectModal; // function(event)
            $scope.getData = getData;                             // function()
            $scope.getFromTime = getFromTime;                     // function()
            $scope.chartStyle = $scope.chartStyle || 'historicalBar';
            $scope.divisorOptions = ChartService.getDivisorOptions();
            $scope.divisorChange  = divisorChange;

            initialise();

            ////////////////////////////////////////////

            function initialise() {
                $scope.loading = true;
                $scope.options = ChartService.getChartOptions($scope.chartStyle, getDetails);


                // If y-axis label is passed through, set it
                if ($scope.yAxis) {
                    $scope.options.chart.yAxis.axisLabel = $scope.yAxis;
                }

                $scope.query = {
                    url: 'api/v1/analytics/historical',
                    params: {
                        to: currrentTime,
                        user: $scope.userId,
                        state: $scope.state,
                        timeResolution: CoreLibrary.resolutionToMs('day'),
                        stateParams: $scope.stateParams,
                        format: 'aggregate',
                        query: {}
                    },
                };

                // If Divisor exists
                if ($scope.divisor && $scope.divisor !== 'true') {
                    $scope.divisorOptions.current = $scope.divisor;
                    $scope.query.params.query.divisor = $scope.divisor;
                }

                // If Chart Type exists
                if ($scope.chartType) {
                    $scope.typeInfo = getChartInfo($scope.chartType);
                    $scope.typeInfo.setOptions();
                } else {
                    $scope.query.params.query.type = $scope.type;
                }

                // Get data
                getFromTime();
                getData();
            }

            function showChartsSelectModal(event) {
                ChartService.selectModal(event, $scope.query.params).then(function (response) {
                    $scope.query.params = _.extend($scope.query.params, response);
                    $scope.getData();
                });
            }

            function divisorChange(){
                if ($scope.divisorOptions.current) {
                    $scope.query.params.query.divisor = $scope.divisorOptions.current;
                    getData();
                }
            }

            function getChartInfo(chartType) {
                var typeInfos = {
                    timeOnSite: {
                        title: 'Time On Site',
                        query: {
                            type: 'timeOnSite'
                        },
                        setOptions: function () {
                            $scope.options.chart.yAxis.axisLabel = 'Seconds';
                        }
                    },
                    timeOnState: {
                        title: 'Time On State',
                        query: {
                            type: 'timeOnState'
                        },
                        setOptions: function () {
                            $scope.options.chart.yAxis.axisLabel = 'Seconds';
                        }
                    },
                    activeUsers: {
                        title: 'Active Users',
                        query: {
                            type: 'activeUsers'
                        },
                        setOptions: function () {
                            $scope.options.chart.yAxis.axisLabel = 'Users';
                        }
                    },
                    statesVisted: {
                        title: 'States Visted',
                        query: {
                            type: 'statesVisited'
                        },
                        setOptions: function () {
                            $scope.options.chart.yAxis.axisLabel = 'States';
                        }
                    },
                    newSignups: {
                        title: 'New Signups',
                        query: {
                            type: 'users'
                        },
                        setOptions: function () {
                            $scope.options.chart.yAxis.axisLabel = 'Signups';
                        }
                    },
                    contentCreation: {
                        title: 'Content Creation',
                        query: {
                            type: 'content'
                        },
                        setOptions: function () {
                            $scope.options.chart.yAxis.axisLabel = 'Number';
                        }
                    },
                    visitors: {
                        title: 'Visitors',
                        query: {
                            type: 'uniqueSiteVisits'
                        },
                        setOptions: function () {
                            $scope.options.chart.yAxis.axisLabel = 'Visitors';
                        }
                    },
                    landingPageConversions: {
                        title: 'Landing Page Conversions',
                        query: {
                            type: 'landingPageConversions'
                        },
                        setOptions: function () {
                            $scope.options.chart.yAxis.axisLabel = '%';
                        }
                    },
                    projectCreation: {
                        title: 'Project Creation',
                        query: {
                            type: 'projects',
                        },
                        setOptions: function () {
                            $scope.options.chart.yAxis.axisLabel = 'Projects';
                        }
                    },
                    threadCreation: {
                        title: 'Thread Creation',
                        query: {
                            type: 'threads',
                        },
                        setOptions: function () {
                            $scope.options.chart.yAxis.axisLabel = 'Threads';
                        }
                    },
                    postCreation: {
                        title: 'Post Creation',
                        query: {
                            type: 'posts',
                        },
                        setOptions: function () {
                            $scope.options.chart.yAxis.axisLabel = 'Posts';
                        }
                    },
                    organisationCreation: {
                        title: 'Organisation Creation',
                        query: {
                            type: 'organisations',
                        },
                        setOptions: function () {
                            $scope.options.chart.yAxis.axisLabel = 'Organisations';
                        }
                    },
                    creations: {
                        title: 'Creations',
                        query: [
                            {
                                type: 'organisations',
                            }, {
                                type: 'posts',
                            }, {
                                type: 'projects',
                            }, {
                                type: 'threads',
                            }, {
                                type: 'applications',
                            },
                        ],
                        setOptions: function () {
                            $scope.options.chart.yAxis.axisLabel = 'Creations';
                        }
                    },
                    projects: {
                        title: 'Projects',
                        query: {
                            type: 'projects',
                        },
                        setOptions: function () {
                            $scope.options.chart.yAxis.axisLabel = 'Projects';
                        }
                    },
                    users: {
                        title: 'Users',
                        query: {
                            type: 'users',
                        },
                        setOptions: function () {
                            $scope.options.chart.yAxis.axisLabel = 'Users';
                        }
                    },
                    threads: {
                        title: 'Threads',
                        query: {
                            type: 'threads',
                        },
                        setOptions: function () {
                            $scope.options.chart.yAxis.axisLabel = 'Threads';
                        }
                    },
                    cumulativeThreads: {
                        title: 'Cumulative Threads',
                        query: {
                            type: 'cumulative-threads',
                        },
                        setOptions: function () {
                            $scope.options.chart.yAxis.axisLabel = 'Threads';
                        }
                    },
                    cumulativeUsers: {
                        title: 'Cumulative Users',
                        query: {
                            type: 'cumulative-users',
                        },
                        setOptions: function () {
                            $scope.options.chart.yAxis.axisLabel = 'Users';
                        }
                    },
                    cumulativeProjects: {
                        title: 'Cumulative Projects',
                        query: {
                            type: 'cumulative-projects',
                        },
                        setOptions: function () {
                            $scope.options.chart.yAxis.axisLabel = 'Projects';
                        }
                    },
                    cumulativeJobs: {
                        title: 'Cumulative Jobs',
                        query: {
                            type: 'cumulative-jobs',
                        },
                        setOptions: function () {
                            $scope.options.chart.yAxis.axisLabel = 'Jobs';
                        }
                    },
                    cumulativeOrganisations: {
                        title: 'Cumulative Organisations',
                        query: {
                            type: 'cumulative-organisations',
                        },
                        setOptions: function () {
                            $scope.options.chart.yAxis.axisLabel = 'Organisations';
                        }
                    },
                };

                // Merge the new query params
                $scope.query.params.query = typeInfos[chartType].query;
                $scope.title = typeInfos[chartType].title;
                return typeInfos[chartType];
            }

            function getDetails(bar) {
                var query;
                if (Array.isArray($scope.query.params.query)) {
                    query = $scope.query.params.query[bar.data.series];
                } else {
                    query = $scope.query.params.query;
                }
                HttpService({
                    url: 'api/v1/analytics/historical',
                    method: 'GET',
                    params: {
                        from: bar.data[0],
                        to: bar.data[0] + $scope.query.params.timeResolution,
                        user: $scope.userId,
                        state: $scope.state,
                        stateParams: $scope.stateParams,
                        format: 'events',
                        query: query
                    }
                }).then(function (response) {
                    console.log(response);
                    var results;
                    if (response.values) {
                        results = CoreLibrary.keyedArrayToObject(response.values, response.key);
                    } else {
                        results = response;
                    }
                    CoreModalService.showEntity(null, results);
                });
            }

            function getData() {
                $scope.loading = true;
                HttpService({
                    url: $scope.query.url,
                    method: 'GET',
                    params: $scope.query.params
                }).then(assignData);
            }

            function getFromTime() {
                if ($scope.query.params.timeResolution === CoreLibrary.resolutionToMs('hour')) {
                    $scope.query.params.from = currrentTime - 3 * CoreLibrary.resolutionToMs('day');
                } else if ($scope.query.params.timeResolution === CoreLibrary.resolutionToMs('day')) {
                    $scope.query.params.from = currrentTime - CoreLibrary.resolutionToMs('month');
                } else if ($scope.query.params.timeResolution === CoreLibrary.resolutionToMs('week')) {
                    $scope.query.params.from = currrentTime - 6 * CoreLibrary.resolutionToMs('month');
                } else if ($scope.query.params.timeResolution === CoreLibrary.resolutionToMs('fortnight')) {
                    $scope.query.params.from = currrentTime - 12 * CoreLibrary.resolutionToMs('month');
                } else if ($scope.query.params.timeResolution === CoreLibrary.resolutionToMs('month')) {
                    $scope.query.params.from = currrentTime - 24 * CoreLibrary.resolutionToMs('month');
                }
            }

            function assignData(response) {
                $scope.loading = false;
                // If, response is an array, we assign to scope
                if (response.constructor === Array) {
                    $scope.data = response;
                }
                // If the response is an object, we wrap in an array
                else {
                    $scope.data = [response];
                }
                // If the data is percent, muliply by 100
                if($scope.percent){
                    // Multiple by 100
                    _.forEach($scope.data[0].values, function(values){
                       values[1] = values[1]*100;
                    });
                }
            }
        }
    };
});
