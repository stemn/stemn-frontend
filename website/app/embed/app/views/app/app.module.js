angular.module('views.app', [
])

angular.module('views.app').
config(function($stateProvider){
    $stateProvider.state('app', {
        abstract: true,
        templateUrl: 'app/views/app/app.tpl.html',
        controller: 'AppViewCtrl',
        data: {
            pageTitle: 'Home',
            viewClass: 'home'
        },
    });
});
