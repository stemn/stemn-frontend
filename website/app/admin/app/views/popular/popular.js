angular.module('views.popular', [
    'modules.search'
]);
angular.module('views.popular').

config(function ($stateProvider) {
    $stateProvider.state('app.popular', {
        url: "/popular",
        templateUrl: "app/views/popular/popular.html",
        controller: 'PopularViewCtrl'
    });
}).

controller('PopularViewCtrl', function ($scope, HttpQuery, CoreLibrary, SelectService, CoreModalService) {
    var currentTime = new Date().getTime();
    $scope.orderFilter = {};
    $scope.typeChange = typeChange;

    $scope.popularQuery = HttpQuery({
        url: '/api/v1/analytics/mostViewed',
        params: {
            from: currentTime - CoreLibrary.resolutionToMs('month'),
            to: currentTime,
            type: '',
            size: 20
        },
        onSuccess: function (results) {

            results = CoreLibrary.keyedArrayToObject(results.values, results.key);
            _.forEach(results, function(result){
                result.requestUsers = idToObject(result.requestUsers);
            })
            return results
        }
    });


    function idToObject(array) {
        return _.map(array, function (id) {
            return {
                id: id,
                type: 'user'
            }
        })
    }


    // Watch the filter object, updated the query params when it changes
    $scope.$watch('orderFilter', function () {
        if ($scope.orderFilter.model) {
            $scope.popularQuery.params.sort = $scope.orderFilter.model;
            $scope.popularQuery.params.order = $scope.orderFilter.reverse ? 'asc' : 'dsc';
            $scope.popularQuery.refresh();
        }
    }, true)

    $scope.showDetailsModal = CoreModalService.showEntity;

    $scope.typeOptions = {
        current: '',
        options: [
            {
                model: 'project',
                title: 'Projects'
            }, {
                model: 'thread',
                title: 'Threads'
            }, {
                model: '',
                title: 'All'
            }
        ]
    }

    $scope.periodOptions = {
        current: 'month',
        options: [
            {
                model: 'day',
                title: 'Day'
            }, {
                model: 'week',
                title: 'Week'
            }, {
                model: 'fortnight',
                title: 'Fortnight'
            }, {
                model: 'month',
                title: 'Month'
            }
        ]
    }

    $scope.config = [
        {
            type: 'date',
            model: 'from',
            current: $scope.popularQuery.params.from,
            title: 'From'
        }, {
            type: 'date',
            model: 'to',
            current: $scope.popularQuery.params.to,
            title: 'To'
        }, {
            type: 'select',
            options: $scope.typeOptions.options,
            current: $scope.popularQuery.params.type,
            model: 'type',
            title: 'Type',
            placeholder: 'Select'
        }, {
            type: 'select',
            options: $scope.periodOptions.options,
            current: $scope.periodOptions.current,
            model: 'period',
            title: 'Period',
            placeholder: 'Select'
        }

    ];

    function typeChange() {
        $scope.popularQuery.params.type = $scope.config[2].current;
        $scope.popularQuery.refresh();
    }

    $scope.popularQuery.more();

    $scope.select = function (event) {
        SelectService.showModal(event, $scope.config).then(function (response) {
            _.forEach(response, function (item) {
                    $scope.popularQuery.params[item.model] = item.current;
                })
                // convert selected period to new from
            $scope.popularQuery.params.from = $scope.popularQuery.params.to - CoreLibrary.resolutionToMs(response[3].current);
            $scope.config = response;
            $scope.config[0].current = $scope.popularQuery.params.from;
            $scope.popularQuery.refresh();
        })
    }
}).

service('SelectService', function ($mdDialog) {
    this.showModal = showModal;

    ////////////////////////////

    function showModal(event, data) {
        return $mdDialog.show({
            templateUrl: 'app/views/popular/table-popular-modal.html',
            controller: function ($mdDialog, $scope, CoreLibrary) {
                $scope.data = angular.copy(data) || {};
                console.log($scope.data)

                _.forEach($scope.data, function (item) {
                    if (item.type === 'date') {
                        item.current = new Date(item.current)
                    }
                })

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
                $scope.save = function () {
                    $mdDialog.hide($scope.data);
                };
            },
            targetEvent: event,
            clickOutsideToClose: true,
        })
    }

});
