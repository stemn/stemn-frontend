import './fields.scss';
angular.module('modules.fields', [
    'modules.authentication',
    'modules.restangular',
    'modules.uploads'
]);
angular.module('modules.fields').

directive('fieldCard', function () {
    return {
        restrict: 'E',
        scope: {
            id   : '@?',
            data : '=?',
            size : '@?'
        },
        template: require('./tpls/field-card.html'),
        controller: function ($scope, Authentication, FieldService) {
            if ($scope.id) {
                // Initiate Loading class
                $scope.loading = true;
                FieldService.getField($scope.id).then(function (field) {
                    $scope.data = field;
                    // Set loading to false when data has loaded
                    $scope.loading = false
                });
            }
        }
    };
}).

service('FieldModalService', function($mdDialog) {
    this.fieldNewModal = function (event, data) {
        return $mdDialog.show({
            template: require('./tpls/field-new-modal.html'),
            controller: 'FieldNewModalCtrl',
            clickOutsideToClose: true,
            targetEvent: event,
            locals : {
                data  : data,
            }
        })
    }
}).

controller('FieldNewModalCtrl', function (data, $scope, $mdDialog, FieldService, SearchService, CoreLibrary) {
    $scope.data = angular.copy(data);

    $scope.checkFieldExists = function (name) {
        if (name) {
            $scope.stub = CoreLibrary.stubify(name);
            SearchService.search({ type : 'field', key : 'stub', value : $scope.stub, match : 'insensitive' }).then(function (response) {
                if (response.data.length === 0) {
                    $scope.NewFieldForm.name.$setValidity('fieldexists', true);
                } else {
                    $scope.NewFieldForm.name.$setValidity('fieldexists', false);
                }
            });
        }
    }

    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.save = function () {
        FieldService.updateField($scope.data).then(function(field) {
            $mdDialog.hide(field);
        });
    };

}).

service('FieldService', function(Restangular, Authentication, HttpService) {

    this.createField = function(field) {
        analytics.track('Field Create', {
            field : field.name
        });
        return Restangular.all('fields').post(field).then(function(field) {
            return field;
        });
    }

    this.getField = function(field) {
        return Restangular.one('fields', field).get();
    }

    this.getFields = function(data) {
        return Restangular.all('fields').getList(data);
    }

    this.updateField = function(field) {
        analytics.track('Field Update', {
            updater : Authentication.currentUser.name,
            field   : field.name
        });

        if (!field._id) {
            return this.createField(field);
        } else {
            return Restangular.one('fields', field._id).customPUT(field);
        }
    }

    this.deleteField = function(fieldId) {
        return HttpService({
            method: 'delete',
            url: '/api/v1/fields/'+fieldId
        })
    }
});
