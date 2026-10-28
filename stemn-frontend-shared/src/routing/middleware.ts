import { CALL_HISTORY_METHOD } from './actions'
import { toRouterPath } from './query'

/** Minimal interface of the react-router data router we drive */
export interface INavigator {
  navigate: (to: any, opts?: any) => any,
  state?: any,
}

const toHref = (to: any) => (typeof to === 'string'
  ? to
  : `${to.pathname || ''}${to.search || ''}${to.hash || ''}`)

const locationHref = (location: any) => location && `${location.pathname}${location.search || ''}${location.hash || ''}`

/**
 * react-router v3 navigated synchronously, so components that redirect from
 * componentWillReceiveProps (e.g. AppUnAuthed -> replace('/')) unmounted straight away.
 * Data router navigations to lazy routes are async and re-render the current
 * route while pending, which would re-dispatch the same redirect forever
 * (each navigate() cancels the previous one). Skip navigations that are
 * already pending, or replaces to the current location.
 */
const isDuplicate = (router: INavigator, to: any, replace: boolean) => {
  const state = router.state
  if (!state) return false
  const href = toHref(to)
  if (state.navigation && state.navigation.state !== 'idle' && locationHref(state.navigation.location) === href) {
    return true
  }
  return replace && (!state.navigation || state.navigation.state === 'idle') && locationHref(state.location) === href
}

let currentRouter: INavigator | undefined
const pending: any[] = []

/** Register the router instance (called once the browser router has been created) */
export const setRouter = (router: INavigator) => {
  currentRouter = router
  // Flush any navigation dispatched before the router existed
  pending.splice(0).forEach(run)
}

export const getRouter = () => currentRouter

function run({ method, args }: { method: string, args: any[] }) {
  const router = currentRouter as INavigator
  switch (method) {
    case 'push':
    case 'replace': {
      const { to, state } = toRouterPath(args[0])
      if (isDuplicate(router, to, method === 'replace')) {
        return undefined
      }
      return router.navigate(to, { replace: method === 'replace', state })
    }
    case 'go':
      return router.navigate(args[0])
    case 'goBack':
      return router.navigate(-1)
    case 'goForward':
      return router.navigate(1)
    default:
      return undefined
  }
}

/**
 * Replacement for react-router-redux's routerMiddleware(history).
 * Performs navigation imperatively on the router instance.
 * Does not pass CALL_HISTORY_METHOD actions down the chain (same as react-router-redux).
 */
export const routerMiddleware = (router?: INavigator) => {
  if (router) {
    setRouter(router)
  }
  return () => (next: any) => (action: any) => {
    if (!action || action.type !== CALL_HISTORY_METHOD) {
      return next(action)
    }
    if (currentRouter) {
      run(action.payload)
    } else {
      pending.push(action.payload)
    }
    return undefined
  }
}
