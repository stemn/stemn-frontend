angular.module('modules.core', [
]);
angular.module('modules.core').

service('CoreLibrary', function ($state) {
    var service = this;

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

});
