/** ********************************************

This middleware is used to run aliased functions.
It will execute in the main thread.

An aliased action names a function in the FunctionLibrary:
{ type, aliased: true, payload: { functionAlias: 'Module.function', functionInputs } }

********************************************* */

import { getFunction } from './FunctionLibrary.js'

function dispatchAction(store, action, aliasedResult) {
  // If it is a function, (it is a thunk, dispatch it)
  if (typeof aliasedResult === 'function') {
    return store.dispatch(aliasedResult)
  }
  // If the initial action has a type (that is not ALIASED), we use the aliasedResult as the payload.
  if (action.type && action.type !== 'ALIASED') {
    return store.dispatch({
      ...action,
      payload: aliasedResult,
      aliased: false, // Set alias to false so we don't loop
    })
  }
  // If the aliased result has a type, we dispatch it
  if (aliasedResult && aliasedResult.type) {
    return store.dispatch(aliasedResult)
  }
  // Else, the function does not need to be dispatched - it is not a redux style action
  return aliasedResult
}

export default (store) => (next) => (action) => {
  if (action && action.aliased) {
    const { functionAlias, functionInputs } = action.payload
    const functionFromAlias = getFunction(functionAlias)
    if (functionFromAlias) {
      // If it is an array, pass in the array of params
      const aliasedResult = Array.isArray(functionInputs)
        ? functionFromAlias(...functionInputs)
        : functionFromAlias(functionInputs)
      return dispatchAction(store, action, aliasedResult)
    }
    return undefined
  }
  return next(action)
}
