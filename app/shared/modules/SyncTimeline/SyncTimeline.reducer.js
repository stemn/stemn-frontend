import i from 'icepick'

const initialState = {

}

export default function (state = initialState, action) {
  switch (action.type) {
    case 'SELECT_TIMELINE_ITEM':
      return i.assocIn(state, [action.meta.cacheKey, 'selected'], action.payload.selected)
    case 'TIMELINE/FETCH_TIMELINE_PENDING':
      return i.assocIn(state, [action.meta.cacheKey, 'loading'], true)
    case 'TIMELINE/FETCH_TIMELINE_REJECTED':
      return i.assocIn(state, [action.meta.cacheKey, 'loading'], false)
    case 'TIMELINE/FETCH_TIMELINE_FULFILLED':
      return i.assocIn(state, [action.meta.cacheKey], {
        data: action.payload.data,
        loading: false
      })
    default:
      return state;
  }
}
