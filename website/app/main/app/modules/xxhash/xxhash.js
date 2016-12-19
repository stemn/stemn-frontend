angular.module('modules.xxhash', []);
angular.module('modules.xxhash').

service('XxhashService', function($window){
	var XXH = $window.XXH;
	if(!XXH){console.error('XXHash not found!!!');}
	return XXH;
})
