export function toggle() {
  return (dispatch, getState) => {
    dispatch({
      type: 'AUTO_LAUNCH/TOGGLE',
      payload: {},
      meta: {
        status: !getState().autoLaunch.status
      }
    })
  }
}
export function getStatus() {
  return {
    type: 'AUTO_LAUNCH/GET_STATUS',
    payload: {}
  }
}
