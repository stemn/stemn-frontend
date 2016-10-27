/**********************************************

This middleware is used to run aliased functions.
It will execute in the main thread.

**********************************************/

import { getFunction } from './FunctionLibrary.js';

export default store => next => action => {
  if(action.payload && action.payload.functionAlias) {
    const { functionAlias, functionInputs } = action.payload;
    const functionFromAlias = getFunction(functionAlias)

    if(functionFromAlias){
      // If it is an array, pass in the array of params
      if(Array.isArray(functionInputs)){
        dispatch(functionFromAlias(...functionInputs));
      }
      // If the inputs are an object:
      else{
        dispatch(functionFromAlias(functionInputs));
      }
    }
  }
  else{
    return next(action);
  }
};
