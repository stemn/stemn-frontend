/**********************************************

This middleware is used to run AutoLaunch
functions

It should only run on the main-thread

**********************************************/

import autoLaunch from 'auto-launch';
const stemnAutoLaunch = new autoLaunch({
    name: 'Stemn',
});

export default store => next => action => {
  if    (action.type == 'AUTO_LAUNCH/TOGGLE') {
    store.dispatch({
      ...action,
      payload: action.meta.status ? stemnAutoLaunch.enable() : stemnAutoLaunch.disable(),
    })
  }
  else if(action.type == 'AUTO_LAUNCH/GET_STATUS'){
    store.dispatch({
      ...action,
      payload: stemnAutoLaunch.isEnabled()
    })
  }
  else{
    return next(action);
  }
};
