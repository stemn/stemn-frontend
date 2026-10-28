import { CALL_HISTORY_METHOD } from './actions'
import { toRouterPath } from './query'

/** Minimal interface of the react-router data router we drive */
export interface INavigator {
  navigate: (to: any, opts?: any) => any,
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
