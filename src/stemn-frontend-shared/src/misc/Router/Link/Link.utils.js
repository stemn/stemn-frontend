import * as routeActions from 'route-actions'
import { some } from 'lodash'

export const isActive = (activeIf, params) => {
  const checkPathIs = () => {
    if (activeIf && activeIf.is) {
      return some(activeIf.is, item => getRoutePath(item, params) === window.location.pathname)
    }
  }

  const checkPathIncludes = () => {
    if (activeIf && activeIf.includes) {
      return some(activeIf.includes, item => window.location.pathname.includes(getRoutePath(item, params)))
    }
  }

  return some([checkPathIs(), checkPathIncludes()])
}

export const getRoutePath = (routeName, routeParams) => {
  if (routeName) {
    if (routeActions[routeName]) {
      return routeActions[routeName](routeParams)
    } 
    console.error('Route note found:', routeName)
  }
}
