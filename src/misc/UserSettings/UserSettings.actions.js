export const getSettings = () => ({
  type: 'USER_SETTINGS/GET_SETTINGS',
  http: true,
  payload: {
    url: 'api/v1/settings',
    method: 'GET',
  },
})

export const saveSettings = () => ({
  type: 'USER_SETTINGS/SAVE_SETTINGS',
  http: true,
  payload: {
    url: 'api/v1/settings',
    method: 'POST',
  },
})
