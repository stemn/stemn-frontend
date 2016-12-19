angular.module('views.home', [
])

angular.module('views.home').

config(function($stateProvider){
    $stateProvider.state('app.home', {
        templateUrl: 'app/views/home/home.tpl.html',
        controller: 'HomeViewCtrl',
        url: '/',
        data: {
            pageTitle: 'Home',
            viewClass: 'home'
        },
    });
});
