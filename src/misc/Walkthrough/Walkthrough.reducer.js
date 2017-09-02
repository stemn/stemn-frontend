import i from 'icepick'

const initialState = {
  active: [],
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'WALKTHROUGH/ACTIVATE': {
      return i.updateIn(state, ['active'], (steps) => {
        const stepIndex = steps.findIndex(step => step === action.payload.name)
        return stepIndex === -1 ? i.push(steps, action.payload.name) : steps
      })
    }
    case 'WALKTHROUGH/DEACTIVATE': {
      return i.updateIn(state, ['active'], (steps) => {
        const stepIndex = steps.findIndex(step => step === action.payload.name)
        return stepIndex !== -1 ? i.splice(steps, stepIndex, 1) : steps
      })
    }
    default:
      return state
  }
}
