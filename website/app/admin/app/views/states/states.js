angular.module('views.states', [
    'modules.charts',
    'modules.states',
]);
angular.module('views.states').

config(function ($stateProvider) {
    $stateProvider.
    state('app.states', {
        url: "/states",
        templateUrl: "app/views/states/states.html",
        controller: 'StatesViewCtrl'
    })
}).

controller('StatesViewCtrl', function ($scope, $http) {
    $scope.stateDataGeneral  = {name: 'app.home'};
    $scope.stateDataSpecific = {name: 'app.home'};

    $http({
        url: '/api/v1/analytics/appStates',
        method: "GET",
    }).then(function(response){
        var total = 0
        _.forEach(response.data, function(state){
            state.name = state.state;
            total = total + state.number
        })
        _.forEach(response.data, function(state){
            state.percentage = (state.number / total * 100).toFixed(2);
        })
        $scope.popularStatesGeneral  = response.data;
        $scope.popularStatesSpecific = angular.copy(response.data);
    });

});
