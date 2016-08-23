//export function initModal({modalId, modalProps}) {
//  return {
//    type: 'MODALS/INIT',
//    payload: {
//      modalId: modalId,
//      modalProps: modalProps
//    },
//  };
//}

export function showModal({modalId, modalProps}) {
  return {
    type: 'MODALS/SHOW_MODAL',
    payload: {
      modalId: modalId,
      modalProps: modalProps
    },
  };
}

export function hideModal({modalId}){
  return {
    type: 'MODALS/HIDE_MODAL',
    payload: {
      modalId: modalId,
    },
  };
}
