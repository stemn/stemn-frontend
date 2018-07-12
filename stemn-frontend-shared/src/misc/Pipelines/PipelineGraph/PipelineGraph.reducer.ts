import * as i from 'icepick'

const initialState = {
  /*
    [diagramId]: {
      selectedStep: string,
      model: {},
    }
  */
}

const reducer = (state, action) => {
  switch (action.type) { 
    case 'PIPELINE_DIAGRAM/INITIALISE_MODEL': 
      return i.assocIn(state, [action.payload.diagramId, 'model'], action.payload.model)

    case 'PIPELINE_DIAGRAM/SELECT_STEP':
      return i.assocIn(state, [action.payload.diagramId, 'selectedStep'], action.payload.stepId)

    case 'PIPELINE_DIAGRAM/ADD_STEP':
      return i.assocIn(state, [action.payload.diagramId, 'model', 'steps', action.payload.stepId], action.payload.step)
    
    default:
      return state
  }
}

export default (state = initialState, action) => {
  if (!state.hydrated) {
    state = { ...initialState, ...state, hydrated: true }
  }
  return reducer(state, action)
}
