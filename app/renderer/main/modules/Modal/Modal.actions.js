import getUuid from 'app/shared/helpers/getUuid.js';
import promise from 'bluebird';

export let modalPromises = {

};

export function showModal({modalType, modalProps, modalOptions, modalConfirm, modalCancel}) {
  return {
    type: 'MODALS/SHOW_MODAL',
    payload: {
      modalId: getUuid(),
      modalType: modalType,
      modalProps: modalProps,
      modalOptions : modalOptions,
      /*******************************
      options: {
        width: '400px'
      }
      *******************************/
      modalConfirm : modalConfirm,
      modalCancel  : modalCancel
    },
  };
}

export function showConfirm({title, message, modalConfirm, modalCancel}) {
  return {
    type: 'MODALS/SHOW_MODAL',
    payload: {
      modalId: getUuid(),
      modalType: 'CONFIRM',
      modalProps: {
        title,
        message
      },
      modalOptions : {},
      modalConfirm : modalConfirm,
      modalCancel  : modalCancel
    },
  };
}
export function showPromiseConfirm({title, message, modalConfirm, modalCancel}) {
  const payload = new Promise();

  return (dispatch)=>{
    dispatch({
      type: 'MODALS/SHOW_MODAL',
      payload: payload
    })
    dispatch({
      modalId: getUuid(),
      modalType: 'CONFIRM',
      modalProps: {
        title,
        message
      },
      modalOptions : {},
      modalConfirm : modalConfirm,
      modalCancel  : modalCancel
    })
  }

}


export function hideModal({modalId}){
  return {
    type: 'MODALS/HIDE_MODAL',
    payload: {
      modalId,
    },
  };
}
