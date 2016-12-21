angular.module('views.organisation.settings', [
]);

angular.module('views.organisation.settings').
config(function ($stateProvider) {
    $stateProvider.
    state('app.organisation.settings', {
        url: '/settings',
        templateUrl: 'app/views/organisation/organisation-settings/tpls/organisation-settings.html',
        layout: {
            bgColor: 'rgba(0, 0, 0, 0.03)',
            footer: false
        },
        resolve: {
            userPermissions: function(userdata, organisation, PermissionsService, $stateParams){
                return PermissionsService.permissionRedirect({
                    userdata : userdata,
                    entity   : organisation,
                    level    : 'collaborator',
                    secret   : $stateParams.secret
                })
            },
        },
        seo: function(resolve){
            return {
                title       : 'Settings - ' + resolve.organisation.name + ' - STEMN',
            }
        },
        abstract: true,
        controller: 'OrganisationSettingsViewCtrl'
    }).
    state('app.organisation.settings.overview', {
        url: '',
        templateUrl: 'app/views/organisation/organisation-settings/tpls/organisation-settings-overview.html',
    }).
    state('app.organisation.settings.team', {
        url: '/team',
        templateUrl: 'app/views/organisation/organisation-settings/tpls/organisation-settings-team.html',
    }).
    state('app.organisation.settings.tags', {
        url: '/tags',
        templateUrl: 'app/views/organisation/organisation-settings/tpls/organisation-settings-tags.html',
    })
}).

controller('OrganisationSettingsViewCtrl', function(userPermissions, $scope, OrganisationService, UploadsModalService, $timeout){
    $scope.userPermissions = userPermissions;
    $scope.forms = {};
    $scope.tabs = [
        {
            label: 'General',
            sref: 'app.organisation.settings.overview'
        },{
            label: 'Tags',
            sref: 'app.organisation.settings.tags'
        },{
            label: 'Team & Permissions',
            sref: 'app.organisation.settings.team',
        }
	];

    $scope.saveOrganisation = saveOrganisation;
    $scope.editGallery = editGallery;
 

    ///////////////

    function saveOrganisation(){
        return OrganisationService.updateOrganisation($scope.organisation)
    }
    
    function editGallery(event){
        UploadsModalService.uploadImagesNewModal(event, $scope.organisation.gallery).then(function(results){
            $scope.organisation.gallery = results;
            $timeout($scope.saveOrganisation, 1);
        })
    }
});
