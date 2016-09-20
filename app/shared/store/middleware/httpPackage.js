import i from 'icepick';
import http from 'axios';

const requests = {};

const packageInterval = 10; // All items requested within 10ms will be packaged together

/*************************************************
This middleware is used to package http requests where possible.

It will transform multiple get requests into a single request of the form:
api/v1/entityType?ids[]=12345678901234567890?ids[]=12345678901234567890?ids[]=12345678901234567890

The action should contain a httpPackage object such as:

export function getTask({taskId}) {
  return {
    type: 'TASKS/GET_TASK',
    httpPackage: {
      endpoint: 'api/v1/tasks',                   The endpoint used to save it in the requests object
      url: `http://localhost:3000/api/v1/tasks`,  The Api endpoint
      method: 'GET',                              Http method, this should probably be GET
      params: {                                   Params object. This is what is packaged together.
        'ids[]' : taskId
      }
    },
    meta: {
      cacheKey: taskId
    }
  }
}

This middleware will emmit standard _FULFILLED and _REJECTED events
when the request has been fulfilled
*************************************************/

export default store => next => action => {
  if(action.httpPackage){
    const { endpoint, params } = action.httpPackage;
    if(!requests[endpoint]){
      initRequest(action, store.dispatch)
    }
    packageAction(action)
  }
  else{
    return next(action);
  }
};

////////////////////////////////////////////////

function initRequest(action, dispatch){
  requests[action.httpPackage.endpoint] = {
    request: setTimeout(()=>resolveRequest(action.httpPackage.endpoint, dispatch), packageInterval),
    actions: [],
  }
}
function resolveRequest(endpoint, dispatch){
  const samplePackage = requests[endpoint].actions[0].httpPackage;
  const params = getParams(endpoint)

  // Dispatch pending
  dispatchIndividualActions({
    actions: requests[endpoint].actions,
    dispatch,
    response : {},
    suffix: '_PENDING'
  })

  http({
    url: samplePackage.url,
    method: samplePackage.method,
    params: params
  }).then( response => {
    // Dispatch fulfilled
    dispatchIndividualActions({
      actions: requests[endpoint].actions,
      dispatch,
      response,
      suffix: '_FULFILLED'
    })
  }).catch( response => {
    // Dispatch rejected
    dispatchIndividualActions({
      actions: requests[endpoint].actions,
      dispatch,
      response,
      suffix: '_REJECTED'
    })
  })

  reset(endpoint);
}

function dispatchIndividualActions({actions, dispatch, response, suffix}){
  actions.forEach( (action, index) => {
    const newAction = i.merge(action, {
      httpPackage: undefined,              // Delete the httpPackage key so we don't loop
      type: action.type + suffix,          // Add the suffix to the action
      payload: response[index] || response // Add the response to the payload
    });
    dispatch(newAction)                    // Dispatch the new action
  })
}

function reset(endpoint){
  requests.endpoint = undefined;
}

function packageAction(action){
  requests[action.httpPackage.endpoint].actions.push(action);
}

function getParams(endpoint){
  // This will get the all the httpPackage params associated with all the packages on a specific endpoint
  const samplePackage = requests[endpoint].actions[0].httpPackage;
  const paramKeys = Object.keys(samplePackage.params);
  const params = {};
  paramKeys.forEach((key)=>{
    params[key] = requests[endpoint].actions.map(action => action.httpPackage.params[key] )
  })

  return params
}
