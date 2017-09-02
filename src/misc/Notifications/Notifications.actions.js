export const show = ({ type, title, body }) => ({
  type: 'NOTIFICATIONS/SHOW',
  payload: {
    functionAlias: 'NotificationsUtils.show',
    functionInputs: {
      title,
      body,
    },
  },
})

export const getNotifications = () => (dispatch, getState) => {
  if (getState().auth.authToken) {
    dispatch({
      type: 'NOTIFICATIONS/GET_NOTIFICATIONS',
      http: true,
      payload: {
        url: '/api/v1/notifications',
        method: 'GET',
      },
    })
  }
}

export const markAsRead = notificationId => ({
  type: 'NOTIFICATIONS/MARK_AS_READ',
  http: true,
  payload: {
    url: `/api/v1/notifications/${notificationId}`,
    method: 'PUT',
  },
  meta: {
    notificationId,
  },
})
