angular.module('views.growth-accounting', [
]);
angular.module('views.growth-accounting').

config(function ($stateProvider) {
    $stateProvider.state('app.growth', {
        url: "/growth",
        templateUrl: "app/views/growth-accounting/growth-accounting.html",
    });
});
