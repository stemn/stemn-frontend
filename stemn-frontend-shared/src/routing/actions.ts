import { LegacyLocationDescriptor } from './query'

/**
 * Redux action creators compatible with react-router-redux v4.
 * They are executed by `routerMiddleware` (see ./middleware).
 */
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE'
export const CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD'

type Location = string | LegacyLocationDescriptor

const updateLocation =
  (method: 'push' | 'replace' | 'go' | 'goBack' | 'goForward') =>
  (...args: any[]) => ({
    type: CALL_HISTORY_METHOD,
    payload: { method, args },
  })

export const push: (location: Location) => any = updateLocation('push')
export const replace: (location: Location) => any = updateLocation('replace')
export const go: (delta: number) => any = updateLocation('go')
export const goBack: () => any = updateLocation('goBack')
export const goForward: () => any = updateLocation('goForward')

export const routerActions = { push, replace, go, goBack, goForward }
