angular.module('modules.local-cache', [
]);
angular.module('modules.local-cache').

service('LocalCache', function($timeout, $q, CoreLibrary) {
    var service = this;
    this.getPackaged     = getPackaged; //function(endpoint, request, requestData, fresh)
    this.save            = save;        //function(endpoint, item)

    // Internal
    this.requestCache = {
        /*****************
        endpoint : {
            index          : {}            - stub to id index,
            cache          : {}            - id cache
            stubCache      : {}            - stub cache
            packagePromise : promise       - Timeout that runs the request function
            request        : fn(package)   - promise function - this takes in package
            package        : []            - Array of query ids []
        }
        *****************/
    };

    //////////////////////////////////////////////////////


    function getPackaged(endpoint, stubOrId, request, fresh){
        /**********************************************

        endpoint: string - unique string endpoint
        stubOrId: stub || id
        request:  request function
        fresh:    true || false - if true, we do a fresh request (even if it is in the cache)

        **********************************************/
        // Create empty object for endpoint if undefined
        createEndpointObject(endpoint);


        var deferred = $q.defer();
        var item     = getFromCache(endpoint, stubOrId);
        // If item is in the cache (and we are not asking for fresh):
		if (item && !fresh) {
            return item.promise ||  $q.when(item); // Return the promise (if defined) or wrap the item in a promise.
        } else {
            // If the package exists, append request data to package
            if(service.requestCache[endpoint].packagePromise){
                addPackage(endpoint, stubOrId)
            }
            // If there is no package promise, create one.
            else{
                newPackage(endpoint, request, stubOrId)
                service.requestCache[endpoint].packagePromise = $timeout(function(){
                    // Set the package promise to undefined so we can create a new package
                    service.requestCache[endpoint].packagePromise = undefined;
                    return sendPackage(endpoint)
                },10)
            }
            // Set the promise to the id-cache or stub-cache
            if(CoreLibrary.isObjectId(stubOrId)){
                service.requestCache[endpoint].cache[stubOrId]     = deferred;
            }else{
                service.requestCache[endpoint].stubCache[stubOrId] = deferred;
            }
		}
		return deferred.promise;
    }

    function save(endpoint, item){
        createEndpointObject(endpoint);
        // Endpoint does not exist in cache if we have not get used the get method
        if(service.requestCache[endpoint]){
            if(item.stub){
                service.requestCache[endpoint].index[item.stub] = item._id; // Add to the stub-id index
            }
            if(item._id){
                service.requestCache[endpoint].cache[item._id]  = item;     // Save to the cache
            }
        }
    }

    function createEndpointObject(endpoint){
        service.requestCache[endpoint]           = service.requestCache[endpoint]           || {};
        service.requestCache[endpoint].cache     = service.requestCache[endpoint].cache     || {};
        service.requestCache[endpoint].index     = service.requestCache[endpoint].index     || {};
        service.requestCache[endpoint].stubCache = service.requestCache[endpoint].stubCache || {};
    }

    // -------------------------------------------------------------------------------------------------------------------- //

    function getFromCache(endpoint, stubOrId){
        var cachedItem
        // If the cache and stubcache is empty, return false
        // Return false if the cached item contains the error property
        if(!service.requestCache[endpoint] || (!service.requestCache[endpoint].cache && !service.requestCache[endpoint].stubCache)){
            return false;
        }
        // Check the id-cache
        if(service.requestCache[endpoint].cache[stubOrId]){
            cachedItem = service.requestCache[endpoint].cache[stubOrId];
            return cachedItem.error ? false : cachedItem;
        }
        // Else, use the stub-id index and check cache again
        else if(service.requestCache[endpoint].cache[service.requestCache[endpoint].index[stubOrId]]){
            cachedItem = service.requestCache[endpoint].cache[service.requestCache[endpoint].index[stubOrId]];
            return cachedItem.error ? false : cachedItem;
        }
        // Check the stub cache
        else if(service.requestCache[endpoint].stubCache[stubOrId]){
            cachedItem = service.requestCache[endpoint].stubCache[stubOrId];
            return cachedItem.error ? false : cachedItem;
        }
        else{
            return false;
        }
    }

    function sendPackage(endpoint){
        return service.requestCache[endpoint].request(service.requestCache[endpoint].package).then(function(results){
            _.forEach(results, function(result){
                // If the result has an error, we reject the promise
                if(result.error){
                    // Resolve any matching promises in the cache and stubcache
                    if(service.requestCache[endpoint].cache[result._id] && service.requestCache[endpoint].cache[result._id].reject){
                        service.requestCache[endpoint].cache[result._id].reject(result);
                    }
                    if(service.requestCache[endpoint].stubCache[result.stub] && service.requestCache[endpoint].stubCache[result.stub].reject){
                        service.requestCache[endpoint].stubCache[result.stub].reject(result);
                    }
                }
                // Else the result is valid, we resolve the promise
                else{
                    // Resolve any matching promises in the id-cache and stub-cache
                    if(service.requestCache[endpoint].cache[result._id] && service.requestCache[endpoint].cache[result._id].resolve){
                        service.requestCache[endpoint].cache[result._id].resolve(result)
                    }
                    if(service.requestCache[endpoint].stubCache[result.stub] && service.requestCache[endpoint].stubCache[result.stub].resolve){
                        service.requestCache[endpoint].stubCache[result.stub].resolve(result)
                    }
                }
                // Save the data to the cache and index
                save(endpoint, result);
            })
        }).catch(function(response){
            _.forEach(service.requestCache[endpoint].package, function(stubOrId){
                // Resolve any matching promises in the cache and stubcache
                if(service.requestCache[endpoint].cache[stubOrId] && service.requestCache[endpoint].cache[stubOrId].reject){
                    service.requestCache[endpoint].cache[stubOrId].reject(response);
                }
                if(service.requestCache[endpoint].stubCache[stubOrId] && service.requestCache[endpoint].stubCache[stubOrId].reject){
                    service.requestCache[endpoint].stubCache[stubOrId].reject(response);
                }
            })
        });
    }
    function newPackage(endpoint, request, requestData){
        service.requestCache[endpoint].package = [requestData];
        service.requestCache[endpoint].request = request;
    }
    function addPackage(endpoint, requestData){
        service.requestCache[endpoint].package.push(requestData)
    }

});
