import u from 'updeep';
import i from 'icepick';
import { cloneDeep } from 'lodash';
import { modeled } from 'react-redux-form';
import { groupTasks } from './Tasks.utils.js';

const initialState = {
  data: {},
  projects: {},
}

const mainReducer = (state, action) => {
  switch (action.type) {
//    case 'TASKS/NEW_TASK_PENDING':
//      return u({
//        [action.meta.cacheKey] : {
//          newTaskLoading: true,
//        }
//      }, state)
//    case 'TASKS/NEW_TASK_REJECTED':
//      return u({
//        [action.meta.cacheKey] : {
//          newTaskLoading: false,
//        }
//      }, state)
    case 'TASKS/NEW_TASK_FULFILLED':
      return i.chain(state)
      .assocIn(['data', action.payload.data._id], action.payload.data)
      .assocIn(['boards', action.payload.data.data, 'newTaskString', action.payload.task.group], '')
      .updateIn(['boards', action.payload.data.data, 'data', 'groups'], (groups) => {
        const groupIndex = groups.findIndex((group)=>group._id == action.payload.data.group);
        const newArray = i.push(groups[groupIndex].tasks, action.payload.data._id);
        return i.assocIn(groups, [groupIndex, 'tasks'], newArray)
      })
      .value();

    case 'TASKS/GET_BOARD_PENDING':
      return i.assocIn(state, ['projects', action.meta.cacheKey, 'loading'], true);
    case 'TASKS/GET_BOARD_REJECTED':
      return i.assocIn(state, ['projects', action.meta.cacheKey, 'loading'], false);
    case 'TASKS/GET_BOARD_FULFILLED':
      return i.merge(state, {
        projects: {
          [action.meta.cacheKey] : {
            boards: [action.payload.data[0]._id],
            loading : false
          }
        },
        boards: {
          [action.payload.data[0]._id] : {
            data: action.payload.data[0]
          }
        }
      })

    case 'TASKS/GET_TASK_PENDING':
      return i.assocIn(state, ['data', action.meta.cacheKey, 'loading'], true);
    case 'TASKS/GET_TASK_REJECTED':
      return i.assocIn(state, ['data', action.meta.cacheKey, 'loading'], false);
    case 'TASKS/GET_TASK_FULFILLED':
      return i.assocIn(state, ['data', action.meta.cacheKey], {
        data: action.payload.data,
        loading: false
      })

    case 'TASKS/NEW_GROUP':
      return u({
        projects: {
          [action.meta.cacheKey] : {
            structure: (groups)=>addItem(groups, action.payload.group),
            newGroupString: ''
          }
        }
      }, state)

    case 'TASKS/DELETE_GROUP':
      return i.updateIn(state, ['projects', action.meta.cacheKey, 'structure'], (structure) => {
        const groupIndex = structure.findIndex((group) => group._id == action.payload.groupId); // Find the index of the group
        return i.splice(structure, groupIndex, 1) // Delete the group from the structure array
      })

//    case 'TASKS/MOVE_TASK':
//      return i.updateIn(state, ['boards', action.payload.boardId, 'data', 'groups'], (groups) => {
//        const taskFrom = getLocationIndex(groups, action.payload.dragItem.id);
//        let newStructure = null;
//        if(action.payload.hoverItem){ // We move the task to the hoverItem position
//          const taskTo   = getLocationIndex(groups, action.payload.hoverItem.id);
//          newStructure = moveTask(
//            groups,
//            taskFrom.groupIndex,
//            taskTo.groupIndex,
//            taskFrom.taskIndex,
//            taskTo.taskIndex
//          );
//        }
//        else if(action.payload.destinationGroup){ // The group is empty
//          newStructure = moveTask(
//            groups,
//            taskFrom.groupIndex,
//            getGroupIndex(groups, action.payload.destinationGroup),
//            taskFrom.taskIndex,
//            0 // Put it at the start of the group
//          );
//        }
//        return newStructure
//      })

    case 'TASKS/MOVE_TASK_PENDING':
      return i.updateIn(state, ['boards', action.meta.boardId, 'data', 'groups'], (groups) => {
        const taskFrom = getLocationIndex(groups, action.meta.task);
        let newStructure = null;
        if(action.meta.destinationTask){ // We move the task to the hoverItem position
          const taskTo   = getLocationIndex(groups, action.meta.destinationTask);
          newStructure = moveTask(
            groups,
            taskFrom.groupIndex,
            taskTo.groupIndex,
            taskFrom.taskIndex,
            taskTo.taskIndex
          );
        }
        else if(action.meta.destinationGroup){ // The group is empty
          newStructure = moveTask(
            groups,
            taskFrom.groupIndex,
            getGroupIndex(groups, action.meta.destinationGroup),
            taskFrom.taskIndex,
            0 // Put it at the start of the group
          );
        }
        return newStructure
      })
    case 'TASKS/MOVE_GROUP':
      const groupFrom = action.payload.dragItem.index;
      const groupTo   = action.payload.hoverItem.index;
      const newGroupStructure = moveGroup(state.boards[action.payload.boardId].data.groups, groupFrom, groupTo);
      return i.assocIn(state, ['boards', action.payload.boardId, 'data', 'groups'], newGroupStructure)
    case 'TASKS/BEGIN_DRAG':
      return i.assocIn(state, ['data', action.payload.taskId, 'isDragging'], true)
    case 'TASKS/END_DRAG':
      return i.assocIn(state, ['data', action.payload.taskId, 'isDragging'], false)

    default:
      return state;
  }
}

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////


function getLocationIndex(groups, id){
  // This will return the group and task index inside the structure object.
  let groupIndex = null;
  let taskIndex  = null;
  groupIndex = groups.findIndex((group, groupIndex) => {
    const foundTaskIndex = group.tasks.findIndex((taskId)=>{
      return taskId == id;
    })
    // If the task index is found, we return it
    if(foundTaskIndex != -1){
      taskIndex = foundTaskIndex;
      return true
    }
  })
  return {
    groupIndex,
    taskIndex
  }
}

function getGroupIndex(groups, groupId){
  return groups.findIndex((group)=>group._id == groupId)
}

function moveTask (groups, lastX, nextX, lastY, nextY) {
  const cloneItems = cloneDeep(groups);
  if (lastX === nextX) {
    cloneItems[lastX].tasks.splice(nextY, 0, cloneItems[lastX].tasks.splice(lastY, 1)[0]);
  } else {
    cloneItems[nextX].tasks.splice(nextY, 0, cloneItems[lastX].tasks[lastY]);  // move element to new place
    cloneItems[lastX].tasks.splice(lastY, 1); // delete element from old place
  }
  return cloneItems;
}


function moveGroup(groups, fromIndex, toIndex){
  const cloneItems = cloneDeep(groups);
  const t = cloneItems.splice(fromIndex, 1)[0];
  cloneItems.splice(toIndex, 0, t);
  return cloneItems;
}

function addItem (keyItems, item) {
  return [].concat(keyItems, [item])
}

export default function (state = initialState, action) {
  return modeled(mainReducer, 'tasks')(state, action)
}
