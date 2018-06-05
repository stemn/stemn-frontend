import { storeChange } from 'stemn-shared/misc/Store/Store.actions'

export const getSettings = () => ({
  type: 'USER_SETTINGS/GET_SETTINGS',
  http: true,
  payload: {
    url: 'api/v1/settings',
    method: 'GET',
  },
})

export const togglePreviewMarkdown = () => ({
  type: 'USER_SETTINGS/TOGGLE_PREVIEW_MARKDOWN',
  payload: {},
})

export const saveSettings = () => (dispatch, getState) => dispatch({
  type: 'USER_SETTINGS/SAVE_SETTINGS',
  http: true,
  payload: {
    url: `api/v1/settings/${getState().auth.user._id}`,
    method: 'PUT',
    data: getState().userSettings.data,
  },
})

export const completeOnboarding = () => storeChange('userSettings.data.messages.onboarding', false)
