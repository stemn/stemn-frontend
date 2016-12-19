angular.module('modules.projects', [
]);

angular.module('modules.projects').

service('ProjectService', function($http, LocalCache) {

    this.getProject     = get;     // function(id)
    var endpoint = 'projects';

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
                url: '/api/v1/'+endpoint,
                method: "GET",
                params: {
                    'select[]' : selectFields,
                    'ids[]'  : data,
                }
            });
        };
        return LocalCache.getPackaged(endpoint+select, stubOrId, getPromise)
	}
});
