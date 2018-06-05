import i from 'icepick'

export const name = 'localPath'

const initialState = {
  // Paths cached by projectId are stored here
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'LOCAL_PATH/GET_PATH_PENDING':
      return i.assoc(state, action.meta.projectId, { loading: true })
    case 'LOCAL_PATH/GET_PATH_REJECTED':
      return i.assoc(state, action.meta.projectId, { loading: false })
    case 'LOCAL_PATH/GET_PATH_FULFILLED':
      return i.assoc(state, action.meta.projectId, { loading: false, data: action.payload.data })
    default:
      return state
  }
}
