import u from 'updeep';
import { clone } from 'lodash';
import { modeled } from 'react-redux-form';

const initialState = {

}

const mainReducer = (state, action) => {
  switch (action.type) {


//    case 'TASKS/NEW_TASK_PENDING':
//      return u({
//        [action.meta.cacheKey] : {
//          newTaskLoading: true,
//        }
//      }, state)
//    case 'TASKS/NEW_TASK_FULFILLED':
//      return u({
//        [action.meta.cacheKey] : {
//          newTaskLoading: false,
//        }
//      }, state)
//    case 'TASKS/NEW_TASK_REJECTED':
//      return u({
//        [action.meta.cacheKey] : {
//          newTaskLoading: false,
//        }
//      }, state)

    case 'TASKS/NEW_TASK':
      return u({
        [action.meta.cacheKey] : {
          items: (items)=>addItem(items, action.payload.task),
          newTaskString: {
            [action.payload.task.group] : ''
          }
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

    case 'TASKS/NEW_GROUP':
      return u({
        [action.meta.cacheKey] : {
          groups: (groups)=>addItem(groups, action.payload.group),
          newGroupString: ''
        }
      }, state)

    case 'TASKS/DELETE_GROUP':
      return u({
        [action.meta.cacheKey] : {
          deleteTaskLoading: false,
        }
      }, state)


    case 'TASKS/MOVE_TASK':
      const move = (items) =>{
        const fromIndex = items.findIndex((item)=>item._id == action.payload.taskId);
        const toIndex = items.findIndex((item)=>item._id == action.payload.beforeId);
        const itemsClone = clone(items);
        const movedItems = moveItem(itemsClone, fromIndex, toIndex);
        return  [
          ...movedItems.slice(0, toIndex),
          u({group: action.payload.group}, movedItems[index]),
          ...movedItems.slice(toIndex + 1)
        ]
      }
      return u({
        [action.meta.cacheKey] : {
          items: move,
        }
      }, state)

    default:
      return state;
  }
}


function moveItem (array, fromIndex, toIndex) {
  array.splice(toIndex, 0, array.splice(fromIndex, 1)[0] );
  return array;
}

function addItem (keyItems, item) {
  return [].concat(keyItems, [item])
}

export default function (state = initialState, action) {
  return modeled(mainReducer, 'tasks')(state, action)
}
