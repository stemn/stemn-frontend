import './site-search.scss';

angular.module('views.search', [
    'modules.site-search'
]);
angular.module('views.search').

config(function ($stateProvider) {
    $stateProvider.
    state('app.search', {
        abstract: true,
        url: '/search?q&type',
        templateUrl: 'app/views/site-search/site-search.html',
        controller: 'SearchViewCtrl',
        seo: function(resolve){
            return {
                title       : "Search Engineering and Aerospace Projects, Jobs and Questions - STEMN",
            }
        },
        layout: {
            bgColor : 'rgba(0, 0, 0, 0.03)',
            size    : 'sm'
        }

    }).
    state('app.search.all', {
        url: '/',
        templateUrl: 'app/views/site-search/site-search-all.html',
    }).
    state('app.search.creations', {
        url: '/creations',
        templateUrl: 'app/views/site-search/site-search-creations.html',
    }).
    state('app.search.organisations', {
        url: '/organisations',
        templateUrl: 'app/views/site-search/site-search-organisations.html',
    }).
    state('app.search.fields', {
        url: '/fields',
        templateUrl: 'app/views/site-search/site-search-fields.html',
    }).
    state('app.search.users', {
        url: '/people',
        templateUrl: 'app/views/site-search/site-search-users.html',
    }).
    state('app.search.jobs', {
        url: '/jobs',
        templateUrl: 'app/views/site-search/site-search-jobs.html',
    })
}).


controller('SearchViewCtrl', function ($scope, $document, $rootScope, $state, $location, $stateParams, $timeout, CoreLibrary, SearchService) {
    var debounceTimeout;
    var debounceTimeoutTime = 300;

    // Tabs ------------------------------------------------------
	$scope.tabs = [
        {
            label: 'All',
            sref: "app.search.all"
        },{
            label: 'Creations',
            sref: "app.search.creations"
        },{
            label: 'Organisations',
            sref: "app.search.organisations"
        },{
            label: 'Fields',
            sref: "app.search.fields"
        },{
            label: 'People',
            sref: "app.search.users"
        },{
            label: 'Jobs',
            sref: "app.search.jobs"
        },
	];
	$scope.currentTab = CoreLibrary.getCurrentTab($scope.tabs);

    $scope.scrollOnEnter = scrollOnEnter;

    // Set the query using the state params
    $scope.query = {
        string   : $stateParams.q
    };

    // Useful functions ----------------------------------------------
    var setUrlPromise
    var setUrl = function(query, timeout){
        // This will set the search params in the URL after a timeout
        setUrlPromise = $timeout(function () {
            $state.current.reloadOnSearch = false;
            // If the query param is wrong, set it
            if($location.search().q != query){
                $location.search('q', query);
            }
            $timeout(function () { $state.current.reloadOnSearch = undefined;});
        }, timeout)
    }
    var cancelSetUrl = function(query){
        // This will cancel the setUrl timeout promise
        $timeout.cancel(setUrlPromise);
    }

    $scope.moreResults = moreResults; // function()
    $scope.searchQuery = searchQuery; // function()

    // Main code ------------------------------------------------------
    $scope.results = {};
    $scope.type = $state.current.name.split(".")[2]; // users || projects || organisations || fields etc
    $scope.page = 1;
    $scope.searchQuery();

    // Re-run when state change success (we have changed tabs)
    $rootScope.$on('$stateChangeSuccess', function () {
        $scope.currentTab = CoreLibrary.getCurrentTab($scope.tabs);
        // If we are on the search page, set the type and query when we change tabs
        if($state.current.name.split(".")[1] == 'search'){
            $scope.type = $state.current.name.split(".")[2]; // users || projects || organisations || fields etc
            $scope.page = 1;
            $scope.searchQuery();
        }
    });
    $rootScope.$on('$stateChangeStart', function () {
        // Cancel the url set if we change state
        cancelSetUrl();
    });


    ///////////////////////////////

    function searchQuery(){
        $timeout.cancel(debounceTimeout);
        debounceTimeout = $timeout(function(){
            if($scope.query.string){
                var types = [];
                $scope.size = 12;
                if($scope.type == 'all'){
                    types = ['project', 'field', 'user', 'thread', 'organisation', 'job'];
                    $scope.size = 4;
                }
                else if($scope.type == 'users'){types = ['user']}
                else if($scope.type == 'creations'){types = ['project','thread']}
                else if($scope.type == 'organisations'){types = ['organisation']}
                else if($scope.type == 'fields'){types = ['field']}
                else if($scope.type == 'jobs'){types = ['job']}
                else{console.error('Search Type Undefined')}

                // Run the query
                SearchService.search({
                    types : types,
                    key : 'name',
                    value : $scope.query.string,
                    size : $scope.size,
                    page : $scope.page,
                    populate : false,
                    select : ['name', 'picture', 'stub', 'blurb', 'type']
                }).then(function (response) {
                    var results = CoreLibrary.groupByKey(response.data, 'entityType');
                    _.forEach(results, function(values, key){
                        // If we are the next page of results
                        if($scope.page > 1){
                            $scope.results[key] = $scope.results[key] || [];
                            $scope.results[key] = $scope.results[key].concat(values);
                        }
                        // Else, assign the results
                        else{
                            $scope.results[key] = $scope.results[key] || [];
                            CoreLibrary.assignArray($scope.results[key], values, '_id');
                        }
                    })
                    // Clear out results if there are none
                    if($scope.page == 1 && response.data.length === 0){
                        _.forEach($scope.results, function(resultType){
                            if(resultType){CoreLibrary.assignArray(resultType, [], '_id');}
                        })
                    }
                    $scope.noMoreResults = response.data.length < $scope.size;
                });
            }
            else{
                $scope.page = 1;
                $scope.results = {};
            }
            $stateParams.q = $scope.query.string;
            cancelSetUrl() // Cancel any existing url promise
            setUrl($scope.query.string, 1000); // Start a new promise
        }, debounceTimeoutTime)
    }

    function moreResults(){
        $scope.page ++
        $scope.searchQuery();
    }

    function scrollOnEnter(){
        var searchResults = angular.element(document.getElementById('search-results'));
        $timeout(function(){
            $document.scrollToElement(searchResults, 80, 500);
        },0)
    }
});
