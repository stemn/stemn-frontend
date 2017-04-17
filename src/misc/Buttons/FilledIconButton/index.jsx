import React from 'react';

import classNames from 'classnames'
import classes from './FilledIconButton.css'

export default (props) => {
  const { children, className, ...otherProps } = props
  return (
    <button className={ classNames(classes.button, className) } { ...otherProps }>
      { children }
    </button>
  )
}
