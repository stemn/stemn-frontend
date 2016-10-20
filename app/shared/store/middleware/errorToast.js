import { show as toastShow } from '../../../renderer/main/modules/Toasts/Toasts.actions.js';
import { has } from 'lodash';

const errorMessageMap = {
  LINK_FOLDER_CONFLICT: {
    message: (error) => has(error, 'data.project.name') ? `Folder cannot be connect to 2 STEMN projects. Already connected to: '${error.data.project.name}'.` : error.mesage
  }
}

/**********************************************
This will add an error message toast when required
**********************************************/
const errorToast = store => next => action => {
  if(action.type.endsWith('_REJECTED') && (has(action, 'payload.response.data.error') || has(action, 'payload.response.data.message'))){
    const { message, type } = action.payload.response.data.error || action.payload.response.data;
    let modifiedMessage = message ? message : action.payload.response.data.error;
    const errorInfo = errorMessageMap[type];
    if(errorInfo){
      modifiedMessage = errorInfo.message(action.payload.response.data.error);
    }

    if(modifiedMessage){
      store.dispatch(toastShow({
        type: 'error',
        title: modifiedMessage,
      }))
    }
  }
  return next(action);
};

export default errorToast;
