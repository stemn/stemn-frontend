import './caption.scss';
angular.module('modules.modular-editor.caption', [
])

angular.module('modules.modular-editor.caption').
directive('editorCaptionPublic', function () {
	return {
		restrict: 'E',
		template: require('./caption.html'),
	};
}).

directive('editorCaptionEdit', function () {
	return {
		restrict: 'E',
		template: require('./caption.html'),
	};
});
