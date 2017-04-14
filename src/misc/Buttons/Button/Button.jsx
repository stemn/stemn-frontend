import React from 'react';
import Link from 'stemn-shared/misc/Router/Link'
// Styles
import classNames from 'classnames'
import classes from './Button.css'

export default class extends React.Component{
  render() {
    const { className, name, href, children, ...otherProps } = this.props

    if (name) {
      return (
        <Link className={classNames(classes.button, className)} name={ name } { ...otherProps }>
          { children }
        </Link>
      )
    }
    else if (href) {
      return (
        <a className={classNames(classes.button, className)} href={ href } { ...otherProps }>
          { children }
        </a>
      );
    } else {
      return (
        <button className={classNames(classes.button, className)} { ...otherProps }>
          { children }
        </button>
      );
    }
  }
};
