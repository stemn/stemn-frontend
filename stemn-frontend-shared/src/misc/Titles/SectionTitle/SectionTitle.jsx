// Component Core
import React from 'react'

// Styles
import cn from 'classnames'
import classes from './SectionTitle.css'

// /////////////////////////////// COMPONENT /////////////////////////////////

export default class SectionTitle extends React.Component {
  render() {
    const { children, style, className } = this.props
    return (
      <div className={ cn(classes.section, 'layout-row', className) } style={ style }>
        <div className={ classes.text }>{children}</div>
      </div>
    )
  }
}
