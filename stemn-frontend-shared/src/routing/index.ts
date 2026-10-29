/**
 * Compatibility layer between the app (written for react-router v3 + react-router-redux v4)
 * and react-router v8 (data router). See README in this folder.
 */
export { CALL_HISTORY_METHOD, LOCATION_CHANGE, go, goBack, goForward, push, replace, routerActions } from './actions'
export { Link } from './Link'
export { getRouter, routerMiddleware, setRouter } from './middleware'
export { parseQuery, stringifyQuery, toLegacyLocation, toRouterPath } from './query'
export { routerReducer } from './reducer'
export { syncRouterWithStore } from './sync'
export { withRouteProps } from './withRouteProps'
