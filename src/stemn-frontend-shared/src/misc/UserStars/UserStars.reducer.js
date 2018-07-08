import i from 'icepick'

const initialState = {
/** *******************************************
This reducer store paginated star data for
every user.

  [userId] : {
    1: [projectId, projectId]
    2: [projectId, projectId]
  }

******************************************** */
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'USER_STARS/GET_STARS_PENDING':
      return i.assocIn(state, [action.meta.userId, action.meta.page, 'loading'], true)
    case 'USER_STARS/GET_STARS_REJECTED':
      return i.assocIn(state, [action.meta.userId, action.meta.page, 'loading'], false)
    case 'USER_STARS/GET_STARS_FULFILLED':
      return i.assocIn(state, [action.meta.userId, action.meta.page], {
        loading: false,
        data: action.payload.data,
      })

    default:
      return state
  }
}
