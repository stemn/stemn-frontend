import { produce } from 'immer'
import { get } from 'lodash'
import { AnyAction } from 'redux'
import { setIn } from 'stemn-shared/redux/draft'

export interface ISyncTimelineState {
  [cacheKey: string]: {
    loading: boolean
    selected: any
    data: any[]
  }
}

const initialState: ISyncTimelineState = {}

export const syncTimelineReducer = (state: ISyncTimelineState = initialState, action: AnyAction) => {
  switch (action.type) {
    case 'TIMELINE/SELECT_ITEM':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'selected'], action.payload.selected)
      })
    case 'TIMELINE/DESELECT_ITEM':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'selected'], {})
      })

    case 'TIMELINE/FETCH_TIMELINE_PENDING':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'loading'], true)
      })
    case 'TIMELINE/FETCH_TIMELINE_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'loading'], false)
      })
    case 'TIMELINE/FETCH_TIMELINE_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'data'], action.payload.data)
        setIn(draft, [action.meta.cacheKey, 'loading'], false)
      })

    case 'TIMELINE/ADD_EVENT': {
      const events: any[] = get(state, [action.payload.cacheKey, 'data']) || []
      return produce(state, (draft) => {
        setIn(draft, [action.payload.cacheKey, 'data'], [...events, action.payload.event])
      })
    }
    case 'TIMELINE/DELETE_EVENT':
      return produce(state, (draft) => {
        const events: any[] = get(draft, [action.payload.cacheKey, 'data'])
        const eventIndex = events.findIndex((event) => event._id === action.payload.eventId)
        if (eventIndex !== -1) events.splice(eventIndex, 1)
      })

    default:
      return state
  }
}
