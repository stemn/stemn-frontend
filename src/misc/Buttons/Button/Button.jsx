import React from 'react';
import Link from 'stemn-shared/misc/Router/Link'
// Styles
import classNames from 'classnames'
import classes from './Button.css'

export default class extends React.Component{
  render() {
    const { className, name, href, children, childRef, ...otherProps } = this.props

    if (name) {
      return (
        <Link ref={ childRef } className={classNames(classes.button, className)} name={ name } { ...otherProps }>
          { children }
        </Link>
      )
    }
    else if (href) {
      return (
        <a ref={ childRef } className={classNames(classes.button, className)} href={ href } { ...otherProps }>
          { children }
        </a>
      );
    } else {
      return (
        <button ref={ childRef } className={classNames(classes.button, className)} { ...otherProps }>
          { children }
        </button>
      );
    }
  }
};
