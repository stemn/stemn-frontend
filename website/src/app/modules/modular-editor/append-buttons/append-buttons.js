import './append-buttons.scss';
angular.module('modules.modular-editor.append-buttons', [
]);
angular.module('modules.modular-editor.append-buttons').

directive('editorAppendButtons', function () {
	return {
		restrict: 'E',
		templateUrl: 'app/modules/modular-editor/append-buttons/append-buttons.html',
		controller: function($scope, $timeout, ModularEditorService, UploadsModalService, MediumEditorModalService, RealtimeEditorService){
			$scope.insertText = function(event){
				var newSection = ModularEditorService.getTextSection();
				ModularEditorService.pushNewSection($scope.editorSections, newSection);
                var newSections = {};
                newSections[newSection.id] = newSection;
                if($scope.editorOptions.realtime){RealtimeEditorService.addSections(newSections, $scope.editorSections.sectionOrder)}
				focusNewSection(newSection.id);
			}
			$scope.insertImage = function(event){
				UploadsModalService.uploadImageNewModal(event).then(function (result) {
					var newSection = ModularEditorService.getImageSection(result);
					ModularEditorService.pushNewSection($scope.editorSections, newSection);
                    var newSections = {};
                    newSections[newSection.id] = newSection;
                    if($scope.editorOptions.realtime){RealtimeEditorService.addSections(newSections, $scope.editorSections.sectionOrder)}
					focusNewSection(newSection.id);
				})
			}
			$scope.insertVideo = function(event){
				MediumEditorModalService.insertVideo(event).then(function (result) {
					var newSection = ModularEditorService.getVideoSection(result);
					ModularEditorService.pushNewSection($scope.editorSections, newSection);
                    var newSections = {};
                    newSections[newSection.id] = newSection;
                    if($scope.editorOptions.realtime){RealtimeEditorService.addSections(newSections, $scope.editorSections.sectionOrder)}
					focusNewSection(newSection.id);
				})
			}
			$scope.insertMath = function(event){
				var newSection = ModularEditorService.getMathSection();
				ModularEditorService.pushNewSection($scope.editorSections, newSection);
                var newSections = {};
                newSections[newSection.id] = newSection;
                if($scope.editorOptions.realtime){RealtimeEditorService.addSections(newSections, $scope.editorSections.sectionOrder)}
				focusNewSection(newSection.id);
			}
            $scope.insertCode = function(event){
				var newSection = ModularEditorService.getCodeSection();
				ModularEditorService.pushNewSection($scope.editorSections, newSection);
                var newSections = {};
                newSections[newSection.id] = newSection;
                if($scope.editorOptions.realtime){RealtimeEditorService.addSections(newSections, $scope.editorSections.sectionOrder)}
				focusNewSection(newSection.id);
			}
			$scope.insertFiles = function(event){
				UploadsModalService.uploadFiles(event).then(function (result) {
					var newSection = ModularEditorService.getFileSection(result);
					ModularEditorService.pushNewSection($scope.editorSections, newSection);
                    var newSections = {};
                    newSections[newSection.id] = newSection;
                    if($scope.editorOptions.realtime){RealtimeEditorService.addSections(newSections, $scope.editorSections.sectonOrder)}
					focusNewSection(newSection.id);
				})
			}

			///////////////////////////////////////////////

			function focusNewSection(sectionId){
				$timeout(function(){
					if($scope.editorSections.sections[sectionId].contentElement){
						$scope.editorSections.sections[sectionId].contentElement.focus();
					}
				},200)
			}
		}
	};
});
