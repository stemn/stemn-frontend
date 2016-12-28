import './tab-dropdown.scss';

angular.module('modules.tab-dropdown', [
]);
angular.module('modules.tab-dropdown').

directive('tabDropdown', function ($compile, $document, $timeout) {
    return {
        restrict: 'A',
        scope: {
            tabDropdown : '='
        },
        link: function (scope, element, attrs){

            element.bind("click", function (e) {
                var dropdownEl = createDropdown();
                positionElement(dropdownEl)
                $timeout(function(){bindCloseClick(dropdownEl)},10)
            })

            // Hoisted functions --------------------------
            function bindCloseClick(dropdown){
                $document.bind('click touchstart', function (e) {
                    dropdown.remove()
                    unbindCloseClick();
                });
            }
            function unbindCloseClick(){
                $document.unbind('click touchstart');
            }
            function positionElement(dropdown){
                var boundingRect = element[0].getBoundingClientRect();
                dropdown.css({
                    'position' : 'fixed',
                    'top'      : boundingRect.top,
                    'left'     : boundingRect.left,
                    'right'    : window.innerWidth-boundingRect.right,

                })

            }





            function createDropdown(){
                var template = angular.element(
                    '<tab-dropdown>'+
                        '<div ng-repeat="item in tabDropdown">'+
                            '<a>{{item.name}}</a>'+
                        '</div>'+
                    '</tab-dropdown>'
                );
                // Compile the element
                $compile(template)(scope);
                // Append element to body
                angular.element(document.body).append(template);
                return template
            }
        }
    };
});
