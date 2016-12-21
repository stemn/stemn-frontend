import './uploads.scss';

angular.module('modules.uploads', [
	'modules.upload-files'
]);
angular.module('modules.uploads').

directive('uploadImage', function ($compile, UploadsModalService, $timeout, FileUploadService) {
    /***************************************************************
    This element directive is used to wrap an image element.

    It can be combined with an ng-model and name to create a memory of previous state (using edit directive)
        <upload-image name="ThreadImage" image="thread.image" ng-model="thread.image">
            <img ng-src="{{thread.image}}">
        </upload-image>

    The image url is assigned to the object passed in using [image] attr

    ****************************************************************/
    return {
        restrict: 'E',
        trasclude: 'true',
        scope: {
            image  : '=',  // The image that will be uploaded, the url will be pass back though this.
            direct : '=?', // true || false - If true, the upload dialog will pop directly without the drag/drop modal
            icon   : '=?', // true || false - If false, the upload icon will be hidden
            circle : '=?',  // true || false - If true, we add border-radius: 50%
            noOverlay : '=?'  // true || false - If true, we don't add a dark overlay
        },
        link: function(scope, element, attrs) {
            // The image should be the first child
            var image = angular.element(element.children()[0])
            $timeout(function(){
                if(!scope.noOverlay){
                    image.addClass('darken-image');
                }
                element.css({cursor : 'pointer'})
            })

            // Create the child
            var child
            if(scope.direct){
                scope.uploader = FileUploadService.uploader();
                scope.uploader.onCompleteItem = function (item, response, status, headers) {
					if(item.file.url && item.file.url != 'false'){
                    	scope.image = item.file.url;
					}
                };
                child = angular.element(
                    '<label class="btn-upload" layout="column" layout-align="center center" ng-class="{\'img-circle\' : circle}" style="overflow: hidden;">'+
                        '<input type="file" accept=".png, .jpg, .jpeg, .gif" class="upload" nv-file-select="" uploader="uploader" />'+
                        '<md-icon ng-show="icon" style="color: #FFF;" class="upload-icon" md-svg-icon="upload"></md-icon>'+
                        '<loading-overlay ng-if="uploader.progress > 0 && uploader.progress < 100" determinate="uploader.progress"></loading-overlay>'+
                        '<loading-overlay ng-if="uploader.progress == 100 && !uploader.queue[uploader.queue.length-1].file.url"></loading-overlay>'+
                    '</label>');
            }
            else{
                child = angular.element('<md-icon ng-show="icon" style="color: #FFF;" class="upload-icon" md-svg-icon="upload"></md-icon>');
            }

            // Insert it after the input box
            element.append(child);
            // Add it to the compile
            $compile(child)(scope);
            // Add the click event, this will pop the upload image modal and set the image url to scope.image
            element.bind('click', function (event) {
                if(!scope.direct){
                    UploadsModalService.uploadImageNewModal(event, scope.image).then(function (result) {
                        scope.image = result.url;
                    });
                }
                // Else, pop the upload select directly
            });
        },
    }
}).

directive('clickUploadImage', function (UploadsModalService) {
    return {
        restrict: 'A',
        scope: {
            image: '='
        },
        link : function(scope, element, attrs){
            element.bind('click', function (event) {
                UploadsModalService.uploadImageNewModal(event).then(function(result){
                    scope.image = result.url;
                })
            });
        }
    }
}).


