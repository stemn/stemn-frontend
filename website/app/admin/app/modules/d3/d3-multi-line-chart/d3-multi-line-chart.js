angular.module('modules.d3.d3-multi-line-chart', []);

angular.module('modules.d3.d3-multi-line-chart').

/********************************************************************

Data of the form:

    $scope.data = [{
        name    : 'Visitors',
		values  : [{
			date: 1438064400000,
			number: 50
		},{
			date: 1438064500000,
			number: 100
		},{
			date: 1438064600000,
			number: 100
		},],
		visible : true
    },{
        name    : 'Smiles',
		values  : [{
			date: 1438064400000,
			number: 12
		},{
			date: 1438064600000,
			number: 214
		},{
			date: 1438064600000,
			number: 12
		},],
		visible : true
    },{
        name    : 'Signups',
		values  : [{
			date: 1438064400000,
			number: 1
		},{
			date: 1438064500000,
			number: 2
		},{
			date: 1438064600000,
			number:10
		},{
			date: 1438064700000,
			number: 4
		},{
			date: 1438064800000,
			number: 7
		},],
		visible : true
    }];

********************************************************************/

directive('d3MultiLineChart', function (d3Service, $window, $timeout) {
	// From http://bl.ocks.org/DStruths/9c042e3a6b66048b5bd4
	return {
		restrict: 'EA',
		scope: {
			data: '=',
			timeRangeFn: '=?',
			legendSelectFn: '=?',
		},
		link: function (scope, element, attrs) {
			// Initial Setup
			var d3 = d3Service.d3;
			var renderTimeout;
			var svgParent = d3.select(element[0])
				.append("svg");
			var svg //This is the first child

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
			});

			$timeout(function () {
				render(scope.data)
			}, 100);

			function render(data) {
				svgParent.selectAll('*').remove();
				//
				if (!data) return;
				if (renderTimeout) $timeout.cancel(renderTimeout);

				renderTimeout = $timeout(function () {

					// Setup --------------------------------------------------
					// Display Params
					var margin = {
							top: 20,
							right: 200,
							bottom: 100,
							left: 50
						},
						margin2 = {
							top: 430,
							right: 10,
							bottom: 20,
							left: 40
						},
						width = element[0].offsetWidth - margin.left - margin.right,
						height = 500 - margin.top - margin.bottom,
						height2 = 500 - margin2.top - margin2.bottom;

					var parseDate = d3.time.format("%Y%m%d").parse;
					var bisectDate = d3.bisector(function (d) {
						return d.date;
					}).left;

					var xScale = d3.time.scale()
						.range([0, width]),

						xScale2 = d3.time.scale()
						.range([0, width]); // Duplicate xScale for brushing ref later

					var yScale = d3.scale.linear()
						.range([height, 0]);

					// Custom colors
					var color = d3.scale.ordinal().range(["#48A36D", "#64B98C", "#80CEAA", "#7FC9BD", "#7EC4CF", "#7FB1CF", "#809ECE", "#8F90CD", "#9E81CC", "#B681BE", "#CE80B0","#D76D8F", "#E05A6D", "#E26962", "#E37756", "#E39158", "#E2AA59", "#DFB95C", "#DBC75F", "#EAD67C"]);
					var xAxis = d3.svg.axis()
						.scale(xScale)
						.orient("bottom"),

						xAxis2 = d3.svg.axis() // xAxis for brush slider
						.scale(xScale2)
						.orient("bottom");

					var yAxis = d3.svg.axis()
						.scale(yScale)
						.orient("left");

					var line = d3.svg.line()
//						.interpolate("basis") // This will smoothly interpolate the line
						.x(function (d) {
							return xScale(d.date);
						})
						.y(function (d) {
							return yScale(d.number);
						})
//	                    // This will hide zero points if no data is defined
//						.defined(function (d) {
//							return d.number;
//						});

					var maxY; // Defined later to update yAxis

					svg = svgParent.attr("width", width + margin.left + margin.right)
						.attr("height", height + margin.top + margin.bottom) //height + margin.top + margin.bottom
						.append("g")
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

					// Create invisible rect for mouse tracking
					svg.append("rect")
						.attr("width", width)
						.attr("height", height)
						.attr("x", 0)
						.attr("y", 0)
						.attr("id", "mouse-tracker")
						.style("fill", "white");

					//for slider part-----------------------------------------------------------------------------------

					var context = svg.append("g") // Brushing context box container
						.attr("transform", "translate(" + 0 + "," + 410 + ")")
						.attr("class", "context");

					//append clip path for lines plotted, hiding those part out of bounds
					svg.append("defs")
						.append("clipPath")
						.attr("id", "clip")
						.append("rect")
						.attr("width", width)
						.attr("height", height);
					// Render  --------------------------------------------------
					// Map fields to colours
					color.domain(_.map(data, 'name')); // Map the colour domain to the fields

					// If the date is in number form, make it date form
					if (!(data[0].values[0].date instanceof Date)) {
						data.forEach(function (d) {
							d.values.forEach(function (v) {
								v.date = new Date(v.date);
//								v.date = parseDate(v.date);
//								console.log(v.date);
							})
						});
					}
					xScale.domain([
						d3.min(data, function (c) {
							return d3.min(c.values, function (v) {
//								console.log(c.values);
//								console.log(v);
								return v.date;
							});
						}),
						d3.max(data, function (c) {
							return d3.max(c.values, function (v) {
								return v.date;
							});
						}),
					])

					yScale.domain([0, 100
									//d3.max(categories, function(c) { return d3.max(c.values, function(v) { return v.number; }); })
								]);

					xScale2.domain(xScale.domain()); // Setting a duplicate xdomain for brushing reference later

					//for slider part-----------------------------------------------------------------------------------

					var brush = d3.svg.brush() //for slider bar at the bottom
						.x(xScale2)
						.on("brush", brushed);

					context.append("g") // Create brushing xAxis
						.attr("class", "x axis1")
						.attr("transform", "translate(0," + height2 + ")")
						.call(xAxis2);

					var contextArea = d3.svg.area() // Set attributes for area chart in brushing context graph
						.interpolate("monotone")
						.x(function (d) {
							return xScale2(d.date);
						}) // x is scaled to xScale2
						.y0(height2) // Bottom line begins at height2 (area chart not inverted)
						.y1(0); // Top line of area, 0 (area chart not inverted)

					//plot the rect as the bar at the bottom
					context.append("path") // Path is created using svg.area details
						.attr("class", "area")
						.attr("d", contextArea(data[0].values)) // pass first data .values to area path generator
						.attr("fill", "#F1F1F2");

					//append the brush for the selection of subsection
					context.append("g")
						.attr("class", "x brush")
						.call(brush)
						.selectAll("rect")
						.attr("height", height2) // Make brush rects same height
						.attr("fill", "#E6E7E8");
					//end slider part-----------------------------------------------------------------------------------

					// draw line graph
					svg.append("g")
						.attr("class", "x axis")
						.attr("transform", "translate(0," + height + ")")
						.call(xAxis);

					svg.append("g")
						.attr("class", "y axis")
						.call(yAxis)
						.append("text")
						.attr("transform", "rotate(-90)")
						.attr("y", 6)
						.attr("x", -10)
						.attr("dy", ".71em")
						.style("text-anchor", "end")
						.text("Number");

					var issue = svg.selectAll(".issue")
						.data(data) // Select nested data and append to new svg group elements
						.enter().append("g")
						.attr("class", "issue");

					issue.append("path")
						.attr("class", "line")
						.style("pointer-events", "none") // Stop line interferring with cursor
						.attr("id", function (d) {
							return "line-" + d.name.replace(" ", "").replace("/", ""); // Give line id of line-(insert issue name, with any spaces replaced with no spaces)
						})
						.attr("d", function (d) {
							return d.visible ? line(d.values) : null; // If array key "visible" = true then draw line, if not then don't
						})
						.attr("clip-path", "url(#clip)") //use clip path to make irrelevant part invisible
						.style("stroke", function (d) {
							return color(d.name);
						});

					// draw legend
					var legendSpace = 450 / data.length; // 450/number of issues (ex. 40)

					// Create the toggle all button
					svg.append("text")
						.attr("x", width + (margin.right / 3))
						.attr("y", 10)
						.text('Click to Toggle All')
						.on("click", function () {

							d3.select(this)
							_.forEach(scope.data, function(eventGroup){
								legendClickBind(eventGroup)
							})
						})

					issue.append("rect")
						.attr("width", 10)
						.attr("height", 10)
						.attr("x", width + (margin.right / 3) - 15)
						.attr("y", function (d, i) {
							return (legendSpace) + i * (legendSpace) - 8;
						}) // spacing
						.attr("fill", function (d) {
							return d.visible ? color(d.name) : "#F1F1F2"; // If array key "visible" = true then color rect, if not then make it grey
						})
						.attr("class", "legend-box")

					.on("click", function (d) {
						legendClickBind(d)
					})

					.on("mouseover", function (d) {

						d3.select(this)
							.transition()
							.attr("fill", function (d) {
								return color(d.name);
							});

						d3.select("#line-" + d.name.replace(" ", "").replace("/", ""))
							.transition()
							.style("stroke-width", 4.5);
					})

					.on("mouseout", function (d) {

						d3.select(this)
							.transition()
							.attr("fill", function (d) {
								return d.visible ? color(d.name) : "#F1F1F2";
							});

						d3.select("#line-" + d.name.replace(" ", "").replace("/", ""))
							.transition()
							.style("stroke-width", 1.5);
					})

					issue.append("text")
						.attr("x", width + (margin.right / 3))
						.attr("y", function (d, i) {
							return (legendSpace) + i * (legendSpace);
						}) // (return (11.25/2 =) 5.625) + i * (5.625)
						.text(function (d) {
							return d.name;
						})
						.on("click", function (d) {
						legendClickBind(d)
					})


					////////////////////////////////////

					function legendClickBind(d){
						d.visible = !d.visible; // If array key for this data selection is "visible" = true then make it false, if false then make it true
						maxY = findMaxY(data); // Find max Y number value categories data with "visible"; true
						yScale.domain([0, maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
						scope.legendSelectFn(brush.extent());

						svg.select(".y.axis")
							.transition()
							.call(yAxis);

						issue.select("path")
							.transition()
							.attr("d", function (d) {
								return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
							})

						issue.select("rect")
							.transition()
							.attr("fill", function (d) {
								return d.visible ? color(d.name) : "#F1F1F2";
							});
					}

					// Hover line
					var hoverLineGroup = svg.append("g")
						.attr("class", "hover-line");

					var hoverLine = hoverLineGroup // Create line with basic attributes
						.append("line")
						.attr("id", "hover-line")
						.attr("x1", 10).attr("x2", 10)
						.attr("y1", 0).attr("y2", height + 10)
						.style("pointer-events", "none") // Stop line interferring with cursor
						.style("opacity", 1e-6); // Set opacity to zero

					var hoverDate = hoverLineGroup
						.append('text')
						.attr("class", "hover-text")
						.attr("y", height - (height - 40)) // hover date text position
						.attr("x", width - 150) // hover date text position
						.style("fill", "#E6E7E8");

					var columnNames = _.map(data, 'name');

					var focus = issue.select("g") // create group elements to house tooltip text
						.data(columnNames) // bind each column name date to each g element
						.enter().append("g") //create one <g> for each columnName
						.attr("class", "focus");

					focus.append("text") // http://stackoverflow.com/questions/22064083/d3-js-multi-series-chart-with-y-value-tracking
						.attr("class", "tooltip")
						.attr("x", width + 20) // position tooltips
						.attr("y", function (d, i) {
							return (legendSpace) + i * (legendSpace);
						}); // (return (11.25/2 =) 5.625) + i * (5.625) // position tooltips

					//                // Add mouseover events for hover line.
					//                d3.select("#mouse-tracker") // select chart plot background rect #mouse-tracker
					//                    .on("mousemove", mousemove) // on mousemove activate mousemove function defined below
					//                    .on("mouseout", function () {
					//                        hoverDate
					//                            .text(null) // on mouseout remove text for hover date
					//
					//                        d3.select("#hover-line")
					//                            .style("opacity", 1e-6); // On mouse out making line invisible
					//                    });
					//
					//                /////////////////////////////////////////////////////////////////////
					//
					//                function mousemove() {
					//                    var mouse_x = d3.mouse(this)[0]; // Finding mouse x position on rect
					//                    var graph_x = xScale.invert(mouse_x); //
					//
					//                    //var mouse_y = d3.mouse(this)[1]; // Finding mouse y position on rect
					//                    //var graph_y = yScale.invert(mouse_y);
					//                    //console.log(graph_x);
					//
					//                    var format = d3.time.format('%b %Y'); // Format hover date text to show three letter month and full year
					//
					//                    hoverDate.text(format(graph_x)); // scale mouse position to xScale date and format it to show month and year
					//
					//                    d3.select("#hover-line") // select hover-line and changing attributes to mouse position
					//                        .attr("x1", mouse_x)
					//                        .attr("x2", mouse_x)
					//                        .style("opacity", 1); // Making line visible
					//
					//                    // Legend tooltips // http://www.d3noob.org/2014/07/my-favourite-tooltip-method-for-line.html
					//
					//                    var x0 = xScale.invert(d3.mouse(this)[0]),
					//                        /* d3.mouse(this)[0] returns the x position on the screen of the mouse. xScale.invert function is reversing the process that we use to map the domain (date) to range (position on screen). So it takes the position on the screen and converts it into an equivalent date! */
					//						i = bisectDate(data, x0, 1), // use our bisectDate function that we declared earlier to find the index of our data array that is close to the mouse cursor
					//                        /*It takes our data array and the date corresponding to the position of or mouse cursor and returns the index number of the data array which has a date that is higher than the cursor position.*/
					//                        d0 = data[i - 1],
					//                        d1 = data[i],
					//                        /*d0 is the combination of date and number that is in the data array at the index to the left of the cursor and d1 is the combination of date and close that is in the data array at the index to the right of the cursor. In other words we now have two variables that know the value and date above and below the date that corresponds to the position of the cursor.*/
					//                        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
					//                    /*The final line in this segment declares a new array d that is represents the date and close combination that is closest to the cursor. It is using the magic JavaScript short hand for an if statement that is essentially saying if the distance between the mouse cursor and the date and close combination on the left is greater than the distance between the mouse cursor and the date and close combination on the right then d is an array of the date and close on the right of the cursor (d1). Otherwise d is an array of the date and close on the left of the cursor (d0).*/
					//
					//
					//                    //d is now the data row for the date closest to the mouse position
					//
					//                    focus.select("text").text(function (columnName) {
					//                        //because you didn't explictly set any data on the <text>
					//                        //elements, each one inherits the data from the focus <g>
					//
					//                        return (d[columnName]);
					//                    });
					//                };


					brushed(); // Initiate the brush
					//for brusher of the slider bar at the bottom
					function brushed() {
						xScale.domain(brush.empty() ? xScale2.domain() : brush.extent());
						// If brush is empty then reset the Xscale domain to default, if not then make it the brush extent

						svg.select(".x.axis") // replot xAxis with transition when brush used
							.transition()
							.call(xAxis);

						maxY = findMaxY(data); // Find max Y number value categories data with "visible"; true
						yScale.domain([0, maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true

						svg.select(".y.axis") // Redraw yAxis
							.transition()
							.call(yAxis);

						issue.select("path") // Redraw lines based on brush xAxis scale and domain
							.transition()
							.attr("d", function (d) {
								return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
							});

						// Set brush to scope
						scope.timeRangeFn(brush.extent(), data)
					}
				}, 200)

			}

			function findMaxY(data) { // Define function "findMaxY"
				var maxYValues = data.map(function (d) {
					if (d.visible) {
						return d3.max(d.values, function (value) { // Return max number value
							return value.number;
						});
					}
				});
				return d3.max(maxYValues);
			}

		}
	};
});
