var u = require('updeep');
const initialState = {

}
export default function (state = initialState, action) {
  switch (action.type) {
    case 'FILES/GET_FILE_PENDING' :
      return u({
        [action.meta.cacheKey] : {
          loading: true
        }
      }, state);
    case 'FILES/GET_FILE_FULFILLED' :
      return u({
        [action.meta.cacheKey] : {
          data: action.payload.data,
          loading: false
        }
      }, state);
    case 'FILES/GET_FILE_REJECTED' :
      return u({
        [action.meta.cacheKey] : {
          data: action.payload.data,
          loading: false
        }
      }, state);
    case 'FILES/GET_META_FULFILLED' :
      return u({
        [action.meta.cacheKey] : {
          meta: action.payload.data
        }
      }, state);
    default:
        return state;
  }
}

