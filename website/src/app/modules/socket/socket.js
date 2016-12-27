angular.module('modules.socket', []);
angular.module('modules.socket').

service('SocketService', function ($rootScope) {
//    var socket = window.io('/editor').connect();

//    var socket = window.io().connect();
//    window.io.Manager('http://localhost:3000', { autoConnect: false });
//    var socket = window.io();
    this.on = on; // function (eventName, callback)
    this.emit = emit; // function (eventName, data, callback)
//
//    /////////////////////////////////////////////////////////

//    function on (eventName, callback) {
//        function wrapper() {
//            var args = arguments;
//            $rootScope.$apply(function () {
//                callback.apply(socket, args);
//            });
//        }
//
//        socket.on(eventName, wrapper);
//
//        return function () {
//            socket.removeListener(eventName, wrapper);
//        };
//    }
//
//    function emit (eventName, data, callback) {
//        socket.emit(eventName, data, function () {
//            var args = arguments;
//            $rootScope.$apply(function () {
//                if(callback) {
//                    callback.apply(socket, args);
//                }
//            });
//        });
//    }

    //////////// stub function code /////////////
    function on () {};
    function emit () {};
    
});
