import React, { PropTypes } from 'react'
import classNames from 'classnames'
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
};

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
            scope: [ routePath.scope ]
          }
        }
      }
    } else if (routePath) {
      return {
        pathname: routePath,
        query: query,
      }
    } else {
      return {
        pathname: to,
        query: query,
      }
    }
  }

  // Construct the function to get the 'href'
  const getHref = () => {
    if (routePath.pathname.startsWith('http')) {
      return routePath.pathname
    } else {
      return `${GLOBAL_ENV.WEBSITE_URL}${routePath.pathname}`
    }
  }

  const additionalClickFunction = () => {
    // Dispatch the show event if required
    if (routePath.scope && routePath.show) showWindow(routePath.scope)
    // dispatch the closeModals
    if (routePath.closeModals) closeAll()

    if (routePath.clickDispatch) {
      dispatch(routePath.clickDispatch)
    }
  }

  const extendedOnClick = () => {
    if (GLOBAL_ENV.APP_TYPE === 'desktop') additionalClickFunction()
    if (onClick) onClick()
  }

  const allClassNames = classNames(className, { 'active': isActive(activeIf, params) })

  if (isExternal) {
    return (
      <a
        href={ getHref() }
        className={ allClassNames }
        onClick={ extendedOnClick }
        { ...otherProps }
      />
    )
  } else {
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
    } else {
    return (
      <a
        className={ allClassNames }
        onClick={ extendedOnClick }
        { ...otherProps }
      />
    )
    }
  }
}

LinkComponent.propTypes = propTypesObject;

export default LinkComponent;
