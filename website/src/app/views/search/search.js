//angular.module('views.search', []);
//angular.module('views.search').
//
//config(function ($stateProvider) {
//    $stateProvider.
//    state('app.search', {
//        url: '/search',
//        template: require('./search.html'),
//        resolve: {
//            users: function (UserService) {
//                return UserService.getUsers({
//                    page: 1,
//                    size: 1000
//                }).then(function (users) {
//                    return _.map(users, function (user) {
//                        return user
//                    });
//                });
//            }
//        },
//        controller: 'SearchViewCtrl'
//    });
//}).
//
//controller('SearchViewCtrl', function ($scope, $filter, users) {
////    console.log(_.map(_.countBy(_.pluck(users, 'name')), function(user) {
////        console.log(user);
////    }));
//    $scope.filtersOrder = ['networks','location','projects', 'followers', 'score']
//    $scope.filters = {
//        networks : {
//            title : 'Networks',
//            open  : true,
//            type  : 'radio',
//            items : [{
//                label  : 'All',
//                number : 22
//            },{
//                label  : 'Yes',
//                number : 15
//            },{
//                label  : 'No',
//                number : 6
//            }]
//        },
//        location  : {
//            title : 'Location',
//            open  : true,
//            type  : 'checkbox',
//            items : [{
//                label  : 'Tiancum',
//                number : 11
//            },{
//                label  : 'Jacob',
//                number : 11
//            },{
//                label  : 'Enos',
//                number : 11
//            }]
//        },
//        projects :{
//            title  : 'Projects',
//            path   : 'numProjects',
//            open   : true,
//            type   : 'slider',
//            slider : {
//                min      : 0,
//                max      : 60,
//                prefix   : '',
//                postfix  : ' years',
//            }
//        },
//        score :{
//            title  : 'Stemn Score',
//            path   : '',
//            open   : true,
//            type   : 'slider',
//            slider : {
//                min      : 0,
//                max      : 100,
//                prefix   : '',
//                postfix  : '',
//            }
//        },
//        followers  :{
//            title  : 'Followers',
//            path   : 'followers',
//            open   : true,
//            type   : 'slider',
//            slider : {
//                min      : 0,
//                max      : 100,
//                prefix   : '',
//                postfix  : '',
//            }
//    }};
//
//    $scope.rawResults = users;
//    console.log($scope.rawResults)
////    var names = _.countBy(_.compact(_.pluck(users, 'name')));
////    $scope.filters[1].items = _.map(_.keys(names), function(name) {
////        return {
////            label  : name,
////            number : names[name]
////        }
////    });
//
//    $scope.query = {
//        filter   : {},
//        radio    : {
//            projects : 'All'
//        },
//        range    : {
//            projects : {
//                min  : 0,
//                max  : 50
//            },
//            followers : {
//                min  : 0,
//                max  : 100
//            }},
//        orderBy  : {
//            name : 'age',
//            down : false
//        }
//    }
//
//    /* Useful Functions */
//    $scope.clearQuery = function (){
//        $scope.query = {};
//        $scope.applyQuery();
//    }
//
//    $scope.applyQuery = function (){
//        console.log('apply query!!')
//        $scope.results = $scope.rawResults;
//        // Filter by range
//        $scope.results = $scope.filterRange($scope.results);
//        // Filter by checkbox
//        $scope.results = $scope.filterCheckbox($scope.results);
//        // Filter by radio
//        $scope.results = $scope.filterRadio($scope.results);
//        // Order Results
//        $scope.results = $filter('orderBy')($scope.results, $scope.query.orderBy.name, $scope.query.orderBy.down);
//        $scope.resultsNum = $scope.results.length;
//    };
//
//
//    /* Filters */
//    $scope.filterRange = function (filterData) {
//        // Iterates over the range filters object.
//        // If there are multiple filters, data must satisfy all (AND condition)
//        _.each($scope.query.range, function(rangeFilter, rangeFilterField){
//            // Determine the path to filter
//            var path = $scope.filters[rangeFilterField].path;
//            // Filter the data
//            filterData = _.filter(filterData, function(data) {
//                return data[path] >= rangeFilter.min && data[path] <= rangeFilter.max;
//            });
//        });
//        return filterData
//    };
//
//    $scope.filterRadio = function (filterData) {
//        _.each($scope.query.radio, function(filterValue, filterField){
//            if (filterValue != 'All'){
//                filterData = _.filter(filterData, function(data) {
//                    return data[filterField] == filterValue;
//                });
//            }
//        });
//        return filterData
//    };
//
//    $scope.filterCheckbox = function (filterData) {
//        var result = [];
//        // if there are filters to be applied, filter, otherwise return original data
//        if (_.keys($scope.query.check).length) {
//            _.each(filterData, function(item) {
//                _.each($scope.query.check, function(filterValues, filterField){
//                    var filters = _.compact(_.map(filterValues, function(value, key) {
//                        return value ? key : false;
//                    }));
//
//                    if (filters.length) {
//                        // return data that matches the filters
//                        _.each(filters, function(filter) {
//                            if (item[filterField] == filter) {
//                                result.push(item);
//                            }
//                        });
//                    } else {
//                        // nothing to be filtered, return original
//                        result = filterData;
//                    }
//                });
//            });
//        } else {
//            result = filterData;
//        }
//        return result;
//    };
//
//    // Watch the query. Apply it on change
//    $scope.$watch('query', function(oldValue, newValue) {
//        $scope.applyQuery();
//    }, true);
//
//    $scope.deleteFilterLabel = function(property){
//        delete $scope.query.filter[property];
//    }
//
//});