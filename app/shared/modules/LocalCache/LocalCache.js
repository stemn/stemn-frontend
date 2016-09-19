import Promise from 'bluebird';
import isUuid from 'app/shared/helpers/isUuid.js';

export const getPackaged; //function(endpoint, request, requestData, fresh)
export const save;        //function(endpoint, item)

// Internal
const requestCache = {
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

    var deferred = new Promise;
    var item     = getFromCache(endpoint, stubOrId);
    // If item is in the cache (and we are not asking for fresh):
    if (item && !fresh) {
      return item.promise || promise.when(item); // Return the promise (if defined) or wrap the item in a promise.
    }
    else {
    // If the package exists, append request data to package
    if(requestCache[endpoint].packagePromise){
      addPackage(endpoint, stubOrId)
    }
    // If there is no package promise, create one.
    else{
      newPackage(endpoint, request, stubOrId)
      requestCache[endpoint].packagePromise = setTimeout(function(){
        // Set the package promise to undefined so we can create a new package
        requestCache[endpoint].packagePromise = undefined;
        return sendPackage(endpoint)
      }, 10)
    }
    // Set the promise to the id-cache or stub-cache
    if(isUuid(stubOrId)){
      requestCache[endpoint].cache[stubOrId]     = deferred;
    }else{
      requestCache[endpoint].stubCache[stubOrId] = deferred;
    }
  }
  return deferred;
}

function save(endpoint, item){
    createEndpointObject(endpoint);
    // Endpoint does not exist in cache if we have not get used the get method
    if(requestCache[endpoint]){
        if(item.stub){
            requestCache[endpoint].index[item.stub] = item._id; // Add to the stub-id index
        }
        if(item._id){
            requestCache[endpoint].cache[item._id]  = item;     // Save to the cache
        }
    }
}

function createEndpointObject(endpoint){
    requestCache[endpoint]           = requestCache[endpoint]           || {};
    requestCache[endpoint].cache     = requestCache[endpoint].cache     || {};
    requestCache[endpoint].index     = requestCache[endpoint].index     || {};
    requestCache[endpoint].stubCache = requestCache[endpoint].stubCache || {};
}

// -------------------------------------------------------------------------------------------------------------------- //

function getFromCache(endpoint, stubOrId){
    var cachedItem
    // If the cache and stubcache is empty, return false
    // Return false if the cached item contains the error property
    if(!requestCache[endpoint] || (!requestCache[endpoint].cache && !requestCache[endpoint].stubCache)){
        return false;
    }
    // Check the id-cache
    if(requestCache[endpoint].cache[stubOrId]){
        cachedItem = requestCache[endpoint].cache[stubOrId];
        return cachedItem.error ? false : cachedItem;
    }
    // Else, use the stub-id index and check cache again
    else if(requestCache[endpoint].cache[requestCache[endpoint].index[stubOrId]]){
        cachedItem = requestCache[endpoint].cache[requestCache[endpoint].index[stubOrId]];
        return cachedItem.error ? false : cachedItem;
    }
    // Check the stub cache
    else if(requestCache[endpoint].stubCache[stubOrId]){
        cachedItem = requestCache[endpoint].stubCache[stubOrId];
        return cachedItem.error ? false : cachedItem;
    }
    else{
        return false;
    }
}

function sendPackage(endpoint){
    return requestCache[endpoint].request(requestCache[endpoint].package).then(function(results){
        results.forEach(function(result){
            // If the result has an error, we reject the promise
            if(result.error){
                // Resolve any matching promises in the cache and stubcache
                if(requestCache[endpoint].cache[result._id] && requestCache[endpoint].cache[result._id].reject){
                    requestCache[endpoint].cache[result._id].reject(result);
                }
                if(requestCache[endpoint].stubCache[result.stub] && requestCache[endpoint].stubCache[result.stub].reject){
                    requestCache[endpoint].stubCache[result.stub].reject(result);
                }
            }
            // Else the result is valid, we resolve the promise
            else{
                // Resolve any matching promises in the id-cache and stub-cache
                if(requestCache[endpoint].cache[result._id] && requestCache[endpoint].cache[result._id].resolve){
                    requestCache[endpoint].cache[result._id].resolve(result)
                }
                if(requestCache[endpoint].stubCache[result.stub] && requestCache[endpoint].stubCache[result.stub].resolve){
                    requestCache[endpoint].stubCache[result.stub].resolve(result)
                }
            }
            // Save the data to the cache and index
            save(endpoint, result);
        })
    }).catch(function(response){
        requestCache[endpoint].package.forEach(function(stubOrId){
            // Resolve any matching promises in the cache and stubcache
            if(requestCache[endpoint].cache[stubOrId] && requestCache[endpoint].cache[stubOrId].reject){
                requestCache[endpoint].cache[stubOrId].reject(response);
            }
            if(requestCache[endpoint].stubCache[stubOrId] && requestCache[endpoint].stubCache[stubOrId].reject){
                requestCache[endpoint].stubCache[stubOrId].reject(response);
            }
        })
    });
}
function newPackage(endpoint, request, requestData){
  requestCache[endpoint].package = [requestData];
  requestCache[endpoint].request = request;
}
function addPackage(endpoint, requestData){
  requestCache[endpoint].package.push(requestData)
}
