// Component Core
import React from 'react'

// Styles
import classNames from 'classnames'
import classes from './SectionTitle.css'

// /////////////////////////////// COMPONENT /////////////////////////////////

export default React.createClass({
  render() {
    const { children, style, className } = this.props
    return (
      <div className={ classNames(classes.section, 'layout-row', className) } style={ style }>
        <div className={ classes.text }>{children}</div>
      </div>
    )
  },
})
