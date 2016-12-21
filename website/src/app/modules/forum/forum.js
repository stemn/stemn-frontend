import './thread-labels/thread-labels.js';
import './thread-timeline/thread-timeline.js';
import './thread-create-modal/thread-create-modal.js';

angular.module('modules.forum', [
    'modules.thread.thread-create-modal',
    'modules.thread.timeline',
    'modules.thread.labels',

    'modules.editor',
    'modules.tags',
    'modules.social-media',
]);
angular.module('modules.forum').

directive('forum', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/forum/tpls/forum.html',
        scope: {
            parentId   : '@?',
            parentType : '@?',
            size       : '@?',
            query      : '=?',
            type       : '@'
        },
        controller: function ($scope, HttpQuery) {
            $scope.size = $scope.size || 20;

            $scope.query = HttpQuery({
                url   : 'api/v1/search',
                params: {
                    parentType: $scope.parentId ? $scope.parentType : '',
                    parentId: $scope.parentId,
                    sort: 'updated',
                    type: 'thread',
                    size: $scope.size,
                    select: ['picture', 'name', 'stub', 'blurb', 'owner', 'projects', 'numPosts', 'fields', 'labels'],
                    populate: true,
                    criteria : $scope.type == 'threads' ? {} : { type : ['question', 'general' ] }
                },
                onSuccess : function(response){
                    _.forEach(response, function(item){
                        item.picture = getPicture(item);
                        item.project = getProject(item);
                    })
                    return response
                },
                requestSize : 20
            });
            $scope.query.more();


            //////////////////////////////


            function getPicture(entity){
                if(!entity.picture){
                    var field = _.find(entity.fields, 'picture');
                    if(field){
                        return field.picture;
                    }
                }
                else{
                    return entity.picture
                }
            }
            function getProject(entity){
                if(entity.projects.length > 0){
                    return  _.find(entity.projects, 'picture');
                }
            }
        }
    };
}).

directive('threadMetaRelations', function () {
    return {
        restrict: 'E',
        template: '<h2 ng-if="relations" ng-bind-html="relations"><h2>',
        scope: {
            projects      : '=?',
            organisations : '=?',
        },
        controller: function ($scope) {
            var entity = [];
            var num    = 0;
            function setEntity(data, type){
                entity[num] = type + ' <a class="bold" href='+data.href+'>'+data.name+'</a>';
                num++
            }

            // Set the entities
            if($scope.projects[0]){
                $scope.projects[0].href = "projects/"+$scope.projects[0].stub;
                setEntity($scope.projects[0], 'project')
            }
            if($scope.organisations[0]){
                $scope.organisations[0].href = "org/"+$scope.organisations[0].stub+"/top";
                setEntity($scope.organisations[0], 'organisation')
            }

            // Construct the string
            if(entity.length === 2){
                $scope.relations = 'In reference to the '+entity[0]+' and the '+entity[1]+'.';
            }
            else if(entity.length === 1){
                $scope.relations = 'In reference to the '+entity[0]+'.';
            }
            else{
                $scope.relations = false;
            }

        }
    };
}).

directive('clickCreateThread', function (ThreadCreateModalService) {
    return {
        restrict: 'A',
        scope: {
            thread: '=?'
        },
        link : function(scope, element, attrs){
            element.bind('click', function (event) {
                ThreadCreateModalService.newThread(event, scope.thread);
            });
        }
    }
}).


service('ThreadService', function($http, HttpService, LocalCache, Restangular, Authentication, $q, ModularEditorService) {

    this.getThread    = getThread;    // function(filter)
//    this.saveThread   = saveThread;   // function(thread)
    this.deleteThread = deleteThread; // function(threadId)

    var endpoint      = 'thread';

    //////////////////////////////////

    function getThread(stubOrId, select) {

        // Default the selectFields
        var selectFields, populate
        if(select == 'sm'){
            selectFields = ['stub', 'name', 'picture', 'blurb'];
            populate = false;
        } else if (select == 'md'){
            selectFields = ['stub', 'name', 'picture', 'blurb', 'followers' ];
            populate = false;
        } else{
            selectFields = ['*'];
            select = 'lg';
            populate = true;
        }

        return HttpService({
            url: '/api/v1/threads/'+stubOrId,
            method: "GET",
        });
	}

//    function saveThread(thread) {
////        LocalCache.save(endpoint+'lg', thread);
//        if (!thread._id) {
//            analytics.track('Thread New', {
//                projects : thread.projects,
//                fields : thread.fields,
//                organisations : thread.organisations,
//                threadLength : thread.body.length
//            });
//            // if the thread hasn't been saved for the first time, post it to the server
//            return Restangular.all('threads').post(thread);
//        } else {
//            // if the thread already exists, put an update to the server
//            analytics.track('Thread Update', {
//                projects : thread.projects,
//                fields : thread.fields,
//                organisations : thread.organisations,
//                threadLength : thread.body.length
//            });
//
//            // do not send the posts to the server as a request body to avoid exceeding
//            // the server's maximum request size
//            var cleanThread = _.clone(thread, true)
//            cleanThread.posts = undefined;
//			// Remove the section elements
//			ModularEditorService.stripSectionsDomElements(cleanThread.sectionData.sections);
//            return Restangular.one('threads', thread._id).customPUT(cleanThread);
//        }
//    }


    function deleteThread(thread) {
        analytics.track('Thread Delete', {
            thread : thread
        });
        return Restangular.all('threads').one(thread).remove();
    }
});
