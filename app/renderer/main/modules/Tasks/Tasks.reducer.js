import u from 'updeep';
import i from 'icepick';
import { cloneDeep } from 'lodash';
import { modeled } from 'react-redux-form';
import { groupTasks } from './Tasks.utils.js';

const initialState = {
  data: {},
  projects: {}
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
      return i.merge(state, {
        data: addTaskToData(state.data, action.payload.task),
        projects : {
          [action.meta.cacheKey] : {
            structure: addTaskToStructure(state.projects[action.meta.cacheKey].structure, action.payload.task),
            newTaskString: {
              [action.payload.task.group] : ''
            }
          }
        }
      });



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
        data: action.payload.response.data.items,
        projects: {
          [action.meta.cacheKey] : {
            structure: action.payload.response.data.structure,
          }
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
        projects: {
          [action.meta.cacheKey] : {
            structure: (groups)=>addItem(groups, action.payload.group),
            newGroupString: ''
          }
        }
      }, state)

    case 'TASKS/DELETE_GROUP':
      return u({
        projects: {
          [action.meta.cacheKey] : {
            deleteTaskLoading: false,
          }
        }
      }, state)


//    case 'TASKS/MOVE_TASK':
//      return u({
//        projects: {
//          [action.meta.cacheKey] : {
//            structure: moveTask,
//          }
//        }
//      }, state)
//
//    case 'TASKS/MOVE_GROUP':
//      const moveGroup = (items) =>{
//        const { lastX, nextX } = action.payload;
//        const cloneItems = cloneDeep(items);
//        const t = cloneItems.splice(lastX, 1)[0];
//        cloneItems.splice(nextX, 0, t);
//        return cloneItems;
//      }
//      return u({
//        projects: {
//          [action.meta.cacheKey] : {
//            structure: moveGroup,
//          }
//        }
//      }, state)


    case 'TASKS/MOVE_TASK':
      const taskFrom = getLocationIndex(state.projects[action.meta.cacheKey].structure, action.payload.dragItem.id);
      let newStructure = null;
      if(action.payload.destinationGroup){
        // The group is empty
        newStructure = moveTask(
          state.projects[action.meta.cacheKey].structure,
          taskFrom.groupIndex,
          getGroupIndex(state.projects[action.meta.cacheKey].structure, action.payload.destinationGroup),
          taskFrom.taskIndex,
          0 // Put it at the start of the group
        );
      }
      else if(action.payload.hoverItem){
        // We move the task to the hoverItem position
        const taskTo   = getLocationIndex(state.projects[action.meta.cacheKey].structure, action.payload.hoverItem.id);
        newStructure = moveTask(
          state.projects[action.meta.cacheKey].structure,
          taskFrom.groupIndex,
          taskTo.groupIndex,
          taskFrom.taskIndex,
          taskTo.taskIndex
        );
      }
      return i.merge(state, {
        projects: {
          [action.meta.cacheKey] : {
            structure: newStructure
          }
        }
      })
    case 'TASKS/MOVE_GROUP':
      const groupFrom = action.payload.dragItem.index;
      const groupTo   = action.payload.hoverItem.index;
      const newGroupStructure = moveGroup(state.projects[action.meta.cacheKey].structure, groupFrom, groupTo);
      return i.merge(state, {
        projects: {
          [action.meta.cacheKey] : {
            structure: newGroupStructure
          }
        }
      })
      return state
    case 'TASKS/BEGIN_DRAG':
      return i.merge(state, {
        data: {
          [action.payload.taskId] : {
            isDragging: true
          }
        }
      })
    case 'TASKS/END_DRAG':
      return i.merge(state, {
        data: {
          [action.payload.taskId] : {
            isDragging: false
          }
        }
      })
    default:
      return state;
  }
}

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function addTaskToStructure(structure, task) {
  const groupIndex = structure.findIndex((group)=>group._id == task.group);
  const newArray = i.push(structure[groupIndex].children, { _id: task._id }); // Push the task onto the child array
  return i.assocIn(structure, [groupIndex, 'children'], newArray)
}

function addTaskToData(data, task) {
  return i.assoc(data, task._id, task)
}

function getLocationIndex(groups, id){
  // This will return the group and task index inside the structure object.
  let groupIndex = null;
  let taskIndex  = null;
  groupIndex = groups.findIndex((group, groupIndex) => {
    const foundTaskIndex = group.children.findIndex((task)=>{
      return task._id == id;
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
    cloneItems[lastX].children.splice(nextY, 0, cloneItems[lastX].children.splice(lastY, 1)[0]);
  } else {
    cloneItems[nextX].children.splice(nextY, 0, cloneItems[lastX].children[lastY]);  // move element to new place
    cloneItems[lastX].children.splice(lastY, 1); // delete element from old place
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
