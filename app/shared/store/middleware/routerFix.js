/**********************************************
React Redux Router does not let us add meta to the payload.

Instead, we add the meta to the state object.
This is transfered to the metadata here.

It will also close any modals.
**********************************************/

import * as modalActions from '../../../renderer/main/modules/Modal/Modal.actions.js'

const routerFix = store => next => action => {

  if(action.type == '@@router/LOCATION_CHANGE' && action.payload.state && action.payload.state.meta){ // muteable
    action.meta = action.payload.state.meta;
    delete action.payload.state.meta;
  }
  // Close modals
  if(action.type == '@@router/LOCATION_CHANGE'){
    store.dispatch(modalActions.closeAll())
  }
  return next(action);
};

export default routerFix;
