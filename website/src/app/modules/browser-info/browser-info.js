angular.module('modules.browser-info', [
]);
angular.module('modules.browser-info').
run(function ($mdDialog, $timeout) {

    // Get browser info
    var browserInfo = get_browser_info();
    if(browserInfo.name == 'IE' || browserInfo.name == 'Opera'){
        $timeout(showBadBrowserModal, 5000)
    }
    // Hoisted functions -----------------------------------------------------------------------------
    function showBadBrowserModal(){
        $mdDialog.show({
            templateUrl: 'app/modules/browser-info/tpls/bad-browser-modal.html',
            controller: function(data, $scope){
				console.log('open');
                $scope.data = data;
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
                $scope.confirm = function () {
                    $mdDialog.cancel();
                };
            },
            locals: {data: browserInfo},
			targetEvent: null
        });
    }

    function get_browser_info() {
        // From http://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser
        var ua = navigator.userAgent,
            tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

        // suport for prerender phantomjs browser
        if (/prerender/i.test(M.input)) {
            return {
                name: 'Prerender',
            };
        }
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return {
                name: 'IE',
                version: (tem[1] || '')
            };
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\bOPR\/(\d+)/)
            if (tem != null) {
                return {
                    name: 'Opera',
                    version: tem[1]
                };
            }
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) {
            M.splice(1, 1, tem[1]);
        }
        return {
            name: M[0],
            version: M[1]
        };
    }
});
