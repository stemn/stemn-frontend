angular.module('modules.image.search', [
]);
angular.module('modules.image.search').

directive('imageSearch', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/image-search/tpls/image-search.html',
        scope: {
            name: '@',
            model: '=?',
            query: '=?', // Callback query function
            multiple: '=?' // true || false - if true, images are added to an array

        },
        controller: function ($scope, $http) {

            $scope.query = function(){
                $scope.loading = true;
                return $http({
                    method: 'GET',
                    skipAuthorization: true,
                    url: 'https://www.googleapis.com/customsearch/v1?q=' + nameConvertToQuery($scope.name) + '&cx=003785480854512233903%3Aagsyong4y2m&fileType=jpg&imgSize=large&imgType=photo&num=8&searchType=image&key=AIzaSyAjfpimM8OB_z1BvpPiSabAWcP-vmby-hs'
                }).then(function (response) {
                    loadingFalse();
                    $scope.imageSearch = response.data;
                }).catch(loadingFalse);
            }
            $scope.selectedImage = selectedImage; // function(imageUrl)

            //////////////////////////////////

            function selectedImage(imageUrl){
                $scope.currentImage = imageUrl;
                $scope.loading = true;
                $http({
                    url    : '/api/v1/download',
                    method : 'POST',
                    data   : {
                        url : imageUrl
                    }
                }).then(function(response){
                    if($scope.multiple){
                        $scope.model = $scope.model || [];
                        $scope.model[0] = {
                            url : response.data.url
                        }
                    }
                    else{
                        $scope.model = response.data.url;
                    }
                    loadingFalse();
                }).catch(loadingFalse)
            }

            function nameConvertToQuery(name) {
                name = name.replace(/\s+/g, "+");
                return name
            }

            function loadingFalse(){
                $scope.loading = false;
            }
        },

    };

})
