/**********************************************
React Redux Router does not let us add meta to the payload.

Instead, we add the meta to the state object.
This is transfered to the metadata here.
**********************************************/
const routerFix = store => next => action => {

  if(action.type == '@@router/LOCATION_CHANGE' && action.payload.state && action.payload.state.meta){ // muteable
    action.meta = action.payload.state.meta;
    delete action.payload.state.meta;
  }
  return next(action);
};

export default routerFix;
