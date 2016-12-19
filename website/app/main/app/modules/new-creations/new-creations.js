angular.module('modules.new-creations', [
]);
angular.module('modules.new-creations').

directive('clickCreate', function (NewCreationsService) {
    return {
        restrict: 'A',
        link : function(scope, element, attrs){
            element.bind('click', function (event) {
                NewCreationsService.createModal(event);
            });
        }
    }
}).
service('NewCreationsService', function(ProjectService, ThreadService, $state, $mdDialog, EntityService) {
    this.create      = create;      // function(entity, type)
    this.createModal = createModal  // function(event, data)
        
    //////////////////////////

    function create(type, entity){
        if(type == 'project'){
            EntityService.create('project', entity).then(function(response){
                 $state.go('app.project.files', {stub: response.stub});
            });
        }
        else if(type == 'thread'){
            EntityService.create('thread', entity).then(function(response) {
                $state.go('app.thread.edit', {stub: response.stub});
            });
        }
        else if(type == 'job'){
           EntityService.create('job', entity).then(function(response) {
                $state.go('app.job', {
                    stub : response._id,
                    edit : 'JobForm'
                });
            });
        }
    }
    
    function createModal(event) {
        return $mdDialog.show({
            templateUrl: 'app/modules/new-creations/tpls/new-something-modal.html',
            controller: 'NewSomethingModalCtrl',
            clickOutsideToClose: true,
            targetEvent: event,
        })
    }
}).

controller('NewSomethingModalCtrl', function ($scope, $mdDialog) {
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
});
