import i from 'icepick'
import { flow, split, map } from 'lodash/fp'

const initialState = {
  lines: {},
  loading: {},
  hasLoadedBefore: {},
}

const removeFirstIfEmpty = arr => ((arr && arr.length === 1 && arr[0] === '') ? [] : arr)

const transformLines = flow(
  split('\n'),
  removeFirstIfEmpty,
  map((item, index) => ({
    number: index,
    data: item,
  })),
)

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
      return i.chain(state)
        .assocIn(['loading', action.meta.stepId], false)
        .assocIn(['hasLoadedBefore', action.meta.stepId], true)
        .value()
    case 'TERMINAL/GET_LINES_FULFILLED':
      return i.chain(state)
        .assocIn(['loading', action.meta.stepId], false)
        .assocIn(['hasLoadedBefore', action.meta.stepId], true)
        .assocIn(['lines', action.meta.stepId], transformLines(action.payload.data))
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
