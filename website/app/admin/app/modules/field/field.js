angular.module('modules.field', [
]);

angular.module('modules.field').

service('FieldService', function (LocalCache, $http, HttpService) {
    this.getField     = get;      // function(id)
    this.saveField    = save;     // function(field)
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


    function save(item){
        return HttpService({
            method: 'PUT',
            url   : 'api/v1/fields/'+item._id,
            data  : item
        })

    }
});
