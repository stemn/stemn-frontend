import React, { useMemo } from 'react'
import { Params, useLocation, useNavigationType, useOutlet, useParams } from 'react-router'
import { LegacyLocation, toLegacyLocation } from './query'

/** The props a route component receives from withRouteProps */
export interface IRouteProps {
  location: LegacyLocation
  params: Readonly<Params>
  children?: React.ReactNode
}

/**
 * Wraps a route component so it receives the props react-router v3 used to inject:
 *  - `params`   route params (including parent route params)
 *  - `location` the current location with a parsed `.query`
 *  - `children` the matched child route (`useOutlet()`), or null when no child matches
 */
export const withRouteProps = <P extends object>(Component: React.ComponentType<P>) => {
  const RouteBridge = (props: Omit<P, keyof IRouteProps>) => {
    const location = useLocation()
    const navigationType = useNavigationType()
    const params = useParams()
    const outlet = useOutlet()
    const legacyLocation = useMemo(() => toLegacyLocation(location, navigationType), [location, navigationType])
    return (
      // `props` is P without the route props, which are added here (TS cannot prove that for a generic P)
      <Component {...(props as P)} location={legacyLocation} params={params}>
        {outlet}
      </Component>
    )
  }
  RouteBridge.displayName = `withRouteProps(${Component.displayName || Component.name || 'Component'})`
  return RouteBridge
}

export default withRouteProps
