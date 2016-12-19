angular.module('views.marketing', []);
angular.module('views.marketing').

config(function ($stateProvider) {
    $stateProvider.state('app.marketing', {
        url: "/marketing",
        templateUrl: "app/views/marketing/marketing.html",
        controller: 'MarketingViewCtrl'
    });
}).

controller('MarketingViewCtrl', function ($scope, $filter, ngTableParams) {
		var data = [{pic: "http://i.imgur.com/oe2nNu4.png", name: "Moroni", age: 50},
                {pic: "http://i.imgur.com/oe2nNu4.png", name: "Tiancum", age: 43},
                {pic: "http://i.imgur.com/oe2nNu4.png", name: "Jacob", age: 27},
                {pic: "http://i.imgur.com/oe2nNu4.png", name: "Nephi", age: 29},
                {pic: "http://i.imgur.com/oe2nNu4.png", name: "Enos", age: 34},
                {pic: "http://i.imgur.com/oe2nNu4.png", name: "Tiancum", age: 43},
                {pic: "http://i.imgur.com/oe2nNu4.png", name: "Jacob", age: 27},
                {pic: "http://i.imgur.com/oe2nNu4.png", name: "Nephi", age: 29},
                {pic: "http://i.imgur.com/oe2nNu4.png", name: "Enos", age: 34},
                {pic: "http://i.imgur.com/oe2nNu4.png", name: "Tiancum", age: 43},
                {pic: "http://i.imgur.com/oe2nNu4.png", name: "Jacob", age: 27},
                {pic: "http://i.imgur.com/oe2nNu4.png", name: "Nephi", age: 29},
                {pic: "http://i.imgur.com/oe2nNu4.png", name: "Enos", age: 34},
                {pic: "http://i.imgur.com/oe2nNu4.png", name: "Tiancum", age: 43},
                {pic: "http://i.imgur.com/oe2nNu4.png", name: "Jacob", age: 27},
                {pic: "http://i.imgur.com/oe2nNu4.png", name: "Nephi", age: 29},
                {pic: "http://i.imgur.com/oe2nNu4.png", name: "Enos", age: 34}];

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
            name: 'asc'     // initial sorting
        }
    }, {
        total: data.length, // length of data
        getData: function($defer, params) {
            // use build-in angular filter
            var orderedData = params.sorting() ?
                                $filter('orderBy')(data, params.orderBy()) :
                                data;

            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

	var dataSource = [
    { arg: 10, y1: -12, y2: 10, y3: 32 },
    { arg: 20, y1: -32, y2: 30, y3: 12 },
    { arg: 40, y1: -20, y2: 20, y3: 30 },
    { arg: 50, y1: -39, y2: 50, y3: 19 },
    { arg: 60, y1: -10, y2: 10, y3: 15 },
    { arg: 75, y1: 10, y2: 10, y3: 15 },
    { arg: 80, y1: 30, y2: 100, y3: 130 },
    { arg: 90, y1: 40, y2: 110, y3: 140 },
    { arg: 100, y1: 50, y2: 90, y3: 90 },
    { arg: 105, y1: 40, y2: 145, y3: 120 },
    { arg: 110, y1: -12, y2: 10, y3: 32 },
    { arg: 120, y1: -32, y2: 30, y3: 12 },
    { arg: 130, y1: -20, y2: 20, y3: 30 },
	];

	var series = [{
		argumentField: 'arg',
		valueField: 'y1'
	}, {
		argumentField: 'arg',
		valueField: 'y2'
	}, {
		argumentField: 'arg',
		valueField: 'y3'
	}];

	$scope.zoom = {};
	$scope.zoom.start = 1;
	$scope.zoom.end = 130;

	$scope.zoomChart = {
		dataSource: dataSource,
		argumentAxis: {
            indentFromMin: 0.02,
            indentFromMax: 0.02
        },
		selectedRange: {
            startValue: $scope.zoom.start, endValue: $scope.zoom.end
        },
//		argumentAxis: {
//			valueMarginsEnabled: false,
//			type: "logarithmic",
//			label: { format: "exponential" },
//			grid: {
//				visible: true
//			},
//			minorGrid: {
//				visible: true
//			},
//			minorTickCount: 10
//		},
//		valueAxis: {
//			placeholderSize: 50
//		},
		legend: {
			visible: false
		},
//		series: {}
		series: series,
		adjustOnZoom: true
	};

	$scope.range = {
		size: {
			height: 120
		},
		margin: {
			left: 10
		},
		scale: {
            divisionValue: 1,
            minRange: 2
        },
		selectedRange: {
            startValue: $scope.zoom.start, endValue: $scope.zoom.end
        },
		dataSource: dataSource,
		chart: {
			series: series,
		},
		behavior: {
            callSelectedRangeChanged: "onMoving"
        },
//		scale: {
//			type: "logarithmic",
//			label: { format: "exponential" },
//			minRange: 1,
//			minorTickCount: 10
//		},
//		sliderMarker: {
//			format: 'exponential'
//		},
//		behavior: {
//			callSelectedRangeChanged: "onMoving",
//			snapToTicks: false
//		},
//		function onSelectedRangeChanged(e) {
//			var zoomedChart = $("#container #zoomedChart").dxChart("instance");
//			zoomedChart.zoomArgument(e.startValue, e.endValue);
//		}
//		onSelectedRangeChanged: function (e) {
//			console.log(e)
//			console.log(e.startValue, e.endValue)
//			$("#chartContainer").dxChart("instance");
//			$scope.zoomChart.zoomArguments.endValue = e.endValue;
//		}

		onSelectedRangeChanged: function (e) {
			$scope.zoom.start = e.startValue;
			$scope.zoom.end = e.endValue;
		}
	}

	var dataSource = [{
		country: "USA",
		medals: 110
	}, {
		country: "China",
		medals: 100
	}, {
		country: "Russia",
		medals: 72
	}, {
		country: "Britain",
		medals: 47
	}, {
		country: "Australia",
		medals: 46
	}, {
		country: "Germany",
		medals: 41
	}, {
		country: "France",
		medals: 40
	}, {
		country: "South Korea",
		medals: 31
	}];

	$scope.channelPie = {
		dataSource: dataSource,
	//    title: "Marketing Channel",
		legend: {
			orientation: "horizontal",
			itemTextPosition: "right",
			horizontalAlignment: "right",
			verticalAlignment: "bottom",
			rowCount: 2
		},
		series: [{
			argumentField: "country",
			valueField: "medals",
			label: {
				visible: true,
				font: {
					size: 16
				},
				connector: {
					visible: true,
					width: 0.5
				},
				position: "columns",
				customizeText: function(arg) {
					return arg.valueText + " ( " + arg.percentText + ")";
				}
			}
		}]
	};

	var dataSource = [{
		state: "Facebook",
		year1998: 423.721,
		year2001: 476.851,
		year2004: 528.904
	}, {
		state: "Twitter",
		year1998: 178.719,
		year2001: 195.769,
		year2004: 227.271
	}, {
		state: "LinkedIn",
		year1998: 308.845,
		year2001: 335.793,
		year2004: 372.576
	}, {
		state: "Other",
		year1998: 348.555,
		year2001: 374.771,
		year2004: 418.258
	}];

	$scope.channelConvChart = {
		dataSource: dataSource,
		commonSeriesSettings: {
			argumentField: "state",
			type: "bar",
			hoverMode: "allArgumentPoints",
			selectionMode: "allArgumentPoints",
			label: {
				visible: true,
				format: "fixedPoint",
				precision: 0
			}
		},
		series: [
			{ valueField: "year2004", name: "Reach (/conv rate)" },
			{ valueField: "year2001", name: "Ref Hits (/active user %)" },
			{ valueField: "year1998", name: "Sign Ups" }
		],
//		title: "Gross State Product within the Great Lakes Region",
		legend: {
			verticalAlignment: "bottom",
			horizontalAlignment: "center"
		},
		onPointClick: function (e) {
			e.target.select();
		}
	};

});