service('UploadsModalService', function ($mdDialog) {

    this.uploadImageNewModal = function (event, data) {
        /***********************************************************
        This modal will return a promise.
        The uploaded image url will be available using:

        .then(function (result) {
            console.log(result + ' is the image url')
        });
        ************************************************************/
        return $mdDialog.show({
            templateUrl: 'app/modules/uploads/tpls/upload-image-new-modal.html',
            controller: 'UploadImageNewModalCtrl',
            targetEvent: event,
            clickOutsideToClose: true,
            locals : {
                data  : data,
            }
        })
    }
    this.uploadImagesNewModal = function (event, data) {
        /***********************************************************
        This modal will return a promise.
        The uploaded images  will be available using:

        .then(function (result) {
            console.log(result + ' is the array of image urls')
        });
        ************************************************************/

        return $mdDialog.show({
            templateUrl: 'app/modules/uploads/tpls/upload-images-new-modal.html',
            controller: 'UploadImagesNewModalCtrl',
            targetEvent: event,
            locals : {
                data  : data,
            }
        })
    }
	this.uploadFiles = function (event, data) {
        /***********************************************************
        This modal will return a promise.
        The uploaded files  will be available using:

        .then(function (result) {
            console.log(result + ' is the array of files')
        });
        ************************************************************/

        return $mdDialog.show({
            templateUrl: 'app/modules/uploads/tpls/upload-files-modal.html',
            controller: 'UploadFilesModalCtrl',
            targetEvent: event,
			clickOutsideToClose: true,
            locals : {
                data  : data,
            }
        })
    }
}).

controller('UploadImageNewModalCtrl', function (data, $scope, $mdDialog, FileUploadService) {
    $scope.currentImage = data;
    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    // Scoped functions
    $scope.remove = remove;

    $scope.uploader = FileUploadService.uploader();
    $scope.uploader.onCompleteItem = function (item, response, status, headers) {
        var image = {
            url    : response.url,
            width  : response.width,
            height : response.height
        }
        $mdDialog.hide(image);
    };

    /////////////////////////////////

    function remove(){
        $mdDialog.hide({url:''});
    }
}).

controller('UploadImagesNewModalCtrl', function (data, $scope, $mdDialog, FileUploadService) {
    $scope.images = angular.copy(data);

    $scope.sortableConfig = {
        animation: 150
    };
    $scope.remove = function(index){
        $scope.images.splice(index, 1)
    }
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.save = function () {
        $mdDialog.hide($scope.images);
    };
    $scope.uploader = FileUploadService.uploader();
    $scope.uploader.onCompleteItem = function (item, response, status, headers) {
        $scope.images.push({url: item.file.url})
    };
}).

controller('UploadFilesModalCtrl', function (data, $scope, $mdDialog, FileUploadService) {
    var files = [];
	$scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.uploader = FileUploadService.generalFileUploader();
    $scope.uploader.onCompleteItem = function (item, response, status, headers) {
		var splitType = item.file.name.split('.');
		item.file.type = splitType[splitType.length-1];
		files.push(item.file)
		if($scope.uploader.progress == 100){
	        $mdDialog.hide(files);
		}
    };
}).

//controller('TestCtrl', function ($rootScope, $scope) {
//
//    $scope.files = [
//        {
//            url: '/uploads/upload_b0288c19ac5f29e4bd793cdef14a6c2f.png'
//        }
//    ]
//    $scope.uploadImageModal = function(files, single, crop, shape, imgSize, aspect){
////        $modal.open({
////            templateUrl: 'app/modules/uploads/tpls/crop-imageuploadmodal.html',
////            size: 'md',
////            backdrop: 'static',
////            resolve: {
////                data: function () {
////                    return {
////                        files   : files,
////                        single  : single,
////                        crop    : crop,
////                        shape   : shape,
////                        imgSize : imgSize,
////                        aspect  : aspect,
////                    }
////                }
////            },
////            controller: function($scope, $modalInstance, data){
////                $scope.files  = data.files;
////                $scope.single = data.single;
////                $scope.crop   = data.crop;
////                $scope.shape  = data.shape;
////                $scope.imgSize= data.imgSize;
////                $scope.aspect = data.aspect;
////
////                $scope.closeModal = function () {
////                    $modalInstance.close();
////                }
////                $scope.saveCloseModal = function () {
////                    $modalInstance.close({
////                        files: $scope.files
////                    });
////                }
////            }
////        }).result.then(function (result) {
////            // If the modal was saved
////            if (result) {
////                $scope.files = result.files;
////            }
////        });
//    };
//}).

