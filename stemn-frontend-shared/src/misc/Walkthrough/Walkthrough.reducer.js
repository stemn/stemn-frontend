import { produce } from 'immer'

const initialState = {
  active: [],
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'WALKTHROUGH/ACTIVATE': {
      return produce(state, (draft) => {
        const stepIndex = draft.active.findIndex((step) => step === action.payload.name)
        if (stepIndex === -1) draft.active.push(action.payload.name)
      })
    }
    case 'WALKTHROUGH/DEACTIVATE': {
      return produce(state, (draft) => {
        const stepIndex = draft.active.findIndex((step) => step === action.payload.name)
        if (stepIndex !== -1) draft.active.splice(stepIndex, 1)
      })
    }
    default:
      return state
  }
}
