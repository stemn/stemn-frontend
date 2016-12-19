angular.module('modules.reminders', [
]);
angular.module('modules.reminders').

service('ReminderService', function ($mdDialog) {
    var service = this;
    this.newReminderModal = newReminderModal;

    function newReminderModal(event) {
        $mdDialog.show({
            templateUrl: 'app/modules/reminders/tpls/new-reminder-modal.html',
            controller: function ($scope, EntityService) {
                $scope.reminder = {
                    reminderDate: Date.now(),
                    user: '56448bd3e2bcb34ab7afb073',
                    notes: 'test'
                }

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
                $scope.confirm = function () {
                    EntityService.create('reminder', $scope.reminder).then(function () {
                        EntityService.updateSuccess();
                        $mdDialog.hide();
                    })
                }
            },
            targetEvent: event,
            clickOutsideToClose: true,
        })
    }
}).

directive('reminderStatus', function () {
    return {
        restrict: 'E',
        scope: {
            entity: '=',
            selectedRows: '=?',
            entities: '=?',
            ratingType: '@?' // 'rating' || 'potentialRating'
        },
        template: `
        <md-checkbox ng-model="entity.complete" aria-label="Complete" style="margin: 0" ng-change="save()"></md-checkbox>
        `,
        controller: function ($scope, LogService, $http, CoreLibrary, EntityService) {
            $scope.save = function () {
                console.log('save');
                if ($scope.selectedRows && $scope.selectedRows.length > 1) {
                    _.forEach($scope.entities, function (item) {
                        if ($scope.selectedRows.indexOf(item._id) != -1) {
                            EntityService.patch('reminder', {
                                complete: $scope.entity.complete,
                            }).then(EntityService.updateSuccess);
                        }
                    });
                } else {
                    EntityService.patch('reminder', $scope.entity).then(EntityService.updateSuccess);
                }
            }
        }
    };
}).

directive('reminderRowActions', function () {
    return {
        restrict: 'E',
        scope: {
            entity: '=',
            query:  '='
        },
        template: `
             <div layout="row">
                <md-button aria-label="edit" class="md-icon-button md-sm" ng-click="edit($event, entity)">
                    <ng-md-icon icon="edit"></ng-md-icon>
                </md-button>
                <md-button aria-label="delete" class="md-icon-button md-sm" ng-click="remove(entity._id)">
                    <ng-md-icon icon="close"></ng-md-icon>
                </md-button>
            </div>
        `,
        controller: function ($scope, HttpService, $mdDialog, $mdToast, EntityService) {
            $scope.remove   = remove;   // function(id)
            $scope.edit     = edit;     // function(event, data)

            ////////////////////////////////////////

            function remove(id){
                if (confirm('Are you sure you want to delete this?')) {
                    EntityService.remove('reminder', id).then(function (response) {
                        EntityService.removeSuccess();
                        $scope.query.refresh();
                    })
                }
            }
            function edit(event, data){
                $mdDialog.show({
                    templateUrl: 'app/views/campaigns/tpls/new-campaign-modal.html',
                    controller: function(data, $scope){
                        $scope.campaign = data;
                        $scope.modalTitle   = 'Edit Campaign - Ref: '+ data.ref.ref;
                        $scope.confirmTitle = 'Save Campaign';

                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };
                        $scope.confirm = function () {
                            EntityService.update('campaign', $scope.campaign).then(function(){
                                EntityService.updateSuccess();
                                $mdDialog.hide();
                            })
                        }
                    },
                    locals: {data:data},
                    targetEvent: event,
                    clickOutsideToClose: true,
                }).then(function(){
                    $scope.query.refresh();
                })
            }

            function clone(event, data){
                $mdDialog.show({
                    templateUrl: 'app/views/campaigns/tpls/new-campaign-modal.html',
                    controller: function(data, $scope){
                        $scope.campaign = angular.copy(data);
                        delete $scope.campaign.ref;
                        delete $scope.campaign.timestamp;
                        delete $scope.campaign.date;
                        console.log($scope.campaign)
                        $scope.modalTitle   = 'Clone Campaign';
                        $scope.confirmTitle = 'Create Campaign';


                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };
                        $scope.confirm = function () {
                            EntityService.create('campaign', $scope.campaign).then(function(){
                                EntityService.updateSuccess();
                                $mdDialog.hide();
                            })
                        }
                    },
                    locals: {data:data},
                    targetEvent: event,
                    clickOutsideToClose: true,
                }).then(function(){
                    $scope.query.refresh();
                })
            }
        }
    };
});
