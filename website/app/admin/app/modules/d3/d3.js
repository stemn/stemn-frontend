angular.module('modules.d3', [
	'modules.d3.d3-bars',
	'modules.d3.d3-multi-line-chart',
]);
angular.module('modules.d3').

service('d3Service', function ($window) {
	var d3 = $window.d3;
	return {
		d3: d3
	};
});
