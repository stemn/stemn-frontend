(function () {
    'use strict';

    angular.module('modules.http', [
    ]);

    angular.module('modules.http').
    service('HttpService', HttpService).
    service('HttpQuery', HttpQuery).
    service('QueryParamsService', QueryParamsService);




    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function QueryParamsService($state, $location, $timeout, CoreService){
        this.set = set; // function(paramName, paramVal)

        //////////////////

        function set(paramName, paramVal){
            if(paramVal){
                if(typeof paramVal === "object"){
                    // Do not encode empty object
                    if(!CoreService.isEmptyObject(paramVal)){
                        paramVal = JSON.stringify(paramVal);
                    }
                    else{
                        paramVal = null;
                    }
                }
            }
            $state.current.reloadOnSearch = false;
            $location.search(paramName, paramVal);
            $timeout(function () {
                $state.current.reloadOnSearch = undefined;
            });
        }
    }

    function HttpService($http, $q, $mdToast) {
        return function(query){
            return $http(query)
            .then(function(response){
                return response.data
            })
            .catch(function(response){
                return $q.reject(response);
            })
        }
    }

    function HttpQuery(HttpService, QueryParamsService, $timeout, $stateParams, $rootScope){
        var lib = function(configObject){
            /*******************************************

            configObject = {
                url: 'request url',
                urlParams: ['sort', 'order'] - These are the query params to appear in the url when they change
                params: {
                    size
                    page
                    etc
                }
                columns: {

                }
                filters: {

                }
                paginate: true || false - if true the results are paginated, not appended
                onSuccess: function(results){
                    do some stuff then:
                    return results
                }
            }
            *******************************************/

            var updateUrlQueryParamsTimeout;
            var updateUrlQueryParamsTime = 1000;
            var defaultParams = angular.copy(configObject.params);

            var queryObject = {params:{}};

            // Query Parameters
            queryObject.params.page = 0;
            queryObject.params.size = 10;
            queryObject.params.criteria = {};

            // Extend by the config object
            queryObject.params = _.merge(queryObject.params, configObject.params);

            // Extend the params by anything in the $stateParams that match the urlParams array
            queryObject.params = extendParamsByStateParams(queryObject.params);


            // Cancel the updateQueryParams promise if state changes
            $rootScope.$on('$stateChangeStart', function () {
                $timeout.cancel(updateUrlQueryParamsTimeout)
            });

            // Other setup
            queryObject.loading = false;
            queryObject.columns = configObject.columns;
            queryObject.filters = configObject.filters;

            // Functions
            queryObject.get = get
            queryObject.setGet = setGet;
            queryObject.more = more;
            queryObject.init = init;
            queryObject.refresh = refresh;
            queryObject.success = success;
            queryObject.updateQueryParams = updateQueryParams;
            queryObject.determineSelect   = determineSelect;


            // Add the get function if appropriate
            if(configObject.url){
                queryObject.setGet(configObject.url)
            }

            return queryObject;

            //////////////////////////////////////////////////////////////////

            function get(){
                console.log('You must assign get function');
            }

            function setGet(getUrl){
                // This will setup the standard get function
                queryObject.get = function(){
                    queryObject.loading = true;
                    HttpService({
                        url: getUrl,
                        method :'GET',
                        params : queryObject.params
                    }).then(queryObject.success);
                }

            }
            function more(){
                queryObject.params.page ++
                queryObject.get();
            }
            function init(){
                if(queryObject.params.page === 0){
                    queryObject.params.page = 1;
                }
                queryObject.get();
            }

            function refresh(){
                queryObject.params.page = 1;
                queryObject.get();
            }

            function success(response){
                // If there is an onSuccess function, run it
                if(configObject.onSuccess){
                    response = configObject.onSuccess(response)
                }
                if(queryObject.params.page == 1){
                    queryObject.notEnoughResults = response.length < queryObject.params.size;
                    queryObject.results = [];
                }
                queryObject.loading = false;
                if(configObject.paginate){
                    queryObject.results = response;
                }
                else{
                    queryObject.results = queryObject.results.concat(response);
                }
                queryObject.noMoreResults = response.length < queryObject.params.size;
            }

            function extendParamsByStateParams(params){
                var paramsExtended = angular.copy(params);
                _.forEach(configObject.urlParams, function(urlParam){
                    if($stateParams[urlParam]){
                        paramsExtended[urlParam] = $stateParams[urlParam];
                    }
                })
                return paramsExtended
            }

            function determineSelect(){
                var initialSelectParams = queryObject.params['select[]'] || queryObject.params.select;
                var modelCleanedSelectParams = _.map(configObject.columns, function(item){
                    if(item.model){
                        return item.model.split('[')[0]
                    }
                });
                var allSelectParams = _.uniq(initialSelectParams.concat(modelCleanedSelectParams));
                if(queryObject.params.select){
                    queryObject.params.select = allSelectParams;
                }
                else if(queryObject.params['select[]']){
                    queryObject.params['select[]'] = allSelectParams;
                }
            }

            function updateQueryParams(){
                $timeout.cancel(updateUrlQueryParamsTimeout);
                updateUrlQueryParamsTimeout = $timeout(function(){
                    // Update the url query params if they are in the 'urlParams' list
                    _.forEach(configObject.urlParams, function(urlParam){
                        // If the query param exists and it is not equal to the default
                        if(queryObject.params[urlParam] && queryObject.params[urlParam] != defaultParams[urlParam]){
                            QueryParamsService.set(urlParam, queryObject.params[urlParam]);
                        }else{
                            QueryParamsService.set(urlParam, null);
                        }
                    })
                }, updateUrlQueryParamsTime)
            }
        }

        return lib
    }
}());
