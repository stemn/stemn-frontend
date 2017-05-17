import i from 'icepick'
import { cloneDeep, has } from 'lodash'
import { modeled } from 'react-redux-form'

const initialState = {
  data: {},
  projects: {},
  events: {},
  boards: {
    /********************************
    boardId: {
      data: {the board data},
      newThread: {

      }
      forms: {}
      searchString: 'Some search string'
      layout: 'board' || 'list'
      loading: true || false
    }
    ********************************/
  }
}

const mainReducer = (state, action) => {
  switch (action.type) {
    case 'TASKS/NEW_TASK_FULFILLED':
      return i.chain(state)
      .assocIn(['data', action.payload.data._id, 'data'], action.payload.data) // Add to data
      .assocIn(['boards', action.payload.data.board, 'newTaskString', action.payload.data.group], '') // Clear string
      .updateIn(['boards', action.payload.data.board, 'data', 'groups'], (groups) => { // Add to groups.tasks array
        const groupIndex = groups.findIndex((group) => group._id === action.payload.data.group)
        return i.updateIn(groups, [groupIndex, 'tasks'], (tasks) => i.push(tasks, action.payload.data._id))
      })
      .value()

    case 'TASKS/GET_BOARDS_PENDING':
      return i.assocIn(state, ['projects', action.meta.cacheKey, 'loading'], true)
    case 'TASKS/GET_BOARDS_REJECTED':
      return i.assocIn(state, ['projects', action.meta.cacheKey, 'loading'], false)
    case 'TASKS/GET_BOARDS_FULFILLED':
      if (has(action, 'payload.data[0]._id')) {
        return i.merge(state, {
          projects: {
            [action.meta.cacheKey]: {
              boards: [action.payload.data[0]._id],
              loading: false
            }
          },
          boards: {
            [action.payload.data[0]._id]: {
              data: action.payload.data[0]
            }
          }
        })
      } else {
        return i.assocIn(state, ['projects', action.meta.cacheKey], {
          boards: [],
          loading: false
        })
      }

    case 'TASKS/GET_BOARD_PENDING':
      return i.assocIn(state, ['boards', action.meta.cacheKey, 'loading'], true)
    case 'TASKS/GET_BOARD_REJECTED':
      return i.assocIn(state, ['boards', action.meta.cacheKey, 'loading'], false)
    case 'TASKS/GET_BOARD_FULFILLED':
      return i.chain(state)
      .assocIn(['boards', action.meta.cacheKey, 'loading'], true)
      .assocIn(['boards', action.meta.cacheKey, 'data'], action.payload.data)
      .value()

    case 'TASKS/GET_GROUP_FULFILLED':
      return i.updateIn(state, ['boards', action.meta.boardId, 'data', 'groups'], (groups) => {
        const groupsIndex = groups.findIndex(group => group._id === action.payload.data._id)
        return i.assoc(groups, groupsIndex, action.payload.data)
      })

    case 'TASKS/GET_TASK_PENDING':
      return i.assocIn(state, ['data', action.meta.cacheKey, 'loading'], true)
    case 'TASKS/GET_TASK_REJECTED':
      return i.assocIn(state, ['data', action.meta.cacheKey, 'loading'], false)
    case 'TASKS/GET_TASK_FULFILLED':
      return i.assocIn(state, ['data', action.meta.cacheKey], {
        data: action.payload.data,
        loading: false
      })

    case 'TASKS/GET_EVENTS_PENDING':
      return i.assocIn(state, ['events', action.meta.cacheKey, 'loading'], true)
    case 'TASKS/GET_EVENTS_REJECTED':
      return i.assocIn(state, ['events', action.meta.cacheKey, 'loading'], false)
    case 'TASKS/GET_EVENTS_FULFILLED':
      return i.assocIn(state, ['events', action.meta.cacheKey], {
        data: action.payload.data,
        loading: false
      })
    case 'TASKS/NEW_EVENT':
      return i.updateIn(state, ['events', action.payload.taskId, 'data'], events => {
        return i.push(events, action.payload.event)
      })

    case 'TASKS/DELETE_EVENT':
      return i.updateIn(state, ['events', action.payload.taskId, 'data'], events => {
        const eventIndex = events.findIndex(event => event._id === action.payload.eventId)
        return eventIndex !== -1 ? i.splice(events, eventIndex, 1) : events
      })

    case 'TASKS/UPDATE_BOARD_PENDING':
      return i.assocIn(state, ['boards', action.meta.cacheKey, 'savePending'], true)
    case 'TASKS/UPDATE_BOARD_REJECTED':
      return i.assocIn(state, ['boards', action.meta.cacheKey, 'savePending'], false)
    case 'TASKS/UPDATE_BOARD_FULFILLED':
      return i.chain(state)
        .assocIn(['boards', action.meta.cacheKey, 'savePending'], false)
        .assocIn(['boards', action.meta.cacheKey, 'data'], action.payload.data)
        .value()

    case 'TASKS/NEW_GROUP_FULFILLED':
      return i.chain(state)
      // Reset the newGroupString to empty
      .assocIn(['boards', action.meta.boardId, 'newGroupString'], '')
      // Push the new group onto the groups array
      .updateIn(['boards', action.meta.boardId, 'data', 'groups'], (groups) => i.push(groups, action.payload.data))
      .value()

    case 'TASKS/DELETE_GROUP_FULFILLED':
      return i.updateIn(state, ['boards', action.meta.boardId, 'data', 'groups'], (groups) => {
        const groupIndex = groups.findIndex((group) => group._id === action.meta.groupId) // Find the index of the group
        return i.splice(groups, groupIndex, 1) // Delete the group from the groups array
      })

    case 'TASKS/DELETE_TASK_FULFILLED':
      return i.chain(state)
      .assocIn(['data', action.meta.taskId], undefined)
      .updateIn(['boards', action.meta.boardId, 'data', 'groups'], (groups) => {
        const location = getLocationIndex(groups, action.meta.taskId)
        return i.updateIn(groups, [location.groupIndex, 'tasks'], (tasks) => i.splice(tasks, location.taskIndex, 1))
      })
      .value()

    case 'TASKS/MOVE_TASK':
      return i.chain(state)
      .assocIn(['data', action.payload.task, 'data', 'group'], action.payload.destinationGroup)    // Update the group property
      .updateIn(['boards', action.payload.boardId, 'data', 'groups'], (groups) => {                // Move the task in the groups array
        const from = getLocationIndex(groups, action.payload.task)
        const to = action.payload.destinationTask ? getLocationIndex(groups, action.payload.destinationTask) : {groupIndex: getGroupIndex(groups, action.payload.destinationGroup), taskIndex: 0}
        return moveTask({
          groups: groups,
          lastX: from.groupIndex,
          nextX: to.groupIndex,
          lastY: from.taskIndex,
          nextY: to.taskIndex
        })
      })
      .value()
    case 'TASKS/MOVE_TASK_FULFILLED':
      return state

    case 'TASKS/MOVE_GROUP':
      return i.updateIn(state, ['boards', action.payload.boardId, 'data', 'groups'], (groups) => {
        const groupFrom = groups.findIndex((group) => group._id === action.payload.group)
        const groupTo = groups.findIndex((group) => group._id === action.payload.destinationGroup)
        return moveGroup(groups, groupFrom, groupTo)
      })

    case 'TASKS/BEGIN_DRAG':
      return i.assocIn(state, ['data', action.payload.taskId, 'isDragging'], true)
    case 'TASKS/END_DRAG':
      return i.assocIn(state, ['data', action.payload.taskId, 'isDragging'], false)

    case 'TASKS/CHANGE_LAYOUT':
      return i.assocIn(state, ['boards', action.payload.boardId, 'layout'], action.payload.layout)

    default:
      return state
  }
}

