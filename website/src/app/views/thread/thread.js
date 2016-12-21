import './thread.scss';
import './thread-edit/thread-edit.js';

angular.module('views.thread', [
    'views.thread.edit'
]);
angular.module('views.thread').

config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.
    // Map default
    when("/blogs/:stub", "/threads/:stub");

    $stateProvider.
    state('app.thread', {
        url: '/threads/:stub?edit&reply',
        resolve: {
            thread: function (userdata, $stateParams, ThreadService, PublishService, $timeout, $state) {
                return ThreadService.getThread($stateParams.stub).
                catch(function(error){
                    $timeout(function(){
                        $state.go('app.404', null, {location: false});
                    })
                })
            },
            userPermissions: function(userdata, thread, PermissionsService, $stateParams){
                return PermissionsService.permissionRedirect({
                    userdata : userdata,
                    entity   : thread,
                    level    : 'public',
                    secret   : $stateParams.secret
                })
            },
        },
        template: require('./tpls/thread.html'),
        controller: function(thread, userPermissions, $rootScope, $document, $timeout, $scope, $state, Authentication, ThreadService, ThreadTimelineService, EntityService, EditorService, SocialModalService, TagsModalService, HighlightElement, $dynamicFooter, $mdToast, PublishService){
            var initialData = _.clone(thread, true);
            // Data ------------------------------------------------------
            $scope.userPermissions  = userPermissions;
            $scope.userCanEdit      = userPermissions.isMin('admin');
			$scope.showEdit         = $scope.userCanEdit;
            $scope.thread           = thread;
//            $scope.thread.timeline  = [];

			$scope.forms = {};

			$scope.editorOptions = {
				realtime  : false,
				contained : true
			}

            $scope.requiredFields = [
                {
                    model     : 'name',
                    condition : function(entity){return !!entity.name},
                    title     : 'You must add a thread name. <a ng-click="field.click()">Click here to add one.</a>',
                    click     : function(){
                        HighlightElement.scrollHighlightElement('nameEdit', {background: true, offset: 100});
                    }
                },{
                    model     : 'fields',
                    condition : function(entity){return entity.fields.length>0},
                    title     : 'You have not added any field tags <a ng-click="field.click()">Add field tags.</a>',
                    click     : function(){
                        HighlightElement.scrollHighlightElement('fieldTags', {background: true, offset: 100});
                    }
                }
            ]

            $scope.publish = publish;                   // function(event)
            $scope.getParticipants = getParticipants;   // function()
            $scope.saveThread = saveThread;             // function()
            $scope.saveAndExit = saveAndExit;             // function()
            $scope.deleteThread = deleteThread;         // function()

            ///////////////////////////////////////////////


            function saveAndExit(event){
                saveThread().then(function(){
                    if($scope.thread.published){
                        $state.go('app.thread')
                    }
                    else{
                        publish(event)
                    }
                })
            }

            function saveThread(){
                $scope.forms.ThreadForm.$setPristine();
                var newData = ThreadTimelineService.processSave(initialData, $scope.thread);
                initialData = _.clone($scope.thread, true);
                return EntityService.update('thread', newData).then(function(response){
                    return response
                });
            }

            function deleteThread(){
                $scope.forms.ThreadForm.$setPristine();
                ThreadService.deleteThread($scope.thread._id).then(function() {
                    history.back();
                });
            }

			function publish(event){
                // Check if we can publish
                // If we can't find any that are missing, we can publish
                if(!_.find($scope.requiredFields, 'missing')){
                    PublishService.selectStubModal(event, $scope.thread).then(function(stub){
                        $scope.thread.stub    = stub;
                        $scope.thread.updated = Date.now();
                        var threadCopy = _.clone($scope.thread, true);
                        threadCopy.published = true;
                        EntityService.update('thread', threadCopy).then(function(response){
                            $scope.thread.published = true;
                            $mdToast.show(
                                $mdToast.simple().
                                content('Your thread has been published. It will now be public.')
                            );
                            $state.go('app.thread', {stub: response.stub})
                        })
                    })
                }
                else{
                    $scope.publishAttempted = true;
                    $document.scrollTopAnimated(0);
                    PublishService.missingFieldsToast($scope.forms.ThreadForm);
                }
			}

            function getParticipants(){
                var result = {};
                _.forEach($scope.thread.timeline, function (item) {
                    if(item.event == 'post'){
                        result[item.owner._id] = item.owner;
                    }
                });
                return result
            }
        },
        seo: function(resolve){
            return {
                title       : resolve.thread.name + ' - STEMN' || 'Untitled Question',
                picture     : resolve.thread.picture,
                description : resolve.thread.blurb
            }
        },
        layout: {
            bgColor : 'rgba(0, 0, 0, 0.03)',
            size: 'md'
        }
    });
}).

directive('threadFooter', function () {
    return {
        restrict: 'E',
        replace: true,
        template: require('./tpls/thread-footer.html'),
    };
});

