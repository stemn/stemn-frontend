angular.module('modules.core', []);
angular.module('modules.core').

service('CoreService', function (ProjectService, EntityService, ThreadService, OrganisationService, FieldService, PostService, StatesService) {
    var service = this;

    this.isEmptyObject = function(object){
        return _.every(object, function (value, key) {
            if (_.isArray(value)) {
                return _.every(value, service.isEmptyObject);
            } else {
                if (key === '$$hashKey') { // fix for angular adding trackby internal reference
                    return true;
                } else {
                    return _.isEmpty(value);
                }
            }
        });
    }

	this.getEntity = function(id, type){
		if(type == 'project'){
			return ProjectService.getProject(id, 'sm')
		}
		else if(type == 'user'){
			return EntityService.get('user', id, 'sm')
		}
		else if(type == 'organisation'){
			return OrganisationService.getOrganisation(id, 'sm')
		}
		else if(type == 'field'){
			return FieldService.getField(id, 'sm')
		}
		else if(type == 'thread' || type == 'general' || type == 'question' || type == 'blog'){
			return ThreadService.getThread(id, 'sm')
		}
        else if(type == 'post'){
			return PostService.get(id)
		}
        else if(type == 'state'){
			return StatesService.get(id)
		}
        else if(type == 'application'){
			return EntityService.get('application', id, 'sm')
		}
        else if(type == 'job'){
			return EntityService.get('job', id, 'sm')
		}
		else{
			console.log(type);
		}
	}

	this.getEntityUrl = function(stub, type, id){
		var base = 'https://stemn.com'
		var url
		if(type == 'project'){
			url = base + '/projects/' + stub
		}
		else if(type == 'user'){
			url = '/users/' + stub
		}
		else if(type == 'thread' || type == 'general' || type == 'question'){
			url = base + '/threads/' + stub
		}
		else if(type == 'blog'){
			url = base + '/blogs/' + stub
		}
		else if(type == 'field'){
			url = base + '/fields/' + stub
		}
		else if(type == 'organisation'){
			url = base + '/org/' + stub
		}
        else if(type == 'job'){
			url = base + '/jobs/' + stub
		}
        else if(type == 'application'){
			url = base + '/applications/' + stub
		}
		else{
			console.log('Type undefined');
		}

		// Add the publish code
		if(id){
			url = url +'?publishcode='+id
		}
		return url
	}
    this.getAdminEntityUrl = function(stub, type, id){
		var base = 'https://stemn.com'
		var url
		if(type == 'project'){
			url = base + '/projects/' + stub
		}
		else if(type == 'thread' || type == 'general' || type == 'question'){
			url = base + '/threads/' + stub
		}
		else if(type == 'blog'){
			url = base + '/blogs/' + stub
		}
		else if(type == 'field'){
			url = base + '/fields/' + stub
		}
		else if(type == 'organisation'){
			url = base + '/org/' + stub
		}
        // Internal
		else if(type == 'user'){
			url = '/users/' + stub
		}
        else if(type == 'state'){
			url = '/states/' + stub
		}
		else{
			console.log('Type undefined');
		}

		// Add the publish code
		if(id){
			url = url +'?publishcode='+id
		}
		return url
	}
    this.getAdminsIds = function(){
		return [
            '54d6bc399b42758d7196977f', // Astronaut
            '547db55af7f342380174e228', // David
            '5498e258a7fbbfcc12c3fa15', // Jackson
            '5496bdb8104ad2c800020602', // Jack
        ]
	}
    this.getFakesIds = function(){
		return [
            '54d6bc399b42758d7196977f', // Astronaut
            '547db55af7f342380174e228', // David
            '5498e258a7fbbfcc12c3fa15', // Jackson
            '5496bdb8104ad2c800020602', // Jack
            '558d27e7c9845c371fecc316', // Jeff Banks
            '55963596423fe3ab0f034ded', // Branden Short
            '558e72224bb4a80838f97fc2', // Jamie Noyes
            '55b8ca33f51196395e4ab725', // Zack Stewart
            '5592166923cd38b21cab4905', // Kevin Collin
        ]
	}
    this.isFakeUser = function(id){
		return service.getFakesIds().indexOf(id) !== -1 ? false : true;
	}
}).

