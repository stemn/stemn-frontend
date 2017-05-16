import { actions } from 'react-redux-form'

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
    url: `api/v1/settings/${getState().auth.user._id}`,
    method: 'PUT',
    data: getState().userSettings.data,
  },
})

export const completeOnboarding = () => actions.change('userSettings.messages.onboarding', false)