service('FileUploadService', function(FileUploader, $mdToast, Authentication, $state, $stateParams) {

    this.uploader = function() {
        var uploader = new FileUploader({
            url        : '/api/v1/uploads',
            autoUpload : true,
            headers: {
                Authorization: 'Bearer ' + Authentication.getToken(),
            },
            formData : [{ state : $state.current.name }, { params : JSON.stringify($stateParams) }]
        });
        uploader.filters.push(imageTypeFilter);
        uploader.filters.push(fileSizeFilter);
        // CALLBACKS
        uploader.onSuccessItem = onSuccessitem;
        uploader.onErrorItem = onErrorItem;
        return uploader;
    }
	this.generalFileUploader = function() {
        var uploader = new FileUploader({
            url        : '/api/v1/uploads/files',
            autoUpload : true,
            headers: {
                Authorization: 'Bearer ' + Authentication.getToken(),
            },
            formData : [{ state : $state.current.name }, { params : JSON.stringify($state.current.params) }]
        });
        uploader.filters.push(fileSizeFilter);
        // CALLBACKS
        uploader.onSuccessItem = onSuccessitem;
        uploader.onErrorItem = onErrorItem;
        return uploader;
    }
    this.documentFileUploader = function() {
        var uploader = new FileUploader({
            url        : '/api/v1/uploads/files',
            autoUpload : true,
            headers: {
                Authorization: 'Bearer ' + Authentication.getToken()
            },
            formData : [{ state : $state.current.name }, { params : JSON.stringify($state.current.params) }]
        });
        uploader.filters.push(documentTypeFilter);
        uploader.filters.push(fileSizeFilter);
        // CALLBACKS
        uploader.onSuccessItem = onSuccessitem;
        uploader.onErrorItem = onErrorItem;
        return uploader;
    }

    this.FileItem = FileUploader.FileItem;

	////////////////////////////////////////////////////
	var imageTypeFilter = {
		name: 'imageFilter',
		types: '|jpg|png|jpeg|bmp|gif|',
		fn: function(item, options) {
			var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
			if ('|jpg|jpeg|png|bmp|gif|'.indexOf(type) == -1) {
                $mdToast.show(
                    $mdToast.simple().
                    theme('warn').
                    content('We only accept jpg, png, bmp, and gif.')
                );
				return false;
			} else {
				return true;
			}
		}
	}
    var documentTypeFilter = {
		name: 'documentFilter',
		fn: function(item, options) {
			var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            var splitName = item.name.split('.');
			if (splitName[splitName.length-1] != 'docx') {
                $mdToast.show(
                    $mdToast.simple().
                    theme('warn').
                    content('Invalid file. We only accept .docx')
                );
				return false;
			} else {
				return true;
			}
		}
	}
	var fileSizeFilter = {
		name: 'fileSize',
		fn: function (item) {
			if (item.size > 10485760) {
                $mdToast.show(
                    $mdToast.simple().
                    theme('warn').
                    content('File too large. Try and keep it under 10MB would ya?')
                );
				return false;
			} else {
				return true;
			}
		}
	}
	function onAfterAddingFile(item) {
		item.croppedImage = '';
		var reader = new FileReader();
		reader.onload = function (event) {
			item.image = event.target.result;
		}
		reader.readAsDataURL(item._file);
	}
	function onErrorItem(fileItem, response, status, headers) {
        $mdToast.show(
            $mdToast.simple().
            theme('warn').
            content('Something went wrong, your file was not uploaded.')
        );
	}
	function onSuccessitem(fileItem, response, status, headers) {
		fileItem.file.url = response.url;
	}

}).

// Links the Image Cropping Modal to the Profile Picture
service('ImageCropService', function() {
    return { image : '' }
}).

controller('CropCtrl', function ($scope, ImageCropService) {

    $scope.myImage = ImageCropService.image;
    $scope.myCroppedImage = '';
    $scope.ImageCropService = ImageCropService;

    $scope.EndCrop = function (data) {
        ImageCropService.image = $scope.myCroppedImage;
    };

    var handleFileSelect = function (evt) {
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function ($scope) {
                $scope.myImage = evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
});
