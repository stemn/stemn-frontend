import './statistics.scss';

angular.module('modules.statistics', ['modules.authentication']);
angular.module('modules.statistics').

directive('statButton', function () {
    return {
        restrict: 'E',
        replace : 'true',
        scope: {
            // Classes: lg, green
            parentId     : '@?', // Id of the parent
            parentType   : '@?', // project || user || thread || blog || post
            type         : '@',  // like || follow || vote
            count        : '=?', // The number of the stat
            displayStyle : '@?', // rectangle || circle
            entityText   : '@?'  // Entity text to be displayed on the button eg) project gives 'follow project' on button
        },
        templateUrl: 'app/modules/statistics/tpls/stat-button.html',
        controller: function ($scope, Authentication, StatButtonTypes, $element, FollowLikeService, LocalCache) {
            $scope.hover  = false;


            if (Authentication.currentUser._id){
                // Watch the ID. This is required because the value is initially indefined.
                $scope.$watch('parentId', function (nv, ov) {
                    // check the status based on the current user
                    if($scope.parentId){
                        dontLetUsersFollowSelf();

                        var convertedTypes = FollowLikeService.convertTypes($scope.parentType, $scope.type);
                        $scope.parentType  = convertedTypes.parentType;
                        $scope.type        = convertedTypes.type;

                    	FollowLikeService.checkStatus($scope).then(function(itemStatus){
							$scope.itemStatus = itemStatus;
						})
                    }
                });
            }
            $scope.types = StatButtonTypes;
            $scope.clickButton = function (){

                var convertedTypes = FollowLikeService.convertTypes($scope.parentType, $scope.type);
                $scope.parentType  = convertedTypes.parentType;
                $scope.type        = convertedTypes.type;

                // If we are activating the button:
                if (!$scope.itemStatus.status){
                    $scope.itemStatus.status = true; // toggle status
                    FollowLikeService.followLike($scope);
                }

                // If we are de-activating the button:
                else if ($scope.itemStatus){
                    $scope.itemStatus.status = false; // toggle status
					FollowLikeService.unfollowLike($scope);
                }
                $scope.hover = false; // Remove the hover class
            }

            function dontLetUsersFollowSelf(){
                // Hide the button if the parent-id is current user's id
                if($scope.parentId == Authentication.currentUser._id){
                    $element.addClass('vishidden')
                }
            }
        }
    };
}).

service('FollowLikeService', function(HttpService, LocalCache, EntityService, Restangular, Authentication, StatButtonTypes, $q, $mdToast, $timeout, $mdDialog) {
	var  service    = this;

    this.followLike   = followLike;   // function(data)
	this.unfollowLike = unfollowLike; // function(data)
	this.checkStatus  = checkStatus;  // function(data)
	this.convertTypes = convertTypes;  // function(parentType, type)

	///////////////////////////////////////////////////////////

    function convertTypes(parentType, type){
        // If the parentType is thread||blog||question||general:
        if(parentType == 'thread'    ||
          parentType == 'question'   ||
          parentType == 'blog'       ||
          parentType == 'discussion' ||
          parentType == 'general'){
            // Set the parentType to thread
            parentType = 'thread'
        }
        return {
            parentType : parentType,
            type       : type,
        }
    }
	function checkStatus(data){
		 /***************************************** /
		 This will check the follow/like status of things
		 data: {
			parentId   : the parents id
			parentType : project || user || thread || blog
			type       : like || follow || vote
		 }
		/ *****************************************/

        if(!Authentication.currentUser._id || !data.parentType || !data.type){
            console.error('Error - Invalid follow inputs');
            return
        }
        var getPromise = function(parentId){
            // data - [asfasffsa, asfafsasfasf] - Array of user ids
            return HttpService({
                url: '/api/v1/social',
                method: "GET",
                params: {
                    'childId'    : Authentication.currentUser._id,
                    'parentIds[]': parentId,
                    'socialType' : data.type,
                }
            });
        };
//        console.log('social-'+Authentication.currentUser._id+'-'+data.type, data.parentId);
        return LocalCache.getPackaged('social-'+Authentication.currentUser._id+'-'+data.type, data.parentId, getPromise)
	}

	function followLike(data) {
		/***************************************** /
		 This is used to follow or like things
		 data: {
			parentId   : the parents id
			parentType : project || user || thread || blog || post
			type       : like || follow || vote
			count      : the number of likes / follows
		 }
		/ *****************************************/

		Restangular.one('users', Authentication.currentUser._id).one(data.type+'s', data.parentId).put().then(function() {
			data.count++;
            // Update status in cache
			LocalCache.save('social-'+Authentication.currentUser._id+'-'+data.type, {
                _id    : data.parentId,
                status : true
            });
			EntityService.get(data.parentType, data.parentId, 'sm').then(function(entity) {
                var entityText = data.parentType == 'post' ? '\'s post.' : '';

                $mdToast.show({
                    controller: function($scope, $mdToast){
                        $scope.entityName = entity.name || entity.owner.name;
                    },
                    template:
                    '<md-toast>'+
                        '<span flex>You have '+ StatButtonTypes[data.type].doVerb + ' <b>{{entityName | letters: 20}}</b>' + entityText + '</span>'+
                    '</md-toast>',
                    hideDelay: 2000,
                });
			});
		});
    }
	function unfollowLike(data) {
		/***************************************** /
		 This is used to follow or like things
		 data: {
			parentId   : the parents id
			parentType : project || user || thread || blog
			type       : like || follow || vote
			count      : the number of likes / follows
		 }
		/ *****************************************/
		Restangular.one('users', Authentication.currentUser._id).one(data.type+'s', data.parentId).remove().then(function() {
			data.count--;
			LocalCache.save('social-'+Authentication.currentUser._id+'-'+data.type, {
                _id    : data.parentId,
                status : false
            });
            EntityService.get(data.parentType, data.parentId, 'sm').then(function(entity) {
                var entityText = data.parentType == 'post' ? '\'s post.' : '';

				$mdToast.show({
					controller: function($scope, $mdToast){
                        $scope.entityName = entity.name || entity.owner.name;
					},
					template:
					'<md-toast class="md-orange-theme">'+
						'<span flex>You have '+ StatButtonTypes[data.type].undoVerb + ' <b>{{entityName | letters: 20}}' + entityText + '</b></span>'+
					'</md-toast>',
					hideDelay: 2000,
				});
			});
		});
    }
}).


