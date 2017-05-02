import React from 'react';
import Link from 'stemn-shared/misc/Router/Link'
// Styles
import classNames from 'classnames'
import classes from './Button.css'

export default class extends React.Component{
  render() {
    const { className, name, href, children, buttonRef, ...otherProps } = this.props

    if (name) {
      return (
        <Link ref={ buttonRef } className={classNames(classes.button, className)} name={ name } { ...otherProps }>
          { children }
        </Link>
      )
    }
    else if (href) {
      return (
        <a ref={ buttonRef } className={classNames(classes.button, className)} href={ href } { ...otherProps }>
          { children }
        </a>
      );
    } else {
      return (
        <button ref={ buttonRef } className={classNames(classes.button, className)} { ...otherProps }>
          { children }
        </button>
      );
    }
  }
};
