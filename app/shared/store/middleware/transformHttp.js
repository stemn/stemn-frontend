import u from 'updeep';
import http from 'axios';

const transformHttp = store => next => action => {
  // If the action has action.http = true, we wrap the payload in axios.

  let modifiedAction;

  if(action.http){
    modifiedAction = u({
      payload: http(action.payload).then(action.then)
    }, action)
  }
  else{
    modifiedAction = action;
  }

  return next(modifiedAction);
};

export default transformHttp;
