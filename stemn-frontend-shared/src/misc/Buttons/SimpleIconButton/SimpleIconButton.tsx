import * as cn from 'classnames'
import * as React from 'react'
import Link from 'stemn-shared/misc/Router/Link'
import * as classes from './SimpleIconButton.scss'

export interface ISimpleIconButtonProps {
  children: any,
  className?: string,
  color?: 'white',
  disabled?: boolean,
  href?: string,
  to?: string,
  name?: string,
  onClick?: any,
  title?: string,
}

export class SimpleIconButton extends React.Component<ISimpleIconButtonProps> {
  public render () {
    const { children, className, color, disabled, href, ...otherProps } = this.props
    const allClasses = cn(classes.button, className, {
      [classes.white]: color === 'white',
      disabled,
    })

    if (this.props.to || this.props.name) {
      return (
        <Link
          className={allClasses}
          {...otherProps}
        >
          {children}
        </Link>
      )
    }
    if (this.props.href) {
      return (
        <a
          className={allClasses}
          href={href}
          {...otherProps}
        >
          {children}
        </a>
      )
    }
    return (
      <button
        className={allClasses}
        {...otherProps}
      >
        {children}
      </button>
    )
  }
}
