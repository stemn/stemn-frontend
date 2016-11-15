import { showModal }          from '../../../renderer/main/modules/Modal/Modal.actions.js';
import { show as toastShow }  from '../../../renderer/main/modules/Toasts/Toasts.actions.js';
import { has }                from 'lodash';

const errorMap = {
  GOOGLE_CONNECTION_ERROR: {
    displayType: 'modal',
    modalType: 'PROVIDER_ACCESS_ERROR',
  },
  DRIVE_ACCESS_REVOKED: {
    displayType: 'modal',
    modalType: 'PROVIDER_ACCESS_REVOKED',
  },
  LINK_FOLDER_CONFLICT: {
    displayType: 'toast',
    message: (error) => has(error, 'data.project.name') ? `Folder cannot be connect to two STEMN projects. Already connected to: '${error.data.project.name}'.` : error.message
  }
}

/**********************************************
This will add an error modal/toast when possible
**********************************************/

const middleware = store => next => action => {
  if(action.type && action.type.endsWith('_REJECTED')){
    if(has(action, 'payload.errno')){
      processLocalError(store, action);
    }
    else if(has(action, 'payload.response.data.error') || has(action, 'payload.response.data.message')){
      processServerError(store, action);
    }
  }
  return next(action);
};

export default middleware;


//////////////////////////////////

function processLocalError(store, action){
  if(action.payload.errno == 'ENETUNREACH'){
    store.dispatch(showModal({
      modalType: 'CONNECTION',
      modalProps: action.payload.data,
      limit: 1,
    }))
  }
}

function processServerError(store, action){
  // Get the toast message and error type
  const { message, type, data } = action.payload.response.data.error;
  let toastMessage = message ? message : action.payload.response.data.error;

  // Error Display Info
  const errorInfo = errorMap[type];

  // If we find display info in the error map, we show it
  if(errorInfo){
    if(errorInfo.displayType == 'modal'){
      store.dispatch(showModal({
        modalType: errorInfo.modalType,
        modalProps: data,
      }))
    }
    else if(errorInfo.displayType == 'toast'){
      toastMessage = errorInfo.message(action.payload.response.data.error);
      store.dispatch(toastShow({
        type: 'error',
        title: toastMessage,
      }))
    }
  }
  // Else, if there is a message, show the toast
  else if(toastMessage){
    store.dispatch(toastShow({
      type: 'error',
      title: toastMessage,
    }))
  }
}
