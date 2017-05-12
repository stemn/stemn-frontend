import { push } from 'react-router-redux'

export default (actionToRun) => (dispatch, getState) => {
  if (getState().auth.authToken && getState().auth.user._id) {
    dispatch(actionToRun())
  } else {
    dispatch(push({
      pathname: '/login',
    }))
  }
}
