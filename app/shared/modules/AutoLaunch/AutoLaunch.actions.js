export function toggle(status) {
  return {
    type: 'AUTO_LAUNCH/TOGGLE',
    payload: {},
    meta: {
      status: status
    }
  }
}
export function getStatus() {
  return {
    type: 'AUTO_LAUNCH/GET_STATUS',
    payload: {}
  }
}
