import u from 'updeep';
import { cloneDeep } from 'lodash';
import { modeled } from 'react-redux-form';
import { groupTasks } from './Tasks.utils.js';

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
          items : groupTasks(action.payload.response.data.groups, action.payload.response.data.items),
        }
      }, state)


//    case 'TASKS/DELETE_TASK_PENDING':
//      return u({
//        [action.meta.cacheKey] : {
//          deleteTaskLoading: true,
//        }
//      }, state)
//    case 'TASKS/DELETE_TASK_FULFILLED':
//      return u({
//        [action.meta.cacheKey] : {
//          deleteTaskLoading: false,
//        }
//      }, state)
//    case 'TASKS/DELETE_TASK_REJECTED':
//      return u({
//        [action.meta.cacheKey] : {
//          deleteTaskLoading: false,
//        }
//      }, state)

    case 'TASKS/NEW_GROUP':
      return u({
        [action.meta.cacheKey] : {
          items: (groups)=>addItem(groups, action.payload.group),
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
      const moveTask = (items) =>{
        const { lastX, lastY, nextX, nextY } = action.payload;
        const cloneItems = cloneDeep(items);
        if (lastX === nextX) {
          cloneItems[lastX].cards.splice(nextY, 0, cloneItems[lastX].cards.splice(lastY, 1)[0]);
        } else {
          cloneItems[nextX].cards.splice(nextY, 0, cloneItems[lastX].cards[lastY]);  // move element to new place
          cloneItems[lastX].cards.splice(lastY, 1); // delete element from old place
        }
        return cloneItems;
      }
      return u({
        [action.meta.cacheKey] : {
          items: moveTask,
        }
      }, state)

    case 'TASKS/MOVE_GROUP':

      const moveGroup = (items) =>{
        const { lastX, nextX } = action.payload;
        const cloneItems = cloneDeep(items);
        const t = cloneItems.splice(lastX, 1)[0];
        cloneItems.splice(nextX, 0, t);
        return cloneItems;
      }
      return u({
        [action.meta.cacheKey] : {
          items: moveGroup,
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
