import './medium-editor.scss';

angular.module('modules.medium-editor', [
	'modules.medium-editor-ext-backspace-merge',
	'modules.medium-editor-ext-insert-media',
    'modules.medium-editor-ext-mentions',
    'modules.medium-editor-ext-mathjax'
//	'modules.medium-editor-ext-mathjax'
]);
angular.module('modules.medium-editor').

directive('mediumEditor', function (MediumEditorInsertMediaExt, MediumEditorBackspaceMergeExt, MediumEditorMathjaxExt, MediumEditorMentionsExt, $timeout, $interval) {

	// From https://github.com/thijsw/angular-medium-editor/blob/master/src/angular-medium-editor.js
	return {
		require: 'ngModel',
		restrict: 'EA',
		scope: {
			bindOptions        : '=',
			editorOrder        : '=',
			editorSections     : '=',
			editorSectionIndex : '=',
			editorSectionId    : '=',
			editorType         : '@?',
			editorOptions      : '=?'
		},
		link: function (scope, iElement, iAttrs, ctrl) {
//			scope.editorSections[scope.editorSectionIndex].element = iElement;
			var InsertMediaExtension  = MediumEditorInsertMediaExt.insertMedia(scope, iElement, iAttrs, ctrl);
			var MentionsExtension     = MediumEditorMentionsExt.mentions(scope, iElement, iAttrs, ctrl);
			var BackspaceSectionMerge = MediumEditorBackspaceMergeExt.backspaceMerge(scope, iElement, iAttrs, ctrl);
			var CleanCaptionExtension = CleanCaptionExtension(scope, iElement, iAttrs, ctrl);
			var MathButton            = MediumEditorMathjaxExt.mathButton();


			////////////////////////////////////////////////////////////////////////////////////////////////////

			angular.element(iElement).addClass('angular-medium-editor');

			// Parse options
			var opts = {};
			if(scope.editorType == 'caption'){
				opts = {
					toolbar: {
						buttons: ['bold', 'underline', 'anchor'],
					},
					placeholder: { text : 'Enter your caption here...'},
					extensions: {
						'insert-media' : new InsertMediaExtension(),
						'clean-caption': new CleanCaptionExtension(),
					},
					autoLink: true,
					targetBlank: true,
					imageDragging: false,
					buttonLabels: 'fontawesome',
					anchor: {
						linkValidation: true,
					}
				}
			}
			else if(scope.editorType == 'caption-banner'){
				opts = {
					toolbar: {
						buttons: ['h2', 'bold', 'italic', 'underline', 'quote', 'anchor'],
					},
					placeholder: { text : 'Enter your caption here...'},
					extensions: {'insert-media': new InsertMediaExtension()},
					autoLink: true,
					targetBlank: true,
					imageDragging: false,
					buttonLabels: 'fontawesome',
					anchor: {
						linkValidation: true,
					}
				}
			}
			else if(scope.editorType == 'text'){
				opts = {
					toolbar: {
						buttons: ['bold', 'underline', 'anchor'],
					},
					placeholder: { text : iAttrs.placeholder || 'Type your text'},
					autoLink: true,
					targetBlank: true,
					imageDragging: false,
					buttonLabels: 'fontawesome',

				}
			}
            else if(scope.editorType == 'text-rich'){
				opts = {
					toolbar: {
						buttons: ['bold', 'underline', 'anchor', 'quote', 'unorderedlist'],
					},
					placeholder: { text : iAttrs.placeholder || 'Type your text'},
                    extensions: {
                        'mentions': new MentionsExtension(),
					},
					autoLink: true,
					targetBlank: true,
					imageDragging: false,
					buttonLabels: 'fontawesome',
                    anchor: {
						linkValidation: true,
					}

				}
			}
			else{
				opts = {
					toolbar: {
						buttons: ['h2', 'h3', 'bold', 'italic', 'underline', 'quote', 'unorderedlist', 'anchor', 'table', 'math'],
					},
					placeholder: { text : iAttrs.placeholder || 'Text section'},
					extensions: {
						'insert-media': new InsertMediaExtension(),
						'backspace-section-merge' : new BackspaceSectionMerge(),
                        'mentions': new MentionsExtension(),
                        'MathPreview': new (MediumEditorMathjaxExt.mathPreview())(),
                        'MathButton': new MathButton(),
                        'table': new MediumEditorTable(),
					},
					autoLink: true,
					targetBlank: true,
					imageDragging: false,
					buttonLabels: 'fontawesome',
					anchor: {
						linkValidation: true,
					}
				}
			}


			var onChange = function () {
				scope.$apply(function () {
					if (iElement.html() === '<br>' || iElement.html() === '') {
						var editor = new MediumEditor(iElement, opts);
					}
					ctrl.$setViewValue(iElement.html());
				});
			};
			var onFocus = function () {
				// Fix html on focus to make sure we can type.
				var html = iElement.html();
				if(!html
			    || html == '<p></p>'
			    || html == '<br>'
			    || html == '<h1></h1>'
			    || html == '<h2></h2>'
			    || html == '<h3></h3>'){
					iElement.html('<p><br></p>');
				}
			};

			// view -> model
			iElement.on('focus', onFocus);
			iElement.on('blur',  onChange);
			iElement.on('input', onChange);

//			$interval(function(){
//				console.log(ctrl.$viewValue);
//			},1000)

			// model -> view
			ctrl.$render = function () {
				if (!this.editor) {
					this.editor = new MediumEditor(iElement, opts);
				}
				if(!ctrl.$viewValue
				|| ctrl.$viewValue == '<p></p>'
				|| ctrl.$viewValue == '<p><br></p>'
				|| ctrl.$viewValue == '<p class=""></p>'
				|| ctrl.$viewValue == '<p class></p>'
				|| ctrl.$viewValue == '<br>'){
					iElement.html('<p><br></p>');
					iElement.addClass('medium-editor-placeholder');
				}
				else{
					iElement.html(ctrl.$viewValue);
					iElement.removeClass('medium-editor-placeholder')
				}
			};

			////////////////////////////////////////////////////////////////////////

			function CleanCaptionExtension(scope, element, attrs, ctrl) {
				// Unwrap italics and remove h2
				return window.MediumEditor.Extension.extend({
					init: function () {
						$timeout(function(){
							angular.forEach(element[0].querySelectorAll('h2,blockquote'), function (element) {
								angular.element(element).contents().unwrap().wrap('<p></p>')
							})
							angular.forEach(element[0].querySelectorAll('i'), function (element) {
								angular.element(element).contents().unwrap()
							})
						},0)
					}
				});
			}

		}
	};
}).