directive('statDisplayModal', function () {
    return {
        restrict: 'A',
        scope: {
            parentId   : '@?', // Id of the parent
            parentType : '@?', // project || user || thread || blog
            type       : '@?', // like || follow || vote
        },
        controller: function ($scope, $element, $mdDialog, $timeout, FollowLikeService) {
            $element.bind('click', function (event) {

                var convertedTypes = FollowLikeService.convertTypes($scope.parentType, $scope.type);
                $scope.parentType  = convertedTypes.parentType;
                $scope.type        = convertedTypes.type;

                var titles = {
                    like   : 'Likers',
                    follow : 'Followers',
                    vote   : 'Likers'
                }

                var data = {
                    parentId   : $scope.parentId,
                    parentType : $scope.parentType,
                    type       : $scope.type,
                    title      : titles[$scope.type]
                }

                return $mdDialog.show({
                    templateUrl: 'app/modules/statistics/tpls/stat-display-modal.html',
                    targetEvent: event,
                    locals : {
                        data : data
                    },
                    controller: function(data, $scope, $mdDialog){
                        $scope.data = data;
                        $scope.cancel = function(){
                            $mdDialog.cancel();
                        }
                    }
                })
            });
        }
    };
}).

directive('statDisplay', function () {
    return {
        restrict: 'E',
        scope: {
            parentId        : '@?', // Id of the parent
            parentType      : '@?', // project || user || thread || blog || organisation
            type            : '@?', // like || follow || vote
            refreshCallback : '=?', // callback function to refresh this displau
        },
        templateUrl: 'app/modules/statistics/tpls/stat-display.html',
        controller: function ($scope, $element, Restangular) {
            var page = 1;
            var size = 12;
            $scope.results = [];

            $scope.more = function(){
                Restangular.one($scope.parentType+'s', $scope.parentId)
                .all($scope.type+'s')
                .getList({page: page, size: size, type: $scope.parentType})
                .then(function(results){
                    $scope.results = $scope.results.concat(results);
                    if(results.length < size){
                        $scope.loading = true;
                        $scope.noMoreResults = true;
                    }
                    else{
                        $scope.loading = false;
                    }
                    page ++
                })
            }

            $scope.refreshCallback = function(){
                page = 1;
                $scope.results = [];
                $scope.more();
            }
        }
    };
}).

directive('statCounter', function () {
    return {
        restrict: 'E',
        scope: {
            parentId   : '@?', // Id of the parent
            parentType : '@?', // project || user || thread || blog
            type       : '@?', // like || follow || vote
            count      : '='   // The stat count
        },
        template:
        '<a stat-display-modal parent-id="{{parentId}}" parent-type="{{parentType}}" type="{{type}}" ng-if="count>0">'+
            '{{count}} {{count==1 ? "person" : "people"}} {{::title}} this'+
        '</a>',
        link: function(scope, element, attrs){
            var titles = {
                like   : 'liked',
                follow : 'followed',
                vote   : 'liked'
            }
            scope.title = titles[scope.type]
        }
    };
}).


service('StatButtonTypes', function ($rootScope) {
    return {
        like: {
            inactive: {
                usual: {
                    text: 'Like',
                    icon: 'heart',
                },
                hover: {
                    text: 'Like',
                    icon: 'heart',
                }
            },
            active: {
                usual: {
                    text: 'Liked',
                    icon: 'heart-filled',
                },
                hover: {
                    text: 'Unlike',
                    icon: 'heart-filled',
                }
            },
            doVerb  :'liked',
            undoVerb:'unliked',
        },
        follow: {
            inactive: {
                usual: {
                    text: 'Follow',
                    icon: 'add-circle-outline',
                },
                hover: {
                    text: 'Follow',
                    icon: 'add-circle-outline',
                }
            },
            active: {
                usual: {
                    text: 'Following', // Following
                    icon: 'add-circle',
                },
                hover: {
                    text: 'Following', // Unfollow
                    icon: 'add-circle',
                }
            },
            doVerb  :'followed',
            undoVerb:'unfollowed',
        },
        vote: {
            inactive: {
                usual: {
                    text: 'Like',
                    icon: 'heart',
                },
                hover: {
                    text: 'Like',
                    icon: 'heart',
                }
            },
            active: {
                usual: {
                    text: 'Liked',
                    icon: 'heart-filled',
                },
                hover: {
                    text: 'Unlike',
                    icon: 'heart-filled',
                }
            },
            doVerb  :'liked',
            undoVerb:'unliked',
        }
    }
}).


service('FollowService', function(HttpService) {
    /************************* /
     user  : user id
     [type : type of entity],
     page  : the page of results to access
     size  : the number of results per page
    / *************************/
    this.getFollowing = function(data) {
        return HttpService({
            method: 'GET',
            url   : 'api/v1/users/'+data.user+'/following',
            params: {
                type : data.type, // organisation || project || user || field
                page : data.page,
                size : data.size
            }
        })
    }
});
