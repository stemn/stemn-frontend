angular.module('views.creations', [

]);
angular.module('views.creations').

config(function ($stateProvider) {
    $stateProvider.
    state('app.creations', {
        url : '/creations',
        abstract: true,
        authLevel: 'user',
        sticky: true,
        templateUrl: 'app/views/creations/tpls/creations.html',
        controller: function ($scope, $rootScope, $state, NewCreationsService, Authentication, CoreLibrary) {

            // Data -----------------------------------------------------
            $scope.user = Authentication.currentUser;
            $scope.$state = $state;

			// Tabs ------------------------------------------------------
			$scope.tabs = [
                {
                    label: 'All',
                    sref: 'app.creations.all'
                },{
                    label: 'Published',
                    sref: 'app.creations.published'
                },{
                    label: 'Drafts',
                    sref: 'app.creations.drafts'
                }
			];
        },
        layout: {
            size: 'md',
            footer: false,
            bgColor: 'rgba(0, 0, 0, 0.03)'
        },
        seo: function(resolve){
            return {
                title       : 'Your Creations - STEMN',
                description : "Find your blogs, questions, discussions and projects. Everything you have created is here!"
            }
        }
    }).
    state('app.creations.all', {
        url : '',
        sticky: true,
        views: {
            'all' : {
                templateUrl: 'app/views/creations/tpls/creations-all.html',
            }
        }
    }).
    state('app.creations.drafts', {
        url : '/drafts',
        sticky: true,
        views: {
            'drafts' : {
                templateUrl: 'app/views/creations/tpls/creations-drafts.html',

            }
        }
    }).
    state('app.creations.published', {
        url : '/published',
        sticky: true,
        views: {
            'published' : {
                templateUrl: 'app/views/creations/tpls/creations-published.html',
            }
        }
    })
}).

directive('myCreations', function($timeout, $state) {
	return {
		restrict: 'E',
        scope: {
          published: '@' // true || false || 'both' - true behavior defaults
        },
        templateUrl: 'app/views/creations/tpls/my-creations.html',
        controller: function($scope, FeedService, Authentication, CoreLibrary, ThreadService, ProjectService, $location, HttpQuery, EntityService){
            $scope.message = getMessage();

            $scope.query = HttpQuery({
                url: '/api/v1/search',
                params: {
                    types      : ['job','project','thread'],
                    size       : 20,
                    sort       : 'updated',
                    key        : 'name',
                    select     : ['name','stub','entityType','type','updated', 'published',
                                 'likes', 'numPosts', 'numComments'],
                    parentType : 'user',
                    published  : $scope.published,
                    parentId   : Authentication.currentUser._id,
                },
                onSuccess      : function(results){
                    setTypeText(results);
                    setNames(results)
                    setHref(results)
                    return results
                }
            });
            $scope.query.more();


            // Functions
            $scope.deleteCreation = deleteCreation; // function(id, type)
            $scope.edit           = edit;           // function(item)

            ///////////////////////////////////////////////////////
            function setTypeText(feed){
                _.forEach(feed, function(item){
                    if(item.type){
                        if(item.type == 'project'){
                            item.typeText = 'Project'
                        }
                        else if(item.type == 'blog'){
                            item.typeText = 'Blog'
                        }
                        else if (item.type == 'general'){
                            item.typeText = 'discussion'
                        }
                        else{
                            item.typeText = 'question'
                        }
                    }
                    else{
                        item.typeText = item.entityType;
                    }

                })
            }
            function getMessage(){
                var message
                if($scope.published == 'false'){
                    message = '<p>You have no drafts.</p>';
                }
                else if($scope.published == 'true'){
                    message = '<p>You haven’t published anything yet.</p>' +
                        '<p>Your projects/questions/blogs will not appear on your profile or in search results until it has been published. Only people with the link can view a your work if it is unpublished.</p>';
                }
                else{
                    message = '<p>You haven’t published anything yet.</p>';
                }
                return message
            }

            function setNames(feed){
                _.forEach(feed, function(item){
                    // If it has no name
                    if(!item.name){
                        item.name = item.published ? 'Untitled ' + item.entityType : 'Unpublished ' + item.entityType;
                    }else{
                        item.name = item.published ? item.name : item.name + ' (Unpublished)'
                    }
                })
            }
            function setHref(feed){
                _.forEach(feed, function (item) {
                    item.href = CoreLibrary.getHref(item.type || item.entityType, item.stub || item._id);
                })
            }

            function deleteCreation(id, type){
                if(type == 'project'){
                    ProjectService.deleteProject(id)
                }
                else if (type == 'job'){
                    EntityService.remove('job', id)
                }
                else{
                    ThreadService.deleteThread(id)
                }

                // Find the index of the creation we want to delete
                var index = _.findIndex($scope.query.results, function(item){
                    return item._id == id
                })
                // Splice it from the feed array
                $scope.query.results.splice(index, 1);
            }

            function edit(item){
                // Set the form so we begin edit automatically
                var form
                if(item.entityType == 'project'){
                    $state.go('app.project.settings.options', {stub: item.stub || item._id})
                }
                else if(item.entityType == 'thread'){
                    $state.go('app.thread.edit', {stub: item.stub || item._id})
                }

                else{
                    if(item.entityType == 'job'){
                        form = 'JobForm'
                    }
                    $location.url(item.href+'?edit='+form);
                }
            }


        }
	};
});