service('CoreLibrary', function () {
    var service = this;

    this.isObjectId = function (objectId) {
        return /^[a-f0-9]{24}$/.test(objectId);
    }
    this.resolutionToMs = function (resolutionString) {
        if     (resolutionString=='hour'){
            return 1000 * 60 * 60;
        }
        else if(resolutionString=='day'){
            return 1000 * 60 * 60 * 24;
        }
        else if(resolutionString=='week'){
            return 1000 * 60 * 60 * 24 * 7;
        }
        else if(resolutionString=='fortnight'){
            return 1000 * 60 * 60 * 24 * 14;
        }
        else if(resolutionString=='month'){
            return 1000 * 60 * 60 * 24 * 30;
        }
    }

    this.checkStateParents = function(stateDetailed, checkParam){
        // This will recursively inspect the $state to find the first state/parent with the check param
        if(stateDetailed.self[checkParam]){
            return stateDetailed.self[checkParam]
        }
        else{
            return service.checkStateParents(stateDetailed.parent, checkParam)
        }
    }

    this.getResolutionObject = function() {
        return [{
            name: 'hour',
            value: 1000 * 60 * 60
        },  {
            name: 'day',
            value: 1000 * 60 * 60 * 24
        },  {
            name: 'week',
            value: 1000 * 60 * 60 * 24 * 7
        },  {
            name: 'fortnight',
            value: 1000 * 60 * 60 * 24 * 14
        },  {
            name: 'month',
            value: 1000 * 60 * 60 * 24 * 30
        }]
    }

    this.getDateFromId = function(id){
        return new Date( parseInt( id.toString().substring(0,8), 16 ) * 1000 );
    }
    this.keyedArrayToObject = function(dataArray, keyArray){
        // Example:
        // keyArray = [type, id, val]
        // dataArray = [[project, assafafsfas, 1], [thread, assafafsfas, 1]]

        // Result
        // [{type : 'project', id: assafafsfas, val: 1}, {type : 'thread', id: assafafsfas, val: 1}]
        var objectArray = [];
        _.forEach(dataArray, function(point){
            var object = {};
            _.forEach(keyArray,function(key, index){
                object[key] = point[index];
            })
            objectArray.push(object);
        })
        return objectArray;
    }
}).

service('CoreModalService', function($mdDialog) {
    this.showEntity = showEntity;
    this.showApplications = showApplications;

    ///////////////////////////////////////////

    function showEntity(event, data) {
        if(data.length>0){
            $mdDialog.show({
                templateUrl: 'app/modules/core/tpls/core-entity-modal.html',
                controller: function (data, $scope) {
                    $scope.enitities = data;
                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };
                },
                targetEvent: event,
                clickOutsideToClose: true,
                locals:{data:data}
            })
        }
    }
    function showApplications(event, params) {
        console.log(params);
        $mdDialog.show({
            templateUrl: 'app/modules/core/tpls/core-show-applications-modal.html',
            controller: function ($scope, HttpQuery, CoreLibrary) {
                $scope.query = HttpQuery({
                    url: '/api/v1/search',
                    params: {
                        type: 'application',
                        size: 20,
                        sort: '_id',
                        order: 'dsc',
                        'select[]': ['*']
                    },
                    columns: [
                        {
                            status: true,
                            template: '<a ui-sref="app.users.user.info({\'stub\': item.child.stub})" class="avatar-circle block" style="background-image: url(\'https://stemn.com{{item.child.picture || \'/assets/images/default/org.png\'}}?size=thumb&crop=true\')")"></a>',
                            model: 'child.picture',
                            width: '40px',
                            sort: false
                        }, {
                            status: true,
                            search: true,
                            name: 'Applicant',
                            template: '<a ui-sref="app.users.user.info({\'stub\': item.child.stub})" class="underlined">{{item.child.name}}</a>',
                            model: 'child.name',
                            width: '150px',
                        }, {
                            status: true,
                            search: true,
                            name: 'Position',
                            template: '<a href="https://stemn.com/applications/{{item._id}}" class="underlined">{{item.parent.name}}</a>',
                            model: 'parent.name',
                        }, {
                            status: true,
                            name: 'Status',
                            model: 'status',
                            width: '140px',
                            template: "<application-status entity='item' entities='query.results' selected-rows='selectedRows'></application-status>",
                        },
                    ],
                    filters: {
                        columnOrder: {},
                    },
                    onSucess: function (response) {
                        _.forEach(response, function (item) {
                            item.timestamp = CoreLibrary.getDateFromId(item._id);
                        })
                        return response
                    }
                });

                $scope.query.params = _.extend($scope.query.params, params)

                $scope.query.more();

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
            },
            targetEvent: event,
            clickOutsideToClose: true,
        })
    }
}).

directive('clickShowEntities', function (CoreModalService) {
    return {
        restrict: 'A',
        scope: {
            clickShowEntities: '='
        },
        link : function (scope, element, attrs){
			element.bind('click', function (event) {
				CoreModalService.showEntity(event, scope.clickShowEntities)
			})
		}
    };
}).

directive('coreEntityAdminHref', function (CoreService, $parse) {
    // attrs: entity : =
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var entity = $parse(attrs.entity)(scope)
            element[0].setAttribute('href', CoreService.getAdminEntityUrl(entity.stub, entity.type, entity.id))
		}
    };
}).

directive('coreEntityRow', function (CoreService) {
    return {
        restrict: 'E',
		replace: true,
		transclude: true,
        scope: {
			entityType : '@',
            entityId   : '@',
            entity     : '=?',
        },
        templateUrl: 'app/modules/core/tpls/core-entity-row.html',
        controller: function ($scope, Authentication) {
			if($scope.entityId && $scope.entityType){
				CoreService.getEntity($scope.entityId, $scope.entityType).then(function (entity) {
                    var stub
					$scope.entity = entity;
                    if(entity[entity.parentType] && entity[entity.parentType].stub){
                        stub = entity[entity.parentType].stub;
                    }
                    else{
                        stub = entity.stub;
                    }
					$scope.entity.url = CoreService.getEntityUrl( stub, entity.parentType || entity.type || $scope.entityType, entity._id);
				});
			}
		}
    };
}).

