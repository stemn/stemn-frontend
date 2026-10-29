import { LegacyLocationDescriptor } from './query'

/**
 * Redux action creators compatible with react-router-redux v4.
 * They are executed by `routerMiddleware` (see ./middleware).
 */
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE'
export const CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD'

/** A location as the app passes it to push/replace: a path string or a v3 descriptor */
export type LocationDescriptor = string | LegacyLocationDescriptor

/** The history call `routerMiddleware` performs, by method */
export type HistoryCall =
  | { method: 'push' | 'replace'; args: [location: LocationDescriptor] }
  | { method: 'go'; args: [delta: number] }
  | { method: 'goBack' | 'goForward'; args: [] }

export interface CallHistoryMethodAction {
  type: typeof CALL_HISTORY_METHOD
  payload: HistoryCall
}

const historyAction = (payload: HistoryCall): CallHistoryMethodAction => ({
  type: CALL_HISTORY_METHOD,
  payload,
})

// Rest parameters: like react-router-redux, every argument passed ends up in `payload.args`
export const push = (...args: [location: LocationDescriptor]) => historyAction({ method: 'push', args })
export const replace = (...args: [location: LocationDescriptor]) => historyAction({ method: 'replace', args })
export const go = (...args: [delta: number]) => historyAction({ method: 'go', args })
export const goBack = (...args: []) => historyAction({ method: 'goBack', args })
export const goForward = (...args: []) => historyAction({ method: 'goForward', args })

export const routerActions = { push, replace, go, goBack, goForward }
