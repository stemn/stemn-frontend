import u from 'updeep';

const initialState = {

};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'MODALS/SHOW_MODAL':
      return u({
        [action.payload.modalId] : {
          isOpen: true,
          modalProps: action.payload.modalProps
        }
      }, state)
    case 'MODALS/HIDE_MODAL':
      return u({
        [action.payload.modalId] : {
          isOpen: false
        }
      }, state)
    default:
      return state;
  }
}
