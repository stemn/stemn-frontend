angular.module('modules.code-mirror', [
    'ui.codemirror'
]);
angular.module('modules.code-mirror').

service('CodeMirrorService', function (LazyLoadingService) {
//    this.load = load;
    this.changeCodeMode = changeCodeMode;

    ////////////////////////////////

//    function load(){
//        return LazyLoadingService.load([{
//            global : 'CodeMirror',
//            src    : 'assets/js/codemirror/codemirror-2.min.js'
//        },{
//            src    : 'assets/js/codemirror/codemirror.css'
//        }]).then(function(modules){
//            return modules[0]
//        })
//    }

    function changeCodeMode(cmEditor, mode) {
        if (mode) {
            window.CodeMirror.modeURL = window.rootHostDomain + "/assets/js/codemirror/mode/%N/%N.js";
            window.CodeMirror.autoLoadMode(cmEditor, mode);
            cmEditor.setOption("mode", mode);
        }
    }
});
