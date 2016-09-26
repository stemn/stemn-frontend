import getUuid from '../../../../shared/helpers/getUuid.js';

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

export function hideModal({modalId}){
  return {
    type: 'MODALS/HIDE_MODAL',
    payload: {
      modalId,
    },
  };
}
