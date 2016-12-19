angular.module('modules.posts', [
]);

angular.module('modules.posts').

service('PostService', function (LocalCache, $http) {

	this.get     = get;     // function(id)
    var endpoint = 'post';

	///////////////////////////////////

	function get(stubOrId, select) {
        // Default the selectFields
        var selectFields
        if(select == 'sm'){
            selectFields = ['stub', 'name', 'type', 'blurb'];
        }else{
            selectFields = ['*'];
            select = 'lg'
        }
        var getPromise = function(data){
            // data - [asfasffsa, asfafsasfasf] - Array of ids
            return $http({
                url: '/api/v1/posts',
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
