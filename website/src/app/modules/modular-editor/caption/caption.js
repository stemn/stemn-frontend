import './caption.scss';
angular.module('modules.modular-editor.caption', [
])

angular.module('modules.modular-editor.caption').
directive('editorCaptionPublic', function () {
	return {
		restrict: 'E',
		templateUrl: 'app/modules/modular-editor/caption/public/caption.html',
	};
}).

directive('editorCaptionEdit', function () {
	return {
		restrict: 'E',
		templateUrl: 'app/modules/modular-editor/caption/edit/caption.html',
	};
});
