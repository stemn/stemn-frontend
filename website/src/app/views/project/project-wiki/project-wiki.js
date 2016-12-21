angular.module('views.project.wiki', [
]);
angular.module('views.project.wiki').

config(function ($stateProvider) {
    $stateProvider.
    state('app.project.wiki', {
        url: '/wiki',
        templateUrl: 'app/views/project/project-wiki/tpls/project-wiki.html',
        layout: {
            size: 'sm',
            bgColor: 'rgba(0, 0, 0, 0.03)'
        },
        resolve: {
        },
        seo: function(resolve){
            return {
                title       : 'Wiki - ' + resolve.project.name + ' - STEMN',
            }
        },
        controller: 'ProjectWikiViewCtrl'
    })
}).

controller('ProjectWikiViewCtrl',function (project, $scope) {
    // Params and Resolve
    $scope.project = project;


    $scope.editorOptions = {
		realtime  : false,
		contained : false
	}

});
