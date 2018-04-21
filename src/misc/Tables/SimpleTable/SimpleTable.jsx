import React from 'react'
import classes from './SimpleTable.css'

export default (props) => {
  const { children } = props
  return (
    <table className={ classes.table }>
      <tbody>
        {children}
      </tbody>
    </table>
  )
}
