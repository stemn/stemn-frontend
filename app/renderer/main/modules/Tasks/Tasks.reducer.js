import u from 'updeep';
import { modeled } from 'react-redux-form';

const initialState = {

}

const mainReducer = (state, action) => {
  switch (action.type) {


    case 'TASKS/NEW_TASK_PENDING':
      return u({
        [action.meta.cacheKey] : {
          newTaskLoading: true,
        }
      }, state)
    case 'TASKS/NEW_TASK_FULFILLED':
      return u({
        [action.meta.cacheKey] : {
          newTaskLoading: false,
        }
      }, state)
    case 'TASKS/NEW_TASK_REJECTED':
      return u({
        [action.meta.cacheKey] : {
          newTaskLoading: false,
        }
      }, state)


//    case 'TASKS/GET_TASKS_PENDING':
//      return u({
//        [action.meta.cacheKey] : {
//          loading : true
//        }
//      }, state)
//    case 'TASKS/GET_TASKS_FULFILLED':
//      return u({
//        [action.meta.cacheKey] : {
//          data: action.payload.data,
//          loading : false
//        }
//      }, state)
//    case 'TASKS/GET_TASKS_REJECTED':
//      return u({
//        [action.meta.cacheKey] : {
//          loading : false
//        }
//      }, state)

    case 'TASKS/GET_TASKS':
      return u({
        [action.meta.cacheKey] : {
          items : action.payload.response.data.items,
          groups : action.payload.response.data.groups,
        }
      }, state)


    case 'TASKS/DELETE_TASK_PENDING':
      return u({
        [action.meta.cacheKey] : {
          deleteTaskLoading: true,
        }
      }, state)
    case 'TASKS/DELETE_TASK_FULFILLED':
      return u({
        [action.meta.cacheKey] : {
          deleteTaskLoading: false,
        }
      }, state)
    case 'TASKS/DELETE_TASK_REJECTED':
      return u({
        [action.meta.cacheKey] : {
          deleteTaskLoading: false,
        }
      }, state)
    default:
      return state;
  }
}

export default function (state = initialState, action) {
  return modeled(mainReducer, 'tasks')(state, action)
}
