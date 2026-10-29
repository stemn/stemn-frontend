import cn from 'classnames'
import React from 'react'
import { Link as RouterLink, useLocation } from 'react-router'
import { LegacyLocationDescriptor, parseQuery, Query, toRouterPath } from './query'

export interface ILinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> {
  to: string | LegacyLocationDescriptor
  /** react-router v2/v3 style extra query (merged into `to`) */
  query?: Query
  state?: any
  replace?: boolean
  className?: any
  activeClassName?: string
  activeStyle?: React.CSSProperties
  onlyActiveOnIndex?: boolean
  children?: React.ReactNode
  ref?: React.Ref<HTMLAnchorElement>
}

const normalisePath = (path: string = '') => (path.length > 1 ? path.replace(/\/+$/, '') : path)

const queryIsActive = (linkQuery: Query | undefined, currentQuery: Query) => {
  if (!linkQuery) {
    return true
  }
  const keys = Object.keys(linkQuery).filter((key) => linkQuery[key] !== undefined && linkQuery[key] !== null)
  return keys.every((key) => String(linkQuery[key]) === String(currentQuery[key]))
}

/**
 * <Link> that accepts react-router v3 props:
 *  - `to` may be a string or `{ pathname, query, state }`
 *  - `query` prop
 *  - `activeClassName` / `activeStyle` / `onlyActiveOnIndex`
 *    (active = pathname matches (prefix unless onlyActiveOnIndex) and every link query key matches)
 */
export const Link = (props: ILinkProps) => {
  const {
    ref,
    to,
    query,
    state,
    replace,
    className,
    activeClassName,
    activeStyle,
    onlyActiveOnIndex,
    style,
    ...otherProps
  } = props
  const location = useLocation()

  const descriptor: LegacyLocationDescriptor =
    typeof to === 'string'
      ? { pathname: to.split('?')[0], search: to.includes('?') ? `?${to.split('?')[1]}` : undefined }
      : { ...to }
  if (query) {
    descriptor.query = { ...(descriptor.query || {}), ...query }
  }
  const { to: routerTo, state: descriptorState } = toRouterPath(descriptor)

  let isActive = false
  if ((activeClassName || activeStyle) && descriptor.pathname) {
    const linkPath = normalisePath(descriptor.pathname)
    const currentPath = normalisePath(location.pathname)
    const pathActive =
      onlyActiveOnIndex || linkPath === '/'
        ? currentPath === linkPath
        : currentPath === linkPath || currentPath.startsWith(`${linkPath}/`)
    isActive = pathActive && queryIsActive(descriptor.query, parseQuery(location.search))
  }

  return (
    <RouterLink
      ref={ref}
      to={routerTo}
      state={state !== undefined ? state : descriptorState}
      replace={replace}
      className={cn(className, isActive && activeClassName) || undefined}
      style={isActive && activeStyle ? { ...style, ...activeStyle } : style}
      {...otherProps}
    />
  )
}

Link.displayName = 'LegacyLink'

export default Link
