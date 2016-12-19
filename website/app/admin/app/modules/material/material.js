angular.module('modules.material', []);
angular.module('modules.material').

config(function($mdThemingProvider) {
  $mdThemingProvider.theme('warn')
    .primaryPalette('red')


//  $mdThemingProvider.theme('dark', 'default')
//  .primaryPalette('yellow')
//  .dark();

});
