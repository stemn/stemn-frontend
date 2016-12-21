import uiCodermurror from './angular-ui-code-mirror.js';

angular.module('modules.code-mirror', [
    'ui.codemirror'
]);
angular.module('modules.code-mirror').


directive('cmCodeMode', function (CodeMirrorService) {
    return {
        restrict: 'E',
        scope: {
            mode   : '=',
            editor : '='
        },
        templateUrl: 'app/modules/code-mirror/tpls/code-mode.html',
        link: function (scope, element, attrs) {
            scope.codeModes = [
                {
                    name: 'C, C#, C++',
                    path: 'clike',
                },{
                    name: 'Fortran',
                    path: 'fortran',
                },{
                    name: 'CSS',
                    path: 'css',
                },{
                    name: 'Erlang',
                    path: 'erlang',
                },{
                    name: 'Django',
                    path: 'django',
                },{
                    name: 'Go',
                    path: 'go',
                },{
                    name: 'Haskell',
                    path: 'haskell',
                },{
                    name: 'HTML',
                    path: 'htmlembedded',
                },{
                    name: 'Javascript',
                    path: 'javascript',
                },{
                    name: 'Mathematica',
                    path: 'mathematica',
                },{
                    name: 'LaTeX',
                    path: 'stex',
                },{
                    name: 'Matlab',
                    path: 'octave',
                },{
                    name: 'Perl',
                    path: 'perl',
                },{
                    name: 'PHP',
                    path: 'php',
                },{
                    name: 'Python',
                    path: 'python',
                },{
                    name: 'R',
                    path: 'r',
                },{
                    name: 'Ruby',
                    path: 'ruby',
                },{
                    name: 'SQL',
                    path: 'sql',
                },{
                    name: 'VB',
                    path: 'vb',
                },{
                    name: 'XML',
                    path: 'xml',
                }
            ];
            scope.changeMode = function(newMode){
                scope.mode = newMode;
            }
            scope.$watch('mode', function(){
                CodeMirrorService.changeCodeMode(scope.editor, scope.mode);
            })
        }
    };
}).

directive('latexInput', function (CodeMirrorService) {
    return {
        restrict: 'E',
        scope: {
            content : '=',
        },
        templateUrl: 'app/modules/code-mirror/tpls/latex-input.html',
        controller: function ($scope) {
            $scope.options = {
                indentWithTabs: true,
                lineWrapping: true,
                dragDrop: false,
                onLoad: function(cmEditor){
                    $scope.cmEditor = cmEditor;
//                    window.CodeMirror.modeURL = "asfsaffsfs/%N/%N.js";

                    CodeMirrorService.changeCodeMode(cmEditor, 'stex')
                }
            };
        }
    };
}).
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
            window.CodeMirror.modeURL = "/assets/js/codemirror/mode/%N/%N.js";
            window.CodeMirror.autoLoadMode(cmEditor, mode);
            cmEditor.setOption("mode", mode);
        }
    }
});
