import i from 'icepick';

const initialState = {
  stack: []
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'MODALS/SHOW_MODAL':
      return i.updateIn(state, ['stack'], stack => {
        stack = stack || [];
        const isLimited       = action.payload.limit;
        const isLessThanLimit = isLimited ? stack.filter(modal => modal.modalType == action.payload.modalType).length < action.payload.limit : true;
        return isLessThanLimit ? i.push(stack, action.payload) : stack;
      });
    case 'MODALS/HIDE_MODAL':
      const modalIndex = state.stack.findIndex(modal => modal.modalId == action.payload.modalId);
      return modalIndex != -1 ? i.merge(state, {stack: i.splice(state.stack, modalIndex, 1)}) : state;
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
