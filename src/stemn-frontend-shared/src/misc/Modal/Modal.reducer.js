import i from 'icepick'

import { getPromise } from './ModalPromises'

const initialState = {
  stack: [],
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'MODALS/SHOW_MODAL_PENDING':
      return i.updateIn(state, ['stack'], (stack) => {
        stack = stack || []
        const isLimited = action.meta.limit
        const isLessThanLimit = isLimited
          ? stack.filter(modal => modal.modalType === action.meta.modalType).length < action.meta.limit
          : true
        return isLessThanLimit ? i.push(stack, action.meta) : stack
      })
    case 'MODALS/HIDE_MODAL':
      const modalIndex = state.stack.findIndex(modal => modal.modalId === action.payload.modalId)
      return modalIndex !== -1 ? i.merge(state, { stack: i.splice(state.stack, modalIndex, 1) }) : state

    case 'MODALS/CLOSE_ALL':
      return i.assoc(state, 'stack', [])

    case 'MODALS/RESOLVE': {
      const modalPromise = getPromise(action.payload.modalId)
      if (modalPromise) {
        modalPromise.resolve(action.payload.data)
      }
      return state
    }

    case 'MODALS/REJECT': {
      const modalPromise = getPromise(action.payload.modalId)
      if (modalPromise) {
        modalPromise.reject(action.payload.data)
      }
      return state
    }

    default:
      return state
  }
}
