export const show = ({ type, title, body }) => ({
  type: 'NOTIFICATIONS/SHOW',
  payload: {
    functionAlias: 'NotificationsUtils.show',
    functionInputs: {
      title, body
    }
  }
})

export const getNotifications = () => ({
  type: 'NOTIFICATIONS/GET_NOTIFICATIONS',
  http: true,
  payload: {
    url: '/api/v1/notifications',
    method: 'GET',
    data: reaction
  }
})
