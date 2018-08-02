import React from 'react'
import s from './SimpleTable.scss'
import cn from 'classnames'

export default (props) => {
  const { children, flex, className, ...otherProps } = props
  if (!flex) {
    return (
      <table className={ cn(s.table, s.shared, className) } { ...otherProps }>
        <tbody>
          {children}
        </tbody>
      </table>
    )
  } else {
    return (
      <div className={ cn(s.flexTable, s.shared, className) } { ...otherProps }>
        {children}
      </div>
    )
  }
}
