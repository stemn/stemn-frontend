// Component Core
import React from 'react'
import PropTypes from 'prop-types'
import { omit } from 'lodash'

// Styles
import cn from 'classnames'
import classes from './ArrowTabs.css'
import MdChrevronRight from 'react-icons/md/chevron-right'
import Link from 'stemn-shared/misc/Router/Link'

const arrowTabsPropTypes = {
  children: PropTypes.node.isRequired,     // Child element
  className: PropTypes.string,              // Classes
}
const arrowTabPropTypes = {
  children: PropTypes.node.isRequired,      // Child element
  isActive: PropTypes.bool,                 // Is the tab active?
  arrow: PropTypes.bool,                 // Should we show the arrow?
  name: PropTypes.string,               // Link path name
  params: PropTypes.object,               // Link params
}

export class ArrowTabs extends React.Component {
  static propTypes = arrowTabsPropTypes;

  render() {
    const { children, className } = this.props
    return (
      <div
        { ...omit(this.props, Object.keys(arrowTabsPropTypes)) }
        className={ cn(classes.tabs, className) }
      >
        {children}
      </div>
    )
  }
}

export class ArrowTab extends React.Component {
  static propTypes = arrowTabPropTypes;

  renderLinkEl = () => {
    const { children, isActive, arrow, name, ...otherProps } = this.props

    const linkClasses = cn(classes.tab, { active: isActive })

    if (name) {
      return (
        <Link className={ linkClasses } name={ name } { ...otherProps }>
          { children }
        </Link>
      )
    } 
    return (
      <a className={ linkClasses } { ...otherProps }>
        { children }
      </a>
    )
  };

  render() {
    const { arrow } = this.props

    return (
      <div className="layout-row layout-align-start-center">
        { this.renderLinkEl() }
        { arrow
          ? <MdChrevronRight className={ classes.arrow } size={ 22 } />
          : null }
      </div>

    )
  }
}