function getLocationIndex(groups, id) {
  // This will return the group and task index inside the structure object.
  let groupIndex = null
  let taskIndex = null
  groupIndex = groups.findIndex((group, groupIndex) => {
    const foundTaskIndex = group.tasks.findIndex((taskId) => taskId === id)
    // If the task index is found, we return it
    if (foundTaskIndex !== -1) {
      taskIndex = foundTaskIndex
      return true
    }
  })
  return {
    groupIndex,
    taskIndex
  }
}

function getGroupIndex(groups, groupId) {
  return groups.findIndex((group) => group._id === groupId)
}

function moveTask ({groups, lastX, nextX, lastY, nextY}) {
  const cloneItems = cloneDeep(groups)
  if (lastX === nextX) {
    cloneItems[lastX].tasks.splice(nextY, 0, cloneItems[lastX].tasks.splice(lastY, 1)[0])
  } else {
    cloneItems[nextX].tasks.splice(nextY, 0, cloneItems[lastX].tasks[lastY])  // move element to new place
    cloneItems[lastX].tasks.splice(lastY, 1) // delete element from old place
  }
  return cloneItems
}


function moveGroup(groups, fromIndex, toIndex) {
  const cloneItems = cloneDeep(groups)
  const t = cloneItems.splice(fromIndex, 1)[0]
  cloneItems.splice(toIndex, 0, t)
  return cloneItems
}

function addItem (keyItems, item) {
  return [].concat(keyItems, [item])
}

export default function (state = initialState, action) {
  if (!state.hydrated) {
    state = { ...initialState, ...state, hydrated: true }
  }
  return modeled(mainReducer, 'tasks')(state, action)
}
