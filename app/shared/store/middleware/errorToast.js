import {toastr} from 'react-redux-toastr'

/**********************************************
This will add an error message toast when required
**********************************************/
const errorToast = store => next => action => {
  if(action.type.endsWith('_REJECTED') && action.payload && action.payload.response && action.payload.response.data){
    const message = action.payload.response.data.error || action.payload.response.data.message;
    if(message){
      toastr.error(message)
    }
  }
  return next(action);
};

export default errorToast;
