import i from 'icepick'

const initialState = {
  data: [],
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'NOTIFICATIONS/GET_NOTIFICATIONS_FULFILLED':
      return i.assocIn(state, ['data'], action.payload.data)

    case 'NOTIFICATIONS/MARK_AS_READ_PENDING': {
      const notifications = state.data
      const notificationIndex = notifications.findIndex(notification => notification._id === action.meta.notificationId)
      const notification = Object.assign({}, notifications[notificationIndex], { read: true })
      const newNotifications = [...notifications.slice(0, notificationIndex), notification, ...notifications.slice(notificationIndex + 1)]
      return i.assocIn(state, ['data'], newNotifications)
    }
    case 'NOTIFICATIONS/MARK_AS_READ_REJECTED': {
      const notifications = state.data
      const notificationIndex = notifications.findIndex(notification => notification._id === action.meta.notificationId)
      const notification = Object.assign({}, notifications[notificationIndex], { read: false })
      const newNotifications = [...notifications.slice(0, notificationIndex), notification, ...notifications.slice(notificationIndex + 1)]
      return i.assocIn(state, ['data'], newNotifications)
    }

    default:
      return state
  }
}
