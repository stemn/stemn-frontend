import './project-threads.scss';

angular.module('views.project.threads', [
]);
angular.module('views.project.threads').

config(function ($stateProvider) {
    $stateProvider.
    state('app.project.threads', {
        url: '/threads',
        templateUrl: 'app/views/project/project-threads/tpls/project-threads.html',
        layout: {
            bgColor: 'rgba(0, 0, 0, 0)'
        },
        seo: function(resolve){
            return {
                title       : 'Questions - ' + resolve.project.name + ' - STEMN',
            }
        },
        controller: 'ProjectThreadsViewCtrl'
    })
}).


controller('ProjectThreadsViewCtrl',function (project, $scope, ThreadCreateModalService) {
    $scope.project = project;
    $scope.newThread = newThread;

    ////////////////////////////////////

    function newThread(event, type){
        ThreadCreateModalService.newThread(event, {
            type: type || 'question',
            projects : [ project ]
        })
    }

});
