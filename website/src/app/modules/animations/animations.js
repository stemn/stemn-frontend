import './animations.scss';

angular.module('modules.animations', []);
angular.module('modules.animations').

directive('setNgAnimate', function ($animate) {
    return {
        link: function ($scope, $element, $attrs) {
            $scope.$watch(function () {
                return $scope.$eval($attrs.setNgAnimate, $scope);
            }, function (valnew, valold) {
                $animate.enabled(!!valnew, $element);
            });
        }
    };
}).

directive('attentionAnimation', function () {
    return {
        restrict : 'A',
        link     : function(scope, element, attributes){
            // INPUTS //
            // animate-toggle -- This will toggle the adding of the animation styles
            // animation      -- This will set the animation style

            // the first time the watch runs, it will trigger the animation,
            // so only run the shake if it isn't the first watch trigger
            var animation = attributes.animation || 'shake'; // Default animation
            var firstRun = true;
            var type = animation +' 0.8s'

            attributes.$observe('animateToggle', function(value) {
                if (!firstRun) {
                    // Remove animation
                    element.css({
                        '-webkit-animation' : '',
                        'animation' : ''})
                    // Add animation
                    setTimeout(function(){
                         element.css({
                            '-webkit-animation' : type,
                            'animation' : type})
                    }, 10);
                }
                firstRun = false;
            });
        }
    };
});
