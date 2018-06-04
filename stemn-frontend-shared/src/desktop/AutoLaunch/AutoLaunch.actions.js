export function toggle({ value }) {
  return {
    type: 'AUTO_LAUNCH/TOGGLE',
    payload: {},
    meta: {
      status: value,
    },
  }
}
export function getStatus() {
  return {
    type: 'AUTO_LAUNCH/GET_STATUS',
    payload: {},
  }
}
