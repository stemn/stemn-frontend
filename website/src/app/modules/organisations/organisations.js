import './organisations.scss';

angular.module('modules.organisations', [
    'modules.authentication',
    'modules.restangular',
    'modules.uploads',

]);
angular.module('modules.organisations').

directive('organisationIcon', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            itemId : '@?',
            item   : '=?',
        },
        template: require('./tpls/organisation-icon.html'),
        controller: function ($scope, Authentication, OrganisationService) {
			if($scope.itemId){
				OrganisationService.getOrganisation($scope.itemId, 'sm').then(function (result) {
					$scope.item = result;
				});
			}
        }
    };
}).

directive('clickCreateOrganisation', function (OrganisationModalService) {
    return {
        restrict: 'A',
        scope: {
            organisation: '=?'
        },
        link : function(scope, element, attrs){
            element.bind('click', function (event) {
                OrganisationModalService.organisationNewModal(event, scope.organisation);
            });
        }
    }
}).

directive('organisationCards', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            size : '@?',
            field: '@?',
            sort:  '@?',
            hideMore   : '=?', // true || false - if true, the 'see more' button will be hidden
            items: '=?'
        },
        template: require('./tpls/organisation-cards.html'),
        controller: function ($scope, HttpService) {
            initialise()
            $scope.more = more; // function()

            /////////////////////////

            function initialise(){
                $scope.noMoreResults = false;
                $scope.notEnoughResults = false;
                $scope.page = 0;
                // Defaults
                $scope.size = $scope.size || 4;
                $scope.sort = $scope.sort || 'updated';
                more();
            }

            function more(){
                if($scope.noMoreResults || $scope.notEnoughResults) return
                $scope.page ++;
                if($scope.size < 8 && $scope.page == 2){
                    $scope.size = 8;
                    $scope.page = 1;
                }
                $scope.loading = true;
                return HttpService({
                    method: 'GET',
                    url: 'api/v1/organisations',
                    params: {
                        field: $scope.field,
                        page : $scope.page,
                        size : $scope.size,
                        sort : $scope.sort
                    }
                }).then(function(items){
                    if($scope.page == 1){
                        $scope.notEnoughResults = items.length < $scope.size;
                        $scope.items = [];
                    }
                    $scope.loading = false;
                    $scope.items = $scope.items.concat(items);
                    $scope.noMoreResults = items.length < $scope.size;
                })
            }
        }
    };
}).


directive('organisationGroups', function ($mdDialog, $timeout) {
    return {
        restrict: 'E',
        scope: {
            organisations : '=',
            viewLayout    : '@?', // tile || row(default)
            edit          : '=?' // true || false - change the edit status
        },
        template: require('./tpls/organisation-groups.html'),
        controller: function($scope) {


            $scope.sortConfig = {
                animation: 150,
                handle: '.my-handle'
            };
            $scope.delete = function(group, index){
                group.splice(index, 1);
            }
        }
    }
}).

service('OrganisationModalService', function($mdDialog) {
    this.organisationNewModal = function (event, data) {
        return $mdDialog.show({
            template: require('./tpls/organisation-new-modal.html'),
            controller: 'OrganisationNewModalCtrl',
            clickOutsideToClose: true,
            targetEvent: event,
            locals : {
                data  : data,
            }
        })
    }
}).

controller('OrganisationNewModalCtrl', function (data, $scope, $mdDialog, SearchService, OrganisationService, Authentication, CoreLibrary) {
    $scope.data = angular.copy(data);

    $scope.checkOrganisationExists = function (name) {
        if (name) {
            $scope.stub = CoreLibrary.stubify(name);
            SearchService.search({ type : 'organisation', key : 'stub', value : $scope.stub, match : 'insensitive' }).then(function (response) {
                if (response.data.length === 0) {
                    $scope.NewOrganisationForm.name.$setValidity('exists', true);
                } else {
                    $scope.NewOrganisationForm.name.$setValidity('exists', false);
                }
            });
        }
    }

    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.save = function () {
        // Add current user to the team
        $scope.data.team = $scope.data.team || []
        $scope.data.team.push({
            _id : Authentication.currentUser._id,
            role: 'Creator',
            group: 'Core Team',
        })
        OrganisationService.updateOrganisation($scope.data).then(function(organisation) {
            $mdDialog.hide(organisation);
        });
    };
}).


service('OrganisationService', function(Restangular, Authentication) {

    this.createOrganisation = function(organisation) {
        analytics.track('Organisation Create', {
            organisation : organisation.name
        });
        return Restangular.all('organisations').post(organisation).then(function(organisation) {
            return organisation;
        });
    }

    this.getOrganisation = function(organisation) {
        return Restangular.one('organisations', organisation).get();
    }

    this.getOrganisations = function(data) {
        return Restangular.all('organisations').getList(data);
    }

    this.updateOrganisation = function(organisation) {
        analytics.track('Organisation Update', {
            updater      : Authentication.currentUser.name,
            organisation : organisation.name
        });

        if (!organisation._id) {
            return this.createOrganisation(organisation);
        } else {
            return Restangular.one('organisations', organisation._id).customPUT(organisation);
        }
    }

    this.deleteOrganisation = function(organisation) {
        analytics.track('Organisation Delete', {
            organisation : organisation.name,
        });
        return organisation.remove();
    }
});
