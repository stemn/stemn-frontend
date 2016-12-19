angular.module('modules.view-cache', []);
angular.module('modules.view-cache');

//directive('viewCache', function ($state, $rootScope) {
//    /***************************************************************
//    [uiView] - string
//    ***************************************************************/
//    return {
//        restrict: 'A',
//        link: function(scope, element, attrs){
//
//            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
//                attrs.uiView = attrs.uiView || undefined; // If uiView attr is '', set it to undefined
//                if(attrs.uiView == getActiveView(toState)){
//                    showView()
//                }
//                else{
//                    hideView()
//                }
//                console.log('to '+getActiveView(toState)+' - '+attrs.uiView)
//            });
//
//            // Hoisted functions -----------------------------
//            function getActiveView(toState){
//                if(toState.views){
//                    return Object.keys(toState.views)[0].split("@")[0];
//                }
//            }
//            function hideView(){
//                element.addClass('hide');
//            }
//            function showView(){
//                element.removeClass('hide');
//            }
//        }
//    };
//});
