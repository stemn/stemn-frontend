angular.module('modules.posts', [
    'modules.editor',
    'modules.scroll-highlight',
]);
angular.module('modules.posts').

//directive('posts', function () {
//    /****************************************************************
//    This directive will set up the posts for a thread/blog/project
//    The data object should contain:
//    data = {
//        posts         : [], - An array of posts
//        owner         : [], - The owner of the thread/project
//    }
//
//    STATE PARAMS:
//    The reply state param can be added. If true, we open the reply window.
//
//    ****************************************************************/
//    return {
//        restrict: 'E',
//        scope: {
//            parent : '=', // The parent object (thread/project)
//        },
//        templateUrl: 'app/modules/posts/tpls/posts.html',
//        controller: function ($scope, PostService, $stateParams, $timeout, HighlightElement) {
//            getPosts($scope.parent);
//            $scope.orderFilter = '';        // Set default order filter - 'timestamp' || '' if tree
//            $scope.toggleSort  = toggleSort; // function()
//            $scope.reply       = '';       // Assigned using set reply
//            $scope.sectionData = {};
//            $scope.setReply   = setReply;  // function(parent)
//            $scope.sendReply  = sendReply; // function()
//
//
//            // Watch the posts, sort them when they change
//            $scope.$watchCollection('parent.posts', sortPosts);
//
//            if($stateParams.reply){
//                $timeout($scope.setReply, 1000)
//            }
//
//            ///////////////////////////////////////////////////////////////////////
//
//            function setReply(parent){
//                HighlightElement.scrollHighlightElement('reply', {background: true, offset: 200});
//                $scope.inputTitle = parent.owner.name ? 'Replying to '+ parent.owner.name +'\'s post.' : '';
//                $scope.postInputStatus.active = true;
//                $scope.reply = PostService.newPost($scope.parent);
//                if (parent) {
//                    // Set the post parent to the ID of the post being replied to
//                    $scope.reply.parent = parent._id;
//                }
//                // Go to edit box
//                $scope.postInputStatus.active = true; // Set input to inactive
//            }
//
//            function sendReply() {
//                if(!$scope.reply){$scope.reply=PostService.newPost($scope.parent)}
//                var post;
//                $scope.reply.sectionData = $scope.sectionData.model;
//                // Set the function that will be run when the post is to be submitted
//                PostService.savePost($scope.parent._id, $scope.reply).then(function(newPost) {
//                    $scope.postInputStatus.active = false; // Set input to inactive
//                    $scope.sectionData        = {}; // Clear Section data
//                    $scope.reply              = ''; // Clear Reply data
//                    post = newPost;
//                    // set the post time to the clients browser as
//                    // they're probably out of sync with the server
//                    // which makes the '1 min ago' timestamp effect
//                    post.timestamp = moment(Date.now()).format("YYYY-MM-DDTHH:mm:ssZZ");
//                    $scope.parent.posts.push(post);
//                }).catch(function(){
//                    $scope.postInputStatus.active = true;
//                });
//
//            }
//
//            function getPosts(parent){
//                // This will check to see if parent.posts exists.
//                // If not, it will request the posts from the server
//                if(parent.posts.length === 0){
//                    PostService.getPosts(parent).then(function(posts){
//                        parent.posts = posts;
//                    })
//                }
//            }
//
//            function toggleSort(){
//                // If time view
//                if($scope.orderFilter == 'timestamp'){
//                    $scope.orderFilter = '';
//                    $scope.sortIcon = 'sort'
//                }
//                // Time tree view
//                else{
//                    $scope.orderFilter = 'timestamp';
//                    $scope.sortIcon = 'access-time'
//                }
//            }
//
//            function sortPosts() {
//                if($scope.parent.posts && $scope.parent.posts.length > 0){
//                    $scope.posts = sortFlatTree($scope.parent.posts);
//                }
//            }
//
//            function sortFlatTree(_posts) {
//                // create indent list
//                var posts = angular.copy(_posts);
//                var tree = [];
//                //build the top level posts
//                var i = 0;
//                while (i < posts.length) {
//                    if (!posts[i].parent) {
//                        posts[i].indentation = 0;
//                        tree.push(posts[i]);
//                        posts.splice(i, 1);
//                    } else {
//                        i++;
//                    }
//                }
//                //build the children for each post
//                i = 0;
//                // start at the first tree root node
//                while (i < tree.length) {
//                    // step chronologically backwards through the list of replies
//                    for (var j = posts.length - 1; j >= 0; j--) {
//                        // if the current post is a child of the current parent
//                        if (posts[j].parent == tree[i]._id) {
//                            posts[j].indentation = tree[i].indentation + 1;
//                            tree.splice(i + 1, 0, posts[j]);
//                            posts.splice(j, 1);
//                        }
//                    }
//                    i++;
//                }
//                // Iterate of the array and add the position value
//                _.forEach(tree, function(n, key) {
//					n.tree = key;
//                });
//                return tree;
//            }
//
//        }
//    };
//}).

