import React, { useMemo } from 'react'
import { useLocation, useNavigationType, useOutlet, useParams } from 'react-router'
import { toLegacyLocation } from './query'

/**
 * Wraps a route component so it receives the props react-router v3 used to inject:
 *  - `params`   route params (including parent route params)
 *  - `location` the current location with a parsed `.query`
 *  - `children` the matched child route (`useOutlet()`), or null when no child matches
 */
export const withRouteProps = <P extends object>(Component: React.ComponentType<P>) => {
  const RouteBridge = (props: any) => {
    const location = useLocation()
    const navigationType = useNavigationType()
    const params = useParams()
    const outlet = useOutlet()
    const legacyLocation = useMemo(() => toLegacyLocation(location, navigationType), [location, navigationType])
    return (
      <Component {...props} location={legacyLocation} params={params}>
        {outlet}
      </Component>
    )
  }
  RouteBridge.displayName = `withRouteProps(${Component.displayName || Component.name || 'Component'})`
  return RouteBridge
}

export default withRouteProps
