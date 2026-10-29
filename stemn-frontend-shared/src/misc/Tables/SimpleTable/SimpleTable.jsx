import React from 'react'
import s from './SimpleTable.module.scss'
import cn from 'classnames'

const SimpleTable = (props) => {
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

export default SimpleTable
