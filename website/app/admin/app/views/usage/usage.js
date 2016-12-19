angular.module('views.usage', [
]);
angular.module('views.usage').

config(function ($stateProvider) {
    $stateProvider.state('app.usage', {
        url: "/",
        templateUrl: "app/views/usage/usage.html",
        controller: 'UsageViewCtrl'
    });
}).

controller('UsageViewCtrl', function (userdata, $scope) {

});
