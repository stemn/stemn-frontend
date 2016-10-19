import { showModal } from '../../../renderer/main/modules/Modal/Modal.actions.js';
import { has } from 'lodash';

const errorModalMap = {
  GOOGLE_CONNECTION_ERROR: {
    modalType: 'GOOGLE_REVOKE',
  }
}

/**********************************************
This will add an error modal when possible
**********************************************/
const errorModal = store => next => action => {
  if(action.type.endsWith('_REJECTED') && has(action, 'payload.response.data')){
    const { errorCode } = action.payload.response.data;
    if(errorCode){
      const errorModal = errorModalMap[errorCode];
      if(errorModal){
        store.dispatch(showModal({
          modalType: errorModal.modalType,
        }))
      }
    }
  }
  return next(action);
};

export default errorModal;
