import { produce } from 'immer'

const initialState = {
  data: [],
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'NOTIFICATIONS/GET_NOTIFICATIONS_FULFILLED':
      return produce(state, (draft) => {
        draft.data = action.payload.data
      })

    case 'NOTIFICATIONS/MARK_AS_READ_PENDING': {
      const notifications = state.data
      const notificationIndex = notifications.findIndex(
        (notification) => notification._id === action.meta.notificationId,
      )
      const notification = Object.assign({}, notifications[notificationIndex], { read: true })
      const newNotifications = [
        ...notifications.slice(0, notificationIndex),
        notification,
        ...notifications.slice(notificationIndex + 1),
      ]
      return produce(state, (draft) => {
        draft.data = newNotifications
      })
    }
    case 'NOTIFICATIONS/MARK_AS_READ_REJECTED': {
      const notifications = state.data
      const notificationIndex = notifications.findIndex(
        (notification) => notification._id === action.meta.notificationId,
      )
      const notification = Object.assign({}, notifications[notificationIndex], { read: false })
      const newNotifications = [
        ...notifications.slice(0, notificationIndex),
        notification,
        ...notifications.slice(notificationIndex + 1),
      ]
      return produce(state, (draft) => {
        draft.data = newNotifications
      })
    }

    default:
      return state
  }
}
