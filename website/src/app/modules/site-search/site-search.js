import './site-search.scss';

angular.module('modules.site-search', [
    'modules.search'
]);
angular.module('modules.site-search').

directive('siteSearch', function () {
    return {
        restrict: 'E',
        template: require('./tpls/site-search.html'),
        scope: {},
        controller: function ($scope, $timeout, $state, $document, $element, CoreLibrary, SearchService) {
            var debounceTimeout;
            var debounceTimeoutTime = 300;

            $scope.results = {};
            $scope.hidePanel = hidePanel;
            $scope.goToResult = goToResult;
//            $scope.goToResults = goToResults;

            // Bind click on touch of element
            $scope.$watch('search', processSearch);

            $scope.$watch('results', processResults, true);
            $scope.$watch('showResults', processResults, true);
            $scope.$on('$destroy', onDestroy);

            ///////////////////////////

            function processSearch(){
                $timeout.cancel(debounceTimeout);
                if($scope.search){
                    debounceTimeout = $timeout(function(){
                        showPanel();
                        $scope.fullResults = [];
                        SearchService.search({
                            types : ['project', 'field', 'user', 'thread', 'organisation', 'job'],
                            key : 'name',
                            value : $scope.search,
                            size : 3,
                            page : 1,
                            populate : false,
                            select : ['name', 'picture', 'stub', 'type']
                        }).then(function (response) {
                            var results = CoreLibrary.groupByKey(response.data, 'entityType');
                            results.creations = results.creations || [];
                            results.thread = results.thread || [];
                            results.project = results.project || [];
                            if(results.project && results.project.length>0){
                                results.creations = results.project.concat(results.thread)
                            }
                            else if(results.thread && results.thread.length>0){
                                results.creations = results.thread;
                            }
                            if(results.creations){
                                results.creations = results.creations.splice(0,3); // Take only first 3
                            }
                            _.forEach(results, function(values, key){
                                $scope.results[key] = $scope.results[key] || [];
                                CoreLibrary.assignArray($scope.results[key], values, '_id');
                            })
                            if(response.data.length === 0){
                                _.forEach($scope.results, function(resultType){
                                    if(resultType){CoreLibrary.assignArray(resultType, [], '_id');}
                                })
                            }
                        });
                    }, debounceTimeoutTime)
                }
                else{
                    hidePanel();
                }
            }

            function processResults(){
                $scope.fullResults = [];
                $scope.fullResults = $scope.fullResults.concat($scope.results.creations, $scope.results.user, $scope.results.organisation, $scope.results.field, $scope.results.job);
            }

            function goToResult(stub, type){
                if (type === 'user') {
                    $state.go('app.user.profile', { stub : stub }, { inherit : false });
                } else if (type === 'project') {
                    $state.go('app.project.overview', { stub : stub }, { inherit : false });
                } else if (type === 'organisation') {
                    $state.go('app.organisation.overview', { stub : stub }, { inherit : false });
                } else if (type === 'field') {
                    $state.go('app.field.top', { stub : stub }, { inherit : false });
                }else if (type === 'blog') {
                    $state.go('app.thread', { stub : stub }, { inherit : false });
                }else if (type === 'general') {
                    $state.go('app.thread', { stub : stub }, { inherit : false });
                }else if (type === 'question') {
                    $state.go('app.thread', { stub : stub }, { inherit : false });
                }else if (type === 'job') {
                    $state.go('app.job', { stub : stub }, { inherit : false });
                }
                hidePanel();
            }

            function hidePanel(){
                $document.off('mousedown', hidePanelBind);
                $scope.showResults = false;
            }

            function showPanel(){
                $document.off('mousedown', hidePanelBind);
                $document.on('mousedown', hidePanelBind);
                $scope.showResults = true;
            }

            function hidePanelBind(event){
                var element = event.target;
                if(angular.element(element).hasClass('showResultsOnClick')){
                    return
                }
                else{
                    var editorSectionElement = angular.element(element).parents('.showResultsOnClick')[0];
                    if(!editorSectionElement){
                        hidePanel();
                        $scope.$apply();
                    }
                    else{
                        return
                    }
                }

            }
            function onDestroy() {
				$document.off('mousedown', hidePanelBind);
			}

        }
    };
});
