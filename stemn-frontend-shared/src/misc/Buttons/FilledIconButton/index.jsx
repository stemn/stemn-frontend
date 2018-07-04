import React from 'react'

import cn from 'classnames'
import classes from './FilledIconButton.css'

export default (props) => {
  const { children, className, ...otherProps } = props
  return (
    <button className={ cn(classes.button, className) } { ...otherProps }>
      { children }
    </button>
  )
}
