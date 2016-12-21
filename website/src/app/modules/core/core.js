angular.module('modules.core', [
]);
angular.module('modules.core').

service('FunctionLibrary', function(){
    this.isCrawler = function(){
        return /bot|googlebot|crawler|spider|robot|prerender|crawling/i.test(navigator.userAgent)
    }

}).

service('CoreLibrary', function ($state) {
    var service = this;

    // This will return the sref based on an item type and stub
    this.getSref = function (type, stub) {
        if     (type == 'project'){
            return 'app.project.overview({"stub" : "'+ stub +'"})'
        }
        else if(type == 'thread' || type == 'discussion' || type == 'question' || type =='general' || type == 'blog'){
            return 'app.thread({"stub" : "'+ stub +'"})'
        }
        else if(type == 'user'){
            return 'app.user.profile({"stub" : "'+ stub +'"})'
        }
        else if(type == 'organisation'){
            return 'app.organisation.overview({"stub" : "'+ stub +'"})'
        }
        else if(type == 'field'){
            return 'app.field.top({"stub" : "'+ stub +'"})'
        }
        else if(type == 'job'){
            return 'app.job({"stub" : "'+ stub +'"})'
        }
    }
	// This will return the base sref based on an item type
    this.getSrefBase = function (type) {
        if     (type == 'project'){
            return 'app.project.overview'
        }
        else if(type == 'thread' || type == 'discussion' || type == 'question' || type =='general' || type == 'blog'){
            return 'app.thread'
        }
        else if(type == 'user'){
            return 'app.user.profile'
        }
        else if(type == 'organisation'){
            return 'app.organisation.overview'
        }
        else if(type == 'field'){
            return 'app.field.top'
        }
        else if(type =='job'){
            return 'app.job'
        }
    }
    // This will return the base sref based on an item type
    this.getHref= function (type, stub) {
        if     (type == 'project'){
            return 'projects/'+stub
        }
        else if(type == 'thread' || type == 'discussion' || type == 'question' || type =='general'){
            return 'threads/'+stub
        }
        else if(type == 'blog'){
            return 'blogs/'+stub
        }
        else if(type == 'user'){
            return 'users/'+stub
        }
        else if(type == 'organisation'){
            return 'org/'+stub
        }
        else if(type == 'field'){
            return 'fields/'+stub
        }
        else if(type =='job'){
            return 'jobs/'+stub
        }
        else if(type =='application'){
            return 'applications/'+stub
        }
    }
    this.getAltType= function (type) {
        if     (type == 'project'){
            return 'project'
        }
        else if(type == 'thread'){
            return 'thread'
        }
        else if(type == 'blog'){
            return 'blog'
        }
        else if(type == 'question'){
            return 'question'
        }
        else if(type == 'general'){
            return 'discussion'
        }
    }

	this.getUuid = function(){
        var possible = 'abcdef0123456789abcdef0123456789';
        return _.sample(possible, 24).join('');
	}

    this.getRandomString = function(num){
        var possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
        return _.sample(possible, num || 30).join('');
	}

    this.keyCodes = {
        BACKSPACE : 8,
        TABKEY : 9,
        RETURNKEY : 13,
        ESCAPE : 27,
        SPACEBAR : 32,
        LEFTARROW : 37,
        UPARROW : 38,
        RIGHTARROW : 39,
        DOWNARROW : 40,
    }

	this.stubify = function(name){
        return name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9\-]+/g, '');
	}

    this.stringTruncate = function(string, limit) {
        var bits, i;
        bits = string.split('');
        if (bits.length > limit) {
            for (i = bits.length - 1; i > -1; --i) {
                if (i > limit) {
                    bits.length = i;
                } else if (' ' === bits[i]) {
                    bits.length = i;
                    break;
                }
            }
            bits.push('...');
        }
        return bits.join('');
    }

    this.pluralise = function(number, thing){
        // takes in thing(singular)
        // adds an 's' if 0 || > 1, adds 'ies' if ends in 'y'

        // Special Cases
        if(thing == 'People'){
            if(number == 1){
                return number+' Person';
            }
            else{
                return number+' People';
            }
        }
        // Normal cases
        var lastLetter = thing[thing.length];
		if(number == 1){
			return number+' '+thing
		}
		else{
            if(lastLetter == 'y'){
                return number+' ' + thing.substring(0, thing.length - 1) + 'ies'
            }
            else{
                return number+' ' + thing + 's'
            }
		}
    }

    this.capitalizeFirstLetter = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

	this.getCurrentTab = function(tabs){
		var tabSrefArray  = _.map(tabs, 'sref');
        var currentState  = $state.current.name.replace("app.", "");

		var currentTab
		// check if the current state exists in the tab array
        _.forEach(tabSrefArray, function(tab, index){
            var tabIndex = tab.indexOf(currentState)
            if( tabIndex !== -1){
                currentTab = index;
            }
        })
        // if it doesn't exist, check to see if a substate exists
        if(!(currentTab >= 0)){
            _.forEach(tabSrefArray, function(tab, index){
                var tabIndex = tab.indexOf(currentState.substring(0, currentState.lastIndexOf('.')))
                if( tabIndex !== -1){
                    currentTab = index;
                }
            })
        }
		return currentTab
	}

    this.isObjectId = function (objectId) {
        return /^[a-f0-9]{24}$/.test(objectId);
    }

    this.compactObject = function (object) {
        _.each(object, function(value, key) {
          if(!value) {
            delete object[key];
          }
        });
        return object;
    }

    this.assignArray = function(assignArray, resultsArray, uniqueKey){
        // This function will overwrite the 'assignArray' with the 'resultsArray'
        // This is done my mapping the array of objects using the 'uniqueKey'
        var oldUniqueArray = _.map(assignArray,  uniqueKey);
        var newUniqueArray = _.map(resultsArray, uniqueKey);
        // Add the new items
        resultsArray.forEach(function(result){
            var oldIndex = oldUniqueArray.indexOf(result[uniqueKey]);
            // If the does not exist in the assignArray, add it
            if(oldIndex == -1){
                assignArray.splice(oldIndex, 0, result);
            }
        })
        // Find and Remove the old items
        var itemsToRemove = [];
        assignArray.forEach(function(result, index){
            var newIndex = newUniqueArray.indexOf(result[uniqueKey]);
            // If the old result does not exist in the resultsArray, remove it
            if(newIndex == -1){
                itemsToRemove.push(index)
            }
        })
        // Remove them
        _.forEachRight(itemsToRemove, function(index){
            assignArray.splice(index, 1);
        })
    }

    this.groupByKey = function(initialArray, key){
        // This will turn an array into an object of arrays, grouped by a key
        return _.reduce(initialArray, function(resultHash, result) {
            var resultType = result[key];
            if (resultHash[resultType]) {
                resultHash[resultType].push(result);
            } else {
                resultHash[resultType] = [result];
            }
            return resultHash;
        }, {})
    }

    this.uniqueArray = function(array, key){
        var existingIds = [];
        // If the key's value is non-unique, remove it
        _.forEachRight(array, function(item, index){
            if(existingIds.indexOf(item[key]) != -1){
                array.splice(index, 1);
            }
            existingIds.push(item[key]);
        })
    }

    this.checkStateParents = function(stateDetailed, checkParam){
        // This will recursively inspect the $state to find the first state/parent with the check param.
        // It will also get the properties on the parent state if they do not exist on the child
        var params = {};
        getParamFromParents(stateDetailed, checkParam);
        return params;


        ///////////////////////

        function getParamFromParents(stateDetailed, checkParam){
            // If the Param exists
            if(stateDetailed.self[checkParam]){
                if(stateDetailed.self[checkParam] !== null && typeof stateDetailed.self[checkParam] === 'object'){ // If isObject
                    _.forEach(stateDetailed.self[checkParam], function(value, key){
                        if(params[key] === undefined){
                            params[key] = value;
                        } // If the key does not exist, assign it
                    })
                    getParamFromParents(stateDetailed.parent, checkParam)
                }
                // If it is not an object, we assign
                else{
                    params = stateDetailed.self[checkParam];
                }
            }
            // Else, we check the parent
            else if(stateDetailed.parent){
                getParamFromParents(stateDetailed.parent, checkParam)
            }
        }

    }

    this.getDateFromId = function(id){
        return new Date( parseInt( id.toString().substring(0,8), 16 ) * 1000 );
    }

    this.checkStateParentsSeo = function(stateDetailed, checkParam, checkSubParam, resolve){
        // This will recursively inspect the $state to find the first state/parent with the check param
        if(!stateDetailed){
            // Give up
            return
        }
        else if(stateDetailed.self[checkParam]){
            return seoList(stateDetailed.self[checkParam](resolve), checkSubParam)
        }
        else{
            return service.checkStateParentsSeo(stateDetailed.parent, checkParam, checkSubParam, resolve)
        }

        function seoList(params, checkSubParam){
            if (params[checkSubParam]){
               return params[checkSubParam];
            }
            else {
                return service.checkStateParentsSeo(stateDetailed.parent, checkParam, checkSubParam, resolve)
            }
        }
    }

    this.getCurrencies = function(){
        var currencies = {
            USD : {
                code  : 'USD',
                symbol: '$',
                name  : 'USD - $',
                rate  : 1
            },
            EUR : {
                code  : 'EUR',
                symbol: '€',
                name  : 'EUR - €',
                rate  : 1.09
            },
            JPY : {
                code  : 'JPY',
                symbol: '¥',
                name  : 'JPY - ¥',
                rate  : 0.0084
            },
            GBP : {
                code  : 'GBP',
                symbol: '£',
                name  : 'GBP - £',
                rate  : 1.42
            },
            AUD : {
                code  : 'AUD',
                symbol: 'AUD$',
                name  : 'AUD - $',
                rate  : 0.7
            },
            CHF : {
                code  : 'CHF',
                symbol: 'CHF',
                name  : 'CHF',
                rate  : 0.98
            },
            CAD : {
                code  : 'CAD',
                symbol: 'CAD$',
                name  : 'CAD - $',
                rate  : 0.71
            },
            MXN : {
                code  : 'MXN',
                symbol: 'MXN$',
                name  : 'MXN - $',
                rate  : 0.054
            },
            CNY : {
                code  : 'CNY',
                symbol: 'CNY¥',
                name  : 'CNY - ¥',
                rate  : 0.15
            },
            NZD : {
                code  : 'NZD',
                symbol: 'NZD$',
                name  : 'NZD - $',
                rate  : 0.64
            },
            INR : {
                code  : 'INR',
                symbol: '₹',
                name  : 'INR - ₹',
                rate  : 0.015
            }
        }
        return currencies
    }
}).


