import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './Button.css';

export default class extends React.Component{
  render() {
    const { className, href, children, ...otherProps } = this.props

    if (href) {
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
