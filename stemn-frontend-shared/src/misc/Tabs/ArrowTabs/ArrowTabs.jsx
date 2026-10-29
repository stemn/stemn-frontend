// Component Core
import React from 'react'
import { omit } from 'lodash'

// Styles
import cn from 'classnames'
import classes from './ArrowTabs.module.css'
import { MdChevronRight as MdChrevronRight } from 'react-icons/md'
import Link from 'stemn-shared/misc/Router/Link'

const arrowTabsOwnPropKeys = ['children', 'className']

export class ArrowTabs extends React.Component {
  render() {
    const { children, className } = this.props
    return (
      <div {...omit(this.props, arrowTabsOwnPropKeys)} className={cn(classes.tabs, className)}>
        {children}
      </div>
    )
  }
}

export class ArrowTab extends React.Component {
  renderLinkEl = () => {
    const { children, isActive, arrow, name, ...otherProps } = this.props

    const linkClasses = cn(classes.tab, { active: isActive })

    if (name) {
      return (
        <Link className={linkClasses} name={name} {...otherProps}>
          {children}
        </Link>
      )
    }
    return (
      <a className={linkClasses} {...otherProps}>
        {children}
      </a>
    )
  }

  render() {
    const { arrow } = this.props

    return (
      <div className="layout-row layout-align-start-center">
        {this.renderLinkEl()}
        {arrow ? <MdChrevronRight className={classes.arrow} size={22} /> : null}
      </div>
    )
  }
}
