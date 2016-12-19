angular.module('modules.organisation', [
]);

angular.module('modules.organisation').

service('OrganisationService', function (LocalCache, $http) {

    this.getOrganisation        = get;     // function(id)
    this.updateOrganisation     = save;    // function(entity)

    var endpoint = 'organisation';

	///////////////////////////////////

	function get(stubOrId, select) {
        // Default the selectFields
        var selectFields
        if(select == 'sm'){
            selectFields = ['stub', 'name', 'type', 'blurb', 'picture'];
        }else{
            selectFields = ['*'];
            select = 'lg'
        }
        var getPromise = function(data){
            // data - [asfasffsa, asfafsasfasf] - Array of ids
            return $http({
                url: '/api/v1/organisations',
                method: "GET",
                params: {
                    'select[]' : selectFields,
                    'ids[]'  : data,
                }
            });
        };
        return LocalCache.getPackaged(endpoint+select, stubOrId, getPromise)
	}

	function save(entity) {
		// Save to local cache
		LocalCache.save(endpoint+'lg', entity);
        return $http({
            url    : '/api/v1/organisations/'+entity._id,
            method : "PUT",
            data   : entity
        })
    }
}).

service('OrganisationModalService', function($mdDialog) {
    this.organisationNewModal = function (event, data) {
        return $mdDialog.show({
            templateUrl: 'app/modules/organisation/tpls/organisation-new-modal.html',
            controller: 'OrganisationNewModalCtrl',
            clickOutsideToClose: true,
            targetEvent: event,
            locals : {
                data  : data,
            }
        })
    }
}).

controller('OrganisationNewModalCtrl', function (data, $scope, $mdDialog, SearchService, EntityService, CoreLibrary) {
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
        EntityService.create('organisation', $scope.data).then(function(organisation) {
            EntityService.updateSuccess();
            $mdDialog.hide(organisation);
        });
    };
});

