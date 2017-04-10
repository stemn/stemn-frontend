import i from 'icepick'

const initialState = {}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'NOTIFICATIONS/GET_NOTIFICATIONS_FULFILLED':
      return i.assocIn(state, ['data'], action.payload.data)

    case 'NOTIFICATIONS/MARK_AS_READ_PENDING':
      return i.assocIn(state, ['data', action.meta.notificationId], { read: true })
    case 'NOTIFICATIONS/MARK_AS_READ_REJECTED':
      return i.assocIn(state, ['data', action.meta.notificationId], { read: false })

    default:
      return state
  }
}
