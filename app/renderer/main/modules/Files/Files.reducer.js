import i from 'icepick'
const initialState = {
  fileData: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'FILES/GET_FILE_PENDING' :
      return i.assocIn(state, ['fileData', action.meta.cacheKey, 'loading'], true)
    case 'FILES/GET_FILE_REJECTED' :
      return i.assocIn(state, ['fileData', action.meta.cacheKey, 'loading'], false)
    case 'FILES/GET_FILE_FULFILLED' :
      return i.assocIn(state, ['fileData', action.meta.cacheKey], {
        data: action.payload.data,
        loading: false
      })

//    case 'FILES/GET_META_FULFILLED' :
//      return u({
//        [action.meta.cacheKey] : {
//          meta: action.payload.data
//        }
//      }, state);

    default:
        return state;
  }
}

