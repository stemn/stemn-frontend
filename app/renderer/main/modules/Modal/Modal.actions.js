//export function initModal({modalId, modalProps}) {
//  return {
//    type: 'MODALS/INIT',
//    payload: {
//      modalId: modalId,
//      modalProps: modalProps
//    },
//  };
//}

import getUuid from 'app/shared/helpers/getUuid.js';


export function showModal({modalId}) {
  return {
    type: 'MODALS/SHOW_MODAL',
    payload: {
      modalId: getUuid(),
      modalType: 'CONFIRM',
      modalProps: {

      },
      modalOptions: {
        width: '400px'
      },
      modalConfirm: {
        type: 'CONFIRM',
        payload: {}
      },
      modalCancel: {
        type: 'CANCEL',
        payload: {}
      }
    },
  };
}

export function hideModal({modalId}){
  return {
    type: 'MODALS/HIDE_MODAL',
    payload: {
      modalId,
    },
  };
}
