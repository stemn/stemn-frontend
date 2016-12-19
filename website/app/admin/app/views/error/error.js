angular.module('views.error', []);
angular.module('views.error').

config(function ($stateProvider) {
  $stateProvider.state('error', {
    url: "/error",
    templateUrl: "app/views/error/error.html",
    controller: 'ErrorViewCtrl'
  });
}).

controller('ErrorViewCtrl', function ($scope, $http) {
});