service('CoreModalService', function($mdDialog) {
    this.showEntity = showEntity;

    ///////////////////////////////////////////

    function showEntity(event, data, options) {
        /****************************************************
        options: {
            title : 'modal title'
        }
        ****************************************************/
        if(data.length>0){
            $mdDialog.show({
                templateUrl: 'app/modules/core/tpls/core-entity-modal.html',
                controller: function ($scope) {
                    $scope.enitities = data;
                    $scope.options   = options;
                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };
                },
                targetEvent: event,
                clickOutsideToClose: true,
            })
        }
    }
}).

directive('setEntityHref', function($parse, CoreLibrary){
    /****************************************************
    This will add the entity href based on the type and stub

    Example:
    <a set-entity-href="data.type" entity-stub="data.stub"></a>

    Inputs:
    set-entity-href: var - parses this in scope
    entity-stub:     var - parses this in scope (use 'type' if string is needed)
    ****************************************************/
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            var entityType  = $parse(attrs.setEntityHref)(scope);
            var entityStub  = $parse(attrs.entityStub)(scope);
            var href        = CoreLibrary.getHref(entityType, entityStub);
            element.attr('href', href);
        }
    }
}).

service('EntityService', function(LocalCache, HttpService, $mdToast, ModularEditorService) {
    this.get      = get;      // function(jobId)
    this.create   = create;   // function(job)
    this.update   = update;   // function(job)
    this.remove   = remove;   // function(jobId)

    this.updateSuccess = updateSuccess; // function()

    //////////////////////////////////////////


    function get(entityType, stubOrId, select) {
        var endpoint       = parseEntityType(entityType);
        var selectSm       = ['stub', 'name', 'picture', 'blurb', 'permissions', 'team'];
        var selectSmPost   = ['stub', 'name', 'picture', 'owner'];
        var selectSmJob    = ['stub', 'name', 'organisations'];
        var selectMd       = ['stub', 'name', 'picture', 'blurb', 'created', 'updated', 'fields', 'organisations', 'team' , 'likes', 'numComments', 'location'];
        var selectLg       = ['*']

        // Default the selectFields
        var selectFields
        if(select == 'sm'){
            if(endpoint == 'posts'){
                selectFields = selectSmPost;
            }
            else if(endpoint == 'jobs'){
                selectFields = selectSmJob;
            }
            else{
                selectFields = selectSm;
            }
        } else if (select == 'md'){
            selectFields = selectMd;
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

        // Clone the entity
        var cloneEntity = _.clone(entity, true);

        // Remove the section elements
        if(cloneEntity.sectionData && cloneEntity.sectionData.sections){
            ModularEditorService.stripSectionsDomElements(cloneEntity.sectionData.sections);
        }

        // Remove the posts
        if(cloneEntity.posts){
            cloneEntity.posts = undefined;
        }

        // Send it
        return HttpService({
            method: 'PUT',
            url: 'api/v1/'+endpoint+'/'+entity._id,
            data: cloneEntity
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
        else if(entityType == 'organisations' || entityType == 'organisation'){
            endpoint = 'organisations'
        }
        else if(entityType == 'projects' || entityType == 'project'){
            endpoint = 'projects'
        }
        else if(entityType == 'threads' || entityType == 'thread'){
            endpoint = 'threads'
        }
        else if(entityType == 'fields' || entityType == 'field'){
            endpoint = 'fields'
        }
        else if(entityType == 'posts' || entityType == 'post'){
            endpoint = 'posts'
        }
        else{
            console.error('Invalid Entity Type');
        }
        return endpoint
    }

    function updateSuccess(){
        $mdToast.show($mdToast.simple().content('Save Successful'));
    }

});
