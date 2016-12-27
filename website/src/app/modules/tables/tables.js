import './tables.scss';

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
            filterQuery   : '=?'
        },
        link: function (scope, element, attrs){

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
    };
});
