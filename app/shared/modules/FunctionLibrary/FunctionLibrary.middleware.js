/**********************************************

This middleware is used to run aliased functions.
It will execute in the main thread.

**********************************************/

import { getFunction } from './FunctionLibrary.js';

export default store => next => action => {
  if(action.aliased) {
    const { functionAlias, functionInputs } = action.payload;
    const functionFromAlias = getFunction(functionAlias)

    if(functionFromAlias){
      // If it is an array, pass in the array of params
      const aliasedResult = Array.isArray(functionInputs) ? functionFromAlias(...functionInputs) : functionFromAlias(functionInputs);
      dispatchAction(store, action, aliasedResult)
    }
  }
  else{
    return next(action);
  }
};


function dispatchAction(store, action, aliasedResult){
  if(action.type && action.type != 'ALIASED'){
    // If the initial action has a type, we use the aliasedResult as the payload.
    const updatedAction = Object.assign({}, action, {
      payload: aliasedResult, 
      aliased: false // Set alias to false so we don't loop
    });
    store.dispatch(updatedAction);
  }
  else if(aliasedResult.type){
    // If the aliased result has a type, we dispatch it
    store.dispatch(aliasedResult);
  }
  // Else, the function does not need to be dispatched - it is not a redux style action
}