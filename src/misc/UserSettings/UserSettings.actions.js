export const getSettings = () => ({
  type: 'USER_SETTINGS/GET_SETTINGS',
  http: true,
  payload: {
    url: 'api/v1/settings',
    method: 'GET',
  },
})

export const saveSettings = () => (dispatch, getState) => dispatch({
  type: 'USER_SETTINGS/SAVE_SETTINGS',
  http: true,
  payload: {
    url: 'api/v1/settings',
    method: 'POST',
    data: getState().userSettings.data,
  },
})
