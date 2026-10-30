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
    case 'TIMELINE/FETCH_TIMELINE_FULFILLED': {
      const fetched = action.payload.data
      // Comment events the app added (addEvent, `local`) that the fetched timeline does not list yet: the API
      // serves timelines stale-while-revalidate, so a fetch right after posting can miss the new comment
      const previous: any[] = get(state, [action.meta.cacheKey, 'data']) || []
      const listed = (comment: string) =>
        Array.isArray(fetched) && fetched.some((item) => item && item.data && item.data.comment === comment)
      const pending = Array.isArray(fetched)
        ? previous.filter((item) => item && item.local && item.data && item.data.comment && !listed(item.data.comment))
        : []
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'data'], pending.length ? [...fetched, ...pending] : fetched)
        setIn(draft, [action.meta.cacheKey, 'loading'], false)
      })
    }

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
