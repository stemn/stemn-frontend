angular.module('modules.medium-editor-ext-insert-media', [
	'modules.core'
]);
angular.module('modules.medium-editor-ext-insert-media').

service('MediumEditorInsertMediaExt', function ($compile, $timeout, MediumEditorUtilService) {

	this.insertMedia = insertMedia; // function(scope, element, attrs, ctrl)

	/////////////////////////////////////////////////////////////////

	function insertMedia(scope, iElement, attrs, ctrl) {
		return window.MediumEditor.Extension.extend({
			name: 'insert-media',
			init: function () {
				this.initialise();
				this.subscribe('editableClick', this.handleKeydown.bind(this));
				this.subscribe('editableKeyup', this.handleKeydown.bind(this));
			},
			elements: {
				insertButtonEle: '',
			},
			handleKeydown: function (event, editable) {

				MediumEditorUtilService.removeSpanStyles(iElement);
				MediumEditorUtilService.removeEmptyP(iElement);

				var targetElement = angular.element(event.target),
					editableElement = angular.element(editable),
					selection = window.getSelection(),
					self = this,
					range, currentElement;


				$timeout(function(){
					// This section is wrapped in a timeout...
					// When we are focused on a 'h2/h3' and press return, the next line starts off as a 'div'.
					// This div is then replaced with a 'p' (i'm not sure where this happens).
					// Wrapping in a timeout means the range selection will include the 'p' and not the 'div'
					range = selection.getRangeAt(0);
					currentElement = angular.element(range.commonAncestorContainer);

                    // If we are in a TD and not in the first column
                    if(currentElement[0].tagName == 'TD' && currentElement[0].cellIndex > 0){
                        hideButtons();
                        return
                    }
                    // If the element is not a text element
					if (currentElement.length && (currentElement.text().trim() === '') && currentElement[0].nodeName !== '#text') {
						if(!self.elements.insertButtonEle)self.elements.insertButtonEle = createInsertButtons();
                        $timeout(function(){
				            positionButtons(self.elements.insertButtonEle, currentElement); // Give current Element time to render
                        }, 0)
						showButtons();

					} else {
						hideButtons();
					}
				},1)

				// Hotkeys
				if (event.which == 73 && event.ctrlKey) {
					// Ctrl + I
					scope.showInsertTools = !scope.showInsertTools;
					scope.$apply();
				}
				if (event.which == 27) {
					// ESC
					scope.showInsertTools = false;
					scope.$apply();
				}

				////////////////////////////////

				function hideButtons() {
					scope.showInsertButtons = false;
					scope.showInsertTools = false;
					scope.$apply();
				}

				function showButtons() {
					scope.showInsertButtons = true;
					scope.$apply();
				}

				function positionButtons(insertButtonEle, positionEle) {
                    var position = positionEle.position();
                    insertButtonEle.css(position)
				}

				function createInsertButtons() {
					// Note, the insert buttons begin with a 'ng-hide' because otherwise they will animate on initial load
					var insertButtonEle = angular.element('<editor-insert-buttons></editor-insert-buttons');
					// Compile the element
					$compile(insertButtonEle)(scope);
					// Append element to body
					iElement.after(insertButtonEle);
					return insertButtonEle;
				}
			},
			initialise: function () {
				scope.ctrl     = ctrl; // Hack to pass ctrl through on scope
				scope.iElement = iElement; // Hack to pass ctrl through on scope
			}
		})
	}
});
