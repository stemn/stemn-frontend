import type { DataRouter } from 'react-router'
import { LOCATION_CHANGE } from './actions'
import { setRouter } from './middleware'
import { LegacyLocation, toLegacyLocation } from './query'

export interface LocationChangeAction {
  type: typeof LOCATION_CHANGE
  payload: LegacyLocation
}

type SyncedRouter = Pick<DataRouter, 'navigate' | 'state' | 'subscribe'>

/**
 * Keeps `state.routing` in sync with a react-router data router and lets
 * `routerMiddleware` drive it. Replacement for react-router-redux's syncHistoryWithStore.
 */
export const syncRouterWithStore = (
  router: SyncedRouter,
  store: { dispatch: (action: LocationChangeAction) => unknown },
) => {
  setRouter(router)
  let lastLocation: DataRouter['state']['location'] | undefined
  const dispatchLocation = (location: DataRouter['state']['location'], action: string) => {
    if (location === lastLocation) {
      return
    }
    lastLocation = location
    store.dispatch({
      type: LOCATION_CHANGE,
      payload: toLegacyLocation(location, action),
    })
  }
  dispatchLocation(router.state.location, router.state.historyAction)
  return router.subscribe((state) => dispatchLocation(state.location, state.historyAction))
}
