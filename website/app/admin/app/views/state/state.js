angular.module('views.state', [
    'modules.charts',
    'modules.states'
]);
angular.module('views.state').

config(function ($stateProvider) {
    $stateProvider.
    state('app.state', {
        url: "/states/:state?stub",
        templateUrl: "app/views/state/state.html",
        controller: 'StateViewCtrl'
    });
}).


controller('StateViewCtrl', function ($scope, $stateParams) {
    $scope.state  = $stateParams.state;
    $scope.params = {
        stub: $stateParams.stub
    }

    $scope.stateDataGeneral  = {
        name: $stateParams.state,
        params: $scope.params
    };
    $scope.stateDataSpecific = {
        name: $stateParams.state,
        params: $scope.params
    };

});
