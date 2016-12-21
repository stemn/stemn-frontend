import './section.scss';
angular.module('modules.modular-editor.section', [
]);
angular.module('modules.modular-editor.section').

directive('editorSection', function (CodeMirrorService) {
	return {
		restrict: 'E',
		scope: {
			section            : '=',
			editorSections     : '=',
			editorOrder        : '=',
			editorSectionIndex : '=',
			editorSectionId    : '=',
			editorOptions      : '=',
			edit               : '=',
            placeholder        : '@'
		},
        link: function (scope, element, attrs){
//            getTemplatePath();
            scope.$watch('section.layout', getTemplatePath)



            if(scope.section.type == 'code'){
                // Code otions
                scope.options = {
                    indentWithTabs: true,
                    readOnly: !scope.edit,
                    dragDrop: false,
                    lineWrapping: true,
                    onLoad: function(cmEditor){
                        scope.cmEditor = cmEditor;
                        CodeMirrorService.changeCodeMode(cmEditor, scope.section.codeMode)
                    }
                };
            }

            ////////////////////////////

            function getTemplatePath(){
                var path = 'app/modules/modular-editor/section/';
                path += scope.section.type + '/';
                path += scope.edit ? 'edit/' : 'public/';
                path += scope.section.layout ? scope.section.layout : scope.section.type;
                path += '.html';
                scope.template = path
            }
        },
		template: '<div layout="row" layout-align="center" ng-include="template"></div>',
	};
}).

directive('editorVideoOverlay', function () {
	return {
		restrict: 'E',
		replace: true,
		// tabindex allows the div to be focused
		template: '<div tabindex="0" ng-if="edit" class="editor-video-overlay"></div>',
	};
});
