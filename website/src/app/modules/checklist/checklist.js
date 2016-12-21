angular.module('modules.checklist', []);
angular.module('modules.checklist').

directive('checklistItem', function () {
    return {
        restrict: 'E',
		transclude: true,
        scope: {
			itemComplete : '=',
			itemHref     : '=',
			itemClick    : '=',
        },
        templateUrl: 'app/modules/checklist/tpls/checklist-item.html',
    };
});
