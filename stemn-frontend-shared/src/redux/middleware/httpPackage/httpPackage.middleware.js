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

import http from 'axios'
import { stringifyQuery } from 'stemn-shared/routing/query'

class DeferredPromise {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}

const requests = {} // This is where the packages are temporarily stored (actions + the package's deferred promise)
const packageInterval = 20 // All items requested within 20ms will be packaged together
// The API parses query strings with qs, which turns more than 20 `ids[]` into an object (and the
// request then fails validation), so a package is sent as soon as it holds 20 items.
const maxPackageSize = 20
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

const getParams = (actions) => {
  // This will get the all the httpPackage params associated with all the packages on a specific endpoint
  const samplePackage = actions[0].httpPackage
  const staticParams = samplePackage.staticParams
  const paramKeys = Object.keys(samplePackage.params)
  const dynamicParams = paramKeys.reduce((params, key) => {
    params[key] = actions.map((action) => action.httpPackage.params[key])
    return params
  }, {})

  return Object.assign({}, staticParams, dynamicParams)
}

/** Dispatches the action's _FULFILLED / _REJECTED action; returns true when it was rejected */
const dispatchAction = ({ action, dispatch, response, suffix }) => {
  const isError = response && response.data && response.data.error
  const modifiedSuffix = isError ? suffixes.rejected : suffix // If the response contains an error, we rejected it.

  const newAction = {
    ...action,
    httpPackage: undefined, // Delete the httpPackage key so we don't loop
    type: action.type + modifiedSuffix, // Add the suffix to the action
    payload: response, // Add the response to the payload
  }
  dispatch(newAction) // Dispatch the new action
  return modifiedSuffix === suffixes.rejected
}

const dispatchActions = ({ actions, dispatch, response, suffix }) =>
  actions
    .map((action, index) => {
      const newResponse =
        response && response.data && response.data[index]
          ? {
              data: response.data[index],
              request: response.request,
            }
          : response

      return dispatchAction({ action, dispatch, response: newResponse, suffix }) // Dispatch the action
    })
    .some(Boolean)

const resolveRequest = (endpoint, dispatch) => {
  // Everything packaged so far is sent as one request; the next action starts a new package
  const { actions, deferred, request } = requests[endpoint]
  clearTimeout(request)
  reset(endpoint)
  const samplePackage = actions[0].httpPackage // Use the first item in the package as a sample for the url and method (this is pretty much always correct)
  http({
    // Send the request
    url: samplePackage.url,
    method: samplePackage.method,
    params: getParams(actions),
  })
    .then((response) => {
      // Dispatch the fulfilled actions (or rejected, for items the API answered with an error)
      const rejected = dispatchActions({ actions, dispatch, response, suffix: suffixes.fulfilled })
      if (rejected) deferred.reject(response)
      else deferred.resolve(response)
    })
    .catch((error) => {
      // Dispatch the rejected actions
      dispatchActions({ actions, dispatch, response: error, suffix: suffixes.rejected })
      deferred.reject(error)
    })
}

const initRequest = (endpoint, dispatch) => {
  requests[endpoint] = {
    request: setTimeout(() => resolveRequest(endpoint, dispatch), packageInterval),
    actions: [],
    // Settled once per package: every action of the package returns this promise
    deferred: new DeferredPromise(),
  }
}

export default (store) => (next) => (action) => {
  if (action && action.httpPackage) {
    const { url, staticParams = {} } = action.httpPackage
    const { dispatch } = store

    // unique key by which to identify packaged actions
    const endpoint = `${url}${stringifyQuery(staticParams) || '?'}`

    if (!requests[endpoint]) {
      // If the requests object does not exist:
      initRequest(endpoint, dispatch) // Initialise the requests object (start the package promise)
    }
    packageAction(action, endpoint) // Push the action onto the package array
    const { promise } = requests[endpoint].deferred
    dispatchAction({ action, dispatch, response: {}, suffix: suffixes.pending }) // Dispatch the _pending action
    if (requests[endpoint].actions.length >= maxPackageSize) {
      resolveRequest(endpoint, dispatch) // Full: send it now
    }

    return promise
  }
  return next(action)
}
