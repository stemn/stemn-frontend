angular.module('modules.modular-editor.toolbar', [
]);
angular.module('modules.modular-editor.toolbar').

directive('editorToolbarLayout', function () {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'app/modules/modular-editor/toolbar/toolbar.html',
		controller: function($scope){
			$scope.layoutButtonDetails = {
				'full-width' : {
					tooltip : 'Full width',
					icon    : 'layout-full-width',
				},
				'full-width-banner' : {
					tooltip : 'Full width banner',
					icon    : 'layout-full-width-banner',
				},
				'full-width-banner-text' : {
					tooltip : 'Full width banner text',
					icon    : 'layout-full-width-banner-text',
				},
				'left' : {
					tooltip : 'Left',
					icon    : 'layout-left',
					},
				'right' : {
					tooltip : 'Right',
					icon    : 'layout-right',
				},
				'center' : {
					tooltip : 'Center',
					icon    : 'layout-center',
				},
				'wide' : {
					tooltip : 'Wide',
					icon    : 'layout-wide',
				}
			}
			if($scope.section.type == 'image'){
				if($scope.editorOptions.contained){
					$scope.layoutButtons = [
						'left',
						'center',
						'wide',
						'right',
					]
				}
				else{
					$scope.layoutButtons = [
						'full-width',
						'full-width-banner',
						'full-width-banner-text',
						'left',
						'center',
						'wide',
						'right',
					]
				}
			}
			else if($scope.section.type == 'video'){
				$scope.layoutButtons = [
					'left',
					'wide',
					'right',
				]
			}
			else{
				console.error('No type defined');
			}
		}
	};
}).


directive('editorToolbar', function ($compile, $timeout, $document) {
	// This is enabled/disabled by changing the attribute value
	// Example:
	// <div editor-toolbar="true">Some Content</div>  - This is enabled
	// <div editor-toolbar="false">Some Content</div> - This is disabled
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var bodyElement = angular.element(document.body);
			var toolbarEle
			element.bind('click', function(){
				if(attrs.editorToolbar == 'true'){
					if(!toolbarEle){createToolbar()}
					$timeout(function(){
						positionToolbar(toolbarEle, element)
						toolbarEle.addClass('medium-editor-toolbar-active');
						bindNextClick();
					},100)
				}
			})
			function createToolbar(){
				toolbarEle = angular.element('<editor-toolbar-layout></editor-toolbar-layout>')
				$compile(toolbarEle)(scope);
				bodyElement.append(toolbarEle)
			}
			function positionToolbar (toolbarElement, containerEle) {
				// position the toolbar at left 0, so we can get the real width of the toolbar
				toolbarElement[0].style.left = '0';

				var diffTop  = -10;
				var diffLeft = 0;

				var windowWidth = window.innerWidth,
					boundary = containerEle[0].getBoundingClientRect(),
					middleBoundary = (boundary.left + boundary.right) / 2,
					toolbarHeight = toolbarElement[0].offsetHeight,
					toolbarWidth = toolbarElement[0].offsetWidth,
					halfOffsetWidth = toolbarWidth / 2,
					buttonHeight = 50,
					defaultLeft = diffLeft - halfOffsetWidth;

				if (boundary.top < buttonHeight) {
					toolbarElement[0].classList.add('medium-toolbar-arrow-over');
					toolbarElement[0].classList.remove('medium-toolbar-arrow-under');
					toolbarElement[0].style.top = buttonHeight + boundary.bottom - diffTop + window.pageYOffset - toolbarHeight + 'px';
				}
				else {
					toolbarElement[0].classList.add('medium-toolbar-arrow-under');
					toolbarElement[0].classList.remove('medium-toolbar-arrow-over');
					toolbarElement[0].style.top = boundary.top + diffTop + window.pageYOffset - toolbarHeight + 'px';
				}

				if (middleBoundary < halfOffsetWidth) {
					toolbarElement[0].style.left = defaultLeft + halfOffsetWidth + 'px';
				} else if ((windowWidth - middleBoundary) < halfOffsetWidth) {
					toolbarElement[0].style.left = windowWidth + defaultLeft - halfOffsetWidth + 'px';
				} else {
					toolbarElement[0].style.left = defaultLeft + middleBoundary + 'px';
				}
			}
			function bindNextClick(){
				$document.bind('click', function(event){
					$document.unbind('click');
					toolbarEle.removeClass('medium-editor-toolbar-active');
					scope.$apply();
				})
			}
		}
	};
});
