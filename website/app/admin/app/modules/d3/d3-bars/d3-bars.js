angular.module('modules.d3.d3-bars', []);
angular.module('modules.d3.d3-bars').

directive('d3Bars', function (d3Service, $window, $timeout) {
	return {
		restrict: 'EA',
		scope: {
			data: '=',
			onClick: '&'
		},
		link: function (scope, element, attrs) {
			// Initial Setup
			var d3 = d3Service.d3;
			var renderTimeout;
			var svg = d3.select(element[0])
				.append('svg')
				.style('width', '100%');

			// Display Params
			var
				margin = parseInt(attrs.margin) || 20,
				barHeight = parseInt(attrs.barHeight) || 20,
				barPadding = parseInt(attrs.barPadding) || 5;


			// Render functions -----------------------------------------------

			// Browser onresize event
			$window.onresize = function () {
				scope.$apply();
			};

			// Watch for resize event
			scope.$watch(function () {
				return angular.element($window)[0].innerWidth;
			}, function () {
				render(scope.data);
			});

			// watch for data changes and re-render
			scope.$watch('data', function () {
				return render(scope.data);
			}, true);

			///////////////////////////////////////

			function render(data) {
				svg.selectAll('*').remove();

				if (!data) return;
				if (renderTimeout) $timeout.cancel(renderTimeout);

				renderTimeout = $timeout(function () {
					var width = d3.select(element[0])[0][0].offsetWidth - margin,
						height = scope.data.length * (barHeight + barPadding),
						color = d3.scale.category20b(),
						xScale = d3.scale.linear()
						.domain([0, d3.max(data, function (d) {
							return d.num;
						})])
						.range([0, width]);

					svg.attr('height', height);

					svg.selectAll('rect')
						.data(data)
						.enter()
						.append('rect')
						.on('click', function (d, i) {
							return scope.onClick({
								item: d
							});
						})
						.attr('height', barHeight)
						.attr('width', 140)
						.attr('x', Math.round(margin / 2))
						.attr('y', function (d, i) {
							return i * (barHeight + barPadding);
						})
						.attr('fill', function (d) {
							return color(d.num);
						})
						.transition()
						.duration(1000)
						.attr('width', function (d) {
							return xScale(d.num);
						});
					svg.selectAll('text')
						.data(data)
						.enter()
						.append('text')
						.on('click', function (d, i) {
							return scope.onClick({
								item: d
							});
						})
						.attr('fill', '#fff')
						.attr('y', function (d, i) {
							return i * (barHeight + barPadding) + 15;
						})
						.attr('x', 15)
						.text(function (d) {
							return d.name + " (" + d.num + ")";
						});
				}, 200);
			}

		}
	};
});
