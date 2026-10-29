import { LOCATION_CHANGE } from './actions'
import { setRouter } from './middleware'
import { toLegacyLocation } from './query'

/**
 * Keeps `state.routing` in sync with a react-router data router and lets
 * `routerMiddleware` drive it. Replacement for react-router-redux's syncHistoryWithStore.
 */
export const syncRouterWithStore = (router: any, store: { dispatch: (action: any) => any }) => {
  setRouter(router)
  let lastLocation: any
  const dispatchLocation = (location: any, action: string) => {
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
  return router.subscribe((state: any) => dispatchLocation(state.location, state.historyAction))
}
