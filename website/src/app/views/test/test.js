import testPageDirective from 'pages/TestPage.directive.js';

angular.module('views.test', [
  testPageDirective
]);
angular.module('views.test').

config(function ($stateProvider) {
    $stateProvider.
    state('test', {
        url: '/test',
        template: `<test-page params="params" class="layout-column flex" style="height: 100vh"></test-page>`,
        controller: function($scope, $stateParams, $state){
            $scope.params = $stateParams;
        }
    })
});
