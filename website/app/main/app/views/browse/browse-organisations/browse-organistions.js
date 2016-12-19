angular.module('views.browse.organisations', [

]);
angular.module('views.browse.organisations').

config(function ($stateProvider) {
    $stateProvider.
    state('app.browse.organisations', {
        url: '/organisations?sort&order&q',
        templateUrl: 'app/views/browse/browse-organisations/browse-organisations.html',
        resolve: {
            fields: function(SearchService){
                return SearchService.search({
                    type: 'field',
                    page: 1,
                    size: 11,
                    sort: 'numOrganisations',
                    select: ['name','numOrganisations'],
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
                title : "Browse Engineering and Space Organisations - STEMN",
            }
        },
        controller: 'BrowseOrganisationsViewCtrl',
        data: {
            name: 'Organisations'
        }
    })
}).

controller('BrowseOrganisationsViewCtrl', function (fields, $scope, $state, $location, HttpQuery, $stateParams, SearchService, OrganisationModalService) {

    // Defaults
    $stateParams.sort  = $stateParams.sort  || 'numProjects';
    $stateParams.order = $stateParams.order || 'dsc';

    // Scoped data
    $scope.fields = fields;
    $scope.newOrganisation = newOrganisation; // function(event)
    $scope.clearFilter = clearFilter; //function()

    // Query
    $scope.query = HttpQuery({
        url       : 'api/v1/search',
        params    : {
            type     : 'organisation',
            select   : ['name', 'stub', 'numProjects', 'picture', 'followers'],
            size     : 24,
            order    : 'dsc',
            sort     : $stateParams.sort,
            criteria : {},
        }
    });

    // Filters
    $scope.fieldFilter = {
        current: '',
        options: fields,
        change: function(input){
            $scope.query.params.parentType = 'field';
            $scope.query.params.parentId   = input;
            $scope.query.updateQueryParams();
            $scope.query.refresh();
        }
    };
    $scope.orderFilter = {
        model:   $stateParams.sort,
        reverse: $stateParams.order == 'asc' ? true : false
    };
    $scope.searchFilter = {
        model: '',
        onChange: function(){
            $scope.query.params.criteria.name = $scope.searchFilter.model ? '/'+$scope.searchFilter.model+'/i' : '';
            $scope.query.refresh();
        }
    }

    // Watchers
    $scope.$watch('orderFilter', watchOrderFilter, true);

    // Init
    $scope.query.more();


    //////////////////////////////////////////////

    function newOrganisation(event) {
        OrganisationModalService.organisationNewModal(event).then(function (result) {
            $state.go('app.organisation.settings.overview', {
                stub: result.stub,
            });
        })
    }

    function watchOrderFilter(){
        if($scope.orderFilter.model){
            $scope.query.params.sort  = $scope.orderFilter.model;
            $scope.query.params.order = $scope.orderFilter.reverse ? 'asc' : 'dsc';
            $scope.query.updateQueryParams();
            $scope.query.refresh();
        }
    }

    function clearFilter() {
        $scope.fieldFilter.current   = '';
        $scope.query.params.parentId = '';

        $scope.searchFilter.model    = '';
        $scope.query.params.criteria.name = '';

        $scope.query.refresh();
    }
});
