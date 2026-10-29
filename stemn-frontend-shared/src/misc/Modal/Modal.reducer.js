import { produce } from 'immer'

import { getPromise } from './ModalPromises'

const initialState = {
  stack: [],
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'MODALS/SHOW_MODAL_PENDING':
      return produce(state, (draft) => {
        if (!draft.stack) draft.stack = []
        const isLimited = action.meta.limit
        const isLessThanLimit = isLimited
          ? draft.stack.filter((modal) => modal.modalType === action.meta.modalType).length < action.meta.limit
          : true
        if (isLessThanLimit) draft.stack.push(action.meta)
      })
    case 'MODALS/HIDE_MODAL': {
      const modalIndex = state.stack.findIndex((modal) => modal.modalId === action.payload.modalId)
      return modalIndex !== -1
        ? produce(state, (draft) => {
            draft.stack.splice(modalIndex, 1)
          })
        : state
    }

    case 'MODALS/CLOSE_ALL':
      return produce(state, (draft) => {
        draft.stack = []
      })

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
