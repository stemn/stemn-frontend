import { produce } from 'immer'
import { setIn } from 'stemn-shared/redux/draft'

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'USERS/GET_USER_PENDING':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.userId, 'loading'], true)
      })
    case 'USERS/GET_USER_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.userId, 'loading'], false)
      })
    case 'USERS/GET_USER_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.userId], {
          loading: false,
          dataSize: action.meta.size,
          data: action.payload.data,
        })
      })

    case 'USERS/SAVE_USER_PENDING':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.userId, 'savePending'], true)
      })
    case 'USERS/SAVE_USER_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.userId, 'savePending'], false)
      })
    case 'USERS/SAVE_USER_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.userId, 'savePending'], false)
      })

    default:
      return state
  }
}
