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

      const addTaskToStructure = (structure) => {
        const cloneStructure = cloneDeep(structure);
        const groupIndex = structure.findIndex((group)=>group._id == action.payload.task.group);
        cloneStructure[groupIndex].children.push({
          _id: action.payload.task._id
        })
        return cloneStructure
      }
      const addTaskToItems = (items) => {
        const cloneItems = cloneDeep(items);
        cloneItems[action.payload.task._id] = action.payload.task;
        return cloneItems
      }
      return u({
        [action.meta.cacheKey] : {
          items: addTaskToItems,
          structure: addTaskToStructure,
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
          groups: action.payload.response.data.groups,
          structure: action.payload.response.data.structure,
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
          structure: (groups)=>addItem(groups, action.payload.group),
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
          cloneItems[lastX].children.splice(nextY, 0, cloneItems[lastX].children.splice(lastY, 1)[0]);
        } else {
          cloneItems[nextX].children.splice(nextY, 0, cloneItems[lastX].children[lastY]);  // move element to new place
          cloneItems[lastX].children.splice(lastY, 1); // delete element from old place
        }
        return cloneItems;
      }
      return u({
        [action.meta.cacheKey] : {
          structure: moveTask,
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
          structure: moveGroup,
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
