import i from 'icepick'
import { cloneDeep, has } from 'lodash'

const initialState = {
  data: {},
  projects: {},
  //  events: {},
  boards: {
    /** ******************************
    boardId: {
      data: {the board data},
      newThread: {

      }
      forms: {}
      searchString: 'Some search string'
      layout: 'board' || 'list'
      loading: true || false
    }
    ******************************* */
  },
}

const mainReducer = (state, action) => {
  switch (action.type) {
    case 'THREADS/NEW_TASK_FULFILLED':
      return i.chain(state)
        .assocIn(['data', action.payload.data._id, 'data'], action.payload.data) // Add to data
        .assocIn(['boards', action.payload.data.board, 'newThreadString', action.payload.data.group], '') // Clear string
        .updateIn(['boards', action.payload.data.board, 'data', 'groups'], (groups) => { // Add to groups.threads array
          const groupIndex = groups.findIndex(group => group._id === action.payload.data.group)
          return i.updateIn(groups, [groupIndex, 'threads'], threads => i.push(threads, action.payload.data._id))
        })
        .value()

    case 'THREADS/GET_BOARDS_PENDING':
      return i.assocIn(state, ['projects', action.meta.cacheKey, 'loading'], true)
    case 'THREADS/GET_BOARDS_REJECTED':
      return i.assocIn(state, ['projects', action.meta.cacheKey, 'loading'], false)
    case 'THREADS/GET_BOARDS_FULFILLED':
      if (has(action, 'payload.data[0]._id')) {
        return i.merge(state, {
          projects: {
            [action.meta.cacheKey]: {
              boards: [action.payload.data[0]._id],
              loading: false,
            },
          },
          boards: {
            [action.payload.data[0]._id]: {
              data: action.payload.data[0],
            },
          },
        })
      } 
      return i.assocIn(state, ['projects', action.meta.cacheKey], {
        boards: [],
        loading: false,
      })
      

    case 'THREADS/GET_BOARD_PENDING':
      return i.assocIn(state, ['boards', action.meta.cacheKey, 'loading'], true)
    case 'THREADS/GET_BOARD_REJECTED':
      return i.assocIn(state, ['boards', action.meta.cacheKey, 'loading'], false)
    case 'THREADS/GET_BOARD_FULFILLED':
      return i.chain(state)
        .assocIn(['boards', action.meta.cacheKey, 'loading'], true)
        .assocIn(['boards', action.meta.cacheKey, 'data'], action.payload.data)
        .value()

    case 'THREADS/GET_GROUP_FULFILLED':
      return i.updateIn(state, ['boards', action.meta.boardId, 'data', 'groups'], (groups) => {
        const groupsIndex = groups.findIndex(group => group._id === action.payload.data._id)
        return i.assoc(groups, groupsIndex, action.payload.data)
      })

    case 'THREADS/GET_TASK_PENDING':
      return i.assocIn(state, ['data', action.meta.cacheKey, 'loading'], true)
    case 'THREADS/GET_TASK_REJECTED':
      return i.assocIn(state, ['data', action.meta.cacheKey], {
        error: action.payload.data.error,
        loading: false,
      })
    case 'THREADS/GET_TASK_FULFILLED':
      return i.assocIn(state, ['data', action.meta.cacheKey], {
        data: action.payload.data,
        loading: false,
      })

      //    case 'THREADS/GET_EVENTS_PENDING':
      //      return i.assocIn(state, ['events', action.meta.cacheKey, 'loading'], true)
      //    case 'THREADS/GET_EVENTS_REJECTED':
      //      return i.assocIn(state, ['events', action.meta.cacheKey, 'loading'], false)
      //    case 'THREADS/GET_EVENTS_FULFILLED':
      //      return i.assocIn(state, ['events', action.meta.cacheKey], {
      //        data: action.payload.data,
      //        loading: false
      //      })
      //    case 'THREADS/NEW_EVENT':
      //      return i.updateIn(state, ['events', action.payload.threadId, 'data'], events => {
      //        return i.push(events, action.payload.event)
      //      })
      //    case 'THREADS/DELETE_EVENT':
      //      return i.updateIn(state, ['events', action.payload.threadId, 'data'], events => {
      //        const eventIndex = events.findIndex(event => event._id === action.payload.eventId)
      //        return eventIndex !== -1 ? i.splice(events, eventIndex, 1) : events
      //      })

    case 'THREADS/UPDATE_BOARD_PENDING':
      return i.assocIn(state, ['boards', action.meta.cacheKey, 'savePending'], true)
    case 'THREADS/UPDATE_BOARD_REJECTED':
      return i.assocIn(state, ['boards', action.meta.cacheKey, 'savePending'], false)
    case 'THREADS/UPDATE_BOARD_FULFILLED':
      return i.chain(state)
        .assocIn(['boards', action.meta.cacheKey, 'savePending'], false)
        .assocIn(['boards', action.meta.cacheKey, 'data'], action.payload.data)
        .value()

    case 'THREADS/NEW_GROUP_FULFILLED':
      return i.chain(state)
      // Reset the newGroupString to empty
        .assocIn(['boards', action.meta.boardId, 'newGroupString'], '')
      // Push the new group onto the groups array
        .updateIn(['boards', action.meta.boardId, 'data', 'groups'], groups => i.push(groups, action.payload.data))
        .value()

    case 'THREADS/DELETE_GROUP_FULFILLED':
      return i.updateIn(state, ['boards', action.meta.boardId, 'data', 'groups'], (groups) => {
        const groupIndex = groups.findIndex(group => group._id === action.meta.groupId) // Find the index of the group
        return i.splice(groups, groupIndex, 1) // Delete the group from the groups array
      })

    case 'THREADS/DELETE_TASK_FULFILLED':
      return i.chain(state)
        .assocIn(['data', action.meta.threadId], undefined)
        .updateIn(['boards', action.meta.boardId, 'data', 'groups'], (groups) => {
          const location = getLocationIndex(groups, action.meta.threadId)
          return i.updateIn(groups, [location.groupIndex, 'threads'], threads => i.splice(threads, location.threadIndex, 1))
        })
        .value()

    case 'THREADS/MOVE_TASK':
      return i.chain(state)
        .assocIn(['data', action.payload.thread, 'data', 'group'], action.payload.destinationGroup)    // Update the group property
        .updateIn(['boards', action.payload.boardId, 'data', 'groups'], (groups) => {                // Move the thread in the groups array
          const from = getLocationIndex(groups, action.payload.thread)
          const to = action.payload.destinationThread ? getLocationIndex(groups, action.payload.destinationThread) : { groupIndex: getGroupIndex(groups, action.payload.destinationGroup), threadIndex: 0 }
          return moveThread({
            groups,
            lastX: from.groupIndex,
            nextX: to.groupIndex,
            lastY: from.threadIndex,
            nextY: to.threadIndex,
          })
        })
        .value()
    case 'THREADS/MOVE_TASK_FULFILLED':
      return state

    case 'THREADS/MOVE_GROUP':
      return i.updateIn(state, ['boards', action.payload.boardId, 'data', 'groups'], (groups) => {
        const groupFrom = groups.findIndex(group => group._id === action.payload.group)
        const groupTo = groups.findIndex(group => group._id === action.payload.destinationGroup)
        return moveGroup(groups, groupFrom, groupTo)
      })

    case 'THREADS/BEGIN_DRAG':
      return i.assocIn(state, ['data', action.payload.threadId, 'isDragging'], true)
    case 'THREADS/END_DRAG':
      return i.assocIn(state, ['data', action.payload.threadId, 'isDragging'], false)

    case 'THREADS/CHANGE_LAYOUT':
      return i.assocIn(state, ['boards', action.payload.boardId, 'layout'], action.payload.layout)

    default:
      return state
  }
}

