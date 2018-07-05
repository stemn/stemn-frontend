import React from 'react'
import Link from 'stemn-shared/misc/Router/Link'
// Styles
import cn from 'classnames'
import classes from './Button.css'

export default class Button extends React.Component {
  render() {
    const { className, name, href, children, childRef, ...otherProps } = this.props

    if (name) {
      return (
        <Link ref={ childRef } className={ cn(classes.button, className) } name={ name } { ...otherProps }>
          { children }
        </Link>
      )
    } else if (href) {
      return (
        <a ref={ childRef } className={ cn(classes.button, className) } href={ href } { ...otherProps }>
          { children }
        </a>
      )
    } 
    return (
      <button ref={ childRef } className={ cn(classes.button, className) } { ...otherProps }>
        { children }
      </button>
    )
  }
}
