import React, { Component, PropTypes } from 'react'
import classes from './HeaderMobileMenu.css'
import classNames from 'classnames'
import Link from 'stemn-shared/misc/Router/Link'

export default class HeaderMobileMenu extends Component {
  render() {
    const { items, isOpen } = this.props
    const linkHeight = 33
    const mobileLinkStyle = {
      height: `${linkHeight}px`
    }
    const mobileLinksStyle = isOpen
      ? {
        height: linkHeight * items.length
      }
      : {}

    return (
      <div className={ classNames(classes.mobileLinks, 'hide-gt-xs') } style={ mobileLinksStyle }>
        { items.map(item => (
          <Link
            key={ item.label }
            activeClassName="active"
            className={ classNames(classes.mobileLink, 'layout-row layout-align-start-center') }
            style={ mobileLinkStyle }
            name={ item.route }
          >
            { item.label }
          </Link>
        ))}
      </div>
    )
  }
}