service('MediumEditorModalService', function ($mdDialog) {
    this.insertVideo = function (event) {
        return $mdDialog.show({
            templateUrl: 'app/modules/medium-editor/tpls/editor-video-modal.html',
            controller: function($scope){
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
                $scope.save = function () {
                    if($scope.LinkForm.$valid){
                        $mdDialog.hide($scope.link);
                    }
                };
            },
            targetEvent: event,
        })
    }
	this.createLink = function (event, link) {
        return $mdDialog.show({
            templateUrl: 'app/modules/medium-editor/tpls/editor-link-modal.html',
            controller: function(data, $scope){
				$scope.data =  {
					link : data
				};
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
                $scope.save = function () {
                    if($scope.LinkForm.$valid){
                        $mdDialog.hide($scope.data);
                    }
                };
            },
            targetEvent: event,
			locals: {data: link}
        })
    }
}).
service('MediumEditorUtilService', function ($mdDialog) {
    this.removeSpanStyles = removeSpanStyles; // function(editorElement)
    this.removeEmptyP     = removeEmptyP;     // function(editorElement)

	///////////////////////////////////

	function removeSpanStyles(editorElement){
		angular.element(editorElement).find("span[style]").contents().unwrap();
	}
	function removeEmptyP(editorElement){
		angular.element(editorElement).find("p:empty").remove();
	}
});
