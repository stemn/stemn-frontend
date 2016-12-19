angular.module('modules.tables', [
]);
angular.module('modules.tables').

directive('filterColumnOrder', function ($parse, $stateParams) {
    /***********************************************
    filterObject : {
        model: '',
        reverse: '',
        onChange: function to run on change
        query: HttpQuery object (optional)
    }

    ************************************************/
    return {
        restrict: 'A',
        scope: {
            filterObject  : '=',
            filterModel   : '@',
            filterReverse : '=?', // true || false' - If true we can sort ascending, otherwise only descending
            filterQuery   : '=?',
            filterEnabled : '@?', // true || false - if 'false' this is disabled
        },
        link: function (scope, element, attrs){
            if(scope.filterEnabled != 'false'){

                // Add class if enabled
                element.addClass('filter-column-order');

                // Bind click
                element.bind('click', function (event) {
                    // If this column is already selected, reverse
                    if(scope.filterObject.model == scope.filterModel && scope.filterReverse){
                        scope.filterObject.reverse = !scope.filterObject.reverse;
                    }
                    // Else, we filter by this column
                    else{
                        scope.filterObject.model = scope.filterModel;
                        scope.filterObject.reverse = false;
                    }
                    // If an onChange function exists
                    if(scope.filterObject.onChange){
                        scope.filterObject.onChange({
                            model: scope.filterObject.model,
                            reverse: scope.filterObject.reverse
                        });
                    }
                    // If the query object is supplied - run generic method
                    var query = scope.filterObject.query || scope.filterQuery;
                    if(query){
                        query.params.sort  = scope.filterObject.model;
                        query.params.order = scope.filterObject.reverse ? 'asc' : 'dsc';
                        query.updateQueryParams();
                        query.refresh();
                    }
                    scope.$apply();

                });
                scope.$watch('filterObject', function(){
                    if(scope.filterObject.model == scope.filterModel){
                        // Add classes for arrows
                        if(scope.filterObject.reverse === true){
                            element.addClass('up')
                            element.removeClass('down')
                        }
                        else if(scope.filterObject.reverse === false){
                            element.addClass('down')
                            element.removeClass('up')
                        }
                    }
                    else{
                        element.removeClass('down')
                        element.removeClass('up')
                    }
                }, true)
            }
        }
    };
}).

directive('modularTable', function ($mdDialog) {
    return {
        restrict: 'E',
        scope: {
            columns: '=',
            query  : '=',
            select : '=?',
            selectedRows : '=?',
            scrollLoad : '=?',
        },
        templateUrl: "app/modules/tables/tpls/modular-table.html",
        link: function (scope, element, attrs) {
            if(scope.select){
                scope._selectedRows =  {};

                // Stop the column being added multiple times - This can happen if the controller is re-instantiated and the DOM is not destroyed (sticky state bug?)
                if(scope.query.columns[0].model != 'select-checkbox'){
                    scope.query.columns.unshift({
                        status: true,
                        sort: false,
                        model: 'select-checkbox',
                        width: '20px',
                        headerTemplate: '<md-checkbox ng-model="selectedAllRowsModel" ng-change="selectedAllRows(selectedAllRowsModel)" aria-label="Select" style="margin: 0"></md-checkbox>',
                        template: `
                            <md-checkbox ng-model="_selectedRows[item._id]" aria-label="Select" style="margin: 0"></md-checkbox>
                        `,
                    });
                }

                scope.$watch('_selectedRows', function(){
                    scope.selectedRows  =  [];
                    _.forEach(scope._selectedRows, function(value, key){
                        if(value){
                            scope.selectedRows.push(key);
                        }
                    })
                }, true);

                scope.selectedAllRows = function(status){
                    _.forEach(scope.query.results, function(result){
                        scope._selectedRows[result._id] = status;
                    })
                }
            }

            /////////////////////////////

        }
    };
}).

directive('selectedRowsOverlay', function ($mdDialog) {
    return {
        restrict: 'E',
        scope: {
            selectedRowsObject: '=',
            selectedRowsArray : '='
        },
        templateUrl: "app/modules/tables/tpls/selected-rows-overlay.html",
        controller: function ($scope) {
            $scope.deselect = function(){
                console.log($scope.selectedRowsObject);
                _.forEach(Object.keys($scope.selectedRowsObject), function(key){
                    $scope.selectedRowsObject[key] = false;
                })
            }

        }
    };
}).

directive('setAttrs', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var attrsToSet = $parse(attrs.setAttrs)(scope);
            if(attrsToSet){
                element[0].setAttribute(attrsToSet, '')
            }
        }
    };
}).

directive('displayTableColumnSelect', function ($mdDialog) {
    return {
        restrict: 'A',
        scope: {
            columns: '='
        },
        link: function (scope, element, attrs) {
            element.bind("click", function (event) {
                showUserModal(event, scope.columns)
            });

            function showUserModal(event, data) {
                $mdDialog.show({
                    templateUrl: 'app/modules/tables/tpls/table-column-select-modal.html',
                    controller: function (data, $scope) {
                        $scope.data = data;
                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };
                    },
                    targetEvent: event,
                    clickOutsideToClose: true,
                    locals: {
                        data: data
                    }
                })
            }
        }
    };
});
