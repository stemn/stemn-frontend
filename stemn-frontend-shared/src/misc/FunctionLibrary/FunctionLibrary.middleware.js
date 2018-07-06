/** ********************************************

This middleware is used to run aliased functions.
It will execute in the main thread.

********************************************* */

import { getFunction } from './FunctionLibrary.js'

export default store => next => (action) => {
  if (action && action.aliased) {
    const { functionAlias, functionInputs } = action.payload
    const functionFromAlias = getFunction(functionAlias)
    if (functionFromAlias) {
      // If it is an array, pass in the array of params
      const aliasedResult = Array.isArray(functionInputs) ? functionFromAlias(...functionInputs) : functionFromAlias(functionInputs)
      dispatchAction(store, action, aliasedResult)
    }
  } else {
    return next(action)
  }
}


function dispatchAction(store, action, aliasedResult) {
  if (action.type === 'FILES/RENDER_FILE') {
    //    console.log({aliasedResult});
    aliasedResult.then(response => 
      //      console.log({response});
      response,
    )
  }

  // If it is a function, (it is a thunk, dispatch it)
  if (typeof aliasedResult === 'function') {
    store.dispatch(aliasedResult)
  }
  // If the initial action has a type (that is not ALIASED), we use the aliasedResult as the payload.
  else if (action.type && action.type !== 'ALIASED') {
    const updatedAction = Object.assign({}, action, {
      payload: aliasedResult,
      aliased: false, // Set alias to false so we don't loop
    })
    store.dispatch(updatedAction)
  }
  // If the aliased result has a type, we dispatch it
  else if (aliasedResult.type) {
    store.dispatch(aliasedResult)
  }
  // Else, the function does not need to be dispatched - it is not a redux style action
}
