angular.module('modules.thread.thread-create-modal', [
]);
angular.module('modules.thread.thread-create-modal').


service('ThreadCreateModalService', function ($mdDialog) {
    this.newThread = function (event, data) {
        /********************************************************************
        We pass data into the modal to tell it which fields, orgs and project
        that it should automaticaly tag.
        We MUST include the thread type
            data = {
                fields        : [],
                organisations : [],
                projects      : [],
                type          : 'general' || 'question' || 'blog'
            }
        ********************************************************************/
        return $mdDialog.show({
            template: require('./tpls/thread-create-modal.html'),
            controller: 'ThreadCreateModalCtrl',
            targetEvent: event,
            locals: {
                data: data
            }
        })
    }
}).

controller('ThreadCreateModalCtrl', function (data, $scope, $state, $mdDialog, ProjectCreateModalService, LicenseData, NewCreationsService, CoreLibrary) {
    $scope.forms = {};
    $scope.activeTab = {};
    $scope.thread = data || {};
    $scope.thread.stub = CoreLibrary.getRandomString(30);
    $scope.thread.type = $scope.thread.type || 'general';

    $scope.tabs = ['Overview', 'Create Thread'];

    $scope.steps = {
        'Overview' : {
            label: 'Overview',
            path: 'app/modules/forum/thread-create-modal/tpls/thread-create-modal.overview.html',
            nextText : 'Create Thread',
            clickFn : function(){
                $scope.activeTab.label = this.label;
                $scope.activeTab.path  = this.path;
            },
            nextFn : function(){
                NewCreationsService.create('thread', $scope.thread);
            },
            isDisabled: function(){
                return $scope.forms.nameForm && $scope.forms.nameForm.$invalid;
            }
        },
        'Create Thread' : {
            label: 'Create Thread',
            isDisabled: function(){
                return true
            }
        },
    };
    $scope.steps.Overview.clickFn();

    $scope.cancel = function () {
        $mdDialog.cancel();
    };
});
