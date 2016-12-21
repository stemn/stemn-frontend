import './mathjax.scss';

angular.module('modules.mathjax', [
]);
angular.module('modules.mathjax').

service('MathJaxService', function(LazyLoadingService) {
    this.load = load;

    //////////////////////////////////

    function load() {
        return LazyLoadingService.load([{
            global : 'MathJax',
            src    : 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
            type   : 'js'
        }]).then(function(modules){
            window.MathJax.Hub.Config({
                skipStartupTypeset: true,
                messageStyle: "none",
                "HTML-CSS": {
        //			showMathMenu: false,
        //			scale: 150
                }
            });
            window.MathJax.Hub.Configured();
            return window.MathJax
        })
    }
}).

directive("mathjaxBind", function(MathJaxService) {
	// http://stackoverflow.com/questions/16087146/getting-mathjax-to-update-after-changes-to-angularjs-model
    return {
        restrict: "A",
        controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
            $scope.$watch($attrs.mathjaxBind, function(value) {
                var $script = angular.element("<script type='math/tex'>")
                    .html(value === undefined ? "" : value);
                $element.html("");
                $element.append($script);
                MathJaxService.load().then(function(){
                    window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "MathOutput"]);
                })
            });
        }]
    };
}).

directive("renderInlineMathjax", function($timeout, MathJaxService) {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            scope.$watch(attrs.ngBindHtml, processMathElements);

            ///////////////

            function processMathElements(){
                $timeout(function(){
                    angular.forEach(element[0].querySelectorAll('.math'), function (mathEl) {
                        mathEl = angular.element(mathEl);
                        var content = mathEl[0].innerText || mathEl[0].textContent; // IE || Others
                        var replacementMathEl = angular.element('<span class="inlineMathJax"></span>')
                        mathEl.after(replacementMathEl);
                        mathEl.remove();
                        var $script = angular.element("<script type='math/tex'>")
                            .html(content === undefined ? "" : content);
                        replacementMathEl.html("");
                        replacementMathEl.append($script);
                        MathJaxService.load().then(function(){
                            window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "MathOutput"]);
                        })
                    });
                },1)
            }
        }
    };
});
