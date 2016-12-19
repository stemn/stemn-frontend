angular.module('views.preview-github', [
])

angular.module('views.preview-github').
config(function($stateProvider){
    $stateProvider.state('app.preview-github', {
        url: '/preview-github?path',
        templateUrl: 'app/views/preview-github/preview-github.tpl.html',
        controller: 'PreviewGithubViewCtrl',
        data: {
            pageTitle: 'Preview',
            viewClass: 'preview'
        },
    });
});
