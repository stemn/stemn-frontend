/**
 * Simple favicon service
 */
angular.module('modules.favico', [])
.factory('favicoService', [
function() {
    var favico = new Favico({
        animation:'popFade',
        bgColor : '#5CB85C',
        textColor : '#fff'
    });

    var badge = function(num) {
        favico.badge(num);
    };
    var reset = function() {
        favico.reset();
    };

    return {
        badge : badge,
        reset : reset
    };
}]);
