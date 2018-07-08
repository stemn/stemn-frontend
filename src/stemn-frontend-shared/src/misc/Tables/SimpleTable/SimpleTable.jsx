import React from 'react'
import classes from './SimpleTable.css'
import cn from 'classnames'

export default (props) => {
  const { children, className, ...otherProps } = props
  return (
    <table className={ cn(classes.table, className) } { ...otherProps }>
      <tbody>
        {children}
      </tbody>
    </table>
  )
}
