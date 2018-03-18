import i from 'icepick'

const initialState = {
  pipelines: {},
}

const reducer = (state, action) => {
  switch (action.type) {    
    case 'PIPELINES/GET_PIPELINE_PENDING':
      return i.assocIn(state, ['data', action.meta.projectId, 'loading'], true)
    case 'PIPELINES/GET_PIPELINE_REJECTED':
      return i.assocIn(state, ['data', action.meta.projectId, 'loading'], false)
    case 'PIPELINES/GET_PIPELINE_FULFILLED':
      return i.chain(state)
        .assocIn(['data', action.meta.projectId, 'loading'], false)
        .assocIn(['data', action.meta.projectId, 'dataSize'], action.meta.size)
        .assocIn(['data', action.meta.projectId, 'data'], action.payload.data)
        .value()
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
