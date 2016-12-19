angular.module('views.app', [
    'ui.router',
    'modules.toggle-menu',
])

angular.module('views.app').
config(function($stateProvider){
    $stateProvider.state('app', {
//            url: '',
        abstract: true,
        resolve: {
            userdata: function (Authentication) {
                return Authentication.loadUserData();
            }
        },
        templateUrl: 'app/views/app/app.tpl.html',
        controller: 'AppViewCtrl',
        data: {
            pageTitle: 'Home',
            viewClass: 'home'
        }
    });
});
