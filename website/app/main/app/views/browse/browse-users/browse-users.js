angular.module('views.browse.users', [

]);
angular.module('views.browse.users').

config(function ($stateProvider) {
    $stateProvider.
    state('app.browse.users', {
        url: '/people?page&sort',
        templateUrl: 'app/views/browse/browse-users/browse-users.html',
        resolve: {
            educationOrgs: function(SearchService){
                return SearchService.search({
                    type: 'organisation',
                    page: 1,
                    size: 11,
                    sort: 'numEducations',
                    select: ['name','numEducations'],
                    key: 'name',
                }).then(function (response) {
                    return response.data
                });
            }
        },
        layout: {
            size: 'lg',
            footer: true
        },
        seo: function(resolve){
            return {
                title : "Browse Users interested in Aerospace and Enigneering - STEMN",
            }
        },
        controller: 'BrowseUsersViewCtrl',
        data: {
            name: 'Users'
        }
    })
}).

controller('BrowseUsersViewCtrl', function (educationOrgs, $scope, $state, $location, HttpQuery, $stateParams, SearchService, OrganisationModalService) {

    // Defaults
    $stateParams.sort  = $stateParams.sort  || 'numProjects';
    $stateParams.order = $stateParams.order || 'dsc';

    // Scoped data
    $scope.sort = $stateParams.sort;
    $scope.clearFilter = clearFilter; //function()

    // Filters
    $scope.searchFilter = {
        model: '',
        onChange: function(){
            $scope.query.params.criteria.name = $scope.searchFilter.model ? '/'+$scope.searchFilter.model+'/i' : '';
            $scope.query.refresh();
        }
    }
    $scope.educationFilter = {
        current: '',
        options: educationOrgs,
        change: function(input){
            $scope.query.params.criteria['profile.profileDetails.education.organisations'] = this.current;
            $scope.query.updateQueryParams();
            $scope.query.refresh();
        }
    };

    //////////////////////////////////////////////

    function clearFilter() {
        $scope.searchFilter.model    = '';
        $scope.query.params.criteria = {};

        $scope.query.refresh();
    }
});
