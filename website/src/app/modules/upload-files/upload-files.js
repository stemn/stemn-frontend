import './upload-files.scss';

angular.module('modules.upload-files', [
]);
angular.module('modules.upload-files').

directive('uploadFilesDisplay', function (FileUploadService, UploadsModalService) {
    return {
        restrict: 'E',
        template: require('./tpls/upload-files-display.html'),
		scope: {
			edit : '=',
			files: '='
		},
        controller: function($scope){
			// Defaults
			$scope.files = $scope.files || [];

            $scope.sortableConfig = {
                handle: ".my-handle",
				draggable: ".draggable",
				group: 'files',
                animation: 150,
				onSort: function (event){
					_.forEach(event.models, function(item, index){
						// The item does not exist or has an error, remove it
						if(!item || !item.url){
							event.models.splice(index,1)
						}
					})
				}
            };
			$scope.uploader = FileUploadService.generalFileUploader();
			$scope.uploader.onCompleteItem = function (item, response, status, headers) {
				var splitType = item.file.name.split('.');
				item.file.type = splitType[splitType.length-1];
				$scope.files.push(item.file)
			};

			$scope.delete = deleteFile; //function(index)

			//////////////////////////////////////////

			function deleteFile(index){
				$scope.files.splice(index, 1)
			}


        },
    }
}).
directive('uploadedFile', function ($mdDialog) {
    return {
        restrict: 'E',
        template: require('./tpls/uploaded-file.html'),
        controller: function($scope){

			$scope.editFile = editFile; //function(event)

			///////////////////////////////////////////////

			function editFile(event){
				$mdDialog.show({
					template: require('./tpls/uploaded-file-edit-modal.html'),
					controller: function(data, $scope){
						$scope.data = angular.copy(data);
						$scope.cancel = function () {
							$mdDialog.cancel();
						};
						$scope.delete = function(){
							$mdDialog.hide('delete');
						}
						$scope.save = function () {
							if($scope.LinkForm.$valid){
								$mdDialog.hide($scope.data);
							}
						};
					},
					targetEvent: event,
					locals: {data: $scope.file}
				}).then(function(result){
					if(result == 'delete'){
						$scope.delete($scope.$index)
					}
					else{
						$scope.file = result;
					}
				})
			}



        },
    }
});
