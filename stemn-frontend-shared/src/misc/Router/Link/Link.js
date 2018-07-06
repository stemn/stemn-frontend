import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Link } from 'react-router'

import { isActive, getRoutePath } from './Link.utils'

const propTypesObject = {
  children: PropTypes.node,               // Child element
  name: PropTypes.string,                 // Router path name, eg -> 'userRoute'
  params: PropTypes.object,               // Query param object
  activeIf: PropTypes.object,             // Object user to determine if the link is active
  // Functions used in desktop
  closeAll: PropTypes.func,
  showWindow: PropTypes.func,
}

const LinkComponent = (props) => {
  const {
    activeIf,
    className,
    closeModals,
    name,
    onClick,
    params,
    query,
    show,
    to,
    // Container functions
    closeAll,
    showWindow,
    dispatch,
    ...otherProps
  } = props

  // Get the path from the route name
  const routePath = getRoutePath(name, params)
  const routePathIsObject = typeof routePath === 'object'

  // Get the isExternal bool (if the route object has external:true)
  const isExternal = routePathIsObject && routePath.external

  // Construct the function to get the 'to'
  const getToPath = () => {
    if (routePath && routePathIsObject) {
      return {
        pathname: routePath.pathname,
        query: Object.assign({}, query, routePath.query),
        // We include the scope on the state.meta
        // This state.meta is moved up to the root action object
        // inside the Router.middleware (this is only used on desktop)
        state: {
          meta: {
            scope: [routePath.scope],
          },
        },
      }
    } else if (routePath) {
      return {
        pathname: routePath,
        query,
      }
    } 
    return {
      pathname: to,
      query,
    }
  }

  // Construct the function to get the 'href'
  const getHref = () => {
    if (routePath.pathname.startsWith('http')) {
      return routePath.pathname
    } 
    return `${GLOBAL_ENV.WEBSITE_URL}${routePath.pathname}`
  }

  const additionalClickFunction = () => {
    // Dispatch the show event if required
    if (routePath && routePath.scope && routePath.show) showWindow(routePath.scope)
    // dispatch the closeModals
    if (routePath && routePath.closeModals) closeAll()

    if (routePath && routePath.clickDispatch) {
      dispatch(routePath.clickDispatch)
    }
  }

  const extendedOnClick = () => {
    if (GLOBAL_ENV.APP_TYPE === 'desktop') additionalClickFunction()
    if (onClick) onClick()
  }

  const allClassNames = cn(className, { active: isActive(activeIf, params) })

  if (isExternal) {
    return (
      <a
        href={ getHref() }
        target="_blank"
        rel="noopener noreferrer"
        className={ allClassNames }
        onClick={ extendedOnClick }
        { ...otherProps }
      />
    )
  } 
  const toPath = getToPath()
  if (toPath && toPath.pathname) {
    return (
      <Link
        to={ getToPath() }
        className={ allClassNames }
        onClick={ extendedOnClick }
        { ...otherProps }
      />
    )
  } 
  return (
    <a
      className={ allClassNames }
      onClick={ extendedOnClick }
      { ...otherProps }
    />
  )
}

// LinkComponent.propTypes = propTypesObject

export default LinkComponent
