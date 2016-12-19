angular.module('modules.lightbox', []);
angular.module('modules.lightbox').

directive('lightbox', function ($mdDialog, $parse) {
    return {
        restrict: 'A',
		/**************************************************************

		[lightbox] = true || false - This enables/disables the lightbox

		[lightbox-image] = image - This is evaluated scope
		[lightbox-images] = [image1, image] - Array of images used for carosel

		The Lightbox images can come in 2 forms:
		1. Image Url
		2. Image object: {
		      image   : {
                url   : 'imageUrl'
              },
		      caption : '',
		   }

		**************************************************************/
        link: function(scope, element, attrs) {
			element.bind('click', function (event) {
				if(attrs.lightbox != 'false'){
					var lightboxImage  = $parse(attrs.lightboxImage)(scope)
					var lightboxImages = $parse(attrs.lightboxImages)(scope)

					var data = {
						lightboxImage  : lightboxImage,
						lightboxImages : lightboxImages,
					}

					if (lightboxImage || lightboxImages){
						return $mdDialog.show({
							templateUrl: 'app/modules/lightbox/tpls/lightbox-modal.html',
							targetEvent: event,
							locals : {
								data : data
							},
							controller: function (data, $scope) {
								$scope.lightboxImages = data.lightboxImages;
								$scope.lightboxImage  = data.lightboxImage;
                                $scope.loading = true;
								// If the is an Images Array
								if ($scope.lightboxImages){
									// Set the Current Image
									var Current
									if($scope.lightboxImages.indexOf($scope.lightboxImage) != -1){
										Current = $scope.lightboxImages.indexOf($scope.lightboxImage);
									}
									else {
										Current = 0;
									}
									var NumImages = $scope.lightboxImages.length;
									setCurrentImage($scope.lightboxImages[Current])

									$scope.next = function(){
										if( Current == NumImages - 1 ){Current = 0}
										else {Current = Current + 1}
										$scope.setImage(Current)
										$scope.current = Current;
                                        $scope.loading = true;
									}
									$scope.prev = function(){
										if( Current === 0 ){Current = NumImages - 1}
										else {Current = Current - 1}
										$scope.setImage(Current)
										$scope.current = Current;
                                        $scope.loading = true;
									}
									$scope.setImage = function(Current){
										setCurrentImage($scope.lightboxImages[Current])
									}
									$scope.current = Current;
								}
								// Otherwise, Single Image...
								if (!$scope.lightboxImages){
									setCurrentImage(lightboxImage)
								}

								$scope.cancel = function () {
									$mdDialog.cancel();
								};

								//////////////////////////////////////////////////////

								function setCurrentImage(image){
									// If the image is an object (with caption)
									if(image.image){
										$scope.currentImage = image;
									}
									// If it is a plain Url (no caption)
									else{
										$scope.currentImage = {
											image: {
                                                url : image
                                            },
											caption: '',
										}
									}
								}
							}

						})
					}
				}
			});


        },
    };
});
