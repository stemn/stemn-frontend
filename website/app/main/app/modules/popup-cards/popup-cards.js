angular.module('modules.popup-cards', [
    'modules.popup',
    'modules.users',
    'modules.organisations',
    'modules.projects',
]);
angular.module('modules.popup-cards').

directive('popupUser', function () {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        link: function(scope, element, attrs){
            attrs.$observe('userId', function(value) {scope.userId = value});
            scope.userId = attrs.userId;
            scope.href   = attrs.href;
        },
        template: '<a ng-href="{{::href}}" popup popup-content="<personcard id=\'{{userId}}\' size=\'sm\'></personcard>" ng-transclude></a>'
    };
}).

directive('popupField', function () {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        link: function(scope, element, attrs){
            scope.fieldId = attrs.fieldId;
            scope.href   = attrs.href;
        },
        template: '<a ng-href="{{::href}}" popup popup-content="<field-card style=\'padding-top: 10px; display: block;\' id=\'{{::fieldId}}\' size=\'sm\'></field-card>" ng-transclude></a>'
    };
}).

directive('popupOrganisation', function () {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        link: function(scope, element, attrs){
            scope.organisationId = attrs.organisationId;
            scope.href   = attrs.href;
        },
        template: '<a ng-href="{{::href}}" popup popup-content="<organisation-card id=\'{{organisationId}}\' size=\'sm\'></organisation-card>" ng-transclude></a>'
    };
}).

directive('popupProject', function () {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        link: function(scope, element, attrs){
            scope.projectId = attrs.projectId;
            scope.href   = attrs.href;
        },
        template: '<a ng-href="{{::href}}" popup popup-content="<creation-card entity-type=\'project\' entity-id=\'{{projectId}}\'></creation-card>" ng-transclude></a>'
    };
}).

directive('urlCard', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            title    : '@?',
            subTitle : '@?',
            anchor   : '@?'
        },
        controller : function ($scope){
            $scope.href = 'https://stemn.com' + location.pathname;
        },
        templateUrl: 'app/modules/popup-cards/tpls/url-card.html',
    };
});
