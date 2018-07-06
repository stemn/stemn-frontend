import React, { Component } from 'react'
import classes from './HeaderMobileMenu.css'
import cn from 'classnames'
import Link from 'stemn-shared/misc/Router/Link'

export default class HeaderMobileMenu extends Component {
  render() {
    const { items, isOpen } = this.props
    const linkHeight = 33
    const mobileLinkStyle = {
      height: `${linkHeight}px`,
    }
    const padding = 20
    const mobileLinksStyle = isOpen
      ? {
        height: linkHeight * items.length + padding,
      }
      : {}

    return (
      <div className={ cn(classes.mobileLinks, 'hide-gt-xs') } style={ mobileLinksStyle }>
        <div className={ classes.inner }>
          { items.map(item => (
            <Link
              key={ item.label }
              activeClassName="active"
              className={ cn(classes.mobileLink, 'layout-row layout-align-start-center') }
              style={ mobileLinkStyle }
              name={ item.route }
            >
              { item.label }
            </Link>
          ))}
        </div>
      </div>
    )
  }
}
