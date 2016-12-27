angular.module('views.scholarship', []);
angular.module('views.scholarship').

config(function ($stateProvider) {
    $stateProvider.
    state('app.scholarship-aerofutures', {
        url: '/aerofutures',
        template: require('./aerofutures.html'),
        controller: function ($rootScope) {
            $rootScope.page.title = 'AeroFutures Scholarship - STEMN';
        }
    });
});
