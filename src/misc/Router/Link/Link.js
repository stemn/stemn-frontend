import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'

import { isActive, getRoutePath } from './Link.utils'

const propTypesObject = {
  children: PropTypes.node.isRequired,    // Child element
  name: PropTypes.string,                 // Router path name, eg -> 'userRoute'
  params: PropTypes.object,               // Query param object
  activeIf: PropTypes.object,             // Object user to determine if the link is active
  // Options used for the desktop app
  scope: PropTypes.string,                // The renderer window to change, eg -> 'main' || 'menubar'
  show: PropTypes.bool,                   // Should the window show/focus?
  closeModals: PropTypes.bool,            // Should all the modals close?
  // Functions used in desktop
  closeAll: PropTypes.func,
  showWindow: PropTypes.func,
};

const LinkComponent = (props) => {
  const { name, params, activeIf, to, className, scope, show, closeModals, onClick, ...otherProps } = props

  // Get the path from the route name
  const routePath = getRoutePath(name, params)

  // Get the route state from the scope
  // We include the scope on the state.meta
  // This state.meta is moved up to the root action object
  // inside the Router.middleware
  // this is only used on desktop
  const routeState = {
    meta : {
      scope: [scope]
    }
  }

  const toWithPath = routePath ? {
    pathname: routePath,
    state: routeState
  } : {
    pathname: to,
    state: routeState
  }

  const additionalClickFunction = () => {
    // Dispatch the show event if required
    if (scope && show) showWindow(scope)
    // dispatch the closeModals
    if (closeModals) closeAll()
  }

  const extendedOnClick = () => {
    if (GLOBAL_ENV.APP_TYPE === 'desktop') additionalClickFunction()
    if (onClick) onClick()
  }

  const allClassNames = classNames(className, { 'active': isActive(activeIf, params) })

  return (
    <Link
       to={ toWithPath }
       className={ allClassNames }
       onClick={ extendedOnClick }
       { ...otherProps }
     />
  )
}

LinkComponent.propTypes = propTypesObject;

export default LinkComponent;
