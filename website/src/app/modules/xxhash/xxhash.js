import { h32 } from 'xxhashjs';

angular.module('modules.xxhash', []);
angular.module('modules.xxhash').

service('XxhashService', function($window){
	if(!h32){console.error('XXHash not found!!!');}
	return h32;
})
