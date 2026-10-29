import { produce } from 'immer'
import { setIn } from 'stemn-shared/redux/draft'

const initialState = {}

export default function (state = initialState, action) {
  switch (action.type) {
    case 'RELATED_FIELDS/GET_RELATED_FIELDS_PENDING': {
      return produce(state, (draft) => {
        setIn(draft, [action.meta.fieldId, 'loading'], true)
      })
    }
    case 'RELATED_FIELDS/GET_RELATED_FIELDS_REJECTED': {
      return produce(state, (draft) => {
        setIn(draft, [action.meta.fieldId, 'loading'], true)
      })
    }
    case 'RELATED_FIELDS/GET_RELATED_FIELDS_FULFILLED': {
      return produce(state, (draft) => {
        setIn(draft, [action.meta.fieldId, 'loading'], false)
        setIn(draft, [action.meta.fieldId, 'data'], action.payload.data)
      })
    }

    default:
      return state
  }
}
