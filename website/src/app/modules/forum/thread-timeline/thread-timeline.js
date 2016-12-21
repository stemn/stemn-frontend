import './thread-timeline.scss';

angular.module('modules.thread.timeline', [
]);
angular.module('modules.thread.timeline').

directive('threadTimelineItem', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/forum/thread-timeline/tpls/thread-timeline-item.html',
        scope: {
            item: '=',
            parent: '=',
            timeline: '='
        },
        controller: function ($scope) {
            $scope.iconMap = {
                label : 'label',
                update : 'person',
                closed : 'close',
                open   : 'done'
            }
        }
    };
}).

directive('threadTimeline', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/forum/thread-timeline/tpls/thread-timeline.html',
        scope: {
            parent: '=',
            timeline: '=',
            saveFn: '&',
            userPermissions: '='
        },
        controller: function ($scope, PostService, $timeout) {
            $scope.loading = true;
            PostService.getPosts($scope.parent).then(function(response){
                $scope.loading = false;
                _.forEach(response.data, function(item){
                    item.event = 'post'
                });
                $scope.timeline = $scope.timeline.concat(response.data);
            })

            $scope.deleteItem = deleteItem; //function(index)

            ////////////////////////////

            function deleteItem(index){
                $scope.timeline.splice(index, 0)
                $timeout($scope.saveFn, 1);
            }
        }
    };
}).


service('ThreadTimelineService', function (Authentication, XxhashService) {
    this.processSave = processSave;

    //////////////////////////////////////////

    function processSave(intialData, newData){
        var eventObject = {
            timestamp : moment().format(),
            user      : {
                _id   : Authentication.currentUser._id,
                name  : Authentication.currentUser.name,
                stub  : Authentication.currentUser.stub,
            },
        }

        if(intialData.published && newData.published){
            // Changes -----------------------------------------
            if(getHash(intialData) != getHash(newData)){
                newData.timeline.push(_.extend({}, eventObject, {
                    event     : 'update'
                }))
            }

            // Process Tags ------------------------------------
            var removedLabels = _.difference(intialData.labels, newData.labels);
            var addedLabels   = _.difference(newData.labels, intialData.labels);
            if(removedLabels.length > 0 || addedLabels.length > 0){
                newData.timeline.push(_.extend({}, eventObject, {
                    added     : addedLabels,
                    removed   : removedLabels,
                    event     : 'label'
                }))
            }

            // Process Closed/Open -----------------------------
            if(intialData.closed != newData.closed){
                newData.timeline.push(_.extend({}, eventObject, {
                    event     : newData.closed ? 'closed' : 'open'
                }))
            }
        }


        // Remove posts
        var newDataCopy = _.cloneDeep(newData);
        var goodTimeline = []
        _.forEach(newDataCopy.timeline, function(item){
            if(item.event != 'post'){
                goodTimeline.push(item)
            }
        });
        newDataCopy.timeline = goodTimeline;

        return newDataCopy


        //////////////////////


        function getHash(entity){
            var sectionClone = _.cloneDeep(entity.sectionData);
            sectionClone.sections = _.map(sectionClone.sections, function(section){
                return {content: section.content}
            })
            return XxhashService(JSON.stringify(sectionClone), 0xABCD).toString();
        }
    }
});

