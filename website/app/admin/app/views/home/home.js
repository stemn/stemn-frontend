angular.module('views.home', []);
angular.module('views.home').

config(function ($stateProvider) {
  $stateProvider.state('app.home', {
    url: "/home",
    templateUrl: "app/views/home/home.html",
    controller: 'HomeViewCtrl'
  });
}).

controller('HomeViewCtrl', function (userdata, $scope, $http, CoreService, Restangular) {

	var graphEvents = [
        'project-create',
        'project-update',
        'thread-create',
        'thread-update',
        'post-create',
        'comment-create',
        'user-update',
        'user-follow',
        'user-like',
        'user-vote',
		'auth-local-signup',
		'auth-linkedin-signup',
		'auth-facebook-signup'
    ];

	var times = {
		week : 1000 * 60 * 60 * 24 * 7,
		day  : 1000 * 60 * 60 * 24,
		hour : 1000 * 60 * 60,
		min  : 1000 * 60,
		sec  : 1000,
	}
	$scope.times = times;

	// Key Metrics
	$scope.getKeyMetrics = getKeyMetrics;
	$scope.getKeyMetrics()

	// Time Machine Query
	var groupedLogData
	$scope.getLogData = getLogData;
	$scope.getLogData();

	// update the plot data time coarsness
	$scope.changeTimeCoarsness = function(timeCoarsness){
		$scope.multiSeriesData = processPlotData(groupedLogData, timeCoarsness);
	}

	// Re-render Visitor Actions and Funnel when Time-Machine changes
	$scope.timeRangeChange = function(timeRange){
		$scope.timeRange = timeRange;
		var visibleEvents = getVisibleEvents($scope.multiSeriesData);
		processFunelAndActions($scope.timeRange, visibleEvents)
		$scope.$apply();
	}
	$scope.legendSelectChange = function(timeRange){
		$scope.timeRange = timeRange;
		var visibleEvents = getVisibleEvents($scope.multiSeriesData);
		processFunelAndActions($scope.timeRange, visibleEvents)
		$scope.$apply();
	}

//	getSignups({ from : '2015-08-12T06:32:49.723Z', to : '2015-08-19T06:32:49.723Z' }).then(function(signups) {
//		console.log(signups);

//	});
//
//	getActiveUsers({ from : '2015-08-12T06:32:49.723Z', to : '2015-08-19T06:32:49.723Z' }).then(function(activeUsers) {
//		console.log(activeUsers);
//	});

	//////////////////////////////////////////////////////////////////////////////////////////////

	function getKeyMetrics(){
		var keyMetrics = {};
		var now        = new Date(new Date().getTime()); // today
		var oneDayAgo  = now - times.day;
		var oneWeekAgo = now - times.week;
		var twoWeeksAgo   = now - 2 * times.week;
		var threeWeeksAgo = now - 3 * times.week;
		getSignups({ from : oneDayAgo, to : now }).then(function(signups) {
			keyMetrics.signups1D = signups;
		});
		getSignups({ from : oneWeekAgo, to : now }).then(function(signups) {
			keyMetrics.signups1W = signups;
		});
		getSignups({ from : twoWeeksAgo, to : oneWeekAgo }).then(function(signups) {
			keyMetrics.signups2W = signups;
		});
		getSignups({ from : threeWeeksAgo, to : twoWeeksAgo }).then(function(signups) {
			keyMetrics.signups3W = signups;
		});

		getActiveUsers({ from : oneDayAgo, to : now }).then(function(activeUsers) {
			keyMetrics.activeUsers1D = activeUsers;
		});
		getActiveUsers({ from : oneWeekAgo, to : now }).then(function(activeUsers) {
			keyMetrics.activeUsers1W = activeUsers;
		});
		getActiveUsers({ from : twoWeeksAgo, to : oneWeekAgo }).then(function(activeUsers) {
			keyMetrics.activeUsers2W = activeUsers;
		});
		getActiveUsers({ from : threeWeeksAgo, to : twoWeeksAgo }).then(function(activeUsers) {
			keyMetrics.activeUsers3W = activeUsers;
		});

		$scope.keyMetrics = keyMetrics
	}

	function getLogData(){

		return $http({url: "/api/v1/logs", method: "GET", params: {fields : {event : {$in:graphEvents}}}}).success(function(data){
			groupedLogData = groupLogData(data);
			console.log(groupedLogData);
			// Convert all dates to secons from utc
			_.forEach(groupedLogData, function(eventGroup, key){
				_.forEach(eventGroup, function(point){
					point.date = (new Date(point.date)).getTime();
				})
			})
			$scope.multiSeriesData = processPlotData(groupedLogData, times.day);
		});
	}

	function processFunelAndActions(timeRange, visibleEvents){
		// Initiate empty data objects and arrays
		var timeRangeData = {};
		var barData       = [];
		var idx = 0
		_.forEach(groupedLogData, function(eventGroup, key){
			// If the event is visible
			if(visibleEvents[key]){
				// Create the list of events in the time range
				timeRangeData[key]=filterByDateRange(eventGroup, timeRange);
				// Create the barData for the funnel
				barData[idx] = {
					name : key,
					num  : timeRangeData[key].length,
				}
				idx ++
			}
		});

		// Assign to scope
		$scope.timeRangeData = timeRangeData;
		$scope.barData       = barData;
	}

	function getVisibleEvents(data){
		// Takes in plot data, returns visible events
		var visibleEvents = {};
		_.forEach(data, function(event){
			visibleEvents[event.name] = event.visible;
		})
		return visibleEvents
	}

	function processPlotData(groupedLogData, period){
		// This takes in the grouped log data and creates an
		// array that contains the event count

		// Group and count the events in a period
		var plotData = [];
		var idx = 0;
		_.forEach(groupedLogData, function(eventGroup, key){
			plotData[idx] = {
				name: key,
				values: groupPointsToPeriod(eventGroup, period),
				visible: true
			}
			idx ++
		})

		return plotData;
	}

	function groupPointsToPeriod(points,period){
		// Check the smallest time in the array
		var first = getSmallestTime(points, period)
		var rangedData = [];
		// Sort to events into an array
		_.forEach(points, function(point){
			var idx = parseInt(Math.ceil((point.date - first)/period));
			if(!rangedData[idx]){
				rangedData[idx] = {
					date   : Math.ceil(point.date/period)*period,
					events : [point]
				}
			}
			else{
				rangedData[idx].events.push(point)
			}
		})
		// Count the number of events and set default
		_.forEach(rangedData, function(points, idx){
			if(points){
				points.number = points.events.length;
			}
			// If the point doesn't exist, set a default of zero
			else{
				rangedData[idx] = {
					date : first+idx*period,
					number : 0
				}
			}
		})
		return rangedData;
	}

	function getSmallestTime(points, period){
		if(points[0].date > points[points.length -1].date){
			// If the first point is larger than last, time is descending
			// First date is the last point
			return Math.ceil(points[points.length -1].date/period)*period;
		}
		else{
			// Else, time is ascending
			// First date is the first point
			return Math.ceil(points[0].date/period)*period;
		}
	}

	function groupLogData(logData){
		var sorted = {};
		_.forEach(logData, function(item){
			if(!sorted[item.event]){
				sorted[item.event] = [item]
			} else{
			sorted[item.event].push(item)
			}
		})
		return sorted
	}


	function filterByDateRange(values,timeRange){
		// timerange is array of min/max times [mindate, maxdate]
		// values is array that includes value.date
		return _.filter(values, function(value) {
			return value.date >= timeRange[0] && value.date <= timeRange[1]
		});
	}
	function averageValue(values){
		// This will take the average value of an array
		return values.reduce(function(a,m,i,p) {
			return a + m.number/p.length;
		},0)
	}

	function getTimeCoarsness(timeRange){
		var timeDelta     = timeRange[1] - timeRange[0];
		return _.find(times, function(timePeriod){
			return timeDelta/timePeriod > 5;
		})
	}

    // This function returns an ObjectId embedded with a given datetime
    // Accepts both Date object and string input
    function objectId(timestamp) {
        // Convert string date to Date object (otherwise assume timestamp is a date)
        if (typeof timestamp === 'string') {
            timestamp = new Date(timestamp);
        }

        // Convert date object to hex seconds since Unix epoch
        var hexSeconds = Math.floor(timestamp/1000).toString(16);

        // Create an ObjectId with that hex timestamp
        return hexSeconds + "0000000000000000";
    }

	function getSignups(data) {
		return Restangular.all('analytics').all('signups').getList({
			from : data.from,
			to : data.to
		});
	}

	function getActiveUsers(data) {
		return Restangular.all('analytics').all('activeUsers').getList({
			from : data.from,
			to : data.to
		});
	}

});


//
//	function signupsDateRange(from, to) {
//		var aggregate = [
//			{
//				$match: {
//					$and : [
//						{ _id : { $gt : objectId(from) } },
//						{ _id : { $lt : objectId(to) } }
//					]
//				}
//			},
//			{
//				$group: {
//					_id: null,
//					count: {$sum: 1}
//				}
//			}
//		];
//		return aggregateQuery(aggregate);
//	}
//
//    function aggregateQuery(aggregate) {
//        return $http({
//            method: 'POST',
//            url: '/api/v1/logs/aggregate',
//            data: aggregate
//        }).then(function(response) {
//            return response.data[0];
//        });
//    }
