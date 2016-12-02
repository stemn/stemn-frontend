import getUuid from '../../../../shared/helpers/getUuid.js';

export let modalPromises = {

};

export function showModal({modalType, modalProps, modalOptions, limit, modalConfirm, modalCancel, meta}) {
  return {
    type: 'MODALS/SHOW_MODAL',
    payload: {
      modalId: getUuid(),
      modalType: modalType,
      modalProps: modalProps,
      modalOptions : modalOptions,
      limit, // Limit the number of this modalType to show
      /*******************************
      options: {
        width: '400px'
      }
      *******************************/
      modalConfirm : modalConfirm,
      modalCancel  : modalCancel
    },
    meta // Meta is used for meta.scope = 'local' show the modal only shows in current window
  };
}

export function showConfirm({title, message, confirmValue, confirmPlaceholder, modalConfirm, modalCancel}) {
  return {
    type: 'MODALS/SHOW_MODAL',
    payload: {
      modalId: getUuid(),
      modalType: 'CONFIRM',
      modalProps: {
        title,
        message,
        confirmValue,       // Some string that must be entered to confirm
        confirmPlaceholder  // Placeholder for the confirm string
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

export function closeAll(){
  return {
    type: 'MODALS/CLOSE_ALL',
    payload: {},
  };
}
