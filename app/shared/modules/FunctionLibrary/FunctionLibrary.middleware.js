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
      if(Array.isArray(functionInputs)){
        store.dispatch(functionFromAlias(...functionInputs));
      }
      // If the inputs are an object:
      else{
        store.dispatch(functionFromAlias(functionInputs));
      }
    }
  }
  else{
    return next(action);
  }
};
