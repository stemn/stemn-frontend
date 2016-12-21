import './related.scss';
angular.module('modules.related', [
    'modules.tags',
    'modules.feed' // Used for feed-item display
]);
angular.module('modules.related').

directive('related', function (RelatedService) {
    return {
        restrict: 'E',
        scope: {
            parentType    : '@',
            parentId      : '@',
            type          : '@?', // field || user || project || organisation || question || general || blog
            displayStyle  : '@?'  // feed || tags || list
        },
        replace: true,
        template: '<div ng-include="template"></div>',
        controller: function($scope, $timeout, $element){
            // Set defaults and info --------------------------------------------------------
            $scope.type = $scope.type || 'field';
            var typeInfos = { // The keys match type inputs
                'field'        : { size : 10, title : 'Related Fields'},
                'user'         : { size : 4,  title : 'Related People'},
                'organisation' : { size : 10, title : 'Related Organisations'},
                'project'      : { size : 3,  title : 'Similar Projects'},
                'blog'         : { size : 3,  title : 'Similar Blogs'},
                'general'      : { size : 3,  title : 'Similar Discussions'},
                'question'     : { size : 3,  title : 'Similar Questions'},
            };
            $scope.typeInfo = typeInfos[$scope.type];

            // TEMP BUG FIX
            // This will change the projects title to 'Top Projects' for the hompeage sidebar
            if($scope.displayStyle != 'feed' && $scope.type == 'project'){
                $scope.typeInfo.title = 'Top Projects'
            }

            // Set layout --------------------------------------------------------------------
            $scope.displayStyle = $scope.displayStyle || 'tags';
            var displayStyles = { // The keys match type inputs
                'feed'        : {template:'app/modules/related/tpls/related-compact-feed.html'},
                'tags'        : {template:'app/modules/related/tpls/related-tags.html'},
            };
            $scope.template = displayStyles[$scope.displayStyle].template;

            // Functions ---------------------------------------------------------------------
            // This will get related fields and organisations.
            var getRelated = function(page){
                RelatedService.getRelated({
                    parentType : $scope.parentType,
                    parentId   : $scope.parentId,
                    type       : $scope.type,
                    page       : page,
                    size       : $scope.typeInfo.size
                }).then(function(related) {
                    if(related.length === 0){$scope.noMoreResults = true;}  // If there are results, set noMoreResults
                    if(page > 1){$scope.data = $scope.data.concat(related)} // Push onto existing array
                    else{$scope.data = related;}
                    // If no results on first page, hide the element
                    if(related.length === 0 && page == 1){
                        $element.addClass('hide')
                    }
                })
            }
            // Get the first page on load
            getRelated(1);
            var page = 2; // Set page to 2, this is because we already have page 1.
            $scope.more = function(){
                getRelated(page)
                page ++
            }
        }
    };
}).

directive('tagged', function () {
    return {
        restrict: 'E',
        scope: {
            tags       : '=?',
            type       : '@?', // field || organisation || projects
        },
        replace: true,
        template: require('./tpls/related-tags.html'),
        controller: function($scope, $timeout, Authentication){
            // Set default
            $scope.type = $scope.type || 'field';

            var typeInfos = { // The keys match type inputs
                'field'        : { title : 'Tagged Fields'},
                'organisation' : { title : 'Tagged Organisations'},
                'project'      : { title : 'Tagged Projects'},
            };
            $scope.typeInfo = typeInfos[$scope.type];

            // Get the data
            var size = 6;
            var page = 1;
            var allData = $scope.tags;

            var getMore = function(){
                var sliceSize = allData.length - (size*page);
                if(sliceSize < 0){sliceSize = 0}
                $scope.data = allData.slice(sliceSize).reverse();
                if(size*page > $scope.data.length){
                    $scope.noMoreResults = true;
                }
                page ++;
            }
            getMore();

            $scope.more = function(){
                getMore();
                $timeout( function(){$scope.currentTab = 0;}, 500 )
            }
        }
    };
}).

service('RelatedService', function (Restangular) {

    /***************************************** /
     parentType : the type of the parent to get related things for
     parentId : the id of the parent to get related things for
     page : The page number to request
     size : The number of results per page
     sort : The field to sort the results by (defaults to views)
     type : The entity to get related for e.g. organisation, field
    / *****************************************/
    this.getRelated = function(options) {
        return Restangular.one(options.parentType + 's', options.parentId).all('related').getList(options);
    }
});
