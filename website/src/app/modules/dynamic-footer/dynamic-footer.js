angular.module('modules.dynamic-footer', [
    'modules.compile'
]);
angular.module('modules.dynamic-footer').


run(function ($rootScope, $dynamicFooter, $timeout) {
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        // Split the state.name to find substates, for example: app.user.projects
        var toStates = toState.name.split(".");
        var fromStates = fromState.name.split(".");
        // Compare the first substate, if it has changed, we close the footer
        if(toStates[1] != fromStates[1]){
            $dynamicFooter.open = false;
        }
    });
}).

directive('dynamicFooter', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {},
        template: require('./tpls/dynamic-footer.html'),
        controller: function ($scope, $dynamicFooter) {
            $scope.$dynamicFooter = $dynamicFooter;
            $scope.$dynamicFooter.open = true;
        }
        // Content is passed into the dynamic footer with all formatting.
        // This should be done with a directive that has replace = true.
    };
}).

directive('entityFooter', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            showEdit: '=',
            userCanEdit: '=',
            entity: '=',
            publishFn: '&',
            editFn   : '&'
        },
        template: require('./tpls/entity-footer.html'),
        controller: function($scope, CoreLibrary){
            if($scope.entity.type == 'project'){
                $scope.confirmBody = 'You should add as many relevant tags as possible. If you dont, your project will be difficult to find and will not reach an appropriate audience. <br><a class="text-green" href="/projects/'+$scope.entity.stub+'?edit=ProjectMainForm#tagsEdit">Add tags now.</a>'
            }
            else if ($scope.entity.type == 'blog'){
                $scope.confirmBody = 'You should add as many relevant tags as possible. If you dont, your update will be difficult to find and will not reach an appropriate audience. <br><a class="text-green" href="/blogs/'+$scope.entity.stub+'?edit=BlogForm#tagsEdit">Add tags now.</a>'
            }
            else{
                $scope.confirmBody = 'You should add as many relevant tags as possible. If you dont, your thread will be difficult to find and will not reach an appropriate audience. <br><a class="text-green" href="/threads/'+$scope.entity.stub+'?edit=ThreadForm#tagsEdit">Add tags now.</a>'
            }
            $scope.altType = CoreLibrary.getAltType($scope.entity.type)
            $scope.togglePublicView = togglePublicView; // function()

            //////////////////////////////////////////////

            function togglePublicView(){
                $scope.showEdit = !$scope.showEdit;
            }
        }
    };
}).

directive('hideFooterWhenVisible', function ($window, $dynamicFooter) {
	/******************************************************************
	This directive will hide the footer when you scroll past an element
	with [hide-footer-when-visible]

	[hide-footer-when-visible] = false - This will prevent any action

	******************************************************************/
    return {
        restrict: 'A',
		link: function (scope, element, attrs) {
			var windowEl = angular.element($window);

			var handler = function () {
				if(attrs.hideFooterWhenVisible != 'false'){
					var eleOffsetTop = element.offset().top;
					// If the element is in ng-hide then eleOffsetTop will equal $window.scrollY;
					if(eleOffsetTop !== 0 && eleOffsetTop !== $window.scrollY){
						if($window.scrollY <= eleOffsetTop - $window.innerHeight){
							$dynamicFooter.open = true;
						}
						// If the window is small, the element will always be visible. Show in this case
						else if (eleOffsetTop <=  $window.innerHeight){
							$dynamicFooter.open = true;
						}
						else{
							$dynamicFooter.open = false;
						}
					}
					else{
						// Else the element is hidden
						$dynamicFooter.open = true;
					}
				}
			}
//			windowEl.on('scroll', scope.$apply.bind(scope, handler));
			handler();
			windowEl.on('scroll', handler);

			// Unbind on destroy
			scope.$on('$destroy', function() {
				windowEl.off('scroll', handler);
			});
		}
    };
}).


service('$dynamicFooter', function () {
    return {
        open    : true,
		enabled : true,
        content : '', // Content
        scope   : ''  // Scope to compile the content in
    };
});
