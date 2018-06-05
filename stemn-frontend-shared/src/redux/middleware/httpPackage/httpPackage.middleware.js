/** *************************************************************************************************

This middleware is used to package http requests where possible.

It will transform multiple get requests into a single request of the form:
api/v1/entityType?ids[]=12345678901234567890?ids[]=12345678901234567890?ids[]=12345678901234567890

The action should contain a httpPackage object such as:

export function getThread({threadId}) {
  return {
    type: 'THREADS/GET_TASK',
    httpPackage: {
      url: `/api/v1/threads`,  The Api endpoint
      method: 'GET',                                          Http method, this should probably be GET
      staticParams: {                                         Parameters common to all packaged requests
        select : 'name picture blurb'
      }
      params: {                                               Params to be packaged together
        'ids[]' : threadId
      }
    }
  }
}

This middleware will emmit standard _PENDING, _FULFILLED and _REJECTED events
when the request has been fulfilled

************************************************************************************************** */

class DeferredPromise {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}

import i from 'icepick'
import http from 'axios'
import qs from 'querystring'

const requests = {}        // This is where the packages are temporarily stored
const promises = {}        // This is where the promises are temporarily stored
const packageInterval = 20 // All items requested within 20ms will be packaged together
const suffixes = {
  pending: '_PENDING',
  fulfilled: '_FULFILLED',
  rejected: '_REJECTED',
}

const reset = (endpoint) => {
  requests[endpoint] = undefined
}

const packageAction = (action, endpoint) => {
  requests[endpoint].actions.push(action)
}

const getParams = (endpoint) => {
  // This will get the all the httpPackage params associated with all the packages on a specific endpoint
  const samplePackage = requests[endpoint].actions[0].httpPackage
  const staticParams = samplePackage.staticParams
  const paramKeys = Object.keys(samplePackage.params)
  const dynamicParams = paramKeys.reduce((params, key) => {
    params[key] = requests[endpoint].actions.map(action => action.httpPackage.params[key])
    return params
  }, {})

  //  console.log(dynamicParams);
  const params = Object.assign({}, staticParams, dynamicParams)
  return params
}

const dispatchAction = ({ action, dispatch, response, suffix, endpoint }) => {
  const isError = response && response.data && response.data.error 
  const modifiedSuffix = isError ? suffixes.rejected : suffix // If the response contains an error, we rejected it.

  if (modifiedSuffix === suffixes.rejected) {
    promises[endpoint].reject()
    delete promises[endpoint]
  } else if (modifiedSuffix === suffixes.fulfilled) {
    promises[endpoint].resolve()
  }
  
  const newAction = i.merge(action, {
    httpPackage: undefined,               // Delete the httpPackage key so we don't loop
    type: action.type + modifiedSuffix,   // Add the suffix to the action
    payload: response,                    // Add the response to the payload
  })
  dispatch(newAction)                     // Dispatch the new action
}

const dispatchActions = ({ actions, dispatch, response, suffix, endpoint }) => {
  actions.forEach((action, index) => {
    const newResponse = response && response.data && response.data[index]
      ? {
        data: response.data[index],
        request: response.request,
      }
      : response

    dispatchAction({ action, dispatch, response: newResponse, suffix, endpoint })   // Dispatch the action
  })
}

const resolveRequest = (endpoint, dispatch) => {
  const samplePackage = requests[endpoint].actions[0].httpPackage // Use the first item in the package as a sample for the url and method (this is pretty much always correct)
  const params = getParams(endpoint)         // Get the array of query params
  const actions = requests[endpoint].actions // We assign actions here so we can delete it in the requests object without causing issues
  reset(endpoint)                            // Reset the endpoint so we can begin the next package
  http({                                     // Send the request
    url: samplePackage.url,
    method: samplePackage.method,
    params,
  })
    .then(response => 
      // Dispatch the fulfilled actions
      dispatchActions({ actions, dispatch, response, suffix: suffixes.fulfilled, endpoint }),
    )   
    .catch(response => 
      // Dispatch the rejected actions
      dispatchActions({ actions, dispatch, response, suffix: suffixes.rejected, endpoint }),
    )
}


const initRequest = (action, endpoint, dispatch) => {
  const deferred =  new DeferredPromise()
  requests[endpoint] = {
    request: setTimeout(() => resolveRequest(endpoint, dispatch, deferred), packageInterval),
    actions: [],
  }
  return deferred
}

export default store => next => (action) => {
  if (action && action.httpPackage) {
    const { url, staticParams = {} } = action.httpPackage
    const { dispatch } = store

    // unique key by which to identify packaged actions
    const endpoint = `${url}?${qs.stringify(staticParams)}`

    if (!promises.endpont) {
      promises[endpoint] = new DeferredPromise()
    }

    if (!requests[endpoint]) {                    // If the requests object does not exist:
      initRequest(action, endpoint, dispatch)     // Initialise the requests object (start the package promise)
    }
    packageAction(action, endpoint)               // Push the action onto the package array
    dispatchAction({ action, dispatch, response: {}, suffix: suffixes.pending }) // Dispatch the _pending action

    return promises[endpoint].promise
  }
  return next(action)
}
