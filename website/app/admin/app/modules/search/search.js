angular.module('modules.search', [
    'modules.search.organisation'
]);
angular.module('modules.search').

/***************************************** /

  Data object properties
  type  : the entity type to search by
  key   : the property of the entity to seach by
  value : the value of the key to match
  match : regex or exact
  sort  : the entity property by which to sort

  location  : {
    northeast : {
            latitude: '',
            longitude: ''
        },
    southwest: {
        latitude: '',
        longitude: ''
    }
    };
    the bounds object

  populate  : true || false - if false will send back IDs
  published : true || false || 'both' - defaults to true
/ *****************************************/

directive('checkboxFilter', function(){
    return {
        restrict: 'E',
        scope: {
            filter  : '=',
            showCount : '=' // This will show the count
        },
        templateUrl: 'app/modules/search/tpls/checkbox-filter.html',
    }
}).

directive('searchFilter', function(){
    return {
        restrict: 'E',
        scope: {
            filter  : '=',
        },
        templateUrl: 'app/modules/search/tpls/search-filter.html',
    }
}).

service('SearchService', function($http, $stateParams, $timeout) {

    this.newFilter = function(filterOptions){

        /****************************************************
        filterOptions = {
            type:
            stateParams:
            query:
            key:
            options:
        }
        ****************************************************/
        var defaultFilter = {
            searchTimeout: '',
            searchTimeoutTime: filterOptions.searchTimeoutTime || 300,

            query   : filterOptions.query, // query object
            title   : filterOptions.title,

            type    : filterOptions.type,    // standard or search
            model   : filterOptions.model,   // Search text
            key     : filterOptions.key,     // SEARCH ONLY - Key is used with the search filter
            current : filterOptions.current, // CHECKLIST ONLY
            options : filterOptions.options,

            onChange : function(){
                if(filterOptions.type == 'search'){
                    // JSON Parse Criteria if it is a string
                    if(typeof filterOptions.query.params.criteria == 'string'){
                        filterOptions.query.params.criteria = JSON.parse(filterOptions.query.params.criteria);
                    }
                    // Remove anything in the criteria if it is in the options array
                    _.forEach(this.options, function(option){
                        delete filterOptions.query.params.criteria[option.model]
                    })
                    filterOptions.query.params.criteria[this.key]  = this.model ? '/'+this.model+'/i' : '';
                }
                else{
                    // CHECKLIST
                    this.current = _.map(_.filter(this.options, 'status'),'model');
                    var splitModel = this.model.split('.');
                    if(splitModel[0] == 'criteria' && splitModel.length > 1){
                        var joinedModel = this.model.replace('criteria.','');
                        filterOptions.query.params.criteria[joinedModel] = this.current;
                    }
                    else{
                        filterOptions.query.params[splitModel[0]] = this.current;
                    }
                }

                // Debounce
                $timeout.cancel(this.searchTimeout);
                this.searchTimeout = $timeout(function(){
                    filterOptions.query.updateQueryParams();
                    filterOptions.query.refresh();
                }, this.searchTimeoutTime);
            },

            parseParams : function(stateParams){
                // Iterate through the options
                // If an option.model is the same as the key in the stateParams we set it
                var paramsKeyArray = Object.keys(stateParams);
                var activeOption = _.find(this.options, function(option){
                    return paramsKeyArray.indexOf(option.model) != -1
                });
                // If we find an active option
                if(activeOption){
                    this.key = activeOption.model;
                    this.model = stateParams[this.key];
                }
            }
        }
        return defaultFilter
    }


    this.assignChecklistModel = function (filterObject, searchParams){
        // This will assign the checklist model based on the $stateParams
        filterObject.current = searchParams;
        _.forEach(filterObject.options, function(option){
            option.status = searchParams.indexOf(option.model) > -1;
        })
    }

    this.assignSortModel = function (sortObject){
        if($stateParams.sort){
            sortObject.model = $stateParams.sort;
        }
        sortObject.order = $stateParams.order ? ($stateParams.order == 'asc' ? true : false) : 'asc'
    }

    this.search = function(data) {
        return $http({
            url: '/api/v1/search',
            method: "GET",
            params: {
                type       : data.type,
                'types[]'  : data.types,
                key        : data.key,
                value      : data.value,
                match      : data.match || 'regex',
                order      : data.order,
                sort       : data.sort,
                size       : data.size,
                page       : data.page,
                'select[]' : data.select,
                location   : data.location,
                populate   : data.populate,
                published  : data.published
            }
        });
    }
});
