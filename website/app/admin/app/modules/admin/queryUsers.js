angular.module('modules.queryUsers', []);
angular.module('modules.queryUsers').

service('queryUsers', function ($http) {
	this.onlineUsers = function() {
		return $http.get('/api/v1/admin/users/onlineUsers')
		.then(function(response) {
			return response.data;
		});
	}
});
