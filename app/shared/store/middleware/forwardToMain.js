import { ipcRenderer } from 'electron';

const forwardToMain = store => next => action => { // eslint-disable-line no-unused-vars
  if(action.type.substr(0, 2) !== '@@' && (
      !action.meta       ||
      !action.meta.scope ||
      action.meta.scope !== 'local'
  )){
    ipcRenderer.send('redux-action', action);
    // stop action in-flight
    return;
  }
//  // Else if it is a state change and the state scope is global, forward it
//  else if(action.type.substr(0, 2) == '@@' && action.payload.state && action.payload.state.scope == 'global'){
//    action.payload.state.scope == false;
//    ipcRenderer.send('redux-action', action);
//  }
//
  return next(action); // eslint-disable-line consistent-return
};

export default forwardToMain;
