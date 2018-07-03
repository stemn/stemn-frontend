import React from 'react'
import classes from './StandardTable.css'

export default class StandardTable extends React.Component {
  render() {
    const { children } = this.props
    return (
      <table className={ classes.table }>
        {children}
      </table>
    )
  }
}