directive('post', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/posts/tpls/post.html',
        scope: {
            post     : '=',
            parent   : '=',
            timeline : '='
        },
        controller: function ($scope, EditorService, PostService) {
            // mark the post to indicate if it was posted by a team member
            $scope.post.isTeam  = isTeam();
            // mark the post to indicate if it was posted by the original poster
            $scope.post.isOwner = isOwner();

            $scope.deletePost   = deletePost; // function()
            $scope.editPost     = editPost;   // function()
            $scope.savePost     = savePost;   // function()
            $scope.cancel       = cancel;     // function()
            $scope.replyPost    = replyPost;     // function()

			$scope.editorOptions = {
				realtime  : false,
				contained : true,
				minimal   : true
			}

			$scope.post.sectionData = $scope.post.sectionData || {sectionOrder : []};

            //////////////////////////////////////

            function isTeam(){
                _.any($scope.parent.projects, function (project) {
                    _.any(project.team, function (member) {
						if(member && member._id){ // Fux because project.team member sometimes null? TODO
                        	return member._id == $scope.post.owner._id
						}
                    })
                })
            }
            function isOwner(){
                if ($scope.parent.owner && $scope.post.owner) {
                    return $scope.post.owner._id == $scope.parent.owner._id;
                }
            }
            function deletePost(){
                PostService.deletePost($scope.post._id).then(function() {
                    var itemIndex = _.findIndex($scope.timeline, '_id', $scope.post._id);
                    if(itemIndex){
                        $scope.timeline.splice(itemIndex, 1)
                    }
                });
            }

            function editPost() {
 				$scope.edit = true;
            }

            function replyPost() {
 				$scope.replyActive = true;
            }

			function cancel() {
 				$scope.edit = false;
            }

			function savePost() {
 				$scope.edit = false;
				PostService.savePost($scope.parent._id, $scope.post).then(function(post) {
					$scope.post.edited = moment(Date.now()).format("YYYY-MM-DDTHH:mm:ssZZ");
				});
			}
        }
    };
}).

directive('postReply', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/posts/tpls/post-reply.html',
        scope: {
            parent: '=',
            timeline: '=',
            parentPost: '=?',
            replyActive: '=?'
        },
        controller: function ($scope, PostService) {
            $scope.reply = {
                sectionData:{}
            };
            if($scope.parentPost){
                $scope.reply.parent = $scope.parentPost;
            }

            $scope.submit = submit;

            ////////////////////////////////

            function submit() {
                PostService.savePost($scope.parent._id, $scope.reply).then(function(post) {
                    $scope.postInputStatus.active = false; // Set input to inactive
                    $scope.reply                  = {sectionData:{}};
                    post.timestamp                = moment().format();
                    post.event                    = 'post';
                    $scope.replyActive            = false;
                    $scope.timeline.push(post);
                }).catch(function(){
                    $scope.postInputStatus.active = true;
                });
            }
        }
    };
}).


directive('postSummary', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/posts/tpls/post-summary.html',
        scope: {
            post: '='
        },
        controller: function($scope, CoreLibrary){
            if($scope.post.thread && $scope.post.thread.type){
                $scope.sref = CoreLibrary.getSrefBase($scope.post.thread.type) + '({"stub": "'+$scope.post.thread.stub+'",  "#" : "'+$scope.post._id+'"})';
            }
            else{
                $scope.sref = CoreLibrary.getSrefBase('project') + '({"stub": "'+$scope.post.project.stub+'",  "#" : "'+$scope.post._id+'"})';
            }
            $scope.editorOptions = {
				realtime  : false,
				contained : true,
				minimal   : true
			}
        }
    };
}).

directive('userPosts', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/posts/tpls/user-posts.html',
        scope: {
            userId: '@'
        },
        controller: function ($scope, PostService) {
            PostService.getUserPosts({
                owner : $scope.userId
            }).then(function(results){
                $scope.data = results.data;
            })

        }
    };
}).


service('PostService', function (Restangular, $http, Authentication, ModularEditorService, $q) {

    // this service handles both thread posts and project comments

    this.getPosts     = getPosts;     // function(parent) - Get posts for the project || thread
    this.savePost     = savePost;     // function(post)   - Save an existing post
    this.deletePost   = deletePost;   // function(postId)   - Delete a post
    this.getUserPosts = getUserPosts; // function(data)

    ///////////////////////////////////////////////

    function getUserPosts(data){
        if(!data || !data.owner){
            return console.error('Invalid Input');
        }
        return $http({
            url: '/api/v1/posts',
            method: "GET",
            params: {
                owner: data.owner,
                sort : '_id',
                order : 'dsc',
                size: 200
            }
        })
    }

    function getPosts(parent){
        return $http({
            url: '/api/v1/threads/'+parent._id+'/posts',
            method: "GET",
        })
    }

    function savePost(parentId, post) {
		var postClone = _.clone(post, true);
		ModularEditorService.stripSectionsDomElements(postClone.sectionData.sections);
        return $http({
            url: postClone._id ? '/api/v1/posts/' + post._id : '/api/v1/threads/' + parentId + '/posts',
            method: postClone._id ? 'PUT' : 'POST',
            data: postClone
        }).then(function(response){
            return response.data
        })
    }

    function deletePost(postId) {
        return $http({
            url: '/api/v1/posts/'+postId,
            method: 'DELETE',
        })
    }
});
