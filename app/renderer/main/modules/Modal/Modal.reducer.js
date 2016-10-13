import i from 'icepick';

const initialState = {
  stack: []
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'MODALS/SHOW_MODAL':
      return i.merge(state, {
        stack: i.push(state.stack, action.payload)
      })
    case 'MODALS/HIDE_MODAL':
      const modalIndex = state.stack.findIndex(modal => modal.modalId == action.payload.modalId);
      return i.merge(state, {
        stack: i.splice(state.stack, modalIndex, 1)
      })
    case 'MODALS/CLOSE_ALL':
      return i.assoc(state, 'stack', [])
    default:
      return state;
  }
}

//    case 'MODALS/SHOW_MODAL':
//      return u({
//        [action.payload.modalId] : {
//          isOpen: true,
//          modalProps: action.payload.modalProps
//        }
//      }, state)
