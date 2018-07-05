import React from 'react'
import Link from 'stemn-shared/misc/Router/Link'
import cn from 'classnames'
import classes from './SimpleIconButton.css'

export default class SimpleIconButton extends React.Component {
  render() {
    const { children, className, color, disabled, href, ...otherProps } = this.props
    const allClasses = cn(classes.button, className, {
      [classes.white]: color === 'white',
      disabled,
    })

    if (this.props.to || this.props.name) {
      return (
        <Link
          className={ allClasses }
          { ...otherProps }
        >
          { children }
        </Link>
      )
    } 
    if (this.props.href) {
      return (
        <a
          className={ allClasses }
          href={ href }
          { ...otherProps }
        >
          { children }
        </a>
      )
    }
    return (
      <button
        className={ allClasses }
        { ...otherProps }
      >
        { children }
      </button>
    )
  }
}
