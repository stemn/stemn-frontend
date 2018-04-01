import i from 'icepick'

const initialState = {
  lines: {},
  loading: {},
}

const reducer = (state, action) => {
  switch (action.type) { 
    case 'TERMINAL/ADD_LINES':
      return i.assocIn(state, ['lines', action.meta.stepId], action.payload.lines.map(item => ({
        number: item[0],
        data: item[1],
      })))

    case 'TERMINAL/GET_LINES_PENDING':
      return i.assocIn(state, ['loading', action.meta.stepId], true)
    case 'TERMINAL/GET_LINES_REJECTED':
      return i.assocIn(state, ['loading', action.meta.stepId], false)
    case 'TERMINAL/GET_LINES_FULFILLED':
      return i.chain(state)
        .assocIn(['loading', action.meta.stepId], false)
        .assocIn(['lines', action.meta.stepId], action.payload.data.split('\n').map((item, index) => ({
          number: index,
          data: item,
        })))
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