directive('coreEntityPicture', function (CoreService) {
    return {
        restrict: 'E',
		replace: true,
		transclude: true,
        scope: {
			entityType : '@',
            entityId   : '@',
            entity     : '=?'
        },
        templateUrl: 'app/modules/core/tpls/core-entity-picture.html',
        controller: function ($scope, Authentication) {
			if($scope.entityId && $scope.entityType){
				CoreService.getEntity($scope.entityId, $scope.entityType).then(function (entity) {
                    var stub
					$scope.entity     = entity;
                    if(entity[entity.parentType] && entity[entity.parentType].stub){
                        stub = entity[entity.parentType].stub;
                    }
                    else{
                        stub = entity.stub;
                    }
					$scope.entity.url = CoreService.getEntityUrl( stub, entity.parentType || entity.type || $scope.entityType, entity._id);
				});
			}
		}
    };
}).

service('EntityService', function($rootScope, LocalCache, HttpService, $mdToast) {
    this.get      = get;      // function(jobId)
    this.create   = create;   // function(job)
    this.update   = update;   // function(job)
    this.patch    = patch;    // function(job)
    this.remove   = remove;   // function(jobId)

    this.updateSuccess = updateSuccess; // function()
    this.removeSuccess = removeSuccess; // function()

    //////////////////////////////////////////


    function get(entityType, stubOrId, select) {
        var endpoint       = parseEntityType(entityType);
        var selectSm       = ['stub', 'name', 'picture', 'blurb'];
        var selectMd       = ['stub', 'name', 'picture', 'blurb', 'created', 'updated', 'fields', 'organisations', 'team' , 'likes', 'location'];
        var selectMdUser   = ['stub', 'name', 'picture', 'blurb', 'profile.banner', 'followers', 'numProjects' ];
        var selectLg       = ['*']

        // Default the selectFields
        var selectFields
        if(select == 'sm'){
            selectFields = selectSm;
        } else if (select == 'md'){
            if(endpoint == 'users'){
                selectFields = selectMdUser;
            }
            else{
                selectFields = selectMd;
            }
        } else{
            selectFields = selectLg;
            select = 'lg';
        }

        var getPromise = function(data){
            // data - [XXXXXXXXXXXXXXXXXXXXXXX, XXXXXXXXXXXXXXXXXXXXXXX] - Array of entity ids
            return HttpService({
                url: '/api/v1/'+endpoint,
                method: "GET",
                params: {
                    'select[]' : selectFields,
                    'ids[]'  : data,
                }
            });
        };
        return LocalCache.getPackaged(endpoint+select, stubOrId, getPromise)
	}

    function create(entityType, entity){
        var endpoint = parseEntityType(entityType);
        return HttpService({
            method: 'POST',
            url: 'api/v1/'+endpoint,
            data: entity
        })
    }

    function update(entityType, entity) {
        var endpoint = parseEntityType(entityType);
        LocalCache.save(endpoint+'lg', entity);
        return HttpService({
            method: 'PUT',
            url: 'api/v1/'+endpoint+'/'+entity._id,
            data: entity
        }).then(function(response){
            $rootScope.$broadcast(endpoint.slice(0, -1)+'.save', response);
            return response
        })
    }

    function patch(entityType, entity) {
        var endpoint = parseEntityType(entityType);
//        LocalCache.save(endpoint+'lg', entity);
        return HttpService({
            method: 'PATCH',
            url: 'api/v1/'+endpoint+'/'+entity._id,
            data: entity
        })
    }

    function remove(entityType, entityId) {
        var endpoint = parseEntityType(entityType);
        return HttpService({
            url: '/api/v1/'+endpoint+'/'+entityId,
            method: "DELETE",
        });
    }

    function parseEntityType(entityType){
        var endpoint
        if(entityType == 'jobs' || entityType == 'job'){
            endpoint = 'jobs'
        }
        else if(entityType == 'applications' || entityType == 'application'){
            endpoint = 'applications'
        }
        else if(entityType == 'users' || entityType == 'user'){
            endpoint = 'users'
        }
        else if(entityType == 'campaigns' || entityType == 'campaign'){
            endpoint = 'campaigns'
        }
        else if(entityType == 'fields' || entityType == 'field'){
            endpoint = 'fields'
        }
        else if(entityType == 'projects' || entityType == 'ptoject'){
            endpoint = 'projects'
        }
        else if(entityType == 'threads' || entityType == 'thread'){
            endpoint = 'threads'
        }
        else if(entityType == 'reminders' || entityType == 'reminder'){
            endpoint = 'reminders'
        }
        else if(entityType == 'organisations' || entityType == 'organisation'){
            endpoint = 'organisations'
        }
        else{
            console.error('Invalid Entity Type');
        }
        return endpoint
    }

    function updateSuccess(){
        $mdToast.show($mdToast.simple().content('Save Successful'));
    }
    function removeSuccess(){
        $mdToast.show($mdToast.simple().content('Delete Successful'));
    }

});
