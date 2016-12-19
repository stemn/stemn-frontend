angular.module('modules.threads', [
]);

angular.module('modules.threads').

service('ThreadService', function(LocalCache, $http) {

    this.getThread     = get;     // function(id)
    var endpoint = 'threads';

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
