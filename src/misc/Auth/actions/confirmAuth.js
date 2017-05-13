import { push } from 'react-router-redux'

export default (actionToRun, noDispatch) => (dispatch, getState) => {
  if (getState().auth.authToken && getState().auth.user._id) {
    if (noDispatch) {
      actionToRun()
    } else {
      dispatch(actionToRun())
    }
  } else {
    dispatch(push({
      pathname: '/login',
    }))
  }
}
