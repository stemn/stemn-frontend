// Component Core
import React from 'react'

// Styles
import classes from './StandardTable.css'

// /////////////////////////////// COMPONENT /////////////////////////////////

export default React.createClass({
  render() {
    const { children } = this.props
    return (
      <table className={ classes.table }>
        {children}
      </table>
    )
  },
})
