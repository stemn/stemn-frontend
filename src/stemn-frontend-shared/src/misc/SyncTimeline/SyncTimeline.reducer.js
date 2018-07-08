import i from 'icepick'

const initialState = {
  /** **********************************************
  [ cacheKey ] : {
    loading: false,
    selected: {},
    data: [ array of data ]
  }
  *********************************************** */
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'TIMELINE/SELECT_ITEM':
      return i.assocIn(state, [action.meta.cacheKey, 'selected'], action.payload.selected)
    case 'TIMELINE/DESELECT_ITEM':
      return i.assocIn(state, [action.meta.cacheKey, 'selected'], {})

    case 'TIMELINE/FETCH_TIMELINE_PENDING':
      return i.assocIn(state, [action.meta.cacheKey, 'loading'], true)
    case 'TIMELINE/FETCH_TIMELINE_REJECTED':
      return i.assocIn(state, [action.meta.cacheKey, 'loading'], false)
    case 'TIMELINE/FETCH_TIMELINE_FULFILLED':
      return i.chain(state)
        .assocIn([action.meta.cacheKey, 'data'], action.payload.data)
        .assocIn([action.meta.cacheKey, 'loading'], false)
        .value()

    case 'TIMELINE/ADD_EVENT':
      return i.updateIn(state, [action.payload.cacheKey, 'data'], events => i.push(events || [], action.payload.event))
    case 'TIMELINE/DELETE_EVENT':
      return i.updateIn(state, [action.payload.cacheKey, 'data'], (events) => {
        const eventIndex = events.findIndex(event => event._id === action.payload.eventId)
        return eventIndex !== -1 ? i.splice(events, eventIndex, 1) : events
      })

    default:
      return state
  }
}
