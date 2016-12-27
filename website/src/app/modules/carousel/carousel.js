import './carousel.scss';

angular.module('modules.carousel', []);
angular.module('modules.carousel').

directive('carousel', function () {
    return {
        restrict: 'E',
        scope: {
            slides   : '=?', // [{image:''},{image:''}]
            slide    : '@?', // imageUrl
            interval : '@' // Timeout between changes
        },
        replace: true,
        transclude: true,
        template: require('./tpls/carousel.html'),
        controller: function ($scope, $interval) {
            $scope.interval = $scope.interval || 7000;
            $scope.activeSlide = 0;
            var counter = 0;

            // If we pass in slide, we just want to display a banner
            if($scope.slide){
                $scope.slides = [{
                    image : $scope.slide,
                }]
            }else{
                $interval(function(){
                    counter ++;
                    $scope.activeSlide = counter % $scope.slides.length;
                }, $scope.interval)
            }
        }
    }
});
