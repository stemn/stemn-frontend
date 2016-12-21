import './section-buttons.scss';

angular.module('modules.modular-editor.section-buttons', [
]);
angular.module('modules.modular-editor.section-buttons').

directive('editorSectionButtons', function (UploadsModalService, MediumEditorModalService, RealtimeEditorService) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'app/modules/modular-editor/section-buttons/section-buttons.html',
		controller: function($scope){
			$scope.deleteSection       = deleteSection;       // function()
			$scope.checkMergeAbove     = checkMergeAbove;     // function()
			$scope.checkMergeBelow     = checkMergeBelow;     // function()
			$scope.mergeWihAbove       = mergeWithAbove;      // function()
			$scope.mergeWithBelow      = mergeWithBelow;      // function()
			$scope.changeImage         = changeImage;         // function(event)
			$scope.uploadFiles         = uploadFiles;         // function(event)
			$scope.changeVideo         = changeVideo;         // function(event)
			$scope.createLink          = createLink;          // function(event, link)
			$scope.highlightSection    = highlightSection;    // function(sectionIndex, style)
			$scope.deleteHighlight     = deleteHighlight;     // function(sectionIndex
			$scope.deleteUnhighlight   = deleteUnhighlight;    // function(sectionIndex)
			$scope.unhighlightSection  = unhighlightSection;  // function(sectionIndex)
			$scope.highlightSections   = highlightSections;   // function()
			$scope.unhighlightSections = unhighlightSections; // function()

			//////////////////////////////////////
			function deleteSection(){
				delete $scope.editorSections[$scope.editorSectionId]
				$scope.editorOrder.splice($scope.editorSectionIndex,1);
				if($scope.editorOptions.realtime){RealtimeEditorService.deleteSection($scope.editorSectionId)};
			}

			function checkMergeAbove(){
				// returns true if we can merge
				if($scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex]] && $scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex-1]] &&
				   (!RealtimeEditorService.edits[$scope.editorOrder[$scope.editorSectionIndex-1]] || !$scope.editorOptions.realtime ) && // If the previous section is not locked
					$scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex]].type == 'text' && $scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex-1]].type == 'text'){
					return true
				}
				else {
					return false;
				}
			}
			function checkMergeBelow(){
				// returns true if we can merge
				if($scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex]] && $scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex+1]] &&
				   (!RealtimeEditorService.edits[$scope.editorOrder[$scope.editorSectionIndex+1]] || !$scope.editorOptions.realtime ) && // If the previous section is not locked
					$scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex]].type == 'text' && $scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex+1]].type == 'text'){
					return true
				}
				else {
					return false;
				}
			}

			function mergeWithAbove(){
				// Check if we can merge
				if(checkMergeAbove()){
					// Add the content onto the previous section
					$scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex-1]].content = $scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex-1]].content + $scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex]].content;
					if($scope.editorOptions.realtime){RealtimeEditorService.saveSection($scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex-1]])}
					$scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex-1]].contentElement.focus(); // This change focus saves
					deleteSection();
					unhighlightSections()
				}
			}

			function mergeWithBelow(){
				// Check if we can merge
				if(checkMergeBelow()){
					// Add the content onto the previous section
					$scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex+1]].content = $scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex]].content + $scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex+1]].content;
					if($scope.editorOptions.realtime){RealtimeEditorService.saveSection($scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex+1]])}
					$scope.editorSections[$scope.editorOrder[$scope.editorSectionIndex+1]].contentElement.focus(); // This change focus saves
					deleteSection()
					unhighlightSections()
				}
			}

			function changeImage(event){
				UploadsModalService.uploadImageNewModal(event).then(function (result) {
					$scope.section.image = result;
				});
			}
			function uploadFiles(event){
				UploadsModalService.uploadFiles(event).then(function (result) {
					$scope.section.files = $scope.section.files.concat(result);
				});
			}

			function changeVideo(event){
				MediumEditorModalService.insertVideo(event).then(function (result) {
					$scope.section.videoUrl = result;
				});
			}
			function createLink(event, link){
				MediumEditorModalService.createLink(event, link).then(function (result) {
					$scope.section.linkUrl = result.link;
				});
			}

			function highlightSection(sectionIndex){
				$scope.editorSections[$scope.editorOrder[sectionIndex]].sectionElement.addClass('highlight-edit');
			}
            function deleteHighlight(sectionIndex){
				$scope.editorSections[$scope.editorOrder[sectionIndex]].sectionElement.addClass('highlight-delete');
			}
            function deleteUnhighlight(sectionIndex){
				$scope.editorSections[$scope.editorOrder[sectionIndex]].sectionElement.removeClass('highlight-delete');
			}
			function unhighlightSection(sectionIndex){
				$scope.editorSections[$scope.editorOrder[sectionIndex]].sectionElement.removeClass('highlight-edit')
			}
			function highlightSections(){
				_.forEach($scope.editorSections,function(section){
					if(section.sectionElement){
						section.sectionElement.addClass('highlight-edit')
					}
				})
			}
			function unhighlightSections(){
				_.forEach($scope.editorSections,function(section){
					if(section.sectionElement){
						section.sectionElement.removeClass('highlight-edit')
					}
				})
			}

		}
	};
});