function getLocationIndex(groups, id) {
  // This will return the group and thread index inside the structure object.
  let groupIndex = null
  let threadIndex = null
  groupIndex = groups.findIndex((group, groupIndex) => {
    const foundThreadIndex = group.threads.findIndex(threadId => threadId === id)
    // If the thread index is found, we return it
    if (foundThreadIndex !== -1) {
      threadIndex = foundThreadIndex
      return true
    }
  })
  return {
    groupIndex,
    threadIndex,
  }
}

function getGroupIndex(groups, groupId) {
  return groups.findIndex(group => group._id === groupId)
}

function moveThread({ groups, lastX, nextX, lastY, nextY }) {
  const cloneItems = cloneDeep(groups)
  if (lastX === nextX) {
    cloneItems[lastX].threads.splice(nextY, 0, cloneItems[lastX].threads.splice(lastY, 1)[0])
  } else {
    cloneItems[nextX].threads.splice(nextY, 0, cloneItems[lastX].threads[lastY])  // move element to new place
    cloneItems[lastX].threads.splice(lastY, 1) // delete element from old place
  }
  return cloneItems
}


function moveGroup(groups, fromIndex, toIndex) {
  const cloneItems = cloneDeep(groups)
  const t = cloneItems.splice(fromIndex, 1)[0]
  cloneItems.splice(toIndex, 0, t)
  return cloneItems
}

function addItem(keyItems, item) {
  return [].concat(keyItems, [item])
}

export default function (state = initialState, action) {
  if (!state.hydrated) {
    state = { ...initialState, ...state, hydrated: true }
  }
  return mainReducer(state, action)
}
