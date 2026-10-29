import React from 'react'

import cn from 'classnames'
import classes from './FilledIconButton.module.css'

const FilledIconButton = (props) => {
  const { children, className, ...otherProps } = props
  return (
    <button className={cn(classes.button, className)} {...otherProps}>
      {children}
    </button>
  )
}

export default FilledIconButton
